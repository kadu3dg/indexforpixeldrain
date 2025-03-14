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

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    if (this.apiKey) {
      headers.set('Authorization', `Basic ${btoa(`${this.apiKey}:`)}`);
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async listFiles(): Promise<{ files: PixeldrainFile[]; albums: PixeldrainAlbum[] }> {
    const response = await this.fetchWithAuth('https://pixeldrain.com/api/user/files');
    const data = await response.json();
    return {
      files: data.files || [],
      albums: data.albums || []
    };
  }

  async getAlbum(albumId: string): Promise<PixeldrainAlbum> {
    const response = await this.fetchWithAuth(`https://pixeldrain.com/api/album/${albumId}`);
    const data = await response.json();
    return data;
  }

  getDownloadUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fetchWithAuth(`https://pixeldrain.com/api/file/${fileId}`, {
      method: 'DELETE'
    });
  }

  async createAlbum(title: string, description: string): Promise<PixeldrainAlbum> {
    const response = await this.fetchWithAuth('https://pixeldrain.com/api/album', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
    return response.json();
  }

  async addFileToAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`https://pixeldrain.com/api/album/${albumId}/${fileId}`, {
      method: 'PUT'
    });
  }

  async removeFileFromAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`https://pixeldrain.com/api/album/${albumId}/${fileId}`, {
      method: 'DELETE'
    });
  }
} 