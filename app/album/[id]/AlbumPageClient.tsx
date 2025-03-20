"use client";

import { useState, useEffect } from 'react';
import { PixeldrainService, PixeldrainAlbum } from '../../services/pixeldrain';
import AlbumViewer from '../../components/AlbumViewer';
import { CircularProgress, Alert, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface AlbumPageClientProps {
  params: {
    id: string;
  };
}

export default function AlbumPageClient({ params }: AlbumPageClientProps) {
  const [album, setAlbum] = useState<PixeldrainAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const pixeldrainService = new PixeldrainService();

  // Função de log de diagnóstico
  const logDiagnostic = (message: string, data?: any) => {
    console.log(`[AlbumPageClient Diagnóstico] ${message}`, data || '');
  };

  // Função de log de erro
  const logError = (message: string, error?: any) => {
    console.error(`[AlbumPageClient Erro] ${message}`, error || '');
  };

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        // Validação mais robusta do ID
        const albumId = params.id?.trim();
        
        logDiagnostic('Iniciando carregamento do álbum', { albumId });
        
        if (!albumId || 
            albumId === '' || 
            albumId === 'default-album' || 
            albumId === 'undefined') {
          throw new Error(`ID de álbum inválido: "${albumId}"`);
        }

        // Verificar disponibilidade do álbum antes de carregar
        const isAvailable = await pixeldrainService.checkAlbumAvailability(albumId);
        
        if (!isAvailable) {
          throw new Error(`Álbum ${albumId} não está disponível`);
        }

        logDiagnostic('Carregando detalhes do álbum');
        const albumData = await pixeldrainService.getListDetails(albumId);
        
        logDiagnostic('Dados do álbum carregados', {
          albumId: albumData.id,
          title: albumData.title,
          fileCount: albumData.files.length
        });

        setAlbum(albumData);
      } catch (error) {
        logError('Erro ao carregar álbum', error);
        
        // Adicionar mais detalhes ao erro
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Erro desconhecido ao carregar álbum';
        
        setError(errorMessage);
        
        // Definir um álbum padrão em caso de erro
        setAlbum({
          id: params.id || 'album-erro',
          title: 'Álbum não encontrado',
          description: errorMessage,
          date_created: new Date().toISOString(),
          files: [],
          can_edit: false,
          file_count: 0
        });
      } finally {
        setLoading(false);
        logDiagnostic('Carregamento do álbum finalizado');
      }
    };

    loadAlbum();
  }, [params.id]);

  const handleBack = () => {
    router.push('/');
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Ordenar arquivos
  const sortedFiles = album?.files ? [...album.files].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  }) : [];

  // Se o ID do álbum não corresponder a nenhum dos IDs pré-gerados,
  // mostrar uma mensagem de erro amigável
  if (params.id === 'default-album' || error) {
    return (
      <main className="min-h-screen p-4" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <Alert severity="warning" sx={{ mb: 2, backgroundColor: '#ffa50033', color: '#ffffff' }}>
            {error || 'Este álbum não está disponível no momento.'}
          </Alert>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#444',
              },
            }}
          >
            Voltar para o Início
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={handleBack}
              variant="contained"
              startIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              }
              sx={{
                backgroundColor: '#333',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#444',
                },
              }}
            >
              Voltar
            </Button>
            {album && (
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{album.title}</h1>
                <p className="text-gray-400">
                  {album.files.length} arquivo{album.files.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleViewMode}
              variant="outlined"
              color="primary"
              startIcon={
                viewMode === 'grid' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                  </svg>
                )
              }
            >
              {viewMode === 'grid' ? 'Lista' : 'Grade'}
            </Button>
            <Button
              onClick={toggleSortOrder}
              variant="outlined"
              color="secondary"
              startIcon={
                sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0v8m0-8h2"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0v-8m0 8h2"/>
                  </svg>
                )
              }
            >
              {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: '#ffffff' }} />
          </div>
        ) : album ? (
          <AlbumViewer 
            album={{...album, files: sortedFiles}} 
            viewMode={viewMode} 
          />
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