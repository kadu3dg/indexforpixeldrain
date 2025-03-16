export async function onRequestPost(context) {
  try {
    // Obter o corpo da requisição
    const requestData = await context.request.json();
    const { apiKey } = requestData;

    if (!apiKey) {
      console.error('Chave API não fornecida');
      return new Response(
        JSON.stringify({ success: false, error: 'Chave API não fornecida' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    console.log('Verificando chave API:', apiKey.substring(0, 3) + '...');

    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch('https://pixeldrain.com/api/user/files', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`:${apiKey}`)}`,
        'Accept': 'application/json',
      },
    });

    // Log da resposta para debug
    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    console.log(`Resposta da API do Pixeldrain: ${responseStatus} ${responseStatusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('Erro na resposta da API do Pixeldrain:', errorData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorData.message || 'Erro na autenticação',
          status: responseStatus
        }),
        { 
          status: responseStatus,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const data = await response.json();
    console.log('Autenticação bem-sucedida');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Autenticação bem-sucedida',
        user: data.user || {}
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('Erro na API de autenticação:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro interno do servidor',
        details: error.message || String(error)
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 