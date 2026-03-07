// app/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { getMessages } from '@/lib/getMessages';
import { Navbar } from '@/components/Navbar/Navbar';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { FeaturesGrid } from '@/components/FeaturesGrid/FeaturesGrid';
import HowItWorks from '@/components/HowItWorks/HowItWorks';

export default function Home() {
  const t = getMessages();
  const router = useRouter();

  const handleListClick = () => {
    router.push(`/auth`);
  };

  // return <button onClick={() => handleListClick()}>{t.loginForNow}</button>;
  return <main>
    <Navbar />
    <HeroSection />
    <FeaturesGrid />
    <HowItWorks />
  </main>
}
