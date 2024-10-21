import { Jimp } from "jimp";

export async function removeTransparentAreas(base64Image: string): Promise<Buffer> {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ""); // Remove base64 prefix
    const buffer = Buffer.from(base64Data, 'base64');

    const image = await Jimp.read(buffer);
  
    // Automatically crop transparent pixels
    image.autocrop();
  
    // Get the updated buffer after cropping
    const croppedBuffer = await image.getBuffer("image/png"); // Use PNG for transparency
    return croppedBuffer;
}