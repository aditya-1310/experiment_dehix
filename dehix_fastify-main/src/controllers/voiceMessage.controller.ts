import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import {
  Controller,
  POST,
  GET,
  Inject,
  FastifyInstanceToken,
} from "fastify-decorators";
import { VoiceMessageService } from "../services/voiceMessage.service";
// import { IVoiceMessage } from "../models/voiceMessage.model"; // Unused
import { MultipartFile } from "@fastify/multipart";
import { AppError } from "../common/errors";
import {
  voiceMessageUploadSchema,
  getVoiceMessagesSchema,
} from "../schema/v1/voiceMessage"; // We'll create these schema files

// Define a type for the expected multipart body
interface VoiceMessageUploadRequest extends FastifyRequest {
  body: {
    senderId: { value: string };
    receiverId: { value: string };
    conversationId: { value: string };
    duration: { value: string }; // Received as string from form-data
    file: MultipartFile;
  };
}

interface GetVoiceMessagesRequest extends FastifyRequest {
  Query: {
    // Changed from Querystring to Query
    conversationId: string;
  };
}

@Controller({ route: "/v1/voice-messages" })
export class VoiceMessageController {
  @Inject(VoiceMessageService)
  private voiceMessageService!: VoiceMessageService;

  @Inject(FastifyInstanceToken)
  private instance!: FastifyInstance;

  @POST("/upload", { schema: voiceMessageUploadSchema })
  async uploadVoiceMessage(
    request: VoiceMessageUploadRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      // console.log('Received body:', request.body);
      // console.log('Received file:', request.body?.file);

      if (!request.isMultipart()) {
        reply.code(400).send({ error: "Request is not multipart" });
        return;
      }

      // The fastify-multipart attachFieldsToBody should have processed the fields.
      // However, files are typically on request.files or request.file if single.
      // The typings might be tricky. Let's assume `request.body.file` is populated by `attachFieldsToBody: true`
      // and `onFile` in app.ts might be logging it.

      const { senderId, receiverId, conversationId, duration, file } =
        request.body;

      if (!file) {
        throw new AppError("No audio file was uploaded.", 400);
      }
      if (
        !senderId?.value ||
        !receiverId?.value ||
        !conversationId?.value ||
        !duration?.value
      ) {
        throw new AppError(
          "Missing required fields: senderId, receiverId, conversationId, or duration.",
          400,
        );
      }

      const durationValue = parseFloat(duration.value);
      if (isNaN(durationValue) || durationValue <= 0) {
        throw new AppError("Invalid duration provided.", 400);
      }

      const voiceMessageUploadData = {
        senderId,
        receiverId,
        conversationId,
        duration: { value: durationValue }, // Pass the parsed number
        file,
      };

      // The service now uses the injected Fastify instance directly
      const voiceMessage = await this.voiceMessageService.createVoiceMessage(
        voiceMessageUploadData,
        // this.instance, // No longer passed as argument
      );
      reply.code(201).send({
        message: "Voice message uploaded successfully",
        data: voiceMessage,
      });
    } catch (error) {
      this.instance.log.error("Error uploading voice message:", error);
      if (error instanceof AppError) {
        reply
          .code(error.statusCode)
          .send({ error: error.message, details: error.details });
      } else if (error && typeof error === "object" && "message" in error) {
        const errWithMessage = error as {
          message: string;
          [key: string]: unknown;
        }; // Cast for message
        if (
          typeof errWithMessage.message === "string" &&
          (errWithMessage.message.startsWith("FST_FILES_LIMIT") ||
            errWithMessage.message.startsWith("FST_FIELDS_LIMIT") ||
            errWithMessage.message.startsWith("FST_FIELD_SIZE_LIMIT"))
        ) {
          reply.code(413).send({
            error: "File or field size/count limit exceeded.",
            details: errWithMessage.message,
          });
        } else {
          reply.code(500).send({
            error: "An unexpected error occurred during file upload.",
            details:
              typeof errWithMessage.message === "string"
                ? errWithMessage.message
                : "No details",
          });
        }
      } else {
        reply.code(500).send({
          error: "An unexpected error occurred (unknown error type).",
        });
      }
    }
  }

  @GET("/", { schema: getVoiceMessagesSchema })
  async getVoiceMessages(
    request: GetVoiceMessagesRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { conversationId } = request.query as { conversationId?: string }; // Cast query
      if (!conversationId) {
        throw new AppError("Conversation ID is required.", 400);
      }
      const messages =
        await this.voiceMessageService.getVoiceMessagesByConversation(
          conversationId,
        );
      reply.code(200).send({ data: messages });
    } catch (error) {
      this.instance.log.error("Error fetching voice messages:", error);
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({ error: error.message });
      } else if (error && typeof error === "object" && "message" in error) {
        const errWithMessage = error as {
          message: string;
          [key: string]: unknown;
        };
        reply.code(500).send({
          error: "An unexpected error occurred.",
          details: errWithMessage.message,
        });
      } else {
        reply.code(500).send({
          error: "An unexpected error occurred (unknown error type).",
        });
      }
    }
  }
}
