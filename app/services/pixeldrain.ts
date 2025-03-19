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

export interface PixeldrainListItem {
  id: string;
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
  private readonly workerUrl: string;

  constructor() {
    this.workerUrl = 'https://pixeldrain-proxy.kadulavinia.workers.dev';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = new URL(this.workerUrl);
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
      return data.lists || [];
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      return [];
    }
  }

  async getListDetails(listId: string): Promise<PixeldrainAlbum> {
    try {
      const data = await this.fetchWithAuth(`/list/${listId}`);
      return data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do álbum ${listId}:`, error);
      return {
        id: listId,
        title: 'Erro ao carregar',
        description: '',
        date_created: new Date().toISOString(),
        files: [],
        can_edit: false
      };
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