import sharp from "sharp";
import { waitFor } from "..";
import { IMAGE_DOWNLOAD_PREVENTIVE_TIMEOUT } from "./constants";

export async function getImageFromUrl(url: string) {
  await waitFor(IMAGE_DOWNLOAD_PREVENTIVE_TIMEOUT);
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const sharpPipeline = sharp(buffer);
  const optimized = await sharpPipeline.webp({ quality: 100 }).toBuffer();
  return optimized;
}
