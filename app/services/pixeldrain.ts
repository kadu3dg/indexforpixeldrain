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
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://kadu3dg.github.io/indexforpixeldrain/api/pixeldrain'
      : '/api/pixeldrain';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = new URL(this.baseUrl, window.location.origin);
    url.searchParams.set('endpoint', endpoint);
    if (this.apiKey) {
      url.searchParams.set('apiKey', this.apiKey);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
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