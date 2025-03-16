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

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Iniciando carregamento de arquivos...');
      const { files: newFiles, albums: newAlbums } = await pixeldrainService.listFiles();
      console.log('Arquivos carregados:', newFiles.length, 'Álbuns carregados:', newAlbums.length);
      setFiles(newFiles);
      setAlbums(newAlbums);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos. Por favor, tente novamente.');
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
      setIsRefreshing(true);
      loadFiles();
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Seus Arquivos</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNewAlbumForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Criar Álbum
          </button>
          <button
            onClick={() => loadFiles()}
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${
              isRefreshing ? 'opacity-50' : ''
            }`}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {loading && <p className="text-center py-4">Carregando...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erro!</p>
          <p>{error}</p>
          <button 
            onClick={() => loadFiles()} 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Tentar Novamente
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