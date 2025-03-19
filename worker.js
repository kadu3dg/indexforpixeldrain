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

async function handleRequest(request) {
  // Lidar com requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Extrair o endpoint e apiKey da URL
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    const apiKey = url.searchParams.get('apiKey');

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
    headers.set('Authorization', `Basic ${btoa(`:${apiKey}`)}`);
    
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