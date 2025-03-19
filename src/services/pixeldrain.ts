export class PixeldrainService {
  private readonly workerUrl: string;

  constructor() {
    this.workerUrl = 'https://pixeldrain-proxy.kadulavinia.workers.dev';
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = new URL(this.workerUrl);
    url.searchParams.set('endpoint', endpoint);

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listFiles() {
    return this.makeRequest('list');
  }

  async getFileInfo(id: string) {
    return this.makeRequest(`info/${id}`);
  }

  async deleteFile(id: string) {
    return this.makeRequest(`file/${id}`, 'DELETE');
  }

  async getUserLists() {
    return this.makeRequest('/user/lists');
  }

  async getListDetails(listId: string) {
    return this.makeRequest(`/list/${listId}`);
  }

  getFileViewUrl(fileId: string) {
    return `https://pixeldrain.com/v/${fileId}`;
  }

  getFileThumbnailUrl(fileId: string) {
    return `https://pixeldrain.com/api/file/${fileId}/thumbnail`;
  }
} 