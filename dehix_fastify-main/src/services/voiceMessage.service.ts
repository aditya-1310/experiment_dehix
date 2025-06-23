import { FastifyInstance } from "fastify";
import { Service, Inject, FastifyInstanceToken } from "fastify-decorators"; // Added FastifyInstanceToken
import { VoiceMessageDAO } from "../dao/voiceMessage.dao";
import { IVoiceMessage } from "../models/voiceMessage.model";
import { MultipartFile } from "fastify-multipart";
import * as fs from "fs/promises";
// import * as path from "path"; // Unused
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../common/errors"; // Assuming you have an AppError
import { FileStorageService } from "../common/services/file-storage.service";
// import { FirebaseClient } from "../clients/firebase.client"; // No longer needed directly
import * as admin from "firebase-admin"; // For Firestore types

// Define a simple interface for what we expect from the file upload part
interface VoiceMessageUploadDTO {
  senderId: { value: string };
  receiverId: { value: string };
  conversationId: { value: string };
  duration: { value: number }; // Duration in seconds, sent from frontend
  file: MultipartFile;
}

@Service()
export class VoiceMessageService {
  @Inject(VoiceMessageDAO)
  private voiceMessageDAO!: VoiceMessageDAO;

  @Inject(FileStorageService)
  private fileStorageService!: FileStorageService;

  @Inject(FastifyInstanceToken) // Inject Fastify instance
  private instance!: FastifyInstance;

  private get firestore(): admin.firestore.Firestore {
    // Access firestore from the decorated fastify instance
    // This assumes FirebaseClient.init(fastify) was successful and GOOGLE_APPLICATION_CREDENTIALS was set.
    if (!this.instance || !(this.instance as any).firestore) {
      // Log critical error, as Firebase should have been initialized and decorated.
      // This might happen if GOOGLE_APPLICATION_CREDENTIALS is not set, and FirebaseClient.init() returned early.
      console.error(
        "Firestore is not available on Fastify instance. Ensure Firebase Admin is initialized and GOOGLE_APPLICATION_CREDENTIALS is set.",
      );
      throw new AppError(
        "Firestore service is not available.",
        500,
        "FASTIFY_FIRESTORE_NOT_DECORATED",
      );
    }
    return (this.instance as any).firestore;
  }

