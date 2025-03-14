'use client';

import { useState, useEffect, useCallback } from 'react';
import { PixeldrainFile, PixeldrainAlbum, PixeldrainService } from '../services/pixeldrain';
import { useSettingsContext } from '../contexts/SettingsContext';
import { formatDate } from '../utils/format';
import AlbumList from './AlbumList';
import VideoPlayer from './VideoPlayer';

interface FileListProps {
  pixeldrainService: PixeldrainService;
}

export default function FileList({ pixeldrainService }: FileListProps) {
  const { settings } = useSettingsContext();
  const [files, setFiles] = useState<PixeldrainFile[]>([]);
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [targetAlbum, setTargetAlbum] = useState<string>('');
  const [currentVideo, setCurrentVideo] = useState<PixeldrainFile | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadFiles = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      
      const data = await pixeldrainService.listFiles();
      setFiles(data.files);
      setAlbums(data.albums);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
      setError('Erro ao carregar arquivos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [pixeldrainService]);

  // Carregamento inicial
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadFiles(false);
    }, 30 * 1000); // 30 segundos

    return () => clearInterval(interval);
  }, [loadFiles]);

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pixeldrainService.createAlbum(newAlbumTitle, newAlbumDescription);
      
      // Adicionar arquivos selecionados ao álbum
      if (selectedFiles.size > 0) {
        const album = albums.find(a => a.id === targetAlbum);
        if (album) {
          for (const fileId of selectedFiles) {
            await pixeldrainService.addFileToAlbum(fileId, album.id);
          }
        }
      }

      // Limpar formulário e recarregar
      setShowNewAlbumForm(false);
      setNewAlbumTitle('');
      setNewAlbumDescription('');
      setSelectedFiles(new Set());
      await loadFiles();
    } catch (err) {
      console.error('Erro ao criar álbum:', err);
      setError('Erro ao criar álbum. Por favor, tente novamente.');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await pixeldrainService.deleteFile(fileId);
      await loadFiles();
    } catch (err) {
      console.error('Erro ao deletar arquivo:', err);
      setError('Erro ao deletar arquivo. Por favor, tente novamente.');
    }
  };

  const handleMoveToAlbum = async (fileId: string, albumId: string) => {
    try {
      await pixeldrainService.addFileToAlbum(fileId, albumId);
      await loadFiles();
    } catch (err) {
      console.error('Erro ao mover arquivo:', err);
      setError('Erro ao mover arquivo. Por favor, tente novamente.');
    }
  };

  const handlePlayVideo = (fileId: string, fileName: string) => {
    setCurrentVideo({
      id: fileId,
      name: fileName
    } as PixeldrainFile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Cabeçalho com informações de atualização */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Álbuns</h1>
          {lastUpdate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Última atualização: {formatDate(lastUpdate.toISOString())}
            </span>
          )}
        </div>
        <button
          onClick={() => loadFiles(false)}
          disabled={isRefreshing}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isRefreshing
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          } text-white transition-colors`}
        >
          <svg
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isRefreshing ? 'Atualizando...' : 'Atualizar'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
          <button
            onClick={() => loadFiles()}
            className="mt-2 text-red-600 dark:text-red-400 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-4">
        <AlbumList
          albums={albums}
          onCreateAlbum={handleCreateAlbum}
          onDeleteFile={handleDeleteFile}
          onMoveFile={handleMoveToAlbum}
          onPlayVideo={handlePlayVideo}
        />
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