import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export async function uploadToCloudinary(imageBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "garments",
          transformation: {
            crop: "fill",    // Auto crop to remove empty spaces
            gravity: "auto", // Focus on the main subject
            width: 400,      // Resize the image to a width of 400px
          }
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(imageBuffer); // Upload the buffer
    });
}