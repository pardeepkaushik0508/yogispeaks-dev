-- Course section headings / final CTA copy
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whyLearnTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whoShouldJoinTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whoShouldJoinIntro" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "curriculumTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "featuresTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "benefitsTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "benefitsIntro" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "learningStepsTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "whyChooseTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "testimonialsTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "faqsTitle" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "finalCtaHeadline" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "finalCtaBody" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "finalSecondaryCtaLabel" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "stickyCtaLabel" TEXT;

-- Curriculum module icons (Listening / Reading / Writing / Speaking)
ALTER TABLE "course_curriculum_items" ADD COLUMN IF NOT EXISTS "iconKey" TEXT;
