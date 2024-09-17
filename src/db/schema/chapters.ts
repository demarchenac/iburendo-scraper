import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { comics } from "./comics";

export const chapters = pgTable(
  "chapters",
  {
    id: serial("id").primaryKey(),
    comicId: integer("comic_id").references(() => comics.id),
    title: text("title").notNull(),
    number: integer("number").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({ uniqueComicChapter: unique("unique_comic_chapter").on(t.comicId, t.number) })
);
