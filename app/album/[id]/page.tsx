import { PixeldrainService } from '../../services/pixeldrain';
import AlbumPageClient from './AlbumPageClient';
import { Metadata } from 'next';

// Esta função é necessária para o modo de exportação estática
export async function generateStaticParams() {
  // Buscar todos os IDs de álbuns disponíveis
  const pixeldrainService = new PixeldrainService();
  try {
    const albums = await pixeldrainService.getUserLists();
    return albums.map(album => ({
      id: album.id
    }));
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos:', error);
    // Retornar pelo menos um ID para garantir que a página seja gerada
    return [{ id: 'default-album' }];
  }
}

// Esta função é necessária para gerar as páginas estáticas
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Verificar se o ID é válido antes de tentar buscar os detalhes
  if (!params.id || params.id === 'default-album') {
    return {
      title: 'Álbum não encontrado - Pixeldrain',
      description: 'Álbum não disponível ou inválido'
    };
  }

  const pixeldrainService = new PixeldrainService();
  
  try {
    const albumDetails = await pixeldrainService.getListDetails(params.id);
    return {
      title: albumDetails.title || `Álbum ${params.id} - Pixeldrain`,
      description: albumDetails.description || 'Detalhes do álbum no Pixeldrain'
    };
  } catch (error) {
    console.error(`Erro ao buscar metadados para o álbum ${params.id}:`, error);
    return {
      title: 'Álbum não encontrado - Pixeldrain',
      description: 'Não foi possível carregar os detalhes do álbum'
    };
  }
}

export default function AlbumPage({ params }: { params: { id: string } }) {
  // Adicionar validação para garantir que o ID não seja undefined
  if (!params.id) {
    return <div>ID do álbum inválido</div>;
  }

  return <AlbumPageClient params={params} />;
} 