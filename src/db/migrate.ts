import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../env";

async function doMigrations() {
  const connection = postgres(env.POSTGRES_DATABASE_URL, { max: 1 });
  await migrate(drizzle(connection), { migrationsFolder: "./src/db/migrations" });
  console.log("✨ Migrations have finished ✨");
  return Promise.resolve();
}

doMigrations().then(() => process.exit(0));
