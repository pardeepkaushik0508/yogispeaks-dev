import type { Metadata } from 'next';
import { Allura, Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const allura = Allura({
  variable: '--font-allura',
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'YogiSpeaks — Communication Coaching for Confidence & Career Growth',
    template: '%s | YogiSpeaks',
  },
  description:
    'Personalized one-to-one communication coaching by YogiSpeaks. Build fluency, confidence, and career-ready presence with expert guidance for students and professionals.',
  keywords: [
    'communication coaching',
    'spoken English',
    'IELTS preparation',
    'public speaking',
    'personality development',
    'YogiSpeaks',
    'Yogender',
  ],
  authors: [{ name: 'YogiSpeaks' }],
  creator: 'YogiSpeaks',
  publisher: 'YogiSpeaks',
  applicationName: 'YogiSpeaks',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'YogiSpeaks',
    title: 'YogiSpeaks — Communication Coaching',
    description:
      'Personalized coaching to help you speak fluently, communicate effectively, and unlock better opportunities.',
    images: [
      {
        url: '/brand/hero-banner.png',
        width: 1200,
        height: 630,
        alt: 'YogiSpeaks communication coaching with founder Yogender',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YogiSpeaks — Communication Coaching',
    description:
      'Personalized coaching to help you speak fluently, communicate effectively, and unlock better opportunities.',
    images: ['/brand/hero-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/brand/logo-primary.png',
    apple: '/brand/logo-primary.png',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${allura.variable} h-full antialiased`}>
      <body className={`${poppins.className} flex min-h-full flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
