// app/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { getMessages } from '@/lib/getMessages';

export default function Home() {
  const t = getMessages();
  const router = useRouter();

  const handleListClick = () => {
    router.push(`/auth`);
  };

  return <button onClick={() => handleListClick()}>{t.loginForNow}</button>;
}
