
import { TextractClient, AnalyzeIDCommand,AnalyzeDocumentCommand, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } from "@aws-sdk/client-textract";
import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();
export module TextractService {
  const textractClient = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    });
    
   export const extractBucketAndKeyFromPresignedUrl = (presignedUrl) => {
        const url = new URL(presignedUrl);
        const [, bucket, ...keyParts] = url.pathname.split('/');
        const key = keyParts.join('/');
        return { bucket, key };
    };
   
   export const analyzeIdDocument = async (s3Bucket, s3Key) => {
        try {
            const command = new AnalyzeIDCommand({
                DocumentPages: [
                    {
                        S3Object: {
                            Bucket: s3Bucket,
                            Name: s3Key,
                        }
                    }
                ]
            });
            const response = await textractClient.send(command);

            return response;
        } catch (error) {
            logger.error("AnalyzeID Error:", error);
            const errorMessage = error?.message || 'AnalyzeID Error';
            throw new Error(errorMessage);
        }
    };
   
  export  const extractDataFromAnalyzeId = (response) => {
        const extractedData = {};
        for (const document of response.IdentityDocuments || []) {
            for (const field of document.IdentityDocumentFields || []) {
                const fieldType = field.Type.Text;
                const fieldValue = field.ValueDetection.Text;
                extractedData[fieldType] = fieldValue;
            }
        }
        return extractedData;
    };
  
    export const processDocumentFromPresignedUrl = async (presignedUrl) => {
        try {
            const { bucket, key } = extractBucketAndKeyFromPresignedUrl(presignedUrl);
            logger.info(`Processing document from bucket: ${bucket}, key: ${key}`);
            const response = await analyzeIdDocument(bucket, key);
            const extractedData = extractDataFromAnalyzeId(response);
            logger.info("Textract AnalyzeID response:", JSON.stringify(extractedData, null, 4));
            return extractedData;
        } catch (error) {
            logger.error(`Error processing document: ${error.message}`);
            throw error;
        }
    };
}
