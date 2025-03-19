'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixeldrainAlbum } from '../services/pixeldrain';
import { formatDate } from '../utils/format';

interface AlbumListProps {
  albums: PixeldrainAlbum[];
}

type ViewMode = 'grid' | 'list';
type SortOrder = 'asc' | 'desc';

export default function AlbumList({ albums }: AlbumListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Ordenar álbuns
  const sortedAlbums = [...albums].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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
            {viewMode === 'grid' ? 'Lista' : 'Grade'}
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
            {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
          </button>
        </div>
      </div>
      
      {albums.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Nenhum álbum encontrado</p>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {sortedAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className={`block bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg ${
                viewMode === 'list' ? 'w-full' : ''
              }`}
            >
              <div className="flex justify-between items-start">
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
                    Total de arquivos: {album.file_count || 0}
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 