import React, { useState, useEffect } from 'react';
import { PixeldrainFile } from '../services/pixeldrain';
import Image from 'next/image';

interface FileViewerProps {
  file: PixeldrainFile;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Determinar o tipo de arquivo baseado no MIME type
  const isImage = file.mime_type?.startsWith('image/');
  const isVideo = file.mime_type?.startsWith('video/');
  const isAudio = file.mime_type?.startsWith('audio/');
  const isPdf = file.mime_type === 'application/pdf';

  // Construir URLs para recursos
  const fileUrl = `https://pixeldrain.com/api/file/${file.id}`;
  const downloadUrl = `${fileUrl}?download`;
  const thumbnailUrl = `https://pixeldrain.com/api/file/${file.id}/thumbnail`;

  // Função de log de erro detalhada
  const logError = (context: string, err?: any) => {
    console.error(`[FileViewer Error] ${context}`, {
      fileId: file.id,
      fileName: file.name,
      mimeType: file.mime_type,
      errorDetails: err instanceof Error ? err.message : err
    });
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setThumbnailError(false);
    
    // Simulando uma verificação da disponibilidade do arquivo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [file.id]);

  // Função de fallback para thumbnails
  const getThumbnail = () => {
    if (thumbnailError) {
      // Fallback para ícones de tipos de arquivo
      const fileTypeIcons: { [key: string]: string } = {
        'image': '/icons/image.svg',
        'video': '/icons/video.svg',
        'audio': '/icons/audio.svg',
        'pdf': '/icons/pdf.svg',
        'document': '/icons/document.svg',
        'spreadsheet': '/icons/spreadsheet.svg',
        'presentation': '/icons/presentation.svg',
        'archive': '/icons/archive.svg',
        'default': '/icons/file.svg'
      };

      // Lógica de seleção de ícone mais específica
      if (file.mime_type?.startsWith('image/')) return fileTypeIcons['image'];
      if (file.mime_type?.startsWith('video/')) return fileTypeIcons['video'];
      if (file.mime_type?.startsWith('audio/')) return fileTypeIcons['audio'];
      if (file.mime_type === 'application/pdf') return fileTypeIcons['pdf'];
      if (file.mime_type?.includes('document') || file.mime_type?.includes('word')) return fileTypeIcons['document'];
      if (file.mime_type?.includes('spreadsheet') || file.mime_type?.includes('excel')) return fileTypeIcons['spreadsheet'];
      if (file.mime_type?.includes('presentation') || file.mime_type?.includes('powerpoint')) return fileTypeIcons['presentation'];
      if (file.mime_type?.includes('archive') || file.mime_type?.includes('zip') || file.mime_type?.includes('rar')) return fileTypeIcons['archive'];
      
      return fileTypeIcons['default'];
    }
    return thumbnailUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>Erro ao carregar o arquivo: {error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.open(downloadUrl, '_blank')}
        >
          Tentar Baixar Diretamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold truncate">{file.name}</h2>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatFileSize(file.size)}</span>
          <span>{file.views || 0} visualizações</span>
        </div>
      </div>
      
      <div className="p-4">
        {isImage && (
          <div className="aspect-w-16 aspect-h-9 bg-black flex justify-center">
            <img
              src={fileUrl}
              alt={file.name}
              className="max-h-[600px] object-contain mx-auto"
              onError={(e) => {
                logError('Erro ao carregar imagem', e);
                setError('Não foi possível carregar a imagem.');
              }}
            />
          </div>
        )}
        
        {isVideo && (
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <video
              src={fileUrl}
              controls
              autoPlay
              className="w-full h-full"
              onError={(e) => {
                logError('Erro ao reproduzir vídeo', e);
                setError('Não foi possível reproduzir o vídeo.');
              }}
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>
        )}
        
        {isAudio && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <audio
              src={fileUrl}
              controls
              className="w-full"
              onError={(e) => {
                logError('Erro ao reproduzir áudio', e);
                setError('Não foi possível reproduzir o áudio.');
              }}
            >
              Seu navegador não suporta a reprodução de áudios.
            </audio>
          </div>
        )}
        
        {isPdf && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex justify-center items-center">
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-[600px]"
              title={file.name}
              onError={(e) => {
                logError('Erro ao carregar PDF', e);
                setError('Não foi possível carregar o PDF.');
              }}
            />
          </div>
        )}
        
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <div className="p-8 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            <img
              src={getThumbnail()}
              alt="Thumbnail"
              className="w-32 h-32 object-contain mb-4"
              onError={(e) => {
                logError('Erro ao carregar thumbnail', e);
                setThumbnailError(true);
              }}
            />
            <p className="text-center mb-4">
              Este tipo de arquivo não pode ser visualizado diretamente no navegador.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.open(downloadUrl, '_blank')}
            >
              Baixar Arquivo
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.open(downloadUrl, '_blank')}
        >
          Baixar
        </button>
        
        <div className="text-sm text-gray-500">
          Compartilhar: 
          <button
            className="ml-2 text-blue-500 hover:underline"
            onClick={() => {
              navigator.clipboard.writeText(`https://pixeldrain.com/u/${file.id}`);
              // Adicionar feedback visual de link copiado
              alert('Link copiado para área de transferência!');
            }}
          >
            Copiar Link
          </button>
        </div>
      </div>
    </div>
  );
};

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default FileViewer; 