import { index, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    imageUrl: text("image_url").notNull(),
    followedBy: integer("followed_by").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (source) => ({
    titleIndex: index("title_idx").on(source.title),
    slugIndex: uniqueIndex("slug_idx").on(source.slug),
  })
);
