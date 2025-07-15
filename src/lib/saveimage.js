import { writeFile } from "fs/promises";
import path from "path";

export async function saveImageToUploads(file) {
  if (!file || typeof file === "string") {
    return null;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name}`;
  const filePath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(filePath, buffer);

  return filename; // just the filename like "1721388888_image.jpg"
}
