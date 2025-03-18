// Versão simplificada para exportação estática
"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const apiKey = '484028b7-6e91-4fa2-a397-da34daf7ebde';
  
  // Função para mostrar/ocultar a chave API
  const toggleApiKeyVisibility = () => {
    setApiKeyVisible(!apiKeyVisible);
  };
  
  // Função para mascarar a chave API
  const maskApiKey = (key: string) => {
    if (!key) return '';
    const start = key.substring(0, 4);
    const end = key.substring(key.length - 4);
    return `${start}...${end}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pixeldrain Album Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Uma interface web para gerenciar seus álbuns no Pixeldrain
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Bem-vindo!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Este site permite que você gerencie seus arquivos e álbuns no Pixeldrain.
          </p>
          
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
            <p className="text-green-800 dark:text-green-300 font-medium flex items-center justify-between">
              <span>Status: <span className="text-green-600 dark:text-green-400 font-bold">Chave API configurada</span></span>
              <button 
                onClick={toggleApiKeyVisibility}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                {apiKeyVisible ? 'Ocultar Chave' : 'Mostrar Chave'}
              </button>
            </p>
            {apiKeyVisible && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-700">
                <code className="text-sm font-mono">{apiKey}</code>
              </div>
            )}
            {!apiKeyVisible && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-700">
                <code className="text-sm font-mono">{maskApiKey(apiKey)}</code>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <a 
              href="https://pixeldrain.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
            >
              Visitar Pixeldrain
            </a>
            
            <a 
              href="/indexforpixeldrain/album/example-album" 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ver Álbum de Exemplo
            </a>
          </div>
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Pixeldrain Album Manager
        </footer>
      </div>
    </div>
  );
} 