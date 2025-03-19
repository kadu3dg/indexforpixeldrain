"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainAlbum } from '../../services/pixeldrain';
import AlbumViewer from '../../components/AlbumViewer';
import { CircularProgress, Alert } from '@mui/material';

export default function AlbumPage({ params }: { params: { id: string } }) {
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