  // Ensure the uploads directory exists
  private async ensureUploadsDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.access(directoryPath);
    } catch (error) {
      // Directory does not exist, create it
      await fs.mkdir(directoryPath, { recursive: true });
    }
  }

  async createVoiceMessage(
    data: VoiceMessageUploadDTO,
    // fastify: FastifyInstance, // This parameter is no longer used, this.instance is used
  ): Promise<IVoiceMessage> {
    if (!data.file) {
      throw new AppError("No audio file provided.", 400);
    }
    if (
      !data.senderId?.value ||
      !data.receiverId?.value ||
      !data.conversationId?.value ||
      data.duration?.value === undefined
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
    ]; // mp4 and webm for MediaRecorder
    if (!allowedMimeTypes.includes(data.file.mimetype)) {
      throw new AppError(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
        400,
      );
    }

    // Max file size (e.g., 10MB) - fastify-multipart should handle this, but good to double check
    // if (data.file.file.bytesRead > 10 * 1024 * 1024) {
    //   throw new AppError('File size exceeds 10MB limit.', 400);
    // }

    const fileBuffer = await data.file.toBuffer();
    if (fileBuffer.length === 0) {
      throw new AppError("Empty audio file provided.", 400);
    }

    // Instead of local storage, use FileStorageService
    // const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'voice');
    // await this.ensureUploadsDirectory(uploadDir);
    // const uniqueFilename = `${uuidv4()}-${data.file.filename}`;
    // const localFilePath = path.join(uploadDir, uniqueFilename);
    // await fs.writeFile(localFilePath, fileBuffer);
    // const audioUrl = `/uploads/voice/${uniqueFilename}`; // This would be for local serving

    const uniqueFilename = `${uuidv4()}-${data.file.filename}`;
    // Example: projects/your-project-id/voice_messages/uniqueFilename
    const storagePath = `voice_messages/${data.conversationId.value}/${uniqueFilename}`;

    // The FileStorageService should handle the actual upload (e.g., to S3 or Firebase Storage)
    // It should return the public URL of the uploaded file.
    const audioUrl = await this.fileStorageService.uploadFile(
      storagePath, // path in bucket
      fileBuffer,
      // data.file.mimetype, // mimeType no longer passed to local storage version
      // fastify // if config like bucket name is needed from fastify.config
    );

    const voiceMessageData: Partial<IVoiceMessage> = {
      senderId: data.senderId.value,
      receiverId: data.receiverId.value,
      conversationId: data.conversationId.value,
      audioUrl: audioUrl,
      duration: Number(data.duration.value), // Ensure duration is a number
      timestamp: new Date(),
    };

    try {
      // 1. Save to MongoDB via DAO (this is the existing IVoiceMessage model)
      const savedMongoMessage =
        await this.voiceMessageDAO.createVoiceMessage(voiceMessageData);

      // 2. Prepare data for Firestore
      //    The frontend expects fields like 'senderId', 'content' (can be audioUrl or special marker), 'timestamp'.
      //    And for voice: 'audioUrl', 'duration', 'messageType: "voice"'
      const firestoreMessageData = {
        senderId: savedMongoMessage.senderId,
        // content: `Voice Message: ${savedMongoMessage.audioUrl}`, // Or just use audioUrl and type
        timestamp: admin.firestore.Timestamp.fromDate(
          savedMongoMessage.timestamp,
        ), // Firestore timestamp
        conversationId: savedMongoMessage.conversationId, // Good for queries, though path has it
        receiverId: savedMongoMessage.receiverId, // For consistency

        messageType: "voice", // Explicitly define type
        audioUrl: savedMongoMessage.audioUrl,
        duration: savedMongoMessage.duration,
        // Add any other fields that regular text messages might have for consistency, e.g., reactions: {}
        reactions: {}, // Initialize reactions
        isRead: false, // Default unread status
      };

      // 3. Write to Firestore
      // The frontend structure for messages is usually conversations/{convId}/messages/{messageId}
      // We can use the MongoDB ID for the Firestore document ID for consistency.
      const messageRef = this.firestore
        .collection("conversations")
        .doc(savedMongoMessage.conversationId)
        .collection("messages")
        .doc(savedMongoMessage.id); // Use MongoDB ID as Firestore doc ID

      await messageRef.set(firestoreMessageData);
      this.instance.log.info(
        `Voice message metadata saved to Firestore: conversations/${savedMongoMessage.conversationId}/messages/${savedMongoMessage.id}`,
      );

      // Also update the lastMessage on the conversation document itself in Firestore
      const conversationRef = this.firestore
        .collection("conversations")
        .doc(savedMongoMessage.conversationId);
      await conversationRef.update({
        lastMessage: {
          id: savedMongoMessage.id,
          senderId: savedMongoMessage.senderId,
          content: "🎙️ Voice Message", // Placeholder content for last message preview
          timestamp: firestoreMessageData.timestamp,
          type: "voice", // Differentiate last message type
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update conversation timestamp
      });
      this.instance.log.info(
        `Conversation ${savedMongoMessage.conversationId} lastMessage updated in Firestore.`,
      );

      return savedMongoMessage; // Return the MongoDB document as per original design
    } catch (error) {
      this.instance.log.error(
        "Error in createVoiceMessage (MongoDB or Firestore):",
        error,
      );
      // If any part of this fails (Mongo, Firestore set, Firestore update), attempt to delete the uploaded file
      if (audioUrl) {
        try {
          this.instance.log.warn(
            `Attempting to delete orphaned audio file due to error: ${storagePath}`,
          );
          await this.fileStorageService.deleteFile(storagePath);
        } catch (deleteError) {
          this.instance.log.error(
            "CRITICAL: Failed to delete orphaned audio file after DB/Firestore error:",
            deleteError,
          );
          // Log this critical error, as there's now an orphaned file in storage
        }
      }
      // Determine if the error was from Firestore or Mongo to give a more specific message
      if (error instanceof AppError) throw error; // rethrow if it's already an AppError
      throw new AppError(
        "Failed to save voice message (DB or Firestore).",
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
    // You might want to add pagination here
    return this.voiceMessageDAO.findByConversationId(conversationId);
  }
}
