import React, { useState, useEffect } from 'react';
import { PixeldrainFile } from '../services/pixeldrain';
import Image from 'next/image';

interface FileViewerProps {
  file: PixeldrainFile;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determinar o tipo de arquivo baseado no MIME type
  const isImage = file.mime_type?.startsWith('image/');
  const isVideo = file.mime_type?.startsWith('video/');
  const isAudio = file.mime_type?.startsWith('audio/');
  const isPdf = file.mime_type === 'application/pdf';

  // Construir URLs para recursos
  const fileUrl = `https://pixeldrain.com/api/file/${file.id}`;
  const downloadUrl = `${fileUrl}?download`;
  const thumbnailUrl = `https://pixeldrain.com/api/file/${file.id}/thumbnail`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Simulando uma verificação da disponibilidade do arquivo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [file.id]);

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
              onError={() => setError('Não foi possível carregar a imagem.')}
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
              onError={() => setError('Não foi possível reproduzir o vídeo.')}
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
              onError={() => setError('Não foi possível reproduzir o áudio.')}
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
              onError={() => setError('Não foi possível carregar o PDF.')}
            />
          </div>
        )}
        
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <div className="p-8 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-32 h-32 object-contain mb-4"
              onError={(e) => (e.currentTarget.style.display = 'none')}
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
            onClick={() => navigator.clipboard.writeText(`https://pixeldrain.com/u/${file.id}`)}
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