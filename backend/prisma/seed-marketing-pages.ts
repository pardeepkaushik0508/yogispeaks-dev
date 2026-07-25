/**
 * Seeds Reviews, Blog, Contact, FAQ, and legal CMS pages from marketing briefs.
 * Idempotent via slug upserts.
 */
import { PrismaClient, PublishStatus } from '@prisma/client';

const p = (text: string) => `<p>${text}</p>`;
const ul = (items: string[]) =>
  `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const h2 = (text: string) => `<h2>${text}</h2>`;
const h3 = (text: string) => `<h3>${text}</h3>`;

type BlockInput = {
  key: string;
  title?: string;
  subtitle?: string;
  bodyHtml?: string;
  itemsJson?: unknown;
  sortOrder: number;
};

async function upsertPage(
  prisma: PrismaClient,
  data: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    bodyHtml?: string;
    blocks: BlockInput[];
  },
) {
  const page = await prisma.page.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title,
      status: PublishStatus.PUBLISHED,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      bodyHtml: data.bodyHtml || p(data.title),
    },
    create: {
      title: data.title,
      slug: data.slug,
      status: PublishStatus.PUBLISHED,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      bodyHtml: data.bodyHtml || p(data.title),
    },
  });

  await prisma.pageBlock.deleteMany({ where: { pageId: page.id } });
  if (data.blocks.length) {
    await prisma.pageBlock.createMany({
      data: data.blocks.map((b) => ({
        pageId: page.id,
        key: b.key,
        title: b.title ?? null,
        subtitle: b.subtitle ?? null,
        bodyHtml: b.bodyHtml ?? null,
        itemsJson: b.itemsJson ?? undefined,
        sortOrder: b.sortOrder,
        isVisible: true,
      })),
    });
  }
  return page;
}

export async function seedMarketingPages(prisma: PrismaClient): Promise<void> {
  // ─── Reviews / Success Stories ────────────────────────────────────────────
  await upsertPage(prisma, {
    title: 'Student Success Stories',
    slug: 'reviews',
    metaTitle:
      'Student Reviews | Success Stories | YogiSpeaks Online Spoken English & IELTS Coaching',
    metaDescription:
      'Read genuine student reviews and success stories from learners who improved their Spoken English, IELTS scores, Professional Communication, Personality Development, and Spoken Hindi through YogiSpeaks’ one-to-one online coaching.',
    blocks: [
      {
        key: 'hero',
        title: 'Student Success Stories',
        subtitle: 'Real Learners. Real Progress. Real Confidence.',
        bodyHtml: p(
          'Every learner’s journey is unique. At YogiSpeaks, we take pride in helping students, professionals, entrepreneurs, and international learners build confidence and achieve their communication goals through personalized coaching.',
        ),
        itemsJson: {
          primaryLabel: 'Book Free Communication Assessment',
          primaryHref: '/free-assessment',
          secondaryLabel: 'Read Google Reviews',
          secondaryHref: 'https://www.google.com/search?q=YogiSpeaks+reviews',
          ratingValue: '4.9',
          ratingCount: '50+',
        },
        sortOrder: 0,
      },
      {
        key: 'why_recommend',
        title: 'Why Our Students Recommend YogiSpeaks',
        bodyHtml: p(
          'Our learners choose YogiSpeaks because we focus on practical communication, personalized guidance, and measurable improvement. Every class is designed to help students apply what they learn in real-life situations.',
        ),
        sortOrder: 1,
      },
      {
        key: 'achievements',
        title: 'Student Achievements',
        subtitle: 'Our learners have successfully:',
        itemsJson: [
          'Improved spoken English fluency.',
          'Built confidence for interviews.',
          'Achieved IELTS target band scores.',
          'Enhanced workplace communication.',
          'Delivered presentations with confidence.',
          'Improved leadership and public speaking skills.',
          'Learned practical Spoken Hindi for travel and work.',
          'Advanced their academic and professional careers.',
        ],
        sortOrder: 2,
      },
      {
        key: 'trust',
        title: 'Why Students Trust YogiSpeaks',
        itemsJson: [
          'Personalized One-to-One Coaching',
          'Practical Learning Approach',
          'Flexible Class Timings',
          'Continuous Feedback',
          'Structured Learning Plans',
          'Live Interactive Sessions',
          'Experienced Mentor',
          'Supportive Learning Environment',
        ],
        sortOrder: 3,
      },
      {
        key: 'journey',
        title: 'Learning Journey',
        itemsJson: [
          { title: 'Assessment', description: 'Understand your current communication level.' },
          { title: 'Personalized Learning Plan', description: 'A course tailored to your goals.' },
          { title: 'Live Coaching', description: 'Interactive sessions with practical speaking activities.' },
          { title: 'Continuous Feedback', description: 'Regular corrections and progress tracking.' },
          { title: 'Success', description: 'Communicate with confidence in real-life situations.' },
        ],
        sortOrder: 4,
      },
      {
        key: 'share',
        title: 'Share Your Experience',
        bodyHtml: `${p(
          'Your feedback helps future learners make informed decisions and motivates us to continue improving.',
        )}${p(
          'If you’ve completed a course with YogiSpeaks, we’d love to hear about your experience.',
        )}`,
        itemsJson: {
          primaryLabel: 'Write a Google Review',
          primaryHref: 'https://www.google.com/search?q=YogiSpeaks+reviews',
          secondaryLabel: 'Share Your Success Story',
          secondaryHref: '/contact',
        },
        sortOrder: 5,
      },
      {
        key: 'faqs',
        title: 'Frequently Asked Questions',
        itemsJson: [
          {
            title: 'Are these reviews from real students?',
            description:
              'Yes. We encourage genuine feedback from learners based on their personal experience.',
          },
          {
            title: 'Can I speak to a mentor before joining?',
            description:
              'Yes. We offer a Free Communication Assessment where you can discuss your goals and receive personalized guidance.',
          },
          {
            title: 'Do you teach learners outside India?',
            description: 'Yes. Our online classes are available for learners across the world.',
          },
          {
            title: 'Are classes one-to-one?',
            description: 'Yes. We specialize in personalized one-to-one online coaching.',
          },
        ],
        sortOrder: 6,
      },
      {
        key: 'cta',
        title: 'Your Success Story Could Be Next',
        subtitle:
          'Join hundreds of learners who have improved their confidence, communication skills, and career opportunities with YogiSpeaks.',
        itemsJson: {
          buttonLabel: 'Book Your Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'Contact Our Mentor',
          secondaryHref: '/contact',
        },
        sortOrder: 7,
      },
      {
        key: 'conversion',
        title: 'Thousands of Lessons. Countless Success Stories. One Goal — Your Growth.',
        subtitle:
          'At YogiSpeaks, every learner receives personalized guidance to build confidence and communicate effectively. Start your journey today and become our next success story.',
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'View Our Courses',
          secondaryHref: '/courses',
        },
        sortOrder: 8,
      },
    ],
  });

  // Extra reviews testimonials (PAGE 8)
  const reviewTestimonials = [
    {
      designation: 'Working Professional',
      courseLabel: 'Spoken English',
      review:
        'I joined YogiSpeaks with very little confidence in speaking English. The one-to-one coaching and regular speaking practice helped me express myself comfortably during interviews and daily conversations.',
    },
    {
      designation: 'College Student',
      courseLabel: 'Spoken English',
      review:
        'The personalized approach made a huge difference. Every lesson was practical, engaging, and tailored to my needs.',
    },
    {
      designation: 'IELTS Aspirant',
      courseLabel: 'IELTS Preparation',
      review:
        'The IELTS preparation sessions were well structured. The detailed feedback on my writing and speaking helped me improve steadily.',
    },
    {
      designation: 'Software Engineer',
      courseLabel: 'Professional Communication',
      review:
        'The Professional Communication course improved my confidence in client meetings, presentations, and business emails.',
    },
    {
      designation: 'Corporate Professional',
      courseLabel: 'Professional Communication',
      review: 'The flexible schedule made it easy for me to learn while managing my full-time job.',
    },
    {
      designation: 'International Learner',
      courseLabel: 'Spoken Hindi',
      review:
        'Learning Spoken Hindi through YogiSpeaks made my stay in India much easier. The classes focused on practical conversations that I could use every day.',
    },
  ];
  for (const [i, t] of reviewTestimonials.entries()) {
    const found = await prisma.testimonial.findFirst({
      where: { review: t.review, deletedAt: null },
    });
    const data = {
      studentName: 'Learner',
      designation: t.designation,
      courseLabel: t.courseLabel,
      review: t.review,
      rating: 5,
      isVisible: true,
      sortOrder: 20 + i,
    };
    if (found) await prisma.testimonial.update({ where: { id: found.id }, data });
    else await prisma.testimonial.create({ data });
  }

  // ─── Blog page + categories + sample posts ────────────────────────────────
  await upsertPage(prisma, {
    title: 'YogiSpeaks Blog',
    slug: 'blog',
    metaTitle:
      'English Learning Blog | Communication Skills, IELTS Tips & Career Advice | YogiSpeaks',
    metaDescription:
      'Explore expert articles on Spoken English, IELTS, Business English, Personality Development, Public Speaking, Interview Skills, and Communication Strategies from YogiSpeaks.',
    blocks: [
      {
        key: 'hero',
        title: 'YogiSpeaks Blog',
        subtitle: 'Learn, Improve & Grow with Expert Insights',
        bodyHtml: `${p(
          'Welcome to the YogiSpeaks Blog—your trusted resource for practical tips, expert guidance, and actionable strategies to improve your communication skills, English fluency, career prospects, and personal development.',
        )}${p(
          'Whether you’re a student, professional, entrepreneur, or language learner, you’ll find valuable content designed to help you achieve your goals.',
        )}`,
        itemsJson: {
          primaryLabel: 'Explore Articles',
          primaryHref: '#articles',
          secondaryLabel: 'Browse Categories',
          secondaryHref: '#categories',
        },
        sortOrder: 0,
      },
      {
        key: 'why_read',
        title: 'Why Read the YogiSpeaks Blog?',
        subtitle:
          'Our articles are designed to provide practical, easy-to-understand guidance that you can apply immediately.',
        itemsJson: [
          'Actionable communication tips',
          'Real-life examples',
          'Learning strategies',
          'Career advice',
          'Language improvement techniques',
          'Professional development insights',
          'Free learning resources',
        ],
        sortOrder: 1,
      },
      {
        key: 'subscribe',
        title: 'Stay Updated',
        subtitle: 'Never miss our latest learning resources.',
        itemsJson: [
          'New blog articles',
          'Communication tips',
          'English learning resources',
          'IELTS updates',
          'Exclusive learning guides',
        ],
        sortOrder: 2,
      },
      {
        key: 'faqs',
        title: 'Frequently Asked Questions',
        itemsJson: [
          {
            title: 'Are the blog articles free to read?',
            description: 'Yes. All articles are available free of charge.',
          },
          {
            title: 'How often are new articles published?',
            description:
              'We regularly publish fresh content covering communication, English learning, IELTS, and personality development.',
          },
          {
            title: 'Can beginners benefit from these articles?',
            description:
              'Absolutely. We create content for learners at beginner, intermediate, and advanced levels.',
          },
          {
            title: 'Can I share these articles?',
            description:
              'Yes. You’re welcome to share our articles while giving proper credit to YogiSpeaks.',
          },
        ],
        sortOrder: 3,
      },
      {
        key: 'cta',
        title: 'Continue Learning. Continue Growing.',
        subtitle:
          'Knowledge grows when it’s shared. Explore our latest articles and take your communication skills to the next level.',
        itemsJson: {
          buttonLabel: 'Explore All Articles',
          buttonHref: '#articles',
          secondaryLabel: 'Book Free Communication Assessment',
          secondaryHref: '/free-assessment',
        },
        sortOrder: 4,
      },
      {
        key: 'conversion',
        title: 'Every Article Brings You One Step Closer to Better Communication.',
        subtitle:
          'Explore practical learning resources created by experienced trainers and start applying them to your studies, career, and everyday conversations.',
        itemsJson: {
          buttonLabel: 'Explore Articles',
          buttonHref: '#articles',
          secondaryLabel: 'Book Free Communication Assessment',
          secondaryHref: '/free-assessment',
        },
        sortOrder: 5,
      },
    ],
  });

  const blogCategories = [
    { name: 'Spoken English', slug: 'spoken-english', description: 'Improve fluency, vocabulary, grammar, pronunciation, and everyday conversation skills.', sortOrder: 0 },
    { name: 'IELTS Preparation', slug: 'ielts-preparation', description: 'Expert strategies for Listening, Reading, Writing, Speaking, time management, and achieving your target band score.', sortOrder: 1 },
    { name: 'Professional Communication', slug: 'professional-communication', description: 'Business English, workplace communication, email writing, meeting etiquette, and client communication.', sortOrder: 2 },
    { name: 'Personality Development', slug: 'personality-development', description: 'Confidence, leadership, body language, public speaking, emotional intelligence, and personal branding.', sortOrder: 3 },
    { name: 'Spoken Hindi', slug: 'spoken-hindi', description: 'Practical Hindi lessons for foreigners, travelers, professionals, and non-native speakers.', sortOrder: 4 },
    { name: 'Interview Preparation', slug: 'interview-preparation', description: 'HR interviews, self-introductions, behavioral questions, resume communication, and salary negotiations.', sortOrder: 5 },
    { name: 'Public Speaking', slug: 'public-speaking', description: 'Stage confidence, voice modulation, audience engagement, and impactful presentations.', sortOrder: 6 },
    { name: 'Grammar & Vocabulary', slug: 'grammar-vocabulary', description: 'Grammar concepts, idioms, phrasal verbs, collocations, vocabulary builders, and common mistakes.', sortOrder: 7 },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of blogCategories) {
    const row = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryIds[cat.slug] = row.id;
  }

  const samplePosts = [
    {
      title: 'How to Speak English Fluently Without Memorizing Grammar Rules',
      slug: 'speak-english-fluently-without-memorizing-grammar',
      categorySlug: 'spoken-english',
      excerpt:
        'Learn practical techniques to improve fluency through conversation, daily practice, and confidence-building exercises.',
    },
    {
      title: '25 Common Interview Questions and How to Answer Them Confidently',
      slug: '25-common-interview-questions-confident-answers',
      categorySlug: 'interview-preparation',
      excerpt:
        'Prepare for your next interview with structured responses and professional communication strategies.',
    },
    {
      title: 'IELTS Writing Task 2: Common Mistakes That Reduce Your Band Score',
      slug: 'ielts-writing-task-2-common-mistakes',
      categorySlug: 'ielts-preparation',
      excerpt: 'Discover the most common writing errors and practical tips to improve your essays.',
    },
    {
      title: '10 Daily Habits That Improve Your English Speaking Skills',
      slug: '10-daily-habits-improve-english-speaking',
      categorySlug: 'spoken-english',
      excerpt:
        'Simple habits you can adopt every day to enhance vocabulary, pronunciation, and fluency.',
    },
    {
      title: 'Professional Email Writing: A Complete Guide',
      slug: 'professional-email-writing-complete-guide',
      categorySlug: 'professional-communication',
      excerpt:
        'Learn how to write clear, professional emails for the workplace with real-world examples.',
    },
    {
      title: 'Body Language Tips for Interviews and Presentations',
      slug: 'body-language-tips-interviews-presentations',
      categorySlug: 'personality-development',
      excerpt:
        'Understand how posture, eye contact, gestures, and facial expressions influence professional success.',
    },
  ];

  for (const [i, post] of samplePosts.entries()) {
    const categoryId = categoryIds[post.categorySlug];
    if (!categoryId) continue;
    const bodyHtml = `${p(post.excerpt)}${p(
      'This article shares practical guidance from YogiSpeaks mentors. Apply these ideas in daily practice, and book a free communication assessment if you’d like personalized coaching.',
    )}`;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        bodyHtml,
        categoryId,
        authorName: 'YogiSpeaks',
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
        metaTitle: `${post.title} | YogiSpeaks Blog`,
        metaDescription: post.excerpt,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        bodyHtml,
        categoryId,
        authorName: 'YogiSpeaks',
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
        metaTitle: `${post.title} | YogiSpeaks Blog`,
        metaDescription: post.excerpt,
      },
    });
    void i;
  }

  // ─── Contact ──────────────────────────────────────────────────────────────
  await upsertPage(prisma, {
    title: 'Contact Us',
    slug: 'contact',
    metaTitle: 'Contact YogiSpeaks | Book a Free Communication Assessment',
    metaDescription:
      'Get in touch with YogiSpeaks for online Spoken English, IELTS, Professional Communication, Personality Development, and Spoken Hindi coaching. Book your free communication assessment today.',
    blocks: [
      {
        key: 'hero',
        title: 'Contact YogiSpeaks',
        subtitle: 'Let’s Start Your Communication Journey',
        bodyHtml: `${p(
          'Whether you’re looking to improve your Spoken English, prepare for IELTS, develop professional communication skills, or build confidence through personality development, we’re here to help.',
        )}${p(
          'Our team will understand your goals, assess your current level, and recommend the most suitable learning plan for you.',
        )}`,
        itemsJson: {
          primaryLabel: 'Book Free Communication Assessment',
          primaryHref: '/free-assessment',
          secondaryLabel: 'Chat on WhatsApp',
          secondaryHref: 'https://wa.me/919873160236',
        },
        sortOrder: 0,
      },
      {
        key: 'get_in_touch',
        title: 'Get in Touch',
        subtitle:
          'We’d love to hear from you. Reach out through your preferred channel, and we’ll respond as soon as possible.',
        itemsJson: {
          office: 'YogiSpeaks, New Delhi, India',
          phone: '+91 98731 60236',
          email: 'hello@yogispeaks.com',
          website: 'www.yogispeaks.com',
          hoursWeekday: 'Monday – Saturday · 8:00 AM – 9:00 PM (IST)',
          hoursSunday: 'Sunday · By Prior Appointment',
        },
        sortOrder: 1,
      },
      {
        key: 'form_intro',
        title: 'Book Your Free Communication Assessment',
        subtitle:
          'Complete the form below, and our mentor will contact you to understand your learning goals and recommend the right course.',
        sortOrder: 2,
      },
      {
        key: 'why_contact',
        title: 'Why Contact YogiSpeaks?',
        subtitle: 'When you reach out to us, you can expect:',
        itemsJson: [
          'Personalized Guidance',
          'Free Initial Assessment',
          'Course Recommendation Based on Your Goals',
          'Flexible Class Timings',
          'One-to-One Live Coaching',
          'Transparent Information',
          'Friendly Support',
        ],
        sortOrder: 3,
      },
      {
        key: 'faqs',
        title: 'Frequently Asked Questions',
        itemsJson: [
          {
            title: 'Is the communication assessment free?',
            description:
              'Yes. We offer a complimentary assessment to understand your current level and learning objectives.',
          },
          {
            title: 'How are the classes conducted?',
            description: 'All sessions are live and delivered online in a one-to-one format.',
          },
          {
            title: 'Do you teach students outside India?',
            description:
              'Yes. We welcome learners from around the world and schedule classes according to different time zones whenever possible.',
          },
          {
            title: 'Can I choose my class timings?',
            description: 'Yes. We offer flexible scheduling based on availability.',
          },
          {
            title: 'How soon will someone contact me?',
            description: 'We aim to respond to all enquiries within one business day.',
          },
        ],
        sortOrder: 4,
      },
      {
        key: 'location',
        title: 'Serving Learners Worldwide',
        bodyHtml: p(
          'Our online coaching allows students and professionals from India and across the globe to learn from anywhere with a stable internet connection. Online Classes Available Worldwide.',
        ),
        sortOrder: 5,
      },
      {
        key: 'cta',
        title: 'Your Communication Goals Start Here',
        subtitle:
          'Whether you’re preparing for interviews, improving workplace communication, learning English, or getting ready for IELTS, YogiSpeaks is here to support your journey.',
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'Chat on WhatsApp',
          secondaryHref: 'https://wa.me/919873160236',
        },
        sortOrder: 6,
      },
      {
        key: 'conversion',
        title: 'Ready to Speak with Confidence?',
        subtitle:
          'Take the first step toward achieving your communication goals. Book your free communication assessment today and receive personalized guidance from YogiSpeaks.',
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'WhatsApp Us',
          secondaryHref: 'https://wa.me/919873160236',
        },
        sortOrder: 7,
      },
    ],
  });

  // ─── Site-wide FAQ page + FAQ records ─────────────────────────────────────
  await upsertPage(prisma, {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    metaTitle: 'Frequently Asked Questions | YogiSpeaks Online English & Communication Courses',
    metaDescription:
      'Find answers to common questions about YogiSpeaks’ online Spoken English, IELTS, Professional Communication, Personality Development, and Spoken Hindi courses, including class format, scheduling, assessments, and learning support.',
    blocks: [
      {
        key: 'hero',
        title: 'Frequently Asked Questions',
        subtitle: 'Everything You Need to Know Before You Join',
        bodyHtml: p(
          'Choosing the right learning program is an important decision. We’ve answered the most common questions about our courses, teaching methodology, schedules, and enrollment process to help you get started with confidence.',
        ),
        itemsJson: {
          primaryLabel: 'Book Free Communication Assessment',
          primaryHref: '/free-assessment',
          secondaryLabel: 'Contact Our Team',
          secondaryHref: '/contact',
        },
        sortOrder: 0,
      },
      {
        key: 'still_questions',
        title: 'Still Have Questions?',
        subtitle: 'If you couldn’t find the answer you’re looking for, our team is here to help.',
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'Contact Our Team',
          secondaryHref: '/contact',
        },
        sortOrder: 1,
      },
      {
        key: 'cta',
        title: 'Your Questions Answered. Your Journey Starts Here.',
        subtitle:
          'Whether you’re a beginner, a professional, or an international learner, YogiSpeaks is committed to helping you achieve your communication goals through personalized one-to-one coaching.',
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
          secondaryLabel: 'Talk to Our Mentor',
          secondaryHref: '/contact',
        },
        sortOrder: 2,
      },
    ],
  });

  const siteFaqs: Array<{ category: string; q: string; a: string }> = [
    { category: 'general', q: 'What is YogiSpeaks?', a: 'YogiSpeaks is an online learning platform that offers personalized one-to-one coaching in Spoken English, IELTS Preparation, Professional Communication, Personality Development, and Spoken Hindi. Our programs focus on practical communication, confidence building, and real-world application.' },
    { category: 'general', q: 'Who can join your courses?', a: 'Our courses are suitable for students, college graduates, working professionals, entrepreneurs, business owners, job seekers, homemakers, international learners, and anyone who wants to improve communication skills.' },
    { category: 'general', q: 'Are classes conducted online?', a: 'Yes. All classes are conducted live online, allowing learners from anywhere in the world to attend.' },
    { category: 'general', q: 'Are classes one-to-one or in batches?', a: 'Our primary focus is personalized one-to-one coaching, ensuring every learner receives individual attention, customized guidance, and continuous feedback.' },
    { category: 'courses', q: 'Which courses do you offer?', a: 'We currently offer Spoken English, IELTS Preparation, Professional Communication, Personality Development, and Spoken Hindi.' },
    { category: 'courses', q: 'Which course is right for me?', a: 'During your Free Communication Assessment, we evaluate your current level, learning objectives, and challenges before recommending the most suitable course.' },
    { category: 'courses', q: 'Is the Spoken English course suitable for beginners?', a: 'Yes. The course is designed for learners at beginner, intermediate, and advanced levels.' },
    { category: 'courses', q: 'Do you teach Business English?', a: 'Yes. Business English is included in our Professional Communication program.' },
    { category: 'courses', q: 'Do you prepare students for IELTS?', a: 'Yes. We provide coaching for both IELTS Academic and IELTS General Training.' },
    { category: 'courses', q: 'Do you teach Spoken Hindi to foreigners?', a: 'Yes. Our Spoken Hindi program is specially designed for international learners, NRIs, expatriates, travelers, and professionals.' },
    { category: 'learning', q: 'How long is each class?', a: 'Class duration depends on the learning plan selected during enrollment. Your mentor will discuss the recommended schedule during the assessment.' },
    { category: 'learning', q: 'Will I receive study material?', a: 'Yes. We provide digital learning resources, notes, assignments, vocabulary exercises, and practice activities relevant to your course.' },
    { category: 'learning', q: 'Will I get speaking practice?', a: 'Yes. Every class includes practical speaking activities to help you build confidence and fluency.' },
    { category: 'learning', q: 'Do you give homework?', a: 'Yes. Practice exercises and assignments are provided to reinforce learning between sessions.' },
    { category: 'learning', q: 'How do you track progress?', a: 'We monitor your progress through regular feedback, practical assessments, and personalized guidance to help you improve consistently.' },
    { category: 'scheduling', q: 'Can I choose my class timings?', a: 'Yes. Flexible scheduling is available based on mentor availability and your preferred time.' },
    { category: 'scheduling', q: 'Can working professionals join?', a: 'Absolutely. Many of our learners are working professionals, and we offer flexible schedules to accommodate busy routines.' },
    { category: 'scheduling', q: 'Do you teach students outside India?', a: 'Yes. We conduct classes for learners from different countries and try to accommodate various time zones.' },
    { category: 'scheduling', q: 'How do I enroll?', a: 'Book your Free Communication Assessment, discuss your goals with our mentor, receive a personalized learning recommendation, complete enrollment, and begin your classes.' },
    { category: 'scheduling', q: 'What happens during the Free Communication Assessment?', a: 'The assessment helps us understand your current communication level, learning goals, strengths, areas for improvement, and recommended learning plan.' },
    { category: 'technical', q: 'What do I need to attend online classes?', a: 'You’ll need a stable internet connection; a laptop, desktop, tablet, or smartphone; a microphone and speakers/headphones; and a quiet learning environment.' },
    { category: 'technical', q: 'Which platform do you use for classes?', a: 'We use reliable online meeting platforms that provide a smooth and interactive learning experience. Platform details are shared after enrollment.' },
    { category: 'technical', q: 'Will class recordings be available?', a: 'Recording availability depends on the course structure and learning plan. Please discuss this during your assessment.' },
    { category: 'support', q: 'Can I ask questions during class?', a: 'Absolutely. Every session encourages interaction, questions, and practical discussions.' },
    { category: 'support', q: 'Will I receive feedback?', a: 'Yes. Personalized feedback is provided regularly to help you improve your communication skills.' },
    { category: 'support', q: 'How can I contact YogiSpeaks?', a: 'You can reach us through the Contact Form, WhatsApp, Phone, or Email. Our team will be happy to assist you.' },
  ];

  // Soft-delete prior site FAQs (no courseId) then recreate
  await prisma.faq.updateMany({
    where: { courseId: null, deletedAt: null, category: { in: ['general', 'courses', 'learning', 'scheduling', 'technical', 'support'] } },
    data: { deletedAt: new Date() },
  });
  await prisma.faq.createMany({
    data: siteFaqs.map((f, i) => ({
      question: f.q,
      answerHtml: p(f.a),
      category: f.category,
      courseId: null,
      showOnHomepage: i < 5,
      isVisible: true,
      sortOrder: i,
    })),
  });

  // ─── Legal pages ──────────────────────────────────────────────────────────
  const privacyHtml = [
    h2('1. Information We Collect'),
    p('We may collect personal information (name, email, mobile, country, preferred course, communication preferences), learning information (assessment details, goals, progress, assignments, feedback), and technical information (IP address, browser, device, OS, pages visited, date/time, referral source).'),
    h2('2. How We Use Your Information'),
    p('Your information may be used to provide coaching services, schedule classes, respond to enquiries, personalize learning, improve courses, send updates, share learning resources, process payments, maintain records, improve website performance, and comply with legal obligations.'),
    h2('3. Cookies'),
    p('Our website may use cookies and similar technologies to improve performance, remember preferences, analyze visitor behavior, and enhance experience. You can manage cookies in your browser settings.'),
    h2('4. Information Sharing'),
    p('We do not sell, rent, or trade your personal information. Information may be shared only with trusted service providers, payment partners, hosting providers, and legal authorities when required by law.'),
    h2('5. Data Security'),
    p('We implement reasonable administrative, technical, and organizational measures to help protect your personal information. No method of internet transmission is completely secure.'),
    h2('6. Online Classes'),
    p('Attendance and learning progress may be monitored. If recordings are made, they are used for educational or internal purposes unless additional permission is obtained where required.'),
    h2('7. Communication'),
    p('You may receive class schedules, materials, course updates, announcements, payment reminders, and service notifications. You may opt out of promotional communications; essential service messages may still be sent.'),
    h2('8. Third-Party Services'),
    p('Our website may include links or integrations with third-party services. Their privacy practices are governed by their own policies.'),
    h2('9. Children’s Privacy'),
    p('Our services are intended for learners who can enter into a binding agreement, or minors with parent/guardian consent where required.'),
    h2('10. Your Rights'),
    p('Depending on applicable law, you may request access, correction, or deletion of your personal information by contacting us.'),
    h2('11. Changes to This Policy'),
    p('We may update this Privacy Policy from time to time. Continued use of our website or services after updates constitutes acceptance of the revised policy.'),
    h2('12. Contact Us'),
    p('For privacy-related questions, contact YogiSpeaks at hello@yogispeaks.com or via our Contact page.'),
  ].join('');

  await upsertPage(prisma, {
    title: 'Privacy Policy',
    slug: 'privacy',
    metaTitle: 'Privacy Policy | YogiSpeaks',
    metaDescription:
      'Read the Privacy Policy of YogiSpeaks to understand how we collect, use, store, and protect your personal information when you use our website and online learning services.',
    bodyHtml: privacyHtml,
    blocks: [
      {
        key: 'hero',
        title: 'Privacy Policy',
        subtitle: 'Effective Date: July 24, 2026',
        bodyHtml: p(
          'Welcome to YogiSpeaks. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website or use our online coaching services.',
        ),
        sortOrder: 0,
      },
    ],
  });

  const termsHtml = [
    h2('1. About YogiSpeaks'),
    p('YogiSpeaks provides online educational and training services including Spoken English, IELTS Preparation, Professional Communication, Personality Development, Spoken Hindi, and other communication programs.'),
    h2('2. Eligibility'),
    p('By using our services, you confirm that the information you provide is accurate, you are legally capable of entering into a binding agreement (or have guardian consent if required), and you will use our services only for lawful purposes.'),
    h2('3. Enrollment'),
    p('Enrollment is confirmed only after registration (if applicable), successful payment, and confirmation from YogiSpeaks. We reserve the right to accept or decline enrollment at our discretion.'),
    h2('4. Fees & Payments'),
    p('Course fees are communicated before enrollment. Payments must be made through approved methods. Access to classes may begin only after payment confirmation.'),
    h2('5. Class Scheduling'),
    p('We strive to offer flexible scheduling based on mentor and learner availability. Learners are responsible for attending at the agreed time. Reasonable advance notice should be provided for schedule changes.'),
    h2('6. Learner Responsibilities'),
    p('Learners agree to participate respectfully, complete assigned practice where applicable, and not share course materials without permission.'),
    h2('7. Intellectual Property'),
    p('All course materials, website content, and branding remain the intellectual property of YogiSpeaks unless otherwise stated.'),
    h2('8. Conduct'),
    p('Abusive, harassing, or unlawful behavior may result in suspension or termination of services without refund where permitted by policy.'),
    h2('9. Limitation of Liability'),
    p('YogiSpeaks provides educational coaching and does not guarantee specific exam scores, job outcomes, or immigration results.'),
    h2('10. Changes to Terms'),
    p('We may update these Terms from time to time. Continued use of the website or services constitutes acceptance of the updated Terms.'),
    h2('11. Governing Law'),
    p('These Terms are governed by the laws of India, without regard to conflict of law principles.'),
    h2('12. Contact'),
    p('Questions about these Terms may be sent to hello@yogispeaks.com or through our Contact page.'),
  ].join('');

  await upsertPage(prisma, {
    title: 'Terms & Conditions',
    slug: 'terms',
    metaTitle: 'Terms & Conditions | YogiSpeaks',
    metaDescription:
      'Read the Terms & Conditions governing the use of the YogiSpeaks website and online coaching services, including enrollment, payments, user responsibilities, intellectual property, and service policies.',
    bodyHtml: termsHtml,
    blocks: [
      {
        key: 'hero',
        title: 'Terms & Conditions',
        subtitle: 'Effective Date: July 24, 2026',
        bodyHtml: p(
          'These Terms & Conditions govern your access to and use of our website, online courses, and related services. By accessing our website or enrolling in our programs, you agree to be bound by these Terms.',
        ),
        sortOrder: 0,
      },
    ],
  });

  const refundHtml = [
    h2('1. Course Enrollment'),
    p('Enrollment is confirmed only after successful payment, payment verification, and confirmation of your class schedule.'),
    h2('2. Free Communication Assessment'),
    p('We offer a Free Communication Assessment to help learners understand their current level and choose the most suitable course before making any payment.'),
    h2('3. Refund Policy'),
    h3('Before Course Commencement'),
    p('If you request a cancellation before your first paid class begins, your refund request will be reviewed based on the circumstances and any administrative or payment processing charges that may apply. Approved refunds will be processed through the original payment method within a reasonable period.'),
    h3('After Course Commencement'),
    p('Once the first paid class has been conducted, course fees are generally non-refundable, as personalized planning, scheduling, and learning resources are allocated specifically for each learner.'),
    h3('Exceptional Circumstances'),
    p('In rare situations, YogiSpeaks may review refund requests at its sole discretion.'),
    h2('4. Cancellation by the Learner'),
    p('If you are unable to continue, inform us as early as possible. Cancellation of future classes does not automatically entitle the learner to a refund unless approved under this policy.'),
    h2('5. Class Rescheduling'),
    p('Learners may request to reschedule a class with reasonable advance notice, subject to mentor availability. Frequent rescheduling may not always be accommodated.'),
    h2('6. Missed Classes'),
    p('If a learner misses a scheduled class without prior notice, the class may be treated as completed and a replacement is not guaranteed. With reasonable advance notice, we will try to offer an alternative session subject to availability.'),
    h2('7. Cancellation by YogiSpeaks'),
    p('If YogiSpeaks cancels or postpones a class due to mentor unavailability or unforeseen circumstances, we will offer a makeup session or an appropriate alternative arrangement.'),
    h2('8. How to Request a Refund or Cancellation'),
    p('Submit requests in writing via email to hello@yogispeaks.com or through the Contact page with your full name, registered email, course details, and reason for the request.'),
    h2('9. Policy Updates'),
    p('We may update this policy from time to time. The version published on this website applies at the time of enrollment unless otherwise agreed in writing.'),
    h2('10. Contact'),
    p('For refund or cancellation questions, contact YogiSpeaks at hello@yogispeaks.com.'),
  ].join('');

  await upsertPage(prisma, {
    title: 'Refund & Cancellation Policy',
    slug: 'refund-policy',
    metaTitle: 'Refund & Cancellation Policy | YogiSpeaks',
    metaDescription:
      'Read the Refund & Cancellation Policy for YogiSpeaks to understand our policies regarding course enrollment, payments, cancellations, rescheduling, and refunds.',
    bodyHtml: refundHtml,
    blocks: [
      {
        key: 'hero',
        title: 'Refund & Cancellation Policy',
        subtitle: 'Effective Date: July 24, 2026',
        bodyHtml: p(
          'At YogiSpeaks, we are committed to providing a high-quality learning experience through personalized one-to-one online coaching. Please read this policy carefully before enrolling.',
        ),
        sortOrder: 0,
      },
    ],
  });
}
