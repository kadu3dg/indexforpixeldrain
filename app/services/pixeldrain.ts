import axios, { AxiosError } from 'axios';

export interface PixeldrainFile {
  id: string;
  name: string;
  size: number;
  views: number;
  downloads: number;
  date_upload: string;
  date_last_view: string;
  mime_type: string;
  thumbnail_href?: string;
  hash_sha256: string;
  can_edit: boolean;
  description?: string;
}

export interface PixeldrainListItem extends PixeldrainFile {
  description?: string;
}

export interface PixeldrainAlbum {
  id: string;
  title: string;
  description: string;
  date_created: string;
  files: PixeldrainListItem[];
  can_edit: boolean;
  file_count?: number;
}

export class PixeldrainService {
  private baseUrl = '/proxy/pixeldrain';

  // Método genérico para tratamento de erros
  private handleError(error: AxiosError, context: string) {
    console.error(`[PixeldrainService Error] ${context}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Mapeamento de erros específicos
    switch (error.response?.status) {
      case 404:
        throw new Error(`Recurso não encontrado: ${context}`);
      case 403:
        throw new Error(`Acesso negado: ${context}`);
      case 500:
        throw new Error(`Erro interno do servidor: ${context}`);
      default:
        throw new Error(`Erro desconhecido ao ${context}: ${error.message}`);
    }
  }

  // Método para buscar detalhes de um álbum
  async getListDetails(albumId: string): Promise<PixeldrainAlbum> {
    try {
      const response = await axios.get(`${this.baseUrl}/list/${albumId}`);
      
      // Validação adicional dos dados
      if (!response.data || !response.data.files) {
        throw new Error('Dados do álbum inválidos');
      }

      // Mapear e validar arquivos
      const validFiles = response.data.files.map((file: any) => ({
        id: file.id || '',
        name: file.name || 'Arquivo sem nome',
        size: file.size || 0,
        mime_type: file.mime_type || '',
        views: file.views || 0
      }));

      return {
        ...response.data,
        files: validFiles
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleError(error, 'buscar detalhes do álbum');
      }
      throw error;
    }
  }

  // Método para buscar todos os álbuns disponíveis
  async getAllAlbums(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/list`);
      return response.data?.lists || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleError(error, 'buscar lista de álbuns');
      }
      throw error;
    }
  }

  // Método para verificar a disponibilidade de um arquivo
  async checkFileAvailability(fileId: string): Promise<boolean> {
    try {
      const response = await axios.head(`${this.baseUrl}/file/${fileId}`);
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log do erro, mas não lança exceção
        console.warn(`Arquivo ${fileId} não disponível`, error.message);
      }
      return false;
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('endpoint', endpoint);

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit'
    };

    try {
      const response = await fetch(url.toString(), fetchOptions);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Erro na API do Pixeldrain: ${response.status} ${response.statusText}\n${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async getFiles(): Promise<PixeldrainFile[]> {
    try {
      const data = await this.fetchWithAuth('/user/files');
      return data.files || [];
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      return [];
    }
  }

  async getUserLists(): Promise<PixeldrainAlbum[]> {
    try {
      const data = await this.fetchWithAuth('/user/lists');
      const lists = data.lists || [];
      
      // Buscar os detalhes de cada álbum para obter o número de arquivos
      const albumsWithFileCount = await Promise.all(
        lists.map(async (list: PixeldrainAlbum) => {
          try {
            const details = await this.getListDetails(list.id);
            return {
              ...list,
              file_count: details.files.length
            };
          } catch (error) {
            console.error(`Erro ao buscar detalhes do álbum ${list.id}:`, error);
            return {
              ...list,
              file_count: 0
            };
          }
        })
      );

      return albumsWithFileCount;
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      return [];
    }
  }

  getFileViewUrl(fileId: string): string {
    return `https://pixeldrain.com/v/${fileId}`;
  }

  getFileThumbnailUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}/thumbnail`;
  }

  async createAlbum(title: string, description: string = ''): Promise<PixeldrainAlbum> {
    return this.fetchWithAuth('/list', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        files: []
      })
    });
  }

  async addFileToAlbum(albumId: string, fileId: string): Promise<void> {
    await this.fetchWithAuth(`/list/${albumId}/file/${fileId}`, {
      method: 'POST'
    });
  }

  async removeFileFromAlbum(albumId: string, fileId: string): Promise<void> {
    await this.fetchWithAuth(`/list/${albumId}/file/${fileId}`, {
      method: 'DELETE'
    });
  }

  async deleteAlbum(albumId: string): Promise<void> {
    await this.fetchWithAuth(`/list/${albumId}`, {
      method: 'DELETE'
    });
  }
} 