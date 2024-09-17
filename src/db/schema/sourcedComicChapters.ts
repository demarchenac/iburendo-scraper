import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { sourcedComics } from "./sourcedComics";
import { chapters } from "./chapters";

export const sourcedComicChapters = pgTable(
  "sourced_comic_chapters",
  {
    id: serial("id").primaryKey(),
    sourcedComicId: integer("source_id").references(() => sourcedComics.id),
    chapterId: integer("chapter_id").references(() => chapters.id),
    pages: integer("pages").notNull().default(0),
    url: text("url").notNull(),
    publishedOn: timestamp("published_on").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueSourcedComicChapter: unique("unique_sourced_comic_chapter").on(
      t.sourcedComicId,
      t.chapterId
    ),
  })
);
