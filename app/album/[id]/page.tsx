import { PixeldrainService } from '../../services/pixeldrain';
import AlbumPageClient from './AlbumPageClient';
import { Metadata } from 'next';

// Esta função é necessária para o modo de exportação estática
export async function generateStaticParams() {
  // Buscar todos os IDs de álbuns disponíveis
  const pixeldrainService = new PixeldrainService();
  try {
    const albums = await pixeldrainService.getUserLists();
    
    // Filtrar IDs inválidos e adicionar um ID padrão
    const validAlbums = albums
      .filter(album => album.id && album.id.trim() !== '')
      .map(album => ({ id: album.id }));
    
    // Adicionar um ID padrão se nenhum álbum for encontrado
    return validAlbums.length > 0 
      ? validAlbums 
      : [{ id: 'default-album' }];
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
  // Validação mais robusta do ID
  const albumId = params.id?.trim();
  
  if (!albumId || 
      albumId === '' || 
      albumId === 'default-album' || 
      albumId === 'undefined') {
    return <div>ID do álbum inválido</div>;
  }

  return <AlbumPageClient params={{ id: albumId }} />;
} 