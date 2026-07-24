/**
 * Seeds About Us page + Spoken English course from marketing page briefs.
 * Idempotent via slug upserts.
 */
import { PrismaClient, PublishStatus } from '@prisma/client';

const p = (text: string) => `<p>${text}</p>`;
const ul = (items: string[]) =>
  `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export async function seedMarketingContent(prisma: PrismaClient): Promise<void> {
  // ─── About Us ─────────────────────────────────────────────────────────────
  const about = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {
      title: 'About Us',
      status: PublishStatus.PUBLISHED,
      metaTitle: 'About YogiSpeaks | Online Spoken English & Communication Skills Academy',
      metaDescription:
        'Learn about YogiSpeaks, a premium online communication academy offering Spoken English, IELTS, Professional Communication, Personality Development, and Spoken Hindi coaching through personalized one-to-one classes.',
      bodyHtml: p(
        'At YogiSpeaks, we believe that effective communication is one of the most valuable life skills.',
      ),
    },
    create: {
      title: 'About Us',
      slug: 'about',
      status: PublishStatus.PUBLISHED,
      metaTitle: 'About YogiSpeaks | Online Spoken English & Communication Skills Academy',
      metaDescription:
        'Learn about YogiSpeaks, a premium online communication academy offering Spoken English, IELTS, Professional Communication, Personality Development, and Spoken Hindi coaching through personalized one-to-one classes.',
      bodyHtml: p(
        'At YogiSpeaks, we believe that effective communication is one of the most valuable life skills.',
      ),
    },
  });

  await prisma.pageBlock.deleteMany({ where: { pageId: about.id } });
  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: about.id,
        key: 'hero',
        title: 'About YogiSpeaks',
        subtitle: 'Empowering Confident Communicators for a Better Future',
        bodyHtml: `${p(
          'At YogiSpeaks, we believe that effective communication is one of the most valuable life skills. Whether you’re a student preparing for higher education, a professional aiming for career growth, an entrepreneur building a business, or someone who simply wants to speak English confidently, we are here to help you succeed.',
        )}${p(
          'Our personalized coaching approach focuses on practical communication rather than rote learning. Every learner receives individual attention, customized lessons, and continuous guidance to achieve measurable improvement.',
        )}`,
        sortOrder: 0,
      },
      {
        pageId: about.id,
        key: 'story',
        title: 'Our Story',
        bodyHtml: `${p(
          'YogiSpeaks was founded with a simple vision—to make quality communication training accessible, practical, and result-oriented.',
        )}${p(
          'Over the years, we have helped thousands of learners from different backgrounds improve their spoken English, build confidence, prepare for interviews, achieve IELTS goals, and communicate effectively in professional and personal environments.',
        )}${p(
          'Instead of relying only on textbooks, our teaching methodology emphasizes real-life conversations, interactive practice, and continuous feedback to ensure learners gain confidence in every situation.',
        )}`,
        sortOrder: 1,
      },
      {
        pageId: about.id,
        key: 'mission',
        title: 'Our Mission',
        bodyHtml: p(
          'To empower learners with practical communication skills that help them succeed academically, professionally, and personally.',
        ),
        sortOrder: 2,
      },
      {
        pageId: about.id,
        key: 'vision',
        title: 'Our Vision',
        bodyHtml: p(
          'To become one of India’s most trusted online communication academies, helping learners across the world develop confidence, fluency, and leadership through effective communication.',
        ),
        sortOrder: 3,
      },
      {
        pageId: about.id,
        key: 'values',
        title: 'Our Core Values',
        itemsJson: [
          {
            title: 'Student-Centric Learning',
            description:
              'Every learner is unique. We personalize every learning journey based on individual goals and current proficiency.',
          },
          {
            title: 'Practical Learning',
            description:
              'We focus on communication that learners can apply immediately in interviews, meetings, presentations, workplaces, and daily conversations.',
          },
          {
            title: 'Continuous Improvement',
            description:
              'Regular assessments, feedback, and progress tracking ensure steady development throughout the learning journey.',
          },
          {
            title: 'Integrity',
            description:
              'We maintain transparency, professionalism, and commitment in every interaction with our learners.',
          },
          {
            title: 'Excellence',
            description:
              'We continuously improve our teaching methods to provide high-quality learning experiences.',
          },
        ],
        sortOrder: 4,
      },
      {
        pageId: about.id,
        key: 'why_choose',
        title: 'Why Thousands Choose YogiSpeaks',
        itemsJson: [
          {
            title: 'Personalized One-to-One Coaching',
            description: 'Individual attention for faster improvement.',
          },
          {
            title: 'Flexible Timings',
            description: 'Learn at your convenience with schedules that suit your routine.',
          },
          {
            title: 'Practical Communication',
            description: 'Real-life speaking practice instead of memorizing grammar rules.',
          },
          {
            title: 'Experienced Mentor',
            description:
              'Learn from an experienced trainer with more than 15 years of teaching experience.',
          },
          {
            title: 'Structured Learning Path',
            description: 'Clear roadmap from beginner to confident communicator.',
          },
          {
            title: 'Continuous Support',
            description:
              'Learning doesn’t stop after class. Receive assignments, study material, speaking exercises, and continuous guidance.',
          },
        ],
        sortOrder: 5,
      },
      {
        pageId: about.id,
        key: 'methodology',
        title: 'Our Teaching Methodology',
        subtitle: 'We follow a five-step learning framework:',
        itemsJson: [
          {
            title: 'Communication Assessment',
            description:
              'We evaluate your current communication skills and understand your goals.',
          },
          {
            title: 'Personalized Learning Plan',
            description: 'A customized roadmap is designed specifically for you.',
          },
          {
            title: 'Interactive Learning',
            description:
              'Live one-to-one classes with practical speaking activities, discussions, role plays, and exercises.',
          },
          {
            title: 'Performance Tracking',
            description:
              'Regular reviews, assignments, and constructive feedback help monitor your improvement.',
          },
          {
            title: 'Goal Achievement',
            description:
              'Speak confidently in interviews, meetings, presentations, academic settings, and everyday conversations.',
          },
        ],
        sortOrder: 6,
      },
      {
        pageId: about.id,
        key: 'who_can_join',
        title: 'Who Can Join?',
        subtitle: 'Our programs are designed for:',
        itemsJson: [
          'Students',
          'Working Professionals',
          'Business Owners',
          'Entrepreneurs',
          'Job Seekers',
          'Homemakers',
          'College Students',
          'Government Exam Aspirants',
          'Corporate Employees',
          'International Learners',
        ],
        sortOrder: 7,
      },
      {
        pageId: about.id,
        key: 'differentiators',
        title: 'What Makes Us Different?',
        itemsJson: [
          'One-to-One Live Online Coaching',
          'Customized Learning Plans',
          'Practical Speaking Sessions',
          'Personalized Feedback',
          'Flexible Scheduling',
          'IELTS Preparation',
          'Professional Communication Training',
          'Personality Development',
          'Spoken Hindi for Non-Native Speakers',
          'Continuous Learning Support',
        ],
        sortOrder: 8,
      },
      {
        pageId: about.id,
        key: 'commitment',
        title: 'Our Commitment',
        bodyHtml: `${p(
          'We don’t just teach English—we help learners communicate with confidence.',
        )}${p(
          'Our goal is to ensure that every student becomes a confident speaker who can express ideas clearly, participate actively in conversations, perform well in interviews, and communicate effectively in professional and social environments.',
        )}`,
        sortOrder: 9,
      },
      {
        pageId: about.id,
        key: 'cta',
        title: 'Ready to Begin?',
        subtitle: 'Start Your Communication Journey Today',
        bodyHtml: p(
          'Book your Free Communication Assessment and discover a personalized learning plan designed to help you achieve your communication goals.',
        ),
        itemsJson: {
          buttonLabel: 'Book Free Communication Assessment',
          buttonHref: '/free-assessment',
        },
        sortOrder: 10,
      },
    ],
  });

  // ─── Spoken English Course ────────────────────────────────────────────────
  const courseData = {
    name: 'Online Spoken English Course',
    slug: 'spoken-english',
    shortDescription:
      'Speak English Fluently. Communicate with Confidence.',
    heroHeadline: 'Speak English Fluently. Communicate with Confidence.',
    longDescriptionHtml: p(
      'Whether you’re a student, working professional, entrepreneur, homemaker, or job seeker, our personalized online Spoken English course helps you develop confidence and communicate naturally in real-life situations.',
    ),
    whyLearnHtml: `${p(
      'English is more than a language—it’s a gateway to better career opportunities, higher education, international communication, and personal growth.',
    )}${p(
      'Our course focuses on helping you think, speak, and communicate confidently, rather than simply memorizing grammar rules.',
    )}`,
    whoShouldJoinHtml: ul([
      'Students',
      'College Graduates',
      'Working Professionals',
      'Job Seekers',
      'Entrepreneurs',
      'Homemakers',
      'Business Owners',
      'Government Exam Aspirants',
      'Anyone who wants to improve spoken English',
    ]),
    whyChooseHtml: `${p(
      'Unlike traditional English courses, we focus on practical communication, personalized coaching, and real-life application.',
    )}${p(
      'Our learners receive individual attention, structured guidance, and continuous feedback that helps them improve faster and build lasting confidence.',
    )}`,
    duration: 'Personalized',
    mode: 'One-to-One Live Online',
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    sortOrder: 0,
    ctaLabel: 'Book Free Communication Assessment',
    ctaHref: '/free-assessment',
    secondaryCtaLabel: 'View Course Curriculum',
    secondaryCtaHref: '#curriculum',
    metaTitle:
      'Online Spoken English Classes | Learn English with Confidence | YogiSpeaks',
    metaDescription:
      'Improve your fluency, grammar, vocabulary, pronunciation, and confidence with YogiSpeaks’ personalized one-to-one online Spoken English classes. Learn from experienced trainers with practical speaking sessions.',
  };

  const existing = await prisma.course.findUnique({ where: { slug: 'spoken-english' } });
  const course = existing
    ? await prisma.course.update({ where: { id: existing.id }, data: courseData })
    : await prisma.course.create({ data: courseData });

  await prisma.courseCurriculumItem.deleteMany({ where: { courseId: course.id } });
  await prisma.courseCurriculumItem.createMany({
    data: [
      {
        courseId: course.id,
        title: 'Module 1 – English Grammar Made Simple',
        bodyHtml: `${p(
          'Build a strong foundation by understanding grammar through practical usage instead of memorization.',
        )}<p><strong>Topics include:</strong></p>${ul([
          'Parts of Speech',
          'Tenses',
          'Articles',
          'Prepositions',
          'Modal Verbs',
          'Active & Passive Voice',
          'Reported Speech',
          'Sentence Structure',
        ])}`,
        sortOrder: 0,
      },
      {
        courseId: course.id,
        title: 'Module 2 – Daily Conversation Practice',
        bodyHtml: `${p(
          'Learn to communicate naturally in everyday situations such as:',
        )}${ul([
          'Introducing Yourself',
          'Talking to Friends',
          'Family Conversations',
          'Shopping',
          'Travel',
          'Telephone Conversations',
          'Office Communication',
        ])}`,
        sortOrder: 1,
      },
      {
        courseId: course.id,
        title: 'Module 3 – Vocabulary Building',
        bodyHtml: `${p('Expand your vocabulary with:')}${ul([
          'Daily-use words',
          'Phrasal Verbs',
          'Idioms',
          'Synonyms',
          'Collocations',
          'Business Vocabulary',
        ])}`,
        sortOrder: 2,
      },
      {
        courseId: course.id,
        title: 'Module 4 – Pronunciation & Fluency',
        bodyHtml: `${p('Improve:')}${ul([
          'Pronunciation',
          'Intonation',
          'Stress',
          'Rhythm',
          'Natural Speaking Speed',
        ])}`,
        sortOrder: 3,
      },
      {
        courseId: course.id,
        title: 'Module 5 – Confidence Building',
        bodyHtml: `${p('Develop confidence through:')}${ul([
          'Role Plays',
          'Group Discussions (if applicable)',
          'Public Speaking Practice',
          'Storytelling',
          'Extempore Speaking',
          'Mock Interviews',
        ])}`,
        sortOrder: 4,
      },
      {
        courseId: course.id,
        title: 'Module 6 – Professional Communication',
        bodyHtml: `${p('Learn:')}${ul([
          'Email Writing',
          'Workplace Communication',
          'Business English',
          'Meeting Conversations',
          'Presentation Skills',
          'Client Communication',
        ])}`,
        sortOrder: 5,
      },
    ],
  });

  await prisma.courseFeature.deleteMany({ where: { courseId: course.id } });
  await prisma.courseFeature.createMany({
    data: [
      'One-to-One Live Online Classes',
      'Personalized Learning Plan',
      'Practical Speaking Practice',
      'Daily Speaking Activities',
      'Grammar Through Conversation',
      'Vocabulary Development',
      'Interview Preparation',
      'Flexible Class Timings',
      'Digital Study Material',
      'Continuous Feedback',
      'Progress Tracking',
      'Lifetime Learning Resources (if applicable)',
    ].map((title, i) => ({ courseId: course.id, title, sortOrder: i })),
  });

  await prisma.courseBenefit.deleteMany({ where: { courseId: course.id } });
  await prisma.courseBenefit.createMany({
    data: [
      'Speak English confidently.',
      'Express ideas clearly.',
      'Participate in meetings confidently.',
      'Perform better in interviews.',
      'Improve workplace communication.',
      'Enhance presentation skills.',
      'Build a professional personality.',
      'Communicate naturally in daily life.',
    ].map((label, i) => ({ courseId: course.id, label, sortOrder: i })),
  });

  await prisma.courseLearningStep.deleteMany({ where: { courseId: course.id } });
  await prisma.courseLearningStep.createMany({
    data: [
      'Communication Assessment',
      'Personalized Learning Plan',
      'Live Interactive Classes',
      'Speaking Practice & Assignments',
      'Weekly Feedback & Improvement',
      'Confident Communication',
    ].map((title, i) => ({
      courseId: course.id,
      stepNumber: i + 1,
      title,
      sortOrder: i,
    })),
  });

  // Soft-delete prior course FAQs then recreate
  await prisma.faq.updateMany({
    where: { courseId: course.id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  const courseFaqs = [
    {
      q: 'How long is the course?',
      a: 'The duration depends on your current level and learning goals. During your Free Communication Assessment, we’ll recommend a personalized learning plan.',
    },
    {
      q: 'Are classes conducted online?',
      a: 'Yes. All classes are live and conducted online in a one-to-one format.',
    },
    {
      q: 'Is this course suitable for beginners?',
      a: 'Absolutely. We teach learners from beginner to advanced levels.',
    },
    {
      q: 'Will I get speaking practice in every class?',
      a: 'Yes. Practical speaking activities are an essential part of every session.',
    },
    {
      q: 'Do you provide study material?',
      a: 'Yes. You’ll receive digital notes, assignments, vocabulary resources, and practice exercises.',
    },
    {
      q: 'Can working professionals join?',
      a: 'Yes. We offer flexible scheduling to accommodate professionals and business owners.',
    },
  ];
  await prisma.faq.createMany({
    data: courseFaqs.map((f, i) => ({
      courseId: course.id,
      question: f.q,
      answerHtml: p(f.a),
      category: 'spoken-english',
      showOnHomepage: false,
      isVisible: true,
      sortOrder: i,
    })),
  });

  // Course-specific testimonials (idempotent by review text prefix)
  const courseTestimonials = [
    {
      studentName: 'Learner',
      designation: 'Software Engineer',
      review:
        'The classes helped me overcome my hesitation and speak confidently during job interviews.',
    },
    {
      studentName: 'Learner',
      designation: 'College Student',
      review: 'I finally started speaking English without fear after joining YogiSpeaks.',
    },
    {
      studentName: 'Learner',
      designation: 'Working Professional',
      review:
        'The personalized feedback and practical speaking sessions made a huge difference.',
    },
  ];
  for (const [i, t] of courseTestimonials.entries()) {
    const found = await prisma.testimonial.findFirst({
      where: { review: t.review, deletedAt: null },
    });
    if (found) {
      await prisma.testimonial.update({
        where: { id: found.id },
        data: {
          courseLabel: 'Spoken English',
          rating: 5,
          isVisible: true,
          sortOrder: i,
        },
      });
    } else {
      await prisma.testimonial.create({
        data: {
          studentName: t.studentName,
          designation: t.designation,
          courseLabel: 'Spoken English',
          review: t.review,
          rating: 5,
          isVisible: true,
          sortOrder: i,
        },
      });
    }
  }
}
