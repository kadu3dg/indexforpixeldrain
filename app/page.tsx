"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainAlbum } from './services/pixeldrain';

export default function Home() {
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const pixeldrainService = new PixeldrainService();
        const response = await pixeldrainService.getAlbums();
        setAlbums(response.albums || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar álbuns:', err);
        setError('Não foi possível carregar os álbuns. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pixeldrain Album Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Uma interface web para gerenciar seus álbuns no Pixeldrain
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Seus Álbuns
            </h2>
            <a 
              href="https://pixeldrain.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Visitar Pixeldrain
            </a>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && albums.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum álbum encontrado.</p>
            </div>
          )}

          {!loading && !error && albums.length > 0 && (
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
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Pixeldrain Album Manager
        </footer>
      </div>
    </div>
  );
} 