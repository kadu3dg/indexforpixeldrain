import { PixeldrainService } from '../../services/pixeldrain';
import AlbumPageClient from './AlbumPageClient';

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

export default function AlbumPage({ params }: { params: { id: string } }) {
  return <AlbumPageClient params={params} />;
} 