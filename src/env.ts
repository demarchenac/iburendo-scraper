import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    AZURE_FILE_STORAGE_SAS_TOKEN: z.string().min(1),
    AZURE_FILE_STORAGE_ACCOUNT_NAME: z.string().min(1),
    AZURE_FILE_STORAGE_CONTAINER_NAME: z.string().min(1),
  },
  runtimeEnvStrict: {
    AZURE_FILE_STORAGE_SAS_TOKEN: process.env.AZURE_FILE_STORAGE_SAS_TOKEN,
    AZURE_FILE_STORAGE_ACCOUNT_NAME: process.env.AZURE_FILE_STORAGE_ACCOUNT_NAME,
    AZURE_FILE_STORAGE_CONTAINER_NAME: process.env.AZURE_FILE_STORAGE_CONTAINER_NAME,
  },
});
