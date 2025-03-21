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
  files: PixeldrainFile[];
  can_edit: boolean;
  file_count?: number;
}

export class PixeldrainService {
  private baseUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://pixeldrain.com/api');
  private apiKey = 'b34f7bc6-f084-40ca-aedd-eab6d8aa8a85';
  private timeout = 15000;

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
    };
  }

  private async makeRequest<T>(endpoint: string, options: any = {}): Promise<T> {
    const url = `${this.baseUrl}${encodeURIComponent(endpoint)}`;
    const config = {
      ...options,
      timeout: this.timeout,
      headers: this.getHeaders(),
      withCredentials: false
    };

    try {
      const response = await axios(url, config);
      return response.data;
    } catch (error) {
      this.logError(`Erro na requisição para ${endpoint}`, error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('Acesso negado. Verifique sua API key.');
        }
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Método de log detalhado
  private logError(context: string, error: any) {
    console.error(`[PixeldrainService Error] ${context}`, {
      errorType: error?.constructor?.name,
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method
    });
  }

  // Método para buscar detalhes de um álbum
  async getListDetails(albumId: string): Promise<PixeldrainAlbum> {
    try {
      const data = await this.makeRequest<any>(`/list/${albumId}`);

      if (!data || !data.files) {
        throw new Error('Dados do álbum inválidos ou vazios');
      }

      const validFiles = data.files.map((file: any) => ({
        id: file.id || '',
        name: file.name || 'Arquivo sem nome',
        size: file.size || 0,
        mime_type: file.mime_type || '',
        views: file.views || 0,
        downloads: file.downloads || 0,
        date_upload: file.date_upload || new Date().toISOString(),
        date_last_view: file.date_last_view || new Date().toISOString(),
        hash_sha256: file.hash_sha256 || '',
        can_edit: file.can_edit || false,
        description: file.description || ''
      }));

      return {
        ...data,
        files: validFiles,
        file_count: validFiles.length
      };
    } catch (error) {
      this.logError('Erro ao buscar detalhes do álbum', error);
      throw error;
    }
  }

  // Método para buscar todos os álbuns disponíveis
  async getUserLists(): Promise<PixeldrainAlbum[]> {
    try {
      const data = await this.makeRequest<any[]>('/user/lists');

      return data.map((album: any) => ({
        id: album.id || '',
        title: album.title || 'Álbum sem título',
        description: album.description || '',
        date_created: album.date_created || new Date().toISOString(),
        files: [],
        can_edit: album.can_edit || false,
        file_count: album.file_count || 0
      }));
    } catch (error) {
      this.logError('Erro ao buscar listas do usuário', error);
      throw error;
    }
  }

  async getFiles(): Promise<PixeldrainFile[]> {
    try {
      const data = await this.makeRequest<any[]>('/user/files');

      return data.map((file: any) => ({
        id: file.id || '',
        name: file.name || 'Arquivo sem nome',
        size: file.size || 0,
        mime_type: file.mime_type || '',
        views: file.views || 0,
        downloads: file.downloads || 0,
        date_upload: file.date_upload || new Date().toISOString(),
        date_last_view: file.date_last_view || new Date().toISOString(),
        hash_sha256: file.hash_sha256 || '',
        can_edit: file.can_edit || false,
        description: file.description || ''
      }));
    } catch (error) {
      this.logError('Erro ao buscar arquivos do usuário', error);
      throw error;
    }
  }

  getFileViewUrl(fileId: string): string {
    return `https://pixeldrain.com/u/${fileId}`;
  }

  getFileDirectUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}`;
  }

  getFileThumbnailUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}/thumbnail`;
  }

  async createAlbum(title: string, description: string = ''): Promise<PixeldrainAlbum> {
    return this.makeRequest<PixeldrainAlbum>('/list', {
      method: 'POST',
      data: {
        title,
        description,
        files: []
      }
    });
  }

  async addFileToAlbum(albumId: string, fileId: string): Promise<void> {
    await this.makeRequest<void>(`/list/${albumId}/file/${fileId}`, {
      method: 'POST'
    });
  }

  async removeFileFromAlbum(albumId: string, fileId: string): Promise<void> {
    await this.makeRequest<void>(`/list/${albumId}/file/${fileId}`, {
      method: 'DELETE'
    });
  }

  async deleteAlbum(albumId: string): Promise<void> {
    await this.makeRequest<void>(`/list/${albumId}`, {
      method: 'DELETE'
    });
  }

  // Método para verificar disponibilidade do álbum com mais diagnóstico
  async checkAlbumAvailability(albumId: string): Promise<boolean> {
    console.log(`[Diagnóstico] Verificando disponibilidade do álbum: ${albumId}`);
    
    try {
      const response = await axios.head(`${this.baseUrl}/list/${albumId}`, {
        timeout: this.timeout,
        validateStatus: (status) => status === 200 || status === 404
      });

      console.log('[Diagnóstico] Status da verificação de disponibilidade:', {
        status: response.status,
        headers: response.headers
      });

      return response.status === 200;
    } catch (error) {
      this.logError('Erro ao verificar disponibilidade do álbum', error);
      return false;
    }
  }
} 