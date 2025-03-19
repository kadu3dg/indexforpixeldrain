addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// API key fixa para todos os usuários
const DEFAULT_API_KEY = 'aa73d120-100e-426e-93ba-c7e1569b0322';

async function handleRequest(request) {
  // Lidar com requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Extrair o endpoint da URL
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');

    if (!endpoint) {
      return new Response(JSON.stringify({
        error: 'Endpoint não especificado',
        files: [],
        lists: []
      }), { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Construir a URL do Pixeldrain corretamente
    let pixeldrainUrl;
    if (endpoint.startsWith('/')) {
      pixeldrainUrl = `https://pixeldrain.com/api${endpoint}`;
    } else {
      pixeldrainUrl = `https://pixeldrain.com/api/${endpoint}`;
    }
    
    console.log('Fazendo requisição para: ' + pixeldrainUrl);
    
    // Preparar os headers para a requisição
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Basic ${btoa(`:${DEFAULT_API_KEY}`)}`);
    
    // Fazer a requisição para o Pixeldrain
    const response = await fetch(pixeldrainUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.body : null,
    });

    // Ler o corpo da resposta
    const responseBody = await response.text();
    
    // Tentar fazer parse do JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseBody);
    } catch (e) {
      // Se não for JSON válido, criar uma resposta padrão
      if (endpoint.includes('files')) {
        jsonResponse = { success: false, error: 'Erro ao processar resposta', files: [] };
      } else if (endpoint.includes('lists')) {
        jsonResponse = { success: false, error: 'Erro ao processar resposta', lists: [] };
      } else {
        jsonResponse = { success: false, error: 'Erro ao processar resposta' };
      }
    }
    
    // Garantir que os arrays esperados existam sempre
    if (endpoint.includes('files') && !jsonResponse.files) {
      jsonResponse.files = [];
    }
    if (endpoint.includes('lists') && !jsonResponse.lists) {
      jsonResponse.lists = [];
    }
    
    // Garantir que o campo 'files' dentro de cada item de 'lists' nunca seja nulo
    if (jsonResponse.lists && Array.isArray(jsonResponse.lists)) {
      jsonResponse.lists = jsonResponse.lists.map(list => {
        if (list.files === null || list.files === undefined) {
          list.files = [];
        }
        return list;
      });
    }
    
    // Se for uma requisição para detalhes de um álbum, garantir que os arquivos tenham todos os campos necessários
    if (endpoint.startsWith('/list/') && !endpoint.includes('/file/')) {
      if (jsonResponse.files && Array.isArray(jsonResponse.files)) {
        jsonResponse.files = jsonResponse.files.map(file => {
          return {
            ...file,
            name: file.name || 'Sem nome',
            size: file.size || 0,
            views: file.views || 0,
            downloads: file.downloads || 0,
            date_upload: file.date_upload || new Date().toISOString(),
            date_last_view: file.date_last_view || new Date().toISOString(),
            mime_type: file.mime_type || 'application/octet-stream',
            hash_sha256: file.hash_sha256 || '',
            can_edit: file.can_edit || false
          };
        });
      }
    }
    
    // Criar uma nova resposta com os headers CORS
    const responseHeaders = new Headers();
    Object.keys(corsHeaders).forEach(key => {
      responseHeaders.set(key, corsHeaders[key]);
    });
    responseHeaders.set('Content-Type', 'application/json');

    return new Response(JSON.stringify(jsonResponse), {
      status: response.ok ? 200 : response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Erro no worker:', error);
    
    // Responder com uma estrutura que o frontend espera
    const errorResponse = {
      error: error.message,
      files: [],
      lists: []
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
} 