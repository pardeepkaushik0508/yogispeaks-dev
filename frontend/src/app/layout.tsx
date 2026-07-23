import type { Metadata } from 'next';
import { Montserrat, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'YogiSpeaks — Communication Coaching',
    template: '%s | YogiSpeaks',
  },
  description:
    'Professional communication coaching courses, assessments, and training by YogiSpeaks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className={`${jakarta.className} flex min-h-full flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[var(--color-primary)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
