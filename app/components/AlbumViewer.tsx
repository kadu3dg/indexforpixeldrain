import React, { useState } from 'react';
import { PixeldrainAlbum, PixeldrainFile } from '../services/pixeldrain';
import FileViewer from './FileViewer';
import { Card, CardContent, Typography, Grid } from '@mui/material';

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

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        {selectedFile && (
          <div className="mb-4">
            <Typography variant="h6" className="text-white">
              {selectedFile.name}
            </Typography>
          </div>
        )}
        <FileViewer file={selectedFile} />
      </div>

      {album.files.length > 0 && (
        <div className="p-4 bg-gray-800">
          <Typography variant="h6" className="text-white mb-4">
            Arquivos no Álbum ({album.files.length})
          </Typography>
          <Grid container spacing={2}>
            {album.files.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFileIndex === index
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-2 hover:ring-blue-300'
                  }`}
                  onClick={() => setSelectedFileIndex(index)}
                  sx={{ backgroundColor: '#1a1a1a', height: '100%' }}
                >
                  <div className="relative aspect-w-16 aspect-h-9">
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
                  <CardContent sx={{ color: '#fff' }}>
                    <Typography variant="subtitle1" component="h3" className="font-medium truncate">
                      {file.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      {formatFileSize(file.size)}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {file.views} visualizações
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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