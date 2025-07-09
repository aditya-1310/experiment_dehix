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
// Correct the import path for handleFileUpload
import { handleFileUpload } from "../common/services/s3.service";

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
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      console.log('=== VOICE MESSAGE UPLOAD DEBUG ===');
      console.log('Content-Type:', request.headers['content-type']);
      console.log('Is Multipart:', request.isMultipart());

      if (!request.isMultipart()) {
        throw new AppError("Request is not multipart", 400);
      }

      // Update handleFileUpload call to include both file and filename
      const file = await request.file();
      if (!file) {
        throw new AppError("No file uploaded.", 400);
      }

      // Extract filename from file object
      const filename = file.filename;

      // Use existing file upload functionality
      const uploadResult = await handleFileUpload(file.file, filename);

      reply.code(200).send({
        message: "Voice message uploaded successfully",
        data: uploadResult,
      });
    } catch (error) {
      this.instance.log.error("Error uploading voice message:", error);
      if (error instanceof AppError) {
        reply.code(error.statusCode).send({
          error: error.message,
          details: error.details,
        });
      } else if (error && typeof error === "object" && "message" in error) {
        const errWithMessage = error as { message: string; [key: string]: unknown };
        reply.code(500).send({
          error: "An unexpected error occurred during file upload.",
          details: errWithMessage.message,
        });
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
