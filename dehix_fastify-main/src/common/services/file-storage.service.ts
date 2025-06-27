import { Service, Inject, FastifyInstanceToken } from "fastify-decorators"; // Added FastifyInstanceToken
import { FastifyInstance } from "fastify";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from 'url';
import { AppError } from "../errors"; // Assuming AppError exists
import { logger } from "./logger.service"; // Assuming logger service

// In ESM (__dirname is undefined). Reconstruct it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Service()
export class FileStorageService {
  // In a real scenario, you'd inject FastifyInstance to get config for bucket names, etc.
  @Inject(FastifyInstanceToken) // Inject Fastify instance to access config
  private instance!: FastifyInstance;

  private localUploadsBaseDir = path.resolve(__dirname, '../../../uploads'); // Root of repo/uploads
  private publicPathPrefix = "/uploads"; // The prefix used by fastify-static

  constructor() {
    // Note: instance might not be available in constructor with fastify-decorators.
    // It's better to access it within methods or use an 'onReady' hook if available.
    // For ensureDirectoryExists, it's okay if it runs early.
    this.ensureDirectoryExists(this.localUploadsBaseDir).catch((error) => {
      logger.error(
        "Failed to create base uploads directory during FileStorageService construction:",
        error,
      );
      // Depending on strictness, you might want to throw here to prevent service instantiation
    });
  }

  private async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      await fs.access(directoryPath);
    } catch (error) {
      try {
        await fs.mkdir(directoryPath, { recursive: true });
        logger.info(`Created directory: ${directoryPath}`);
      } catch (mkdirError) {
        logger.error(
          `Failed to create directory ${directoryPath}:`,
          mkdirError,
        );
        throw new AppError(
          `Storage setup error: unable to create directory ${directoryPath}.`,
          500,
          mkdirError,
        );
      }
    }
  }

  /**
   * Uploads a file to the storage.
   * @param storagePath Path within the storage (e.g., 'voice_messages/conversation_id/filename.mp3')
   * @param fileBuffer Buffer of the file content.
   * @param mimeType Mime type of the file.
   * @returns Publicly accessible URL of the uploaded file.
   */
  async uploadFile(
    storagePath: string,
    fileBuffer: Buffer,
    // mimeType: string, // Removed as not used by local storage simulation
  ): Promise<string> {
    // For local storage simulation:
    const localDirPath = path.join(
      this.localUploadsBaseDir,
      path.dirname(storagePath),
    );
    const localFilePath = path.join(this.localUploadsBaseDir, storagePath);

    try {
      await this.ensureDirectoryExists(localDirPath);
      await fs.writeFile(localFilePath, fileBuffer);
      logger.info(`File saved locally: ${localFilePath}`);

      // Construct a full public URL
      let backendBaseUrl = this.instance.config.BACKEND_PUBLIC_URL;
      if (!backendBaseUrl) {
        // Fallback to server properties, but log a warning as this might not be reliable for all deployment scenarios
        // or might not be available if accessed too early.
        const protocol =
          (this.instance.server.address() as any)?.protocol || "http";
        const hostname =
          (this.instance.server.address() as any)?.address || "localhost";
        const port =
          (this.instance.server.address() as any)?.port ||
          this.instance.config.SERVER_PORT;
        backendBaseUrl = `${protocol}://${hostname}:${port}`;
        logger.warn(
          `BACKEND_PUBLIC_URL not set. Falling back to dynamically constructed URL: ${backendBaseUrl}. Please set BACKEND_PUBLIC_URL for robust behavior.`,
        );
      }

      // Ensure no double slashes and correctly join parts
      const relativeUrlPath =
        `${this.publicPathPrefix}/${storagePath.replace(/\\/g, "/")}`.replace(
          /\/\//g,
          "/",
        );
      // new URL() handles joining correctly, ensuring no double slashes between base and path if path starts with /
      const publicUrl = new URL(relativeUrlPath, backendBaseUrl).toString();

      logger.info(`Constructed public URL: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      logger.error(
        `Failed to write file to local storage at ${localFilePath}:`,
        error,
      );
      throw new AppError("File upload failed during storage.", 500, error);
    }

    // // Example for S3 (would require aws-sdk and proper configuration)
    // const s3Client = new S3Client({ region: "your-region" });
    // const bucketName = this.fastify.config.S3_BUCKET_NAME;
    // const putCommand = new PutObjectCommand({
    //   Bucket: bucketName,
    //   Key: storagePath,
    //   Body: fileBuffer,
    //   ContentType: mimeType,
    //   // ACL: 'public-read', // if you want files to be publicly readable directly
    // });
    // try {
    //   await s3Client.send(putCommand);
    //   return `https://${bucketName}.s3.your-region.amazonaws.com/${storagePath}`;
    // } catch (error) {
    //   logger.error('Failed to upload to S3:', error);
    //   throw new AppError('File upload to S3 failed.', 500, error);
    // }
  }

  /**
   * Deletes a file from the storage.
   * @param storagePath Path of the file within the storage.
   */
  async deleteFile(storagePath: string): Promise<void> {
    // For local storage simulation:
    const localFilePath = path.join(this.localUploadsBaseDir, storagePath);
    try {
      await fs.access(localFilePath); // Check if file exists
      await fs.unlink(localFilePath);
      logger.info(`File deleted locally: ${localFilePath}`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        logger.warn(`Attempted to delete non-existent file: ${localFilePath}`);
        return; // File doesn't exist, consider it deleted
      }
      logger.error(
        `Failed to delete file from local storage at ${localFilePath}:`,
        error,
      );
      throw new AppError("File deletion failed during storage.", 500, error);
    }

    // // Example for S3
    // const s3Client = new S3Client({ region: "your-region" });
    // const bucketName = this.fastify.config.S3_BUCKET_NAME;
    // const deleteCommand = new DeleteObjectCommand({
    //   Bucket: bucketName,
    //   Key: storagePath,
    // });
    // try {
    //   await s3Client.send(deleteCommand);
    // } catch (error) {
    //   logger.error('Failed to delete from S3:', error);
    //   throw new AppError('File deletion from S3 failed.', 500, error);
    // }
  }
}
