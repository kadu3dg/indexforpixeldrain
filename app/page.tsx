"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainAlbum } from './services/pixeldrain';

export default function Home() {
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError('');

        // Inicializar o serviço com a chave API definida
        const pixeldrainService = new PixeldrainService();
        const response = await pixeldrainService.getAlbums();
        
        console.log('Resposta completa da API:', response);
        
        if (response.success === false) {
          console.error('Erro ao buscar álbuns:', response.error);
          setError(`Erro ao conectar com a API do Pixeldrain: ${response.error}`);
          
          // Adicionar informações de debug se existirem
          if (response.text) {
            console.error('Detalhes da resposta HTML:', response.text);
            setDebugInfo(response.text.substring(0, 500) + '...');
          } else if (response.errorDetails) {
            console.error('Detalhes do erro:', response.errorDetails);
            setDebugInfo(response.errorDetails);
          }
          
          setAlbums([]);
        } else if (response.albums) {
          console.log('Álbuns encontrados:', response.albums);
          setAlbums(response.albums);
          setError('');
          setDebugInfo(null);
        } else {
          console.log('Nenhum álbum encontrado na resposta:', response);
          setAlbums([]);
          setError('');
          setDebugInfo(null);
        }
      } catch (err) {
        console.error('Erro ao carregar álbuns:', err);
        setError(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Pixeldrain Album Manager</h1>
        <p className="text-gray-400 mb-8">Uma interface web para gerenciar seus álbuns no Pixeldrain</p>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Seus Álbuns</h2>
          <a 
            href="https://pixeldrain.com/u/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Visitar Pixeldrain
          </a>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
            <div className="text-sm border-t border-red-200 pt-2 mt-2">
              <p className="font-semibold mb-1">Possíveis soluções:</p>
              <ul className="list-disc pl-5 mb-3">
                <li>Verifique se a chave API está correta em <code className="bg-red-50 px-1 rounded">app/services/pixeldrain.ts</code></li>
                <li>A API do Pixeldrain pode estar temporariamente indisponível. Tente novamente mais tarde.</li>
                <li>Verifique sua conexão com a internet.</li>
              </ul>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
              >
                Tentar novamente
              </button>
            </div>
            
            {/* Seção de debug com detalhes técnicos, se disponíveis */}
            {debugInfo && (
              <div className="mt-4 pt-3 border-t border-red-200">
                <details className="text-xs">
                  <summary className="cursor-pointer font-semibold mb-2">Informações técnicas para debug</summary>
                  <div className="bg-red-50 p-2 rounded overflow-auto max-h-40">
                    <pre>{debugInfo}</pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {albums.length === 0 && !error ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-lg mb-3">Nenhum álbum encontrado. Esta conta não possui álbuns no Pixeldrain.</p>
                <a 
                  href="https://pixeldrain.com/u/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Criar álbuns no Pixeldrain
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div key={album.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {album.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(album.date_created).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {album.description || "Sem descrição"}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                          {album.file_count || 0} arquivo(s)
                        </span>
                        <a 
                          href={`/indexforpixeldrain/album/${album.id}`}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Ver Álbum
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <footer className="mt-12 py-4 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2025 Pixeldrain Album Manager
      </footer>
    </div>
  );
} 