-- AlterTable
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whyLearnHtml" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whyChooseHtml" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "heroHeadline" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "secondaryCtaLabel" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "secondaryCtaHref" TEXT;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN IF NOT EXISTS "courseId" UUID;

-- CreateTable
CREATE TABLE IF NOT EXISTS "course_features" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "iconKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "course_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "course_learning_steps" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "course_learning_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "page_blocks" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "bodyHtml" TEXT,
    "itemsJson" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "page_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "course_features_courseId_sortOrder_idx" ON "course_features"("courseId", "sortOrder");
CREATE INDEX IF NOT EXISTS "course_learning_steps_courseId_sortOrder_idx" ON "course_learning_steps"("courseId", "sortOrder");
CREATE INDEX IF NOT EXISTS "faqs_courseId_idx" ON "faqs"("courseId");
CREATE INDEX IF NOT EXISTS "page_blocks_pageId_sortOrder_idx" ON "page_blocks"("pageId", "sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "page_blocks_pageId_key_key" ON "page_blocks"("pageId", "key");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "course_features" ADD CONSTRAINT "course_features_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "course_learning_steps" ADD CONSTRAINT "course_learning_steps_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
