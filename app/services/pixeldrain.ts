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

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? '/api/pixeldrain'
      : 'https://pixeldrain.com/api';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = new URL(
      process.env.NODE_ENV === 'development'
        ? this.baseUrl
        : endpoint,
      process.env.NODE_ENV === 'development'
        ? window.location.origin
        : this.baseUrl
    );

    if (process.env.NODE_ENV === 'development') {
      url.searchParams.set('endpoint', endpoint);
      url.searchParams.set('apiKey', this.apiKey);
    }

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    if (process.env.NODE_ENV !== 'development') {
      headers.set('Authorization', `Basic ${btoa(`:${this.apiKey}`)}`);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro na API do Pixeldrain: ${response.status} ${response.statusText}\n${errorData}`);
    }

    return response.json();
  }

  async getFiles(): Promise<PixeldrainFile[]> {
    const data = await this.fetchWithAuth('/user/files');
    return data.files || [];
  }

  async getUserLists(): Promise<PixeldrainAlbum[]> {
    const data = await this.fetchWithAuth('/user/lists');
    return data.lists || [];
  }

  async createAlbum(title: string, description: string = ''): Promise<PixeldrainAlbum> {
    const data = await this.fetchWithAuth('/list', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        files: []
      })
    });
    return data;
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