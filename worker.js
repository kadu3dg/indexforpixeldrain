// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleRequest(request) {
  // Lidar com requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Extrair o endpoint da URL original
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/proxy/', '');
    
    // Construir a URL do Pixeldrain
    const pixeldrainUrl = `https://pixeldrain.com/api/${endpoint}`;
    
    // Copiar os headers originais
    const headers = new Headers(request.headers);
    
    // Adicionar a autenticação
    headers.set('Authorization', 'Basic ' + btoa(':aa73d120-100e-426e-93ba-c7e1569b0322'));
    
    // Fazer a requisição para o Pixeldrain
    const response = await fetch(pixeldrainUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.body : null,
    });

    // Criar uma nova resposta com os headers CORS
    const responseHeaders = new Headers(response.headers);
    Object.keys(corsHeaders).forEach(key => {
      responseHeaders.set(key, corsHeaders[key]);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
}); 