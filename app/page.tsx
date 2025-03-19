"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainFile, PixeldrainAlbum } from './services/pixeldrain';
import { Button, Input, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(1),
  width: '100%',
  maxWidth: 600,
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  '& .MuiTypography-root': {
    color: '#ffffff',
  },
  '& .MuiTypography-colorTextSecondary': {
    color: '#aaaaaa',
  }
}));

export default function Home() {
  const [files, setFiles] = useState<PixeldrainFile[]>([]);
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pixeldrainService = new PixeldrainService();

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar arquivos
      const filesData = await pixeldrainService.getFiles();
      setFiles(filesData);

      // Carregar álbuns
      const albumsData = await pixeldrainService.getUserLists();
      setAlbums(albumsData);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
      <h1 className="text-4xl font-bold mb-8 text-white">Índice Pixeldrain</h1>

      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600, mb: 2, backgroundColor: '#ff000033', color: '#ffffff' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ color: '#ffffff' }} />
      ) : (
        <>
          <section className="w-full max-w-3xl">
            <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
              Álbuns ({albums.length})
            </Typography>
            {albums.map((album) => (
              <StyledCard key={album.id}>
                <CardContent>
                  <Typography variant="h6">{album.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {album.description}
                  </Typography>
                  {album.date_created && (
                    <Typography variant="caption" display="block">
                      Criado em: {new Date(album.date_created).toLocaleDateString()}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    Arquivos: {album.files?.length || 0}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/album/${album.id}`}
                    sx={{ mt: 2 }}
                  >
                    Ver Álbum
                  </Button>
                </CardContent>
              </StyledCard>
            ))}
          </section>

          <section className="w-full max-w-3xl mt-8">
            <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
              Arquivos ({files.length})
            </Typography>
            {files.map((file) => (
              <StyledCard key={file.id}>
                <CardContent>
                  <Typography variant="h6">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Views: {file.views}
                  </Typography>
                  {file.date_upload && (
                    <Typography variant="caption" display="block">
                      Enviado em: {new Date(file.date_upload).toLocaleDateString()}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/file/${file.id}`}
                    sx={{ mt: 2 }}
                  >
                    Visualizar
                  </Button>
                </CardContent>
              </StyledCard>
            ))}
          </section>
        </>
      )}
    </main>
  );
} 