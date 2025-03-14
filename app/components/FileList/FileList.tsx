'use client';

import { useEffect, useState } from 'react';
import { PixeldrainFile, PixeldrainService, PixeldrainAlbum } from '../../services/pixeldrain';
import AlbumList from '../AlbumList';
import Image from 'next/image';

interface FileListProps {
  pixeldrainService: PixeldrainService;
}

export default function FileList({ pixeldrainService }: FileListProps) {
  const [files, setFiles] = useState<PixeldrainFile[]>([]);
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      console.log('Iniciando carregamento de arquivos...');
      if (!pixeldrainService) {
        throw new Error('Serviço do Pixeldrain não inicializado');
      }

      setLoading(true);
      setError(null);
      const data = await pixeldrainService.listFiles();
      console.log('Dados recebidos:', data);
      setFiles(data.files);
      setAlbums(data.albums);
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
      setError('Erro ao carregar arquivos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('FileList montado, pixeldrainService:', pixeldrainService ? 'presente' : 'ausente');
    loadFiles();
  }, [pixeldrainService]); // Adiciona pixeldrainService como dependência

  const handleDownload = (file: PixeldrainFile) => {
    const downloadUrl = pixeldrainService.getDownloadUrl(file.id);
    window.open(downloadUrl, '_blank');
  };

  const handleDelete = async (file: PixeldrainFile) => {
    if (!confirm(`Tem certeza que deseja excluir "${file.name}"?`)) {
      return;
    }

    try {
      await pixeldrainService.deleteFile(file.id);
      await loadFiles(); // Recarrega a lista após deletar
    } catch (err) {
      console.error('Erro ao deletar arquivo:', err);
      alert('Erro ao deletar arquivo. Por favor, tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadFiles}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {albums.length > 0 && (
        <AlbumList
          albums={albums}
          onCreateAlbum={async (e) => {
            e.preventDefault();
            // Implementar lógica de criação de álbum aqui
          }}
          onDeleteFile={async (fileId) => {
            try {
              await pixeldrainService.deleteFile(fileId);
              await loadFiles();
            } catch (err) {
              console.error('Erro ao deletar arquivo:', err);
              setError('Erro ao deletar arquivo. Por favor, tente novamente.');
            }
          }}
          onMoveFile={async (fileId, albumId) => {
            try {
              await pixeldrainService.addFileToAlbum(fileId, albumId);
              await loadFiles();
            } catch (err) {
              console.error('Erro ao mover arquivo:', err);
              setError('Erro ao mover arquivo. Por favor, tente novamente.');
            }
          }}
          onPlayVideo={(fileId, fileName) => {
            // Implementar lógica de reprodução de vídeo aqui
          }}
        />
      )}

      {files.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Arquivos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow"
              >
                {file.mime_type.startsWith('image/') ? (
                  <div className="relative h-32 bg-gray-100 rounded">
                    <Image
                      src={`https://pixeldrain.com/api/file/${file.id}/thumbnail`}
                      alt={file.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-4xl">📄</span>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(file.date_upload)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex-1 px-2 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                    >
                      Baixar
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && albums.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum arquivo encontrado
        </div>
      )}
    </div>
  );
} 