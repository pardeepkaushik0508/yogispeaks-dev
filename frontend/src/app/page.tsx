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

export default function HomePage() {
  return (
    <>
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
