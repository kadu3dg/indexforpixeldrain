'use client';

import { useState, useEffect } from 'react';
import { PixeldrainAlbum } from '../services/pixeldrain';
import { formatDate } from '../utils/format';

interface AlbumListProps {
  albums: PixeldrainAlbum[];
  onCreateAlbum: (e: React.FormEvent) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onMoveFile: (fileId: string, albumId: string) => Promise<void>;
  onPlayVideo: (fileId: string, fileName: string) => void;
}

type ViewMode = 'grid' | 'list';
type SortOrder = 'asc' | 'desc';

export default function AlbumList({ albums, onCreateAlbum, onDeleteFile, onMoveFile, onPlayVideo }: AlbumListProps) {
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Ordenar álbuns
  const sortedAlbums = [...albums].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Expandir o primeiro álbum por padrão quando a lista de álbuns mudar
  useEffect(() => {
    if (albums.length > 0 && expandedAlbums.size === 0) {
      setExpandedAlbums(new Set([albums[0].id]));
    }
  }, [albums]);

  const toggleAlbum = (albumId: string) => {
    setExpandedAlbums(prev => {
      const newSet = new Set(prev);
      if (newSet.has(albumId)) {
        newSet.delete(albumId);
      } else {
        newSet.add(albumId);
      }
      return newSet;
    });
  };

  const expandAllAlbums = () => {
    setExpandedAlbums(new Set(albums.map(album => album.id)));
  };

  const collapseAllAlbums = () => {
    setExpandedAlbums(new Set());
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const isVideoFile = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Álbuns</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {viewMode === 'grid' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
              )}
            </svg>
            {viewMode === 'grid' ? 'Visualizar em Lista' : 'Visualizar em Grade'}
          </button>
          <button
            onClick={toggleSortOrder}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sortOrder === 'asc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0v8m0-8h2"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0v-8m0 8h2"/>
              )}
            </svg>
            Ordenar {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
          </button>
          <button
            onClick={expandAllAlbums}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Expandir Todos
          </button>
          <button
            onClick={collapseAllAlbums}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Recolher Todos
          </button>
        </div>
      </div>
      
      {albums.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Nenhum álbum encontrado</p>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {sortedAlbums.map((album) => (
            <div
              key={album.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg ${
                viewMode === 'list' ? 'w-full' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {album.description || 'Sem descrição'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Criado em: {formatDate(album.date_created)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total de arquivos: {album.files?.length || 0}
                  </p>
                </div>
                <button
                  onClick={() => toggleAlbum(album.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  {expandedAlbums.has(album.id) ? '▼' : '▶'}
                </button>
              </div>
              {expandedAlbums.has(album.id) && (
                <div className="mt-4 space-y-2 transition-all duration-200">
                  {album.files && album.files.length > 0 ? (
                    album.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex flex-col flex-1 truncate">
                          <span className="text-sm text-gray-900 dark:text-white truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {file.views} visualizações
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {isVideoFile(file.mime_type) && (
                            <button
                              onClick={() => onPlayVideo(file.id, file.name)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center transition-colors"
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
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Mover
                          </button>
                          <button
                            onClick={() => onDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                      {album.files ? 'Nenhum arquivo neste álbum' : 'Carregando arquivos...'}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 