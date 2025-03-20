import { PixeldrainService } from '../../services/pixeldrain';
import AlbumPageClient from './AlbumPageClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Esta função é necessária para o modo de exportação estática
export async function generateStaticParams() {
  // Buscar todos os IDs de álbuns disponíveis
  const pixeldrainService = new PixeldrainService();
  try {
    const albums = await pixeldrainService.getAllAlbums();
    
    // Filtrar IDs inválidos e adicionar um ID padrão
    const validAlbums = albums
      .filter(albumId => albumId && albumId.trim() !== '')
      .map(albumId => ({ id: albumId }));
    
    // Log detalhado para depuração
    console.log('Álbuns gerados para rotas estáticas:', validAlbums);
    
    // Adicionar um ID padrão se nenhum álbum for encontrado
    const finalParams = validAlbums.length > 0 
      ? validAlbums 
      : [{ id: 'default-album' }];
    
    console.log('Parâmetros finais para rotas estáticas:', finalParams);
    
    return finalParams;
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos:', error);
    // Retornar um ID padrão em caso de erro
    return [{ id: 'default-album' }];
  }
}

// Esta função é necessária para gerar as páginas estáticas
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  // Validação mais robusta do ID
  const albumId = params.id?.trim();
  
  if (!albumId || 
      albumId === '' || 
      albumId === 'default-album' || 
      albumId === 'undefined') {
    return {
      title: 'Álbum não encontrado - Pixeldrain',
      description: 'Álbum não disponível ou inválido'
    };
  }

  const pixeldrainService = new PixeldrainService();
  
  try {
    const albumDetails = await pixeldrainService.getListDetails(albumId);
    return {
      title: albumDetails.title || `Álbum ${albumId} - Pixeldrain`,
      description: albumDetails.description || 'Detalhes do álbum no Pixeldrain'
    };
  } catch (error) {
    console.error(`Erro ao buscar metadados para o álbum ${albumId}:`, error);
    return {
      title: 'Álbum não encontrado - Pixeldrain',
      description: 'Não foi possível carregar os detalhes do álbum'
    };
  }
}

export default async function AlbumPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Log de depuração para verificar os parâmetros recebidos
  console.log('Parâmetros recebidos na página do álbum:', params);

  // Validação mais robusta do ID
  const albumId = params.id?.trim();
  
  if (!albumId || 
      albumId === '' || 
      albumId === 'default-album' || 
      albumId === 'undefined') {
    return <div>ID do álbum inválido</div>;
  }

  // Adicionar tratamento de erro para álbuns não encontrados
  try {
    const pixeldrainService = new PixeldrainService();
    
    // Verificar disponibilidade do álbum
    const isAvailable = await pixeldrainService.checkAlbumAvailability(albumId);
    
    if (!isAvailable) {
      console.warn(`Álbum ${albumId} não está disponível`);
      return <div>Álbum não disponível</div>;
    }

    const albumDetails = await pixeldrainService.getListDetails(albumId);
    
    // Log de depuração para verificar os detalhes do álbum
    console.log('Detalhes do álbum carregados:', albumDetails);

    return <AlbumPageClient params={{ id: albumId }} />;
  } catch (error) {
    console.error(`Erro ao carregar detalhes do álbum ${albumId}:`, error);
    return <div>Álbum não encontrado</div>;
  }
} 