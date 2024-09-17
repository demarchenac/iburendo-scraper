import type { Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_DATABASE_URL,
  },
} satisfies Config;
