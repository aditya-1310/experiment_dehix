import { FastifyInstance } from "fastify";
import { Service, Inject, FastifyInstanceToken } from "fastify-decorators";
import { VoiceMessageDAO } from "../dao/voiceMessage.dao";
import { IVoiceMessage } from "../models/voiceMessage.model";
import { MultipartFile } from "fastify-multipart";
import * as fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../common/errors";
import { FileStorageService } from "../common/services/file-storage.service";

// Define a simple interface for what we expect from the file upload part
interface VoiceMessageUploadDTO {
  senderId: string;
  receiverId: string;
  conversationId: string;
  duration: number;
  file: MultipartFile;
}

@Service()
export class VoiceMessageService {
  @Inject(VoiceMessageDAO)
  private voiceMessageDAO!: VoiceMessageDAO;

  @Inject(FileStorageService)
  private fileStorageService!: FileStorageService;

  @Inject(FastifyInstanceToken)
  private instance!: FastifyInstance;

  // Ensure the uploads directory exists
  private async ensureUploadsDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.access(directoryPath);
    } catch (error) {
      await fs.mkdir(directoryPath, { recursive: true });
    }
  }

  async createVoiceMessage(
    data: VoiceMessageUploadDTO,
  ): Promise<IVoiceMessage> {
    if (!data.file) {
      throw new AppError("No audio file provided.", 400);
    }
    if (
      !data.senderId ||
      !data.receiverId ||
      !data.conversationId ||
      data.duration === undefined
    ) {
      throw new AppError(
        "Missing required fields: senderId, receiverId, conversationId, or duration.",
        400,
      );
    }

    const allowedMimeTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "audio/webm",
    ];
    const mimeType = data.file.mimetype.split(";")[0];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new AppError(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
        400,
      );
    }

    const fileBuffer = await data.file.toBuffer();
    if (fileBuffer.length === 0) {
      throw new AppError("Empty audio file provided.", 400);
    }

    const uniqueFilename = `${uuidv4()}-${data.file.filename}`;
    const storagePath = `voice_messages/${data.conversationId}/${uniqueFilename}`;

    // Upload to S3 (or local, depending on FileStorageService implementation)
    const audioUrl = await this.fileStorageService.uploadFile(
      storagePath,
      fileBuffer,
    );

    const voiceMessageData: Partial<IVoiceMessage> = {
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
      audioUrl: audioUrl,
      duration: Number(data.duration),
      timestamp: new Date(),
    };

    try {
      // Save to MongoDB via DAO
      const savedMongoMessage =
        await this.voiceMessageDAO.createVoiceMessage(voiceMessageData);
      return savedMongoMessage;
    } catch (error) {
      this.instance.log.error(
        "Error in createVoiceMessage (MongoDB):",
        error,
      );
      // If DB save fails, attempt to delete the uploaded file
      if (audioUrl) {
        try {
          this.instance.log.warn(
            `Attempting to delete orphaned audio file due to error: ${storagePath}`,
          );
          await this.fileStorageService.deleteFile(storagePath);
        } catch (deleteError) {
          this.instance.log.error(
            "CRITICAL: Failed to delete orphaned audio file after DB error:",
            deleteError,
          );
        }
      }
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to save voice message (DB).",
        500,
        error,
      );
    }
  }

  async getVoiceMessagesByConversation(
    conversationId: string,
  ): Promise<IVoiceMessage[]> {
    if (!conversationId) {
      throw new AppError("Conversation ID is required.", 400);
    }
    return this.voiceMessageDAO.findByConversationId(conversationId);
  }
}
