import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Este arquivo é apenas um placeholder para direcionar para a versão App Router
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, [router]);
  
  return null;
} 