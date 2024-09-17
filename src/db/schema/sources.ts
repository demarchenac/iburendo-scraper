import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    imageUrl: text("image_url").notNull(),
    followedBy: integer("followed_by").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({ sourceTitleIndex: index("source_title_idx").on(t.title) })
);
