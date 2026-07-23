export const siteContact = {
  phone: '+91 98731 60236',
  phoneHref: 'tel:+919873160236',
  email: 'hello@yogispeaks.com',
  emailHref: 'mailto:hello@yogispeaks.com',
  whatsapp: 'https://wa.me/919873160236',
  address: 'New Delhi, India',
  hours: 'Mon–Sat · 10:00 AM – 7:00 PM IST',
};

export const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' as const },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' as const },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' as const },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' as const },
  { label: 'WhatsApp', href: siteContact.whatsapp, icon: 'whatsapp' as const },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Courses',
    href: '/courses',
    children: [
      { label: 'Spoken English', href: '/courses/spoken-english' },
      { label: 'IELTS Preparation', href: '/courses/ielts-preparation' },
      { label: 'Professional Communication', href: '/courses/professional-communication' },
      { label: 'Personality Development', href: '/courses/personality-development' },
      { label: 'Spoken Hindi', href: '/courses/spoken-hindi' },
    ],
  },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const heroContent = {
  eyebrow: 'Helping Students & Professionals',
  heading: 'Transform the Way You Communicate. Build Confidence. Advance Your Career.',
  highlightPhrases: ['Build Confidence.', 'Advance Your Career.'],
  description:
    'Personalized one-to-one coaching to help you speak fluently, communicate effectively, and unlock better opportunities.',
  primaryCta: {
    label: 'Book Your Free Communication Assessment',
    href: '/free-assessment',
  },
  secondaryCta: {
    label: 'Explore Our Programs',
    href: '/courses',
  },
  founderQuote:
    "Communication is not just a skill, it's your competitive advantage.",
  founderAttribution: 'Yoginder, Coach & Founder',
};

export const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '5000+', label: 'Learners Coached' },
  { value: '150+', label: 'Verified Reviews' },
  { value: '', label: 'Trusted by Students Across India & Internationally', isBadge: true },
];

export const featuresSection = {
  eyebrow: 'Why Learners Choose YogiSpeaks',
  title: 'Personalized Guidance. Real Results.',
  items: [
    {
      title: 'Personalized Coaching',
      description: 'One-to-one sessions tailored to your goals, pace, and industry context.',
      icon: 'user' as const,
    },
    {
      title: 'Practical Communication',
      description: 'Real conversations, presentations, and interviews — not rote scripts.',
      icon: 'message' as const,
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit around work, exams, and life abroad.',
      icon: 'calendar' as const,
    },
    {
      title: 'Structured Learning',
      description: 'Clear milestones from assessment through fluency and confidence.',
      icon: 'layers' as const,
    },
    {
      title: 'Continuous Feedback',
      description: 'Actionable coaching notes after every practice so progress sticks.',
      icon: 'refresh' as const,
    },
    {
      title: 'Dedicated Support',
      description: 'Guidance beyond class — materials, doubt clearing, and motivation.',
      icon: 'heart' as const,
    },
  ],
};

export const faqs = [
  {
    question: 'Who can join YogiSpeaks?',
    answer:
      'Students, working professionals, job seekers, and anyone who wants clearer, more confident spoken communication — from beginners to advanced learners.',
  },
  {
    question: 'Is this course suitable for beginners?',
    answer:
      'Yes. We start with a free assessment to place you at the right level and build a plan that matches your current fluency.',
  },
  {
    question: 'Are classes online or offline?',
    answer:
      'Primary delivery is live one-to-one online. Hybrid or in-person options can be discussed during your assessment.',
  },
  {
    question: 'Do you provide study materials?',
    answer:
      'Yes. You receive assignments, practice sheets, and curated resources aligned to your learning plan.',
  },
  {
    question: 'Will I receive a certificate?',
    answer:
      'Completion certificates are available for eligible programs. Details are shared during enrollment.',
  },
  {
    question: 'How long does it take to see improvement?',
    answer:
      'Many learners notice clearer speech and confidence within a few weeks of consistent practice. Exact timelines depend on goals and starting level.',
  },
  {
    question: 'Can I choose my class timing?',
    answer:
      'Yes. Session slots are flexible and booked around your availability.',
  },
  {
    question: 'Do you help with interview preparation?',
    answer:
      'Absolutely. Interview communication, body language, and mock rounds are part of professional tracks.',
  },
  {
    question: 'How do I enroll / book an assessment?',
    answer:
      'Click Book Free Assessment, share your details, and we will schedule your complimentary communication assessment.',
  },
];

export const programs = [
  {
    slug: 'spoken-english',
    title: 'Spoken English',
    description: 'Build fluency, clarity, and everyday confidence in spoken English.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'ielts-preparation',
    title: 'IELTS Preparation',
    description: 'Targeted speaking and communication practice for IELTS success.',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'professional-communication',
    title: 'Professional Communication',
    description: 'Meetings, presentations, and workplace English that opens doors.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'personality-development',
    title: 'Personality Development',
    description: 'Presence, confidence, and the soft skills that set you apart.',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    slug: 'spoken-hindi',
    title: 'Spoken Hindi',
    description: 'Practical Hindi conversation for daily life and professional settings.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
  },
];

export const testimonials = [
  {
    name: 'Priya Sharma',
    designation: 'Working Professional',
    review:
      'My interviews finally feel natural. The coaching is practical, personal, and results-driven.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    designation: 'MBA Aspirant',
    review:
      'From hesitant answers to confident delivery — YogiSpeaks changed how I present myself.',
    rating: 5,
  },
  {
    name: 'Ananya Gupta',
    designation: 'University Student',
    review:
      'The one-to-one format meant every session targeted my weak spots. Highly recommend.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    designation: 'Team Lead',
    review:
      'Clearer meetings, stronger presence with clients. The feedback after each class was gold.',
    rating: 5,
  },
];

export const journeySteps = [
  {
    title: 'Communication Assessment',
    description: 'We evaluate your current level, goals, and gaps.',
    icon: 'clipboard' as const,
  },
  {
    title: 'Personalized Learning Plan',
    description: 'A roadmap built around your career and timeline.',
    icon: 'map' as const,
  },
  {
    title: 'Learn Through Practice',
    description: 'Live drills for speaking, listening, and presence.',
    icon: 'mic' as const,
  },
  {
    title: 'Track Your Progress',
    description: 'Visible milestones and coaching notes each week.',
    icon: 'chart' as const,
  },
  {
    title: 'Achieve Your Goals',
    description: 'Step into interviews, classrooms, and careers with confidence.',
    icon: 'trophy' as const,
  },
];

export const benefits = [
  '1-to-1 Live Online Classes',
  'Real-life Speaking Practice',
  'Personalized Feedback',
  'Flexible Scheduling',
  'Assignments & Study Materials',
  'Lifetime Guidance & Support',
];

export const bottomCta = {
  heading: 'Ready to Transform Your Communication?',
  description: 'Take the first step toward becoming a confident communicator.',
  highlights: ['Free Communication Assessment', 'Personalized Learning Plan'],
  ctaLabel: 'Book Your Free Communication Assessment',
  ctaHref: '/free-assessment',
  reassurance: 'No Obligation – 100% Free',
};
