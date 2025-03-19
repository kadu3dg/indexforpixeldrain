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
      return new Response('Endpoint não especificado', { status: 400 });
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
    
    // Criar uma nova resposta com os headers CORS
    const responseHeaders = new Headers();
    Object.keys(corsHeaders).forEach(key => {
      responseHeaders.set(key, corsHeaders[key]);
    });
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Erro no worker:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
} 