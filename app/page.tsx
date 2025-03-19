"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainFile, PixeldrainAlbum } from './services/pixeldrain';
import { Button, Input, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(1),
  width: '100%',
  maxWidth: 600,
}));

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [files, setFiles] = useState<PixeldrainFile[]>([]);
  const [albums, setAlbums] = useState<PixeldrainAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pixeldrainService = new PixeldrainService(apiKey);

  const loadContent = async () => {
    if (!apiKey) {
      setError('Por favor, insira sua chave API do Pixeldrain');
      return;
    }

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
    if (apiKey) {
      loadContent();
    }
  }, [apiKey]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-8">Índice Pixeldrain</h1>

      <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
        <Input
          fullWidth
          placeholder="Insira sua chave API do Pixeldrain"
          value={apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
          type="password"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <section className="w-full max-w-3xl">
            <Typography variant="h5" gutterBottom>
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
                    Arquivos: {album.files.length}
                  </Typography>
                </CardContent>
              </StyledCard>
            ))}
          </section>

          <section className="w-full max-w-3xl mt-8">
            <Typography variant="h5" gutterBottom>
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
                  <Typography variant="body2" color="text.secondary">
                    Downloads: {file.downloads}
                  </Typography>
                  {file.date_upload && (
                    <Typography variant="caption" display="block">
                      Enviado em: {new Date(file.date_upload).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>
            ))}
          </section>
        </>
      )}
    </main>
  );
} 