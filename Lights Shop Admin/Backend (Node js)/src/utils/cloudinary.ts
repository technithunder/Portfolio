import { v2 as cloudinaryV2 } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

export namespace Cloudinary {
  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  type FileOrBase64 = Express.Multer.File | string;

  export const uploadToCloudinary = async (
    fileOrBase64: FileOrBase64,
    isBeingCalled?: string
  ): Promise<any> => {
    try {
      return new Promise((resolve, reject) => {
        const folderMap: Record<string, string> = {
          products: "products",
          orders: "orders",
          staffs: "staffs",
          dealers: "dealers",
          order_payment: "order_payment",
          users: "users",
          review_image: "review_image",
        };

        const folderValue =
          isBeingCalled && folderMap[isBeingCalled]
            ? folderMap[isBeingCalled]
            : undefined;

        // Base64 upload
        if (
          typeof fileOrBase64 === "string" &&
          fileOrBase64.startsWith("data:")
        ) {
          cloudinaryV2.uploader.upload(
            fileOrBase64,
            { folder: folderValue },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
        } else if (
          typeof fileOrBase64 === "object" &&
          fileOrBase64.buffer &&
          fileOrBase64.originalname
        ) {
          // Multer file upload
          const stream = cloudinaryV2.uploader.upload_stream(
            {
              folder: folderValue,
              public_id: fileOrBase64.originalname.split(".")[0],
            },
            (error, result: any) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          const readableStream = new Readable();
          readableStream.push(fileOrBase64.buffer);
          readableStream.push(null);
          readableStream.pipe(stream);
        } else {
          reject(new Error("Invalid file format for Cloudinary upload"));
        }
      });
    } catch (error) {
      console.error("Cloudinary error:", error);
      throw new Error("Cloudinary upload failed");
    }
  };
}
