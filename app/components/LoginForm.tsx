'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (apiKey: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Remover espaços em branco e caracteres especiais
      const cleanApiKey = apiKey.trim().replace(/\s+/g, '');
      console.log('Tentando autenticar...');

      const response = await fetch('/api/pixeldrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: cleanApiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação');
      }

      if (data.success === false) {
        throw new Error(data.message || 'Chave API inválida');
      }

      // Se chegou até aqui, a autenticação foi bem sucedida
      onLogin(cleanApiKey);
      
    } catch (err) {
      console.error('Erro ao conectar:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao conectar com o Pixeldrain. Verifique sua chave API.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login Pixeldrain</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Chave API
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Cole sua chave API aqui"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Cole a chave API exatamente como aparece na sua conta do Pixeldrain
          </p>
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Conectando...' : 'Entrar'}
        </button>
        <div className="space-y-2 text-sm text-gray-600 mt-4">
          <p>
            1. Acesse a{' '}
            <a
              href="https://pixeldrain.com/user/api_keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              página de chaves API do Pixeldrain
            </a>
          </p>
          <p>2. Clique em "Create new API key" se necessário</p>
          <p>3. Copie a chave API completa</p>
          <p>4. Cole a chave no campo acima</p>
        </div>
      </form>
    </div>
  );
} 