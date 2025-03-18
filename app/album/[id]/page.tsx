'use client';

import { PixeldrainService } from '../../services/pixeldrain';
import PublicView from '../../components/PublicView';

interface AlbumPageProps {
  params: {
    id: string;
  };
}

// Esta função é necessária para o modo de exportação estática
// Ela indica ao Next.js quais parâmetros pré-gerar durante o build
export function generateStaticParams() {
  // Retornamos um array vazio, o que significa que não pré-renderizamos 
  // nenhuma página específica no build, mas a estrutura da rota ainda será exportada
  return [];
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const pixeldrainService = new PixeldrainService();
  
  return (
    <PublicView
      albumId={params.id}
      pixeldrainService={pixeldrainService}
    />
  );
} 