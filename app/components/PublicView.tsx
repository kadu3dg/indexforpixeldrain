'use client';

import { useState, useEffect } from 'react';
import { PixeldrainFile, PixeldrainAlbum, PixeldrainService } from '../services/pixeldrain';
import { formatDate } from '../utils/format';
import VideoPlayer from './VideoPlayer';

interface PublicViewProps {
  albumId?: string;
  pixeldrainService: PixeldrainService;
}

export default function PublicView({ albumId, pixeldrainService }: PublicViewProps) {
  const [album, setAlbum] = useState<PixeldrainAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<PixeldrainFile | null>(null);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (albumId) {
          const data = await pixeldrainService.getAlbum(albumId);
          setAlbum(data);
        }
      } catch (err) {
        console.error('Erro ao carregar álbum:', err);
        setError('Erro ao carregar álbum. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [albumId, pixeldrainService]);

  const handlePlayVideo = (fileId: string, fileName: string) => {
    setCurrentVideo({
      id: fileId,
      name: fileName
    } as PixeldrainFile);
  };

  const isVideoFile = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Álbum não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {album.description}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Criado em: {formatDate(album.date_created)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {album.files?.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {file.name}
                  </h3>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tipo: {file.mime_type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload: {formatDate(file.date_upload)}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    {isVideoFile(file.mime_type) && (
                      <button
                        onClick={() => handlePlayVideo(file.id, file.name)}
                        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reproduzir
                      </button>
                    )}
                    <a
                      href={`https://pixeldrain.com/api/file/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentVideo && (
        <VideoPlayer
          src={`https://pixeldrain.com/api/file/${currentVideo.id}`}
          title={currentVideo.name}
          onClose={() => setCurrentVideo(null)}
        />
      )}
    </div>
  );
} 