'use client';

import { useState } from 'react';
import { PixeldrainAlbum } from '../services/pixeldrain';
import { formatDate } from '../utils/format';

interface AlbumListProps {
  albums: PixeldrainAlbum[];
  onCreateAlbum: (e: React.FormEvent) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onMoveFile: (fileId: string, albumId: string) => Promise<void>;
  onPlayVideo: (fileId: string, fileName: string) => void;
}

export default function AlbumList({ albums, onCreateAlbum, onDeleteFile, onMoveFile, onPlayVideo }: AlbumListProps) {
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);

  const isVideoFile = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Álbuns</h2>
      {albums.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Nenhum álbum encontrado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {album.description || 'Sem descrição'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Criado em: {formatDate(album.date_created)}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {expandedAlbum === album.id ? '▼' : '▶'}
                </button>
              </div>
              {expandedAlbum === album.id && album.files && (
                <div className="mt-4 space-y-2">
                  {album.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-sm text-gray-900 dark:text-white truncate flex-1">
                        {file.name}
                      </span>
                      <div className="flex items-center space-x-2 ml-4">
                        {isVideoFile(file.mime_type) && (
                          <button
                            onClick={() => onPlayVideo(file.id, file.name)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Reproduzir
                          </button>
                        )}
                        <button
                          onClick={() => onMoveFile(file.id, album.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Mover
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 