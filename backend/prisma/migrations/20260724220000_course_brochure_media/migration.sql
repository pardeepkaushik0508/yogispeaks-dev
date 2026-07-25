-- Course brochure PDF / document upload (admin media library)
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "brochureMediaId" UUID;

DO $$ BEGIN
  ALTER TABLE "courses"
    ADD CONSTRAINT "courses_brochureMediaId_fkey"
    FOREIGN KEY ("brochureMediaId") REFERENCES "media_assets"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "courses_brochureMediaId_idx" ON "courses"("brochureMediaId");
