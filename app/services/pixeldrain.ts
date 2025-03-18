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
  file_count?: number;
  files?: PixeldrainFile[];
}

export class PixeldrainService {
  private apiKey: string = 'a79a8e71-2813-4295-8617-bf9a23830060';
  private baseUrl: string = 'https://pixeldrain.com/api';

  constructor(apiKey: string = 'a79a8e71-2813-4295-8617-bf9a23830060') {
    this.apiKey = apiKey || 'a79a8e71-2813-4295-8617-bf9a23830060';
  }

  // Método para obter os arquivos do usuário
  async getFiles() {
    try {
      // Usar a API real do Pixeldrain
      const response = await this.fetchWithAuth('/user/files');
      console.log('Resposta da API de arquivos:', response);
      
      return response;
    } catch (error) {
      console.error('Erro crítico ao buscar arquivos:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        files: []
      };
    }
  }

  // Método para obter os álbuns do usuário
  async getAlbums() {
    try {
      console.log('Tentando buscar álbuns com a chave API:', this.apiKey);
      
      // Usar a API real do Pixeldrain
      const response = await this.fetchWithAuth('/user/albums');
      console.log('Resposta da API de álbuns:', response);
      
      return response;
    } catch (error) {
      console.error('Erro crítico ao buscar álbuns:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        albums: []
      };
    }
  }

  // Método para obter os arquivos de um álbum específico
  async getAlbumFiles(albumId: string) {
    try {
      // Usar a API real do Pixeldrain
      const response = await this.fetchWithAuth(`/album/${albumId}`);
      console.log(`Resposta da API para o álbum ${albumId}:`, response);
      
      return response;
    } catch (error) {
      console.error(`Erro crítico ao buscar arquivos do álbum ${albumId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        files: []
      };
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    try {
      const headers = new Headers(options.headers);
      headers.set('Content-Type', 'application/json');
      
      if (this.apiKey) {
        // Verificar se a API key está definida e não vazia
        if (!this.apiKey.trim()) {
          console.error('API key está vazia');
          return {
            success: false,
            error: 'API key não fornecida'
          };
        }
        
        // Usar Basic Auth com a chave API do Pixeldrain
        const authString = `:${this.apiKey}`;
        let base64Auth;
        try {
          // Tentar usar btoa para navegadores
          if (typeof btoa === 'function') {
            base64Auth = btoa(authString);
          } else {
            // Fallback para Node.js
            base64Auth = Buffer.from(authString).toString('base64');
          }
          headers.set('Authorization', `Basic ${base64Auth}`);
        } catch (e) {
          console.error('Erro ao codificar credenciais:', e);
        }
      }

      // Remover o trailing slash do baseUrl se existir
      const baseUrl = this.baseUrl.endsWith('/') 
        ? this.baseUrl.slice(0, -1) 
        : this.baseUrl;
      
      // Adicionar o leading slash do endpoint se não existir
      const path = endpoint.startsWith('/') 
        ? endpoint 
        : `/${endpoint}`;
      
      // Construir a URL completa
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${baseUrl}${path}`;
      
      console.log(`Fazendo requisição para: ${url}`);
      
      // Criar um controlador de timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
      
      const fetchOptions: RequestInit = {
        ...options,
        headers,
        // Tentar com 'cors' primeiro
        mode: 'cors',
        // Omitir credenciais para evitar problemas com CORS
        credentials: 'omit',
        // Usar o sinal do controlador para timeout
        signal: controller.signal
      };

      console.log('Opções de fetch:', {
        url,
        method: options.method || 'GET',
        mode: fetchOptions.mode,
        credentials: fetchOptions.credentials
      });

      try {
        const response = await fetch(url, fetchOptions);
        // Limpar o timeout já que a resposta foi recebida
        clearTimeout(timeoutId);
        
        // Tenta obter o corpo da resposta como JSON
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          console.error('Erro ao processar JSON:', e);
          responseData = { success: false, message: 'Não foi possível ler a resposta' };
        }

        if (!response.ok) {
          console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          console.error('Detalhes da resposta:', responseData);
          // Retornar o erro em vez de lançar, para permitir tratamento adequado
          return {
            success: false,
            error: `Erro na API: ${response.status} - ${responseData.error || responseData.message || response.statusText}`
          };
        }

        return responseData;
      } catch (fetchError) {
        // Limpar o timeout em caso de erro também
        clearTimeout(timeoutId);
        
        // Tratar erros de rede
        console.error('Erro de rede na requisição:', fetchError);
        
        // Verificar se é um erro de CORS
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Erro desconhecido';
        if (errorMessage.includes('NetworkError') || 
            errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('CORS')) {
          return {
            success: false,
            error: 'Não foi possível conectar ao servidor Pixeldrain devido a restrições de CORS. Isso pode acontecer devido às políticas de segurança do navegador.'
          };
        }
        
        // Se for um erro de timeout (AbortError)
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return {
            success: false,
            error: 'A requisição excedeu o tempo limite. Verifique sua conexão com a internet ou tente novamente mais tarde.'
          };
        }
        
        // Qualquer outro erro
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      // Retornar um objeto de erro em vez de lançar exceção
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na requisição'
      };
    }
  }

  async listFiles(): Promise<{ files: PixeldrainFile[]; albums: PixeldrainAlbum[] }> {
    try {
      // Usar as rotas de API internas do Next.js
      const filesResponse = await this.fetchWithAuth('/files');
      const albumsResponse = await this.fetchWithAuth('/albums');
      
      console.log('Resposta da API de arquivos:', filesResponse);
      console.log('Resposta da API de álbuns:', albumsResponse);
      
      const albums = albumsResponse.albums || [];
      
      // Carregar os arquivos de cada álbum
      const albumsWithFiles = await Promise.all(
        albums.map(async (album: PixeldrainAlbum) => {
          try {
            const albumDetails = await this.getAlbum(album.id);
            return {
              ...album,
              files: albumDetails.files || []
            };
          } catch (error) {
            console.error(`Erro ao carregar arquivos do álbum ${album.id}:`, error);
            return album;
          }
        })
      );
      
      return {
        files: filesResponse.files || [],
        albums: albumsWithFiles
      };
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }
  }

  async getAlbum(albumId: string): Promise<PixeldrainAlbum> {
    try {
      const response = await this.fetchWithAuth(`/albums/${albumId}`);
      return response;
    } catch (error) {
      console.error(`Erro ao obter álbum ${albumId}:`, error);
      throw error;
    }
  }

  getDownloadUrl(fileId: string): string {
    return `https://pixeldrain.com/api/file/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fetchWithAuth(`/file/${fileId}`, {
      method: 'DELETE'
    });
  }

  async createAlbum(title: string, description: string): Promise<PixeldrainAlbum> {
    const data = await this.fetchWithAuth('/album', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });
    return data;
  }

  async addFileToAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`/album/${albumId}/${fileId}`, {
      method: 'PUT'
    });
  }

  async removeFileFromAlbum(fileId: string, albumId: string): Promise<void> {
    await this.fetchWithAuth(`/album/${albumId}/${fileId}`, {
      method: 'DELETE'
    });
  }
} 