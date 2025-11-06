// app/page.tsx
'use client'
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  const handleListClick = () => {
    router.push(`auth`);
  };

  return <button onClick={() => handleListClick()}>click me biatch</button>;
}