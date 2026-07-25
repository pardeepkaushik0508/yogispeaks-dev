/**
 * Seeds About Us page + Spoken English + IELTS courses from marketing page briefs.
 * Idempotent via slug upserts.
 */
import { PrismaClient, PublishStatus } from '@prisma/client';

const p = (text: string) => `<p>${text}</p>`;
const ul = (items: string[]) =>
  `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

async function upsertCourseFaqs(
  prisma: PrismaClient,
  courseId: string,
  category: string,
  faqs: Array<{ q: string; a: string }>,
) {
  await prisma.faq.updateMany({
    where: { courseId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  await prisma.faq.createMany({
    data: faqs.map((f, i) => ({
      courseId,
      question: f.q,
      answerHtml: p(f.a),
      category,
      showOnHomepage: false,
      isVisible: true,
      sortOrder: i,
    })),
  });
}

async function upsertCourseTestimonials(
  prisma: PrismaClient,
  courseLabel: string,
  items: Array<{ studentName: string; designation: string; review: string }>,
) {
  for (const [i, t] of items.entries()) {
    const found = await prisma.testimonial.findFirst({
      where: { review: t.review, deletedAt: null },
    });
    if (found) {
      await prisma.testimonial.update({
        where: { id: found.id },
        data: {
          courseLabel,
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
          courseLabel,
          review: t.review,
          rating: 5,
          isVisible: true,
          sortOrder: i,
        },
      });
    }
  }
}

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
    whyLearnTitle: 'Why Learn Spoken English?',
    whoShouldJoinTitle: 'Who Should Join This Course?',
    whoShouldJoinIntro: 'This course is ideal for:',
    curriculumTitle: 'What You Will Learn',
    featuresTitle: 'Course Features',
    benefitsTitle: 'Course Benefits',
    benefitsIntro: 'After completing the course, you’ll be able to:',
    learningStepsTitle: 'Our Teaching Method',
    whyChooseTitle: 'Why Choose YogiSpeaks?',
    testimonialsTitle: 'Student Success Stories',
    faqsTitle: 'Frequently Asked Questions',
    finalCtaHeadline: 'Start Speaking English with Confidence',
    finalCtaBody:
      'Take the first step toward better communication and greater opportunities.',
    finalSecondaryCtaLabel: 'Talk to an Expert',
    stickyCtaLabel: 'Book Free Communication Assessment',
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
  await upsertCourseFaqs(prisma, course.id, 'spoken-english', [
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
  ]);

  await upsertCourseTestimonials(prisma, 'Spoken English', [
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
  ]);

  // ─── IELTS Preparation Course (PAGE 4) ────────────────────────────────────
  const ieltsData = {
    name: 'IELTS Preparation Course',
    slug: 'ielts-preparation',
    shortDescription:
      'Achieve Your Target IELTS Band Score with Expert Guidance',
    heroHeadline: 'Achieve Your Target IELTS Band Score with Expert Guidance',
    longDescriptionHtml: p(
      'Whether you’re planning to study abroad, migrate, or work internationally, our personalized IELTS coaching helps you build the skills and confidence needed to achieve your desired band score.',
    ),
    whyLearnHtml: p(
      'The IELTS exam evaluates your ability to communicate effectively in English. Our structured training focuses on improving all four modules while helping you understand the exam format, avoid common mistakes, and perform confidently on test day.',
    ),
    whoShouldJoinHtml: ul([
      'Students planning to study abroad',
      'Professionals applying for overseas jobs',
      'Immigration applicants',
      'Nurses and healthcare professionals',
      'Anyone preparing for IELTS Academic or General Training',
    ]),
    whyChooseHtml: `${p(
      'Unlike large batch coaching centers, we provide:',
    )}${ul([
      'Individual attention',
      'Personalized feedback',
      'Flexible scheduling',
      'Regular speaking practice',
      'Detailed writing corrections',
      'Customized improvement strategies',
      'Continuous mentor support',
    ])}`,
    duration: 'Personalized',
    mode: 'One-to-One Live Online',
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    sortOrder: 1,
    ctaLabel: 'Book Free IELTS Assessment',
    ctaHref: '/free-assessment',
    secondaryCtaLabel: 'Download Course Brochure',
    secondaryCtaHref: null as string | null,
    whyLearnTitle: 'Why Choose Our IELTS Coaching?',
    whoShouldJoinTitle: 'Who Should Join?',
    whoShouldJoinIntro: 'This course is ideal for:',
    curriculumTitle: 'What You’ll Learn',
    featuresTitle: 'Course Features',
    benefitsTitle: 'Expected Learning Outcomes',
    benefitsIntro: 'By the end of the course, you’ll be able to:',
    learningStepsTitle: 'Our Teaching Methodology',
    whyChooseTitle: 'What Makes YogiSpeaks Different?',
    testimonialsTitle: 'Student Success Stories',
    faqsTitle: 'Frequently Asked Questions',
    finalCtaHeadline: 'Take the Next Step Towards Your International Goals',
    finalCtaBody:
      'Achieve your target IELTS band score with personalized coaching, practical strategies, and expert guidance.',
    finalSecondaryCtaLabel: 'Talk to an IELTS Expert',
    stickyCtaLabel: 'Book Free IELTS Assessment',
    metaTitle: 'Online IELTS Coaching | IELTS Preparation Classes | YogiSpeaks',
    metaDescription:
      'Prepare for IELTS Academic and General Training with personalized one-to-one online coaching. Improve your Listening, Reading, Writing, and Speaking skills with expert guidance at YogiSpeaks.',
  };

  const ieltsExisting = await prisma.course.findUnique({
    where: { slug: 'ielts-preparation' },
  });
  const ielts = ieltsExisting
    ? await prisma.course.update({ where: { id: ieltsExisting.id }, data: ieltsData })
    : await prisma.course.create({ data: ieltsData });

  await prisma.courseCurriculumItem.deleteMany({ where: { courseId: ielts.id } });
  await prisma.courseCurriculumItem.createMany({
    data: [
      {
        courseId: ielts.id,
        title: 'Module 1 – Listening',
        iconKey: 'listening',
        bodyHtml: `${p('Develop your ability to:')}${ul([
          'Understand different English accents',
          'Identify key information',
          'Improve note-taking skills',
          'Answer various question types',
          'Manage time effectively',
        ])}`,
        sortOrder: 0,
      },
      {
        courseId: ielts.id,
        title: 'Module 2 – Reading',
        iconKey: 'reading',
        bodyHtml: `${p('Master:')}${ul([
          'Skimming',
          'Scanning',
          'Keyword identification',
          'True/False/Not Given questions',
          'Matching headings',
          'Sentence completion',
          'Time management',
        ])}`,
        sortOrder: 1,
      },
      {
        courseId: ielts.id,
        title: 'Module 3 – Writing',
        iconKey: 'writing',
        bodyHtml: `${p('<strong>Task 1</strong> — Learn to write:')}${ul([
          'Graph Reports',
          'Charts',
          'Tables',
          'Maps',
          'Process Diagrams',
        ])}${p('<strong>Task 2</strong> — Improve:')}${ul([
          'Essay Structure',
          'Argument Development',
          'Grammar Accuracy',
          'Vocabulary',
          'Cohesion & Coherence',
        ])}`,
        sortOrder: 2,
      },
      {
        courseId: ielts.id,
        title: 'Module 4 – Speaking',
        iconKey: 'speaking',
        bodyHtml: `${p('Practice:')}${ul([
          'Personal Introduction',
          'Cue Card Speaking',
          'Discussion Questions',
          'Fluency',
          'Pronunciation',
          'Confidence Building',
        ])}`,
        sortOrder: 3,
      },
    ],
  });

  await prisma.courseFeature.deleteMany({ where: { courseId: ielts.id } });
  await prisma.courseFeature.createMany({
    data: [
      'One-to-One Live Online Coaching',
      'Personalized Study Plan',
      'IELTS Academic & General Training',
      'Speaking Mock Tests',
      'Writing Evaluation with Detailed Feedback',
      'Vocabulary Enhancement',
      'Grammar Improvement',
      'Weekly Performance Assessment',
      'Flexible Class Timings',
      'Digital Study Material',
      'Exam Strategies & Time Management',
    ].map((title, i) => ({ courseId: ielts.id, title, sortOrder: i })),
  });

  await prisma.courseBenefit.deleteMany({ where: { courseId: ielts.id } });
  await prisma.courseBenefit.createMany({
    data: [
      'Understand the IELTS exam format confidently',
      'Improve your Listening, Reading, Writing, and Speaking skills',
      'Build a stronger English vocabulary',
      'Manage time effectively during the exam',
      'Approach every section with confidence',
      'Increase your chances of achieving your target band score',
    ].map((label, i) => ({ courseId: ielts.id, label, sortOrder: i })),
  });

  await prisma.courseLearningStep.deleteMany({ where: { courseId: ielts.id } });
  await prisma.courseLearningStep.createMany({
    data: [
      'Free IELTS Assessment',
      'Identify Strengths & Improvement Areas',
      'Personalized Study Plan',
      'Live Interactive Coaching',
      'Regular Mock Tests & Feedback',
      'Final Exam Preparation',
    ].map((title, i) => ({
      courseId: ielts.id,
      stepNumber: i + 1,
      title,
      sortOrder: i,
    })),
  });

  await upsertCourseFaqs(prisma, ielts.id, 'ielts-preparation', [
    {
      q: 'Which IELTS module do you teach?',
      a: 'We provide coaching for both IELTS Academic and IELTS General Training.',
    },
    {
      q: 'Are classes conducted online?',
      a: 'Yes. All sessions are live and conducted online in a one-to-one format.',
    },
    {
      q: 'Will I get speaking practice?',
      a: 'Yes. Every learner receives regular speaking practice and mock interview sessions.',
    },
    {
      q: 'Do you evaluate Writing tasks?',
      a: 'Yes. We provide detailed corrections, feedback, and suggestions for improvement.',
    },
    {
      q: 'Is study material included?',
      a: 'Yes. Digital study material, practice exercises, vocabulary lists, and mock tests are included.',
    },
    {
      q: 'Can working professionals join?',
      a: 'Absolutely. We offer flexible class timings to suit your schedule.',
    },
  ]);

  await upsertCourseTestimonials(prisma, 'IELTS Preparation', [
    {
      studentName: 'Learner',
      designation: 'IELTS Academic Student',
      review:
        'The personalized writing feedback helped me improve my essays significantly.',
    },
    {
      studentName: 'Learner',
      designation: 'Working Professional',
      review:
        'The speaking mock tests made me feel confident on the actual exam day.',
    },
    {
      studentName: 'Learner',
      designation: 'Study Abroad Aspirant',
      review:
        'The structured approach and individual attention helped me achieve my target band score.',
    },
  ]);
}
