import config from "./config";
import { logger } from "./logger";

// AWS S3 SDK - optional dependency
// Install with: npm install @aws-sdk/client-s3
let S3Client: any = null;
let PutObjectCommand: any = null;
let DeleteObjectCommand: any = null;

try {
  const s3Module = require("@aws-sdk/client-s3");
  S3Client = s3Module.S3Client;
  PutObjectCommand = s3Module.PutObjectCommand;
  DeleteObjectCommand = s3Module.DeleteObjectCommand;
} catch (error) {
  logger.warn("AWS S3 SDK not installed. S3 features will be disabled.");
}

let s3Client: any = null;

// AWS S3 configuration
// Add these to your .env file:
// AWS_ACCESS_KEY_ID=your-access-key
// AWS_SECRET_ACCESS_KEY=your-secret-key
// AWS_REGION=your-region
// AWS_S3_BUCKET=your-bucket-name

const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
};

if (awsConfig.credentials) {
  s3Client = new S3Client(awsConfig);
  logger.info("AWS S3 configured successfully");
} else {
  logger.warn("AWS S3 credentials not provided. S3 features will be disabled.");
}

export default s3Client;

// Helper functions
export const uploadToS3 = async (
  bucket: string,
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string
): Promise<boolean> => {
  if (!s3Client) {
    logger.error("S3 client not configured");
    return false;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    logger.info(`File uploaded to S3: ${key}`);
    return true;
  } catch (error: any) {
    logger.error(`S3 upload error: ${error.message}`);
    return false;
  }
};

export const deleteFromS3 = async (bucket: string, key: string): Promise<boolean> => {
  if (!s3Client) {
    logger.error("S3 client not configured");
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
    logger.info(`File deleted from S3: ${key}`);
    return true;
  } catch (error: any) {
    logger.error(`S3 delete error: ${error.message}`);
    return false;
  }
};

export const getS3Url = (bucket: string, key: string): string => {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

