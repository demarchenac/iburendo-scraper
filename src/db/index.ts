import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env";
import * as schema from "./schema";

const connection = postgres(env.POSTGRES_DATABASE_URL);
export const db = drizzle(connection, { schema });
