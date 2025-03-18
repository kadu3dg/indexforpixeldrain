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
  // Chave API do Pixeldrain - IMPORTANTE: verifique se a chave está correta
  // Formato da chave: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (UUID)
  private apiKey: string;
  private baseUrl: string = 'https://pixeldrain.com/api';
  private useProxy: boolean = true; // Usar o proxy para evitar problemas de CORS

  // É possível usar a aplicação sem API key, mas a autenticação será limitada
  constructor(apiKey?: string) {
    // Verificar se a apiKey foi fornecida, caso contrário usar a default
    if (apiKey && apiKey.trim().length > 0) {
      this.apiKey = apiKey.trim();
    } else {
      // A chave default está definida aqui
      this.apiKey = 'a79a8e71-2813-4295-8617-bf9a23830060';
    }
    
    console.log('PixeldrainService inicializado com a chave: ' + 
      this.apiKey.substring(0, 5) + '...' + this.apiKey.substring(this.apiKey.length - 5));
  }

  // Método para obter os arquivos do usuário
  async getFiles() {
    try {
      // Usar a API real do Pixeldrain
      const response = await this.fetchWithAuth('/user/files');
      console.log('Resposta da API de arquivos:', response);
      
      // Verificar se a resposta foi bem-sucedida
      if (response.success === false) {
        console.error('Erro ao buscar arquivos:', response.error);
        return {
          success: false,
          error: response.error || 'Erro ao buscar arquivos do usuário',
          files: []
        };
      }
      
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
      console.log('Tentando buscar álbuns com a chave API:', 
        this.apiKey.substring(0, 5) + '...' + this.apiKey.substring(this.apiKey.length - 5));
      
      // IMPORTANTE: A rota correta para os álbuns do usuário é /user/albums
      const response = await this.fetchWithAuth('/user/albums');
      console.log('Resposta da API de álbuns:', response);
      
      // Verificar se a resposta contém erro
      if (response.success === false) {
        console.error('Erro ao buscar álbuns:', response.error);
        
        // Verificar se o erro é de autenticação
        if (response.error && (
          response.error.includes('401') || 
          response.error.includes('autenticação') || 
          response.error.includes('authentication')
        )) {
          return {
            success: false,
            error: `Erro de autenticação. Verifique se a chave API '${this.apiKey.substring(0, 5)}...' está correta.`,
            albums: []
          };
        }
        
        return {
          success: false,
          error: response.error || 'Erro ao buscar álbuns do usuário',
          albums: []
        };
      }
      
      // Verificar se a resposta contém uma mensagem HTML (indica erro na API)
      if (response.text && response.text.includes('<!DOCTYPE')) {
        console.error('A API retornou HTML em vez de JSON:', response.text.substring(0, 100));
        return {
          success: false,
          error: 'A API do Pixeldrain retornou HTML em vez de JSON. Possível problema com a autenticação ou a URL.',
          albums: []
        };
      }
      
      // Se a resposta não tem álbuns, mas não tem erro explícito, pode ser que seja um array vazio
      if (!response.albums && !response.error) {
        // Se a resposta é um array, assumimos que são os álbuns
        if (Array.isArray(response)) {
          console.log('Resposta é um array, convertendo para formato esperado');
          return {
            success: true,
            albums: response
          };
        }
        
        // Se não foi detectado como erro, mas não temos álbuns, retornar array vazio
        console.log('Resposta não contém álbuns nem erros, retornando array vazio');
        return {
          success: true,
          albums: []
        };
      }
      
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
      // Verificar se o ID do álbum foi fornecido
      if (!albumId) {
        console.error('ID do álbum não fornecido');
        return {
          success: false,
          error: 'ID do álbum não fornecido',
          files: []
        };
      }
      
      // Usar a API real do Pixeldrain
      const response = await this.fetchWithAuth(`/album/${albumId}`);
      console.log(`Resposta da API para o álbum ${albumId}:`, response);
      
      // Verificar se a resposta contém erro
      if (response.success === false) {
        console.error(`Erro ao buscar arquivos do álbum ${albumId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao buscar arquivos do álbum ${albumId}`,
          files: []
        };
      }
      
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
      // Verificar se a API key está definida e não vazia
      if (!this.apiKey || !this.apiKey.trim()) {
        console.error('API key está vazia');
        return {
          success: false,
          error: 'API key não fornecida'
        };
      }

      // Verificar se a API key tem o formato correto de UUID
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(this.apiKey)) {
        console.error('Formato da API key é inválido. Deve ser um UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        return {
          success: false,
          error: 'Formato da API key é inválido. Verifique se a chave está correta.'
        };
      }

      // Remover o trailing slash do endpoint se existir
      const path = endpoint.startsWith('/') 
        ? endpoint 
        : `/${endpoint}`;

      // Sempre usar o proxy para evitar problemas de CORS
      this.useProxy = true;
      return this.fetchWithProxy(path, options);
    } catch (error) {
      console.error('Erro na requisição:', error);
      // Retornar um objeto de erro em vez de lançar exceção
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na requisição'
      };
    }
  }

  // Método para fazer requisições através do proxy interno
  private async fetchWithProxy(path: string, options: RequestInit = {}) {
    try {
      // Construir a URL para o proxy
      const proxyUrl = new URL('/api/pixeldrain-proxy', window.location.origin);
      
      // Adicionar o caminho da API e a apiKey como parâmetros de consulta
      proxyUrl.searchParams.append('path', path);
      proxyUrl.searchParams.append('apiKey', this.apiKey);
      
      console.log(`[Proxy] Fazendo requisição para: ${proxyUrl.toString()}`);
      
      // Configurar as opções da requisição
      const fetchOptions: RequestInit = {
        ...options,
        headers: {
          'Accept': 'application/json', // Solicitar explicitamente JSON
          ...options.headers
        },
      };
      
      // Fazer a requisição para o proxy
      const response = await fetch(proxyUrl.toString(), fetchOptions);
      
      // Processar a resposta
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('[Proxy] Erro ao processar resposta JSON do proxy:', error);
        
        // Se a resposta não é JSON, pode ser uma página HTML ou outro formato
        const textResponse = await response.text();
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          console.error('[Proxy] Resposta contém HTML:', textResponse.substring(0, 500));
          return {
            success: false,
            error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
            text: textResponse.substring(0, 1000)
          };
        }
        
        return {
          success: false,
          error: 'Erro ao processar resposta do proxy. A resposta não está em formato JSON válido.',
          text: textResponse.substring(0, 500)
        };
      }
      
      // Verificar se houve erro na requisição
      if (!response.ok) {
        console.error(`[Proxy] Erro na requisição: ${response.status} - ${response.statusText}`);
        return {
          success: false,
          error: data.error || `Erro ${response.status}: ${response.statusText}`
        };
      }
      
      return data;
    } catch (error) {
      console.error('[Proxy] Erro ao usar proxy:', error);
      return {
        success: false,
        error: error instanceof Error 
          ? `Erro ao usar proxy: ${error.message}` 
          : 'Erro desconhecido ao usar proxy'
      };
    }
  }

  async listFiles(): Promise<{ files: PixeldrainFile[]; albums: PixeldrainAlbum[] }> {
    try {
      // Usar as rotas de API internas do Next.js
      const filesResponse = await this.fetchWithAuth('/user/files');
      const albumsResponse = await this.fetchWithAuth('/user/albums');
      
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
      const response = await this.fetchWithAuth(`/album/${albumId}`);
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