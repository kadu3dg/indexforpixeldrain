export interface PixeldrainFile {
  id: string;
  name: string;
  size: number;
  views: number;
  date_upload?: string;
  date_created?: string;
  date_last_view?: string;
  mime_type: string;
  description?: string;
  thumbnail_href?: string;
  bandwidth_used?: number;
  detail_href?: string;
}

export interface PixeldrainListItem {
  id: string;
  description?: string;
}

export interface PixeldrainAlbum {
  id: string;
  title: string;
  description?: string;
  date_created?: string;
  file_count?: number;
  files?: PixeldrainFile[];
  count?: number;
}

export class PixeldrainService {
  private apiKey: string;
  private baseUrl: string = 'https://pixeldrain.com/api';

  constructor(apiKey?: string) {
    if (apiKey && apiKey.trim().length > 0) {
      this.apiKey = apiKey.trim();
    } else {
      this.apiKey = '';
    }
    
    console.log('PixeldrainService inicializado' + (this.apiKey ? 
      ' com a chave: ' + this.apiKey.substring(0, 5) + '...' + this.apiKey.substring(this.apiKey.length - 5) :
      ' sem chave API (modo anônimo)'));
  }

  /**
   * Obtém a lista de arquivos do usuário autenticado
   */
  async getUserFiles() {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível obter arquivos do usuário.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível obter arquivos do usuário.',
          files: []
        };
      }

      // Este é o endpoint correto mencionado na documentação
      const response = await this.fetchWithAuth('/user/files');
      console.log('Resposta da API ao obter arquivos do usuário:', response);
      
      if (response.success === false) {
        console.error('Erro ao buscar arquivos do usuário:', response.error);
        return {
          success: false,
          error: response.error || 'Erro ao buscar arquivos do usuário',
          files: []
        };
      }
      
      return {
        success: true,
        files: Array.isArray(response) ? response : []
      };
    } catch (error) {
      console.error('Erro crítico ao buscar arquivos do usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        files: []
      };
    }
  }

  /**
   * Obtém as listas (álbuns) do usuário autenticado
   */
  async getUserLists() {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível obter listas do usuário.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível obter listas do usuário.',
          albums: []
        };
      }

      // Este é o endpoint correto mencionado na documentação
      const response = await this.fetchWithAuth('/user/lists');
      console.log('Resposta da API ao obter listas do usuário:', response);
      
      if (response.success === false) {
        console.error('Erro ao buscar listas do usuário:', response.error);
        return {
          success: false,
          error: response.error || 'Erro ao buscar listas do usuário',
          albums: []
        };
      }
      
      return {
        success: true,
        albums: Array.isArray(response) ? response : []
      };
    } catch (error) {
      console.error('Erro crítico ao buscar listas do usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        albums: []
      };
    }
  }

  /**
   * Obtém informações detalhadas de um arquivo específico
   */
  async getFileInfo(fileId: string) {
    try {
      if (!fileId) {
        console.error('ID do arquivo não fornecido');
        return {
          success: false,
          error: 'ID do arquivo não fornecido'
        };
      }

      const response = await this.fetchWithAuth(`/file/${fileId}/info`);
      console.log(`Resposta da API ao obter informações do arquivo ${fileId}:`, response);
      
      if (response.success === false) {
        console.error(`Erro ao buscar informações do arquivo ${fileId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao buscar informações do arquivo ${fileId}`
        };
      }
      
      return {
        success: true,
        file: response
      };
    } catch (error) {
      console.error(`Erro crítico ao buscar informações do arquivo ${fileId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Obtém detalhes de uma lista (álbum) específica
   */
  async getListDetails(listId: string) {
    try {
      if (!listId) {
        console.error('ID da lista não fornecido');
        return {
          success: false,
          error: 'ID da lista não fornecido',
          album: null
        };
      }

      const response = await this.fetchWithAuth(`/list/${listId}`);
      console.log(`Resposta da API ao obter detalhes da lista ${listId}:`, response);
      
      if (response.success === false) {
        console.error(`Erro ao buscar detalhes da lista ${listId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao buscar detalhes da lista ${listId}`,
          album: null
        };
      }
      
      return {
        success: true,
        album: response
      };
    } catch (error) {
      console.error(`Erro crítico ao buscar detalhes da lista ${listId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        album: null
      };
    }
  }

  /**
   * Cria uma nova lista (álbum)
   */
  async createList(title: string, description: string = '', files: PixeldrainListItem[] = []) {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível criar lista.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível criar lista.',
          listId: null
        };
      }

      if (!title) {
        console.error('Título da lista não fornecido');
        return {
          success: false,
          error: 'Título da lista não fornecido',
          listId: null
        };
      }

      const data = {
        title,
        description,
        anonymous: false,
        files
      };

      const response = await this.fetchWithAuth('/list', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      console.log('Resposta da API ao criar lista:', response);
      
      if (response.success === false) {
        console.error('Erro ao criar lista:', response.error || response.message);
        return {
          success: false,
          error: response.error || response.message || 'Erro desconhecido ao criar lista',
          listId: null
        };
      }
      
      return {
        success: true,
        listId: response.id
      };
    } catch (error) {
      console.error('Erro crítico ao criar lista:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        listId: null
      };
    }
  }

  /**
   * Adiciona um arquivo a uma lista (álbum)
   */
  async addFileToList(listId: string, fileId: string, description: string = '') {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível adicionar arquivo à lista.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível adicionar arquivo à lista.'
        };
      }

      if (!listId) {
        console.error('ID da lista não fornecido');
        return {
          success: false,
          error: 'ID da lista não fornecido'
        };
      }

      if (!fileId) {
        console.error('ID do arquivo não fornecido');
        return {
          success: false,
          error: 'ID do arquivo não fornecido'
        };
      }

      // Primeiro, obtemos os detalhes da lista
      const listDetails = await this.getListDetails(listId);
      if (!listDetails.success) {
        return {
          success: false,
          error: `Erro ao obter detalhes da lista: ${listDetails.error}`
        };
      }

      // Verificamos se o arquivo já está na lista
      const list = listDetails.album;
      const files = list.files || [];
      const fileExists = files.some((file: PixeldrainFile) => file.id === fileId);
      
      if (fileExists) {
        console.log(`Arquivo ${fileId} já existe na lista ${listId}`);
        return {
          success: true,
          message: `Arquivo já existe na lista`
        };
      }

      // Adicionamos o arquivo à lista de arquivos
      files.push({
        id: fileId,
        description
      });

      // Atualizamos a lista com a nova lista de arquivos
      const response = await this.fetchWithAuth(`/list/${listId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: list.title,
          description: list.description,
          files
        })
      });

      console.log(`Resposta da API ao adicionar arquivo ${fileId} à lista ${listId}:`, response);
      
      if (response.success === false) {
        console.error(`Erro ao adicionar arquivo ${fileId} à lista ${listId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao adicionar arquivo à lista`
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`Erro crítico ao adicionar arquivo ${fileId} à lista ${listId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Remove um arquivo de uma lista (álbum)
   */
  async removeFileFromList(listId: string, fileId: string) {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível remover arquivo da lista.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível remover arquivo da lista.'
        };
      }

      if (!listId) {
        console.error('ID da lista não fornecido');
        return {
          success: false,
          error: 'ID da lista não fornecido'
        };
      }

      if (!fileId) {
        console.error('ID do arquivo não fornecido');
        return {
          success: false,
          error: 'ID do arquivo não fornecido'
        };
      }

      // Primeiro, obtemos os detalhes da lista
      const listDetails = await this.getListDetails(listId);
      if (!listDetails.success) {
        return {
          success: false,
          error: `Erro ao obter detalhes da lista: ${listDetails.error}`
        };
      }

      // Removemos o arquivo da lista de arquivos
      const list = listDetails.album;
      const files = (list.files || []).filter((file: PixeldrainFile) => file.id !== fileId);

      // Atualizamos a lista com a nova lista de arquivos
      const response = await this.fetchWithAuth(`/list/${listId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: list.title,
          description: list.description,
          files
        })
      });

      console.log(`Resposta da API ao remover arquivo ${fileId} da lista ${listId}:`, response);
      
      if (response.success === false) {
        console.error(`Erro ao remover arquivo ${fileId} da lista ${listId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao remover arquivo da lista`
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`Erro crítico ao remover arquivo ${fileId} da lista ${listId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Exclui um arquivo
   */
  async deleteFile(fileId: string) {
    try {
      if (!this.apiKey) {
        console.error('API key não fornecida. Impossível excluir arquivo.');
        return {
          success: false,
          error: 'API key não fornecida. Impossível excluir arquivo.'
        };
      }

      if (!fileId) {
        console.error('ID do arquivo não fornecido');
        return {
          success: false,
          error: 'ID do arquivo não fornecido'
        };
      }

      const response = await this.fetchWithAuth(`/file/${fileId}`, {
        method: 'DELETE'
      });

      console.log(`Resposta da API ao excluir arquivo ${fileId}:`, response);
      
      if (response.success === false) {
        console.error(`Erro ao excluir arquivo ${fileId}:`, response.error);
        return {
          success: false,
          error: response.error || `Erro ao excluir arquivo`
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`Erro crítico ao excluir arquivo ${fileId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Obtém a URL para download direto de um arquivo
   */
  getFileUrl(fileId: string, download: boolean = false): string {
    if (!fileId) return '';
    
    const url = `${this.baseUrl}/file/${fileId}`;
    return download ? `${url}?download` : url;
  }

  /**
   * Obtém a URL para thumbnail de um arquivo
   */
  getThumbnailUrl(fileId: string, width: number = 128, height: number = 128): string {
    if (!fileId) return '';
    
    // Width e height precisam ser múltiplos de 16, máximo 128
    width = Math.min(128, Math.round(width / 16) * 16);
    height = Math.min(128, Math.round(height / 16) * 16);
    
    return `${this.baseUrl}/file/${fileId}/thumbnail?width=${width}&height=${height}`;
  }

  /**
   * Método auxiliar para fazer requisições autenticadas
   */
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    try {
      // Prepara o caminho do endpoint
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = new URL(path, this.baseUrl);
      
      // Configurar os cabeçalhos
      const headers = new Headers(options.headers);
      headers.append('Accept', 'application/json');
      
      // Adicionar autenticação se a apiKey estiver presente
      if (this.apiKey) {
        const authHeader = `Basic ${Buffer.from(`:${this.apiKey}`).toString('base64')}`;
        headers.append('Authorization', authHeader);
      }
      
      // Fazer a requisição diretamente para a API do Pixeldrain
      const response = await fetch(url.toString(), {
        ...options,
        headers,
      });
      
      // Clonar a resposta para permitir múltiplas leituras
      const clonedResponse = response.clone();
      
      // Verificar se a resposta é bem-sucedida
      if (!response.ok) {
        let errorText;
        
        try {
          // Tenta ler a resposta como texto
          errorText = await clonedResponse.text();
          
          // Verifica se o texto pode ser JSON
          if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
            try {
              // Tenta converter o texto para JSON
              const errorJson = JSON.parse(errorText);
              return {
                success: false,
                error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
                details: errorJson
              };
            } catch (jsonError) {
              console.error('Erro ao processar JSON de erro:', jsonError);
            }
          }
          
          // Se for HTML ou texto puro, retorna mensagem de erro
          if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
            console.error('API retornou HTML em vez de JSON', errorText.substring(0, 500));
            return {
              success: false,
              error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
              text: errorText.substring(0, 500)
            };
          }
          
          // Para outros tipos de texto
          return {
            success: false,
            error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
            text: errorText.substring(0, 500)
          };
        } catch (textError) {
          console.error('Erro ao ler resposta como texto:', textError);
          return {
            success: false,
            error: `API do Pixeldrain retornou erro ${response.status} sem dados adicionais`
          };
        }
      }
      
      // Processar a resposta bem-sucedida
      try {
        const contentType = response.headers.get('content-type') || '';
        
        // Se o content-type for JSON, processar como JSON
        if (contentType.includes('application/json')) {
          const data = await response.json();
          return data;
        } else {
          // Para outros tipos, retornar o texto e informar o content-type
          const textData = await clonedResponse.text();
          
          // Tentar interpretar como JSON mesmo se o content-type não for JSON
          if (textData.trim().startsWith('{') || textData.trim().startsWith('[')) {
            try {
              const jsonData = JSON.parse(textData);
              return jsonData;
            } catch (jsonError) {
              console.error('Erro ao interpretar como JSON:', jsonError);
            }
          }
          
          // Fallback para texto
          return {
            success: true,
            contentType,
            text: textData
          };
        }
      } catch (dataError) {
        console.error('Erro ao processar dados da resposta:', dataError);
        return {
          success: false,
          error: 'Erro ao processar resposta da API do Pixeldrain',
          details: dataError instanceof Error ? dataError.message : String(dataError)
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na requisição'
      };
    }
  }

  /**
   * Método para fazer requisições através do proxy interno
   */
  private async fetchWithProxy(path: string, options: RequestInit = {}) {
    return this.fetchWithAuth(path, options);
  }

  /**
   * Método para carregar todos os arquivos e listas do usuário
   */
  async getAllUserContent() {
    try {
      const [filesResult, listsResult] = await Promise.all([
        this.getUserFiles(),
        this.getUserLists()
      ]);
      
      const files = filesResult.success ? filesResult.files : [];
      const albums = listsResult.success ? listsResult.albums : [];
      
      // Carregar os detalhes de cada lista para obter os arquivos de cada uma
      const albumsWithDetails = await Promise.all(
        albums.map(async (album) => {
          try {
            const details = await this.getListDetails(album.id);
            if (details.success && details.album) {
              return details.album;
            }
            return album;
          } catch (error) {
            console.error(`Erro ao carregar detalhes do álbum ${album.id}:`, error);
            return album;
          }
        })
      );
      
      return {
        success: true,
        files,
        albums: albumsWithDetails
      };
    } catch (error) {
      console.error('Erro ao carregar conteúdo do usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        files: [],
        albums: []
      };
    }
  }
} 