import { S3 } from "@aws-sdk/client-s3";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file for AWS configuration
dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error("Missing AWS configuration environment variables.");
}

// Initialize the S3 client with the necessary configuration including region and credentials
const s3 = new S3({
  region, // The AWS region where the S3 bucket is located
  credentials: {
    accessKeyId, // Your AWS access key ID
    secretAccessKey, // Your AWS secret access key
  },
});

// Interface defining the structure for upload parameters
interface UploadParams {
  bucketName: string; // The name of the S3 bucket
  fileKey: string; // The key (filename) under which the file will be stored in the bucket
  fileBuffer: Buffer; // The buffer containing the file data to be uploaded
  contentType: string; // The MIME type of the file (e.g., image/jpeg, application/pdf)
}

/**
 * Uploads a file to S3 bucket.
 * @param params - An object containing bucket name, file key, file buffer, and content type.
 * @returns {Promise<{Location: string; Key: string; Bucket: string}>} - An object containing the file URL and metadata.
 */
const uploadFileToS3 = async (
  params: UploadParams,
): Promise<{ Location: string; Key: string; Bucket: string }> => {
  const { bucketName, fileKey, fileBuffer, contentType } = params;

  // Construct the parameters for the S3 putObject method
  const uploadParams = {
    Bucket: bucketName, // The S3 bucket to upload to
    Key: fileKey, // The key (name) for the uploaded file
    Body: fileBuffer, // The actual file data
    ContentType: contentType, // The MIME type of the file
  };

  // Upload the file to the specified S3 bucket
  await s3.putObject(uploadParams);

  // Construct the URL to access the uploaded file
  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return {
    Location: fileUrl, // URL of the uploaded file
    Key: fileKey, // The key under which the file was stored
    Bucket: bucketName, // The name of the bucket
  };
};

/**
 * Processes image files.
 * @param buffer - The Buffer containing image data.
 * @returns {Promise<Buffer>} - A promise that resolves with the processed image buffer.
 */
const processImage = async (buffer: Buffer): Promise<Buffer> => {
  // Optional image processing logic can be implemented here
  return buffer; // Returning the original buffer for now
};

/**
 * Processes PDF files.
 * @param buffer - The Buffer containing PDF data.
 * @returns {Promise<Buffer>} - A promise that resolves with the processed PDF buffer.
 */
const processPdf = async (buffer: Buffer): Promise<Buffer> => {
  // Optional PDF processing logic can be implemented here
  return buffer; // Returning the original buffer for now
};

/**
 * Handles the file upload process, including processing and uploading to S3.
 * @param file - The file stream to be uploaded (usually obtained from a multipart/form-data request).
 * @param filename - The original name of the file.
 * @returns {Promise<{Location: string; Key: string; Bucket: string}>} - An object containing the file URL and metadata.
 */
export const handleFileUpload = async (
  file: any, // The file stream received from the upload
  filename: string, // The original name of the uploaded file
): Promise<{ Location: string; Key: string; Bucket: string }> => {
  const bucketName = process.env.S3_BUCKET_NAME; // Retrieve the bucket name from environment variables
  const fileExt = path.extname(filename).toLowerCase(); // Get the file extension

  if (!bucketName) {
    throw new Error(
      "S3 bucket name is not set. Please check your environment variables.",
    );
  }

  // Convert the file stream into a buffer
  const chunks: Buffer[] = []; // Array to hold chunks of file data
  for await (const chunk of file) {
    chunks.push(chunk); // Push each chunk into the array
  }
  let fileBuffer = Buffer.concat(chunks); // Concatenate chunks into a single buffer

  // Perform processing based on the file extension
  if (fileExt === ".jpg" || fileExt === ".jpeg" || fileExt === ".png") {
    fileBuffer = await processImage(fileBuffer); // Process images
  } else if (fileExt === ".pdf") {
    fileBuffer = await processPdf(fileBuffer); // Process PDFs
  }

  const fileKey = `${Date.now()}-${filename}`; // Create a unique file key using timestamp
  console.log("Uploading to S3:", bucketName, fileKey); // Log upload information

  // Upload the processed file to S3 and return the URL
  return await uploadFileToS3({
    bucketName, // The name of the bucket
    fileKey, // The key under which to store the file
    fileBuffer, // The buffer containing the file data
    contentType: file.mimetype, // The MIME type of the file
  });
};
