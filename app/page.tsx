'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import FileList from './components/FileList';
import { PixeldrainService } from './services/pixeldrain';

export default function Home() {
  const [pixeldrainService, setPixeldrainService] = useState<PixeldrainService | null>(null);

  useEffect(() => {
    // Tenta recuperar a chave API do localStorage
    const savedKey = localStorage.getItem('pixeldrain_api_key');
    if (savedKey) {
      const service = new PixeldrainService(savedKey);
      setPixeldrainService(service);
    }
  }, []);

  const handleLogin = (apiKey: string) => {
    try {
      console.log('Tentando criar serviço com a chave API');
      const service = new PixeldrainService(apiKey);
      setPixeldrainService(service);
      // Salva a chave API no localStorage
      localStorage.setItem('pixeldrain_api_key', apiKey);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
    }
  };

  const handleLogout = () => {
    setPixeldrainService(null);
    localStorage.removeItem('pixeldrain_api_key');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {!pixeldrainService ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Sair
            </button>
          </div>
          <FileList pixeldrainService={pixeldrainService} />
        </div>
      )}
    </main>
  );
} 