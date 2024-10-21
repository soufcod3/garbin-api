const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY

export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
    const formData = new FormData();
    
    formData.append("size", "auto");
    formData.append("image_file", new Blob([imageBuffer], { type: "image/png" }));
  
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  
    // Convert the result to a buffer
    const resultBuffer = Buffer.from(await response.arrayBuffer());
    return resultBuffer;
}