'use client';

import { PixeldrainService } from '../../services/pixeldrain';
import PublicView from '../../components/PublicView';

interface AlbumPageProps {
  params: {
    id: string;
  };
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