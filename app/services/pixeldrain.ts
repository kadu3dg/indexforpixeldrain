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
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://cors-anywhere.herokuapp.com/https://pixeldrain.com/api'
    : 'https://pixeldrain.com/api';
  private apiKey = 'b34f7bc6-f084-40ca-aedd-eab6d8aa8a85';
  private timeout = 15000;

  private getHeaders() {
    return {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Origin': window.location.origin,
      'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
    };
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

  // Método para buscar detalhes de um álbum com diagnóstico detalhado
  async getListDetails(albumId: string): Promise<PixeldrainAlbum> {
    console.log(`[Diagnóstico] Tentando carregar álbum: ${albumId}`);
    console.log(`[Diagnóstico] URL base: ${this.baseUrl}`);

    try {
      const response = await axios.get(`${this.baseUrl}/list/${albumId}`, {
        timeout: this.timeout,
        headers: this.getHeaders()
      });
      
      console.log('[Diagnóstico] Resposta do álbum recebida:', {
        status: response.status,
        dataReceived: !!response.data,
        fileCount: response.data?.files?.length || 0
      });

      if (!response.data || !response.data.files) {
        throw new Error('Dados do álbum inválidos ou vazios');
      }

      const validFiles = response.data.files.map((file: any) => ({
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
        ...response.data,
        files: validFiles,
        file_count: validFiles.length
      };
    } catch (error) {
      this.logError('Erro ao buscar detalhes do álbum', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              throw new Error(`Álbum ${albumId} não encontrado`);
            case 403:
              throw new Error(`Acesso negado ao álbum ${albumId}. Verifique sua API key.`);
            case 500:
              throw new Error(`Erro interno do servidor ao buscar álbum ${albumId}`);
            case 0:
              throw new Error(`Erro de CORS ao acessar o álbum ${albumId}. Tente novamente mais tarde.`);
          }
        } else if (error.request) {
          throw new Error(`Sem resposta do servidor ao buscar álbum ${albumId}. Verifique sua conexão.`);
        }
      }
      throw new Error(`Falha ao carregar álbum ${albumId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Método para buscar todos os álbuns disponíveis
  async getUserLists(): Promise<PixeldrainAlbum[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/user/lists`, {
        timeout: this.timeout,
        headers: this.getHeaders()
      });

      if (!Array.isArray(response.data)) {
        console.error('Resposta inválida da API:', response.data);
        return [];
      }

      return response.data.map((album: any) => ({
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
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error('Acesso negado. Verifique sua API key.');
      }
      return [];
    }
  }

  async getFiles(): Promise<PixeldrainFile[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/user/files`, {
        timeout: this.timeout,
        headers: this.getHeaders()
      });

      if (!Array.isArray(response.data)) {
        console.error('Resposta inválida da API:', response.data);
        return [];
      }

      return response.data.map((file: any) => ({
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
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error('Acesso negado. Verifique sua API key.');
      }
      return [];
    }
  }

  getFileViewUrl(fileId: string): string {
    return `https://pixeldrain.com/u/${fileId}`;
  }

  getFileDirectUrl(fileId: string): string {
    return `${this.baseUrl}/file/${fileId}`;
  }

  getFileThumbnailUrl(fileId: string): string {
    return `${this.baseUrl}/file/${fileId}/thumbnail`;
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