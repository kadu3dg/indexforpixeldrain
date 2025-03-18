export interface PixeldrainFile {
  id: string;
  name: string;
  size: number;
  views: number;
  date_upload: string;
  date_last_view: string;
  mime_type: string;
}

export interface PixeldrainAlbum {
  id: string;
  title: string;
  description: string;
  date_created: string;
  files?: PixeldrainFile[];
}

export class PixeldrainService {
  private apiKey?: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.baseUrl = '/api/pixeldrain';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    try {
      const headers = new Headers(options.headers);
      headers.set('Content-Type', 'application/json');
      
      if (this.apiKey) {
        headers.set('Authorization', `Basic ${Buffer.from(`:${this.apiKey}`).toString('base64')}`);
      }

      // Usar diretamente a API do Pixeldrain em vez das rotas internas
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${this.baseUrl}${endpoint}`;
      
      console.log(`Fazendo requisição para: ${url}`);
      
      try {
        const response = await fetch(url, {
          ...options,
          headers
        });

        // Tenta obter o corpo da resposta como JSON
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          console.error('Erro ao processar JSON:', e);
          responseData = { message: 'Não foi possível ler a resposta' };
        }

        if (!response.ok) {
          console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          console.error('Detalhes da resposta:', responseData);
          throw new Error(`Erro na API: ${response.status} - ${responseData.error || responseData.message || response.statusText}`);
        }

        return responseData;
      } catch (fetchError) {
        console.error('Erro na requisição fetch:', fetchError);
        if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
          throw new Error('Falha na conexão com o servidor. Verifique sua conexão com a internet.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async listFiles(): Promise<{ files: PixeldrainFile[]; albums: PixeldrainAlbum[] }> {
    try {
      // Usar as rotas de API internas do Next.js
      const filesResponse = await this.fetchWithAuth('/files');
      const albumsResponse = await this.fetchWithAuth('/albums');
      
      console.log('Resposta da API de arquivos:', filesResponse);
      console.log('Resposta da API de álbuns:', albumsResponse);
      
      const albums = albumsResponse.albums || [];
      
      // Carregar os arquivos de cada álbum
      const albumsWithFiles = await Promise.all(
        albums.map(async (album: PixeldrainAlbum) => {
          try {
            const albumDetails = await this.getAlbum(album.id);
            return {
              ...album,
              files: albumDetails.files || []
            };
          } catch (error) {
            console.error(`Erro ao carregar arquivos do álbum ${album.id}:`, error);
            return album;
          }
        })
      );
      
      return {
        files: filesResponse.files || [],
        albums: albumsWithFiles
      };
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }
  }

  async getAlbum(albumId: string): Promise<PixeldrainAlbum> {
    try {
      const response = await this.fetchWithAuth(`/albums/${albumId}`);
      return response;
    } catch (error) {
      console.error(`Erro ao obter álbum ${albumId}:`, error);
      throw error;
    }
  }

  getDownloadUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fetchWithAuth(`/file/${fileId}`, {
      method: 'DELETE'
    });
  }

  async createAlbum(title: string, description: string): Promise<PixeldrainAlbum> {
    const data = await this.fetchWithAuth('/album', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });
    return data;
  }

  async addFileToAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`/album/${albumId}/${fileId}`, {
      method: 'PUT'
    });
  }

  async removeFileFromAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`/album/${albumId}/${fileId}`, {
      method: 'DELETE'
    });
  }
} 