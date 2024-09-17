import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { sourcedComicChapters } from "./sourcedComicChapters";

export const sourcedComicChapterPages = pgTable(
  "sourced_comic_chapter_pages",
  {
    id: serial("id").primaryKey(),
    sourcedComicChapterId: integer("source_id").references(() => sourcedComicChapters.id),
    number: integer("number").notNull(),
    imageUrl: text("image_url").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueSourcedComicChapterPage: unique("unique_sourced_comic_chapter_page").on(
      t.sourcedComicChapterId,
      t.number
    ),
  })
);
