'use client';

import { TopBar } from '@/components/home/TopBar';
import { SiteHeader } from '@/components/home/SiteHeader';
import { SiteFooter } from '@/components/home/SiteFooter';
import { WhatsAppButton } from '@/components/home/WhatsAppButton';
import { AssessmentModalProvider } from '@/components/home/AssessmentModal';

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <AssessmentModalProvider>
      <TopBar />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </AssessmentModalProvider>
  );
}
