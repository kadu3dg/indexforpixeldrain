export async function onRequest(context) {
  try {
    // Obter a chave da API do cabeçalho de autorização
    const authHeader = context.request.headers.get('Authorization');
    let apiKey = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    }

    if (!apiKey) {
      console.error('API key não fornecida');
      return new Response(
        JSON.stringify({ error: 'API key não fornecida' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    console.log('Fazendo requisição para a API do Pixeldrain com a chave:', apiKey.substring(0, 3) + '...');

    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch('https://pixeldrain.com/api/user/lists', {
      headers: {
        'Authorization': `Basic ${btoa(`:${apiKey}`)}`
      }
    });

    // Log da resposta para debug
    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    console.log(`Resposta da API do Pixeldrain: ${responseStatus} ${responseStatusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da API do Pixeldrain:', errorText);
      return new Response(
        JSON.stringify({ error: `Erro na API do Pixeldrain: ${responseStatus} ${responseStatusText}`, details: errorText }),
        { 
          status: responseStatus,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const data = await response.json();
    console.log('Dados recebidos da API do Pixeldrain:', JSON.stringify(data).substring(0, 200) + '...');

    // Verificar se a resposta contém a propriedade 'success'
    if (data && typeof data.success === 'boolean' && !data.success) {
      console.error('Erro retornado pela API do Pixeldrain:', data.message || 'Erro desconhecido');
      return new Response(
        JSON.stringify({ error: data.message || 'Erro desconhecido' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Verificar se a resposta contém a propriedade 'lists'
    if (!data || !data.lists) {
      console.error('Resposta da API do Pixeldrain não contém a propriedade "lists"');
      return new Response(
        JSON.stringify({ error: 'Formato de resposta inválido', data }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Transformar as listas em álbuns
    const albums = data.lists.map((list) => ({
      id: list.id,
      title: list.title,
      description: list.description,
      date_created: list.date_created
    }));

    return new Response(
      JSON.stringify({ albums }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message || String(error) }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
} 