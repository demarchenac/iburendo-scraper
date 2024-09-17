import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const comics = pgTable(
  "comics",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    imageUrl: text("image_url").notNull(),
    followedBy: integer("followed_by").notNull().default(0),
    firstChapter: integer("first_chapter").notNull().default(0),
    lastChapter: integer("last_chapter").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({ comicTitleIndex: index("comic_title_idx").on(t.title) })
);
