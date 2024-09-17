import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { sources } from "./sources";
import { comics } from "./comics";

export const sourcedComics = pgTable(
  "sourced_comics",
  {
    id: serial("id").primaryKey(),
    sourceId: integer("source_id").references(() => sources.id),
    comicId: integer("comic_id").references(() => comics.id),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueSourcedComic: unique("unique_sourced_comic").on(t.sourceId, t.comicId),
  })
);
