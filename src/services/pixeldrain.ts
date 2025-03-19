export class PixeldrainService {
  private readonly apiKey: string;
  private readonly workerUrl: string;

  constructor() {
    this.apiKey = 'aa73d120-100e-426e-93ba-c7e1569b0322';
    this.workerUrl = 'https://pixeldrain-proxy.kadulavinia.workers.dev';
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = new URL(this.workerUrl);
    url.searchParams.set('endpoint', endpoint);
    url.searchParams.set('apiKey', this.apiKey);

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
} 