import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import logger from './logger';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const uploadToS3Bucket = async (base64Data: string): Promise<{ fileKey: string; s3FileUrl: string }> => {
  try {
    const fileKey = `uploads/${Date.now()}-${uuidv4()}`;

    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 format');
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));

    return { fileKey, s3FileUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}` };

  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Error while uploading image to S3');
  }
};


export const extractTextFromImage = async (fileKey: string): Promise<string> => {
  try {
    const params = {
      Document: {
        S3Object: {
          Bucket: BUCKET_NAME!,
          Name: fileKey,
        },
      },
    };

    const command = new DetectDocumentTextCommand(params);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await textractClient.send(command);
    return response.Blocks?.filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join(' ') || '';
  } catch (error) {
    logger.error('Textract Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

