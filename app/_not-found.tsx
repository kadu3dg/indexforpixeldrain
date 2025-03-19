"use client";

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{
            backgroundColor: '#333',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#444',
            },
          }}
        >
          Voltar para o Início
        </Button>
      </div>
    </main>
  );
} 