import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { env } from "../../env";
import { waitFor } from "../../helpers";
import { IMAGE_UPLOAD_PREVENTIVE_TIMEOUT } from "./constants";
import { Readable } from "node:stream";

const key = env.AZURE_FILE_STORAGE_KEY;
const account = env.AZURE_FILE_STORAGE_ACCOUNT_NAME;
const container = env.AZURE_FILE_STORAGE_CONTAINER_NAME;

const connectionString = `https://${account}.blob.core.windows.net/`;

const credentials = new StorageSharedKeyCredential(account, key);
const accountClient = new BlobServiceClient(connectionString, credentials);

const containerClient = accountClient.getContainerClient(container);

export async function isImageUploaded(name: string) {
  const blobClient = containerClient.getBlockBlobClient(name);
  const wasAlreadyUploaded = await blobClient.exists();
  if (wasAlreadyUploaded) return blobClient.url;

  return undefined;
}

export async function uploadImage(name: string, image: Buffer) {
  const blobClient = containerClient.getBlockBlobClient(name);
  const wasAlreadyUploaded = await blobClient.exists();
  if (wasAlreadyUploaded) return blobClient.url;

  await waitFor(IMAGE_UPLOAD_PREVENTIVE_TIMEOUT);
  await blobClient.uploadStream(Readable.from(image));
  return blobClient.url;
}

export const AzureBlobService = {
  uploadImage,
  isImageUploaded,
};
