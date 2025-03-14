export interface PixeldrainFile {
  id: string;
  name: string;
  size: number;
  date_upload: string;
  mime_type: string;
  album_id?: string;
}

export interface PixeldrainAlbum {
  id: string;
  title: string;
  description: string;
  date_created: string;
  files: PixeldrainFile[];
}

export class PixeldrainService {
  private apiKey: string;
  private baseUrl = 'https://pixeldrain.com/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchLocal(endpoint: string, options: RequestInit = {}) {
    const url = new URL('/api/pixeldrain' + endpoint, window.location.origin);
    url.searchParams.append('apiKey', this.apiKey);

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }

  async listFiles(): Promise<{ files: PixeldrainFile[], albums: PixeldrainAlbum[] }> {
    try {
      console.log('Iniciando listagem de arquivos e álbuns...');
      
      // Buscar álbuns
      const albumsData = await this.fetchLocal('/albums');
      const albums: PixeldrainAlbum[] = [];
      
      // Para cada álbum, buscar seus arquivos
      for (const album of albumsData.albums || []) {
        const albumFiles = await this.fetchLocal(`/albums/${album.id}`);
        albums.push({
          ...album,
          files: albumFiles.files || []
        });
      }

      // Buscar arquivos que não estão em álbuns
      const filesData = await this.fetchLocal('/files');
      const filesWithoutAlbum = (filesData.files || []).filter(
        (file: PixeldrainFile) => !file.album_id
      );

      return {
        files: filesWithoutAlbum,
        albums: albums
      };
    } catch (error) {
      console.error('Erro detalhado ao listar arquivos:', error);
      throw new Error('Erro ao carregar arquivos. Por favor, tente novamente.');
    }
  }

  async createAlbum(title: string, description: string = ''): Promise<PixeldrainAlbum> {
    const data = await this.fetchLocal('/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    return data;
  }

  async addFileToAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchLocal(`/albums/${albumId}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileId }),
    });
  }

  async removeFileFromAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchLocal(`/albums/${albumId}/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fetchLocal(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  getDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/file/${fileId}?download`;
  }

  getViewUrl(fileId: string): string {
    return `https://pixeldrain.com/u/${fileId}`;
  }
} 