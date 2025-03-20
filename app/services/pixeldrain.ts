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
  private baseUrl = 'https://pixeldrain.com/api';
  private timeout = 10000; // 10 segundos de timeout

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
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('[Diagnóstico] Resposta do álbum recebida:', {
        status: response.status,
        dataReceived: !!response.data,
        fileCount: response.data?.files?.length || 0
      });

      // Validação adicional dos dados
      if (!response.data || !response.data.files) {
        throw new Error('Dados do álbum inválidos ou vazios');
      }

      // Mapear e validar arquivos
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

      // Tratamento específico para diferentes tipos de erros
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // O servidor respondeu com um status de erro
          switch (error.response.status) {
            case 404:
              throw new Error(`Álbum ${albumId} não encontrado`);
            case 403:
              throw new Error(`Acesso negado ao álbum ${albumId}`);
            case 500:
              throw new Error(`Erro interno do servidor ao buscar álbum ${albumId}`);
          }
        } else if (error.request) {
          // A requisição foi feita, mas nenhuma resposta foi recebida
          throw new Error(`Sem resposta do servidor ao buscar álbum ${albumId}`);
        }
      }

      // Erro genérico
      throw new Error(`Falha ao carregar álbum ${albumId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Método para buscar todos os álbuns disponíveis
  async getAllAlbums(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/list`);
      return response.data?.lists || [];
    } catch (error) {
      this.logError('Erro ao buscar lista de álbuns', error);
      return [];
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
    // Arquivos de demonstração
    return [
      {
        id: 'S8XO23s8',
        name: 'Arquivo de demonstração 1.jpg',
        size: 1024000,
        views: 10,
        downloads: 5,
        date_upload: new Date().toISOString(),
        date_last_view: new Date().toISOString(),
        mime_type: 'image/jpeg',
        hash_sha256: '',
        can_edit: false
      },
      {
        id: 'a2b4c6d8',
        name: 'Arquivo de demonstração 2.pdf',
        size: 2048000,
        views: 5,
        downloads: 2,
        date_upload: new Date().toISOString(),
        date_last_view: new Date().toISOString(),
        mime_type: 'application/pdf',
        hash_sha256: '',
        can_edit: false
      }
    ];
  }

  async getUserLists(): Promise<PixeldrainAlbum[]> {
    try {
      // Lista de álbuns predefinidos para demonstração
      const demoAlbums = [
        { id: 'GLELo283', title: 'Álbum de Demonstração 1' },
        { id: 'z3dL7Lsa', title: 'Álbum de Demonstração 2' }
      ];
      
      return demoAlbums.map(album => ({
        id: album.id,
        title: album.title,
        description: 'Álbum de demonstração para o Pixeldrain',
        date_created: new Date().toISOString(),
        files: [],
        can_edit: false,
        file_count: 0
      }));
    } catch (error) {
      console.error('Erro ao buscar listas do usuário:', error);
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