CREATE TABLE IF NOT EXISTS "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"comic_id" integer,
	"title" text NOT NULL,
	"number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_comic_chapter" UNIQUE("comic_id","number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text NOT NULL,
	"followed_by" integer DEFAULT 0 NOT NULL,
	"first_chapter" integer DEFAULT 0 NOT NULL,
	"last_chapter" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sourced_comic_chapter_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"number" integer NOT NULL,
	"image_url" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_sourced_comic_chapter_page" UNIQUE("source_id","number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sourced_comic_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"chapter_id" integer,
	"pages" integer DEFAULT 0 NOT NULL,
	"url" text NOT NULL,
	"published_on" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_sourced_comic_chapter" UNIQUE("source_id","chapter_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sourced_comics" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"comic_id" integer,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_sourced_comic" UNIQUE("source_id","comic_id")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "title_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "slug_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_comic_id_comics_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sourced_comic_chapter_pages" ADD CONSTRAINT "sourced_comic_chapter_pages_source_id_sourced_comic_chapters_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sourced_comic_chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sourced_comic_chapters" ADD CONSTRAINT "sourced_comic_chapters_source_id_sourced_comics_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sourced_comics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sourced_comic_chapters" ADD CONSTRAINT "sourced_comic_chapters_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sourced_comics" ADD CONSTRAINT "sourced_comics_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sourced_comics" ADD CONSTRAINT "sourced_comics_comic_id_comics_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comic_title_idx" ON "comics" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_title_idx" ON "sources" USING btree ("title");--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_slug_unique" UNIQUE("slug");