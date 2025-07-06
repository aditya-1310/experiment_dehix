import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import {
  Controller,
  POST,
  GET,
  Inject,
  FastifyInstanceToken,
} from "fastify-decorators";
import { VoiceMessageService } from "../services/voiceMessage.service";
import { MultipartFile } from "@fastify/multipart";
import { AppError } from "../common/errors";
import {
  voiceMessageUploadSchema,
  getVoiceMessagesSchema,
} from "../schema/v1/voiceMessage";

// Updated request interface
interface VoiceMessageUploadRequest extends FastifyRequest {
  body: {
    senderId: string;
    receiverId: string;
    conversationId: string;
    duration: string;
  };
}

interface GetVoiceMessagesRequest extends FastifyRequest {
  query: {
    conversationId: string;
  };
}

@Controller({ route: "/v1/voice-messages" })
export default class VoiceMessageController {
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
      // Debug logging
      console.log('=== VOICE MESSAGE UPLOAD DEBUG ===');
      console.log('Content-Type:', request.headers['content-type']);
      console.log('Is Multipart:', request.isMultipart());
      console.log('Request Body:', request.body);
      console.log('Request Body Type:', typeof request.body);
      console.log('Request Body Keys:', Object.keys(request.body || {}));
      
      if (!request.isMultipart()) {
        reply.code(400).send({ error: "Request is not multipart" });
        console.log("Request is not multipart");
        return;
      }

      // Get file using request.file() since we removed attachFieldsToBody
      const file = await request.file();
      console.log('File:', file);
      console.log('File filename:', file?.filename);
      console.log('File mimetype:', file?.mimetype);

      // Get other fields from request.body (they come as plain strings now)
      const { senderId, receiverId, conversationId, duration } = request.body;
      console.log('Extracted fields:', { senderId, receiverId, conversationId, duration });

      if (!file) {
        console.log('No file uploaded');
        throw new AppError("No audio file was uploaded.", 400);
      }

      if (!senderId || !receiverId || !conversationId || !duration) {
        console.log('Missing fields:', { 
          hasSenderId: !!senderId, 
          hasReceiverId: !!receiverId, 
          hasConversationId: !!conversationId, 
          hasDuration: !!duration 
        });
        throw new AppError(
          "Missing required fields: senderId, receiverId, conversationId, or duration.",
          400,
        );
      }

      const durationValue = parseFloat(duration);
      if (isNaN(durationValue) || durationValue <= 0) {
        throw new AppError("Invalid duration provided.", 400);
      }

      const voiceMessageUploadData = {
        senderId,
        receiverId,
        conversationId,
        duration: durationValue,
        file,
      };

      const voiceMessage = await this.voiceMessageService.createVoiceMessage(
        voiceMessageUploadData,
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
        };

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
            details: errWithMessage.message,
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
      const { conversationId } = request.query as { conversationId?: string };

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
