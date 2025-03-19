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
}

export class PixeldrainService {
  private apiKey: string;
  private baseUrl: string;
  private corsProxy: string;

  constructor(apiKey: string = 'aa73d120-100e-426e-93ba-c7e1569b0322') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://pixeldrain.com/api';
    this.corsProxy = 'https://api.allorigins.win/raw?url=';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = new URL(endpoint, this.baseUrl);
    const proxyUrl = this.corsProxy + encodeURIComponent(url.toString());

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Basic ${btoa(`:${this.apiKey}`)}`);

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit'
    };

    try {
      const response = await fetch(proxyUrl, fetchOptions);

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