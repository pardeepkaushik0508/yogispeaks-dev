/** Shared CMS types for public marketing pages. */

export type PageBlockItem =
  | string
  | { title: string; description?: string }
  | Record<string, unknown>;

export type PageBlock = {
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  bodyHtml: string | null;
  itemsJson: PageBlockItem[] | Record<string, unknown> | null;
  sortOrder: number;
  isVisible: boolean;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  bodyHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  blocks: PageBlock[];
  heroImage?: { url?: string; publicUrl?: string } | null;
};

export type CourseBenefit = { id: string; label: string; sortOrder: number };
export type CourseFeature = {
  id: string;
  title: string;
  description: string | null;
  iconKey: string | null;
  sortOrder: number;
};
export type CourseLearningStep = {
  id: string;
  stepNumber: number;
  title: string;
  description: string | null;
  sortOrder: number;
};
export type CourseCurriculumItem = {
  id: string;
  title: string;
  bodyHtml: string | null;
  iconKey: string | null;
  sortOrder: number;
};
export type CourseFaq = {
  id: string;
  question: string;
  answerHtml: string;
  sortOrder: number;
};

export type CmsCourse = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescriptionHtml: string;
  heroHeadline: string | null;
  whyLearnHtml: string | null;
  whoShouldJoinHtml: string | null;
  whyChooseHtml: string | null;
  whyLearnTitle: string | null;
  whoShouldJoinTitle: string | null;
  whoShouldJoinIntro: string | null;
  curriculumTitle: string | null;
  featuresTitle: string | null;
  benefitsTitle: string | null;
  benefitsIntro: string | null;
  learningStepsTitle: string | null;
  whyChooseTitle: string | null;
  testimonialsTitle: string | null;
  faqsTitle: string | null;
  finalCtaHeadline: string | null;
  finalCtaBody: string | null;
  finalSecondaryCtaLabel: string | null;
  stickyCtaLabel: string | null;
  duration: string;
  mode: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  benefits: CourseBenefit[];
  features: CourseFeature[];
  learningSteps: CourseLearningStep[];
  curriculumItems: CourseCurriculumItem[];
  faqs: CourseFaq[];
  featuredImage?: { id?: string; url?: string; publicUrl?: string; mimeType?: string } | null;
  brochureMedia?: { id?: string; url?: string; publicUrl?: string; mimeType?: string; title?: string } | null;
};

export type CmsTestimonial = {
  id: string;
  studentName: string;
  designation: string;
  courseLabel: string | null;
  review: string;
  rating: number;
};

export type CmsFaq = {
  id: string;
  question: string;
  answerHtml: string;
  category: string | null;
  courseId?: string | null;
  sortOrder: number;
};

export type CmsBlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  authorName: string;
  publishedAt: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  category?: CmsBlogCategory | null;
  featuredImage?: { url?: string; publicUrl?: string } | null;
};
