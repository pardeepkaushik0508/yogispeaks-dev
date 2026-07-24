import type { Metadata } from 'next';
import { TopBar } from '@/components/home/TopBar';
import { SiteHeader } from '@/components/home/SiteHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesFaqSection } from '@/components/home/FeaturesFaqSection';
import { ProgramsSection } from '@/components/home/ProgramsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { JourneyBenefitsSection } from '@/components/home/JourneyBenefitsSection';
import { BottomCtaSection } from '@/components/home/BottomCtaSection';
import { SiteFooter } from '@/components/home/SiteFooter';
import { WhatsAppButton } from '@/components/home/WhatsAppButton';
import { siteContact } from '@/data/homepage';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Communication Coaching for Confidence & Career Growth',
  description:
    'Transform how you communicate with personalized one-to-one coaching from YogiSpeaks. Build fluency, confidence, and career-ready presence.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'YogiSpeaks — Communication Coaching for Confidence & Career Growth',
    description:
      'Personalized coaching to help you speak fluently, communicate effectively, and unlock better opportunities.',
    url: siteUrl,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'YogiSpeaks',
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-primary.png`,
  description:
    'Professional communication coaching courses, assessments, and training by YogiSpeaks.',
  email: siteContact.email,
  telephone: siteContact.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New Delhi',
    addressCountry: 'IN',
  },
  founder: {
    '@type': 'Person',
    name: 'Yogender',
    jobTitle: 'Coach & Founder',
  },
  sameAs: [
    'https://facebook.com',
    'https://instagram.com',
    'https://youtube.com',
    'https://linkedin.com',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-98731-60236',
      contactType: 'customer service',
      email: siteContact.email,
      availableLanguage: ['English', 'Hindi'],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <TopBar />
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <FeaturesFaqSection />
        <ProgramsSection />
        <TestimonialsSection />
        <JourneyBenefitsSection />
        <BottomCtaSection />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
