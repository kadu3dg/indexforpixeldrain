export async function onRequest(context) {
  try {
    // Obter o ID do álbum da URL
    const url = new URL(context.request.url);
    const pathParts = url.pathname.split('/');
    const albumId = pathParts[pathParts.length - 1];
    
    if (!albumId) {
      return new Response(
        JSON.stringify({ error: 'ID do álbum não fornecido' }),
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

    console.log(`Obtendo detalhes do álbum ${albumId} com a chave API:`, apiKey.substring(0, 3) + '...');

    // Fazer a requisição para a API do Pixeldrain
    // A API do Pixeldrain usa "list" para obter os detalhes de um álbum
    const response = await fetch(`https://pixeldrain.com/api/list/${albumId}?include_files=true`, {
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
    console.log(`Dados do álbum ${albumId} recebidos:`, JSON.stringify(data).substring(0, 200) + '...');

    // Transformar a resposta no formato esperado
    const album = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      date_created: data.date_created,
      files: data.files || []
    };

    return new Response(
      JSON.stringify(album),
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