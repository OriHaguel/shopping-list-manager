// app/page.tsx
import { Navbar } from '@/components/Navbar/Navbar';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { FeaturesGrid } from '@/components/FeaturesGrid/FeaturesGrid';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';

export default function Home() {

  return <main>
    <Navbar />
    <HeroSection />
    <FeaturesGrid />
    <HowItWorks />
  </main>
}
