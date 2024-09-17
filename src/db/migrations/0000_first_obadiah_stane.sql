DO $$ BEGIN
 CREATE TYPE "public"."popularity" AS ENUM('unknown', 'known', 'popular');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text NOT NULL,
	"followed_by" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "sources" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "sources" USING btree ("slug");