"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainAlbum } from '../../services/pixeldrain';
import AlbumViewer from '../../components/AlbumViewer';
import { CircularProgress, Alert } from '@mui/material';

interface AlbumPageClientProps {
  params: {
    id: string;
  };
}

export default function AlbumPageClient({ params }: AlbumPageClientProps) {
  const [album, setAlbum] = useState<PixeldrainAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pixeldrainService = new PixeldrainService();

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const albumData = await pixeldrainService.getListDetails(params.id);
        setAlbum(albumData);
      } catch (error) {
        console.error('Erro ao carregar álbum:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar álbum');
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [params.id]);

  // Se o ID do álbum não corresponder a nenhum dos IDs pré-gerados,
  // mostrar uma mensagem de erro amigável
  if (params.id === 'default-album') {
    return (
      <main className="min-h-screen p-4" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <Alert severity="warning" sx={{ mb: 2, backgroundColor: '#ffa50033', color: '#ffffff' }}>
            Este álbum não está disponível no modo offline. Por favor, acesse online para ver o conteúdo.
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#ff000033', color: '#ffffff' }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: '#ffffff' }} />
          </div>
        ) : album ? (
          <AlbumViewer album={album} />
        ) : (
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">Álbum não encontrado</h1>
            <p className="mt-2">O álbum que você está procurando não existe ou foi removido.</p>
          </div>
        )}
      </div>
    </main>
  );
} 