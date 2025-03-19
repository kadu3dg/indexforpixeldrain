import React, { useState } from 'react';
import { PixeldrainAlbum, PixeldrainFile } from '../services/pixeldrain';
import FileViewer from './FileViewer';

interface AlbumViewerProps {
  album: PixeldrainAlbum;
}

const AlbumViewer: React.FC<AlbumViewerProps> = ({ album }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Verifica se há arquivos no álbum
  if (!album.files || album.files.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg mb-4">
        Este álbum está vazio.
      </div>
    );
  }

  const selectedFile = album.files[selectedFileIndex];
  const isVideo = selectedFile.mime_type?.startsWith('video/');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">{album.title}</h1>
        {album.description && (
          <p className="mt-2 text-gray-300">{album.description}</p>
        )}
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{album.files.length} arquivo(s)</span>
          {album.date_created && (
            <span>
              Criado em: {new Date(album.date_created).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <FileViewer file={selectedFile} />
      </div>

      {album.files.length > 1 && (
        <div className="p-4 bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Arquivos no Álbum</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {album.files.map((file, index) => (
              <div
                key={file.id}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedFileIndex === index
                    ? 'border-blue-500'
                    : 'border-transparent'
                } hover:border-blue-300 transition-colors duration-200`}
                onClick={() => setSelectedFileIndex(index)}
              >
                <div className="relative aspect-w-1 aspect-h-1">
                  {file.mime_type?.startsWith('video/') ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <img
                        src={`https://pixeldrain.com/api/file/${file.id}/thumbnail`}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getFileIcon(file.mime_type || '');
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white opacity-80"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`https://pixeldrain.com/api/file/${file.id}/thumbnail`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getFileIcon(file.mime_type || '');
                      }}
                    />
                  )}
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Função para obter um ícone baseado no tipo MIME
function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    return '/icons/image.svg';
  } else if (mimeType.startsWith('video/')) {
    return '/icons/video.svg';
  } else if (mimeType.startsWith('audio/')) {
    return '/icons/audio.svg';
  } else if (mimeType === 'application/pdf') {
    return '/icons/pdf.svg';
  } else if (mimeType.includes('document') || mimeType.includes('word')) {
    return '/icons/document.svg';
  } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return '/icons/spreadsheet.svg';
  } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return '/icons/presentation.svg';
  } else if (mimeType.includes('archive') || mimeType.includes('zip') || mimeType.includes('rar')) {
    return '/icons/archive.svg';
  } else {
    return '/icons/file.svg';
  }
}

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default AlbumViewer; 