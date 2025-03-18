import { NextRequest, NextResponse } from 'next/server';

// Handler para requisições GET
export async function GET(request: NextRequest) {
  try {
    // Extrair o caminho da API do Pixeldrain da URL
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    const apiKey = url.searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro path não fornecido' },
        { status: 400 }
      );
    }

    // Construir a URL da API do Pixeldrain
    const pixeldrainUrl = `https://pixeldrain.com/api${path.startsWith('/') ? path : `/${path}`}`;
    
    console.log(`[Proxy] Realizando requisição para: ${pixeldrainUrl}`);
    console.log(`[Proxy] Usando API key: ${apiKey ? (apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5)) : 'não fornecida'}`);
    
    // Configurar os headers para a requisição
    const headers: HeadersInit = {
      'Accept': 'application/json', // Solicitar explicitamente JSON
    };
    
    // Adicionar header de autorização se a API key for fornecida
    if (apiKey) {
      const base64Auth = Buffer.from(`:${apiKey}`).toString('base64');
      headers['Authorization'] = `Basic ${base64Auth}`;
      console.log(`[Proxy] Header de autenticação adicionado: Basic ${base64Auth.substring(0, 10)}...`);
    } else {
      console.log('[Proxy] Aviso: API key não fornecida, a requisição pode falhar');
    }
    
    // Fazer a requisição para a API do Pixeldrain
    console.log(`[Proxy] Headers da requisição:`, headers);
    const response = await fetch(pixeldrainUrl, {
      method: 'GET',
      headers,
    });
    
    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy] Content-Type da resposta: ${contentType}`);
    console.log(`[Proxy] Status da resposta: ${response.status} ${response.statusText}`);
    
    // Obter todos os headers da resposta para debugging
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('[Proxy] Headers da resposta:', responseHeaders);
    
    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      console.error(`[Proxy] Erro na requisição: ${response.status} - ${response.statusText}`);
      
      let errorText;
      try {
        // Tentar ler o corpo como texto primeiro
        errorText = await response.text();
        console.error('[Proxy] Resposta de erro (primeiros 1000 caracteres):', errorText.substring(0, 1000));
        
        // Tentar converter o texto em JSON se possível
        if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            { 
              success: false, 
              error: `Erro na API: ${response.status} - ${errorJson.error || errorJson.message || response.statusText}` 
            },
            { status: response.status }
          );
        }
        
        // Se não for JSON, retornar o erro como texto
        return NextResponse.json(
          { 
            success: false, 
            error: `Erro na API: ${response.status} - ${response.statusText}`,
            errorDetails: errorText.slice(0, 500) // Limitamos a 500 caracteres para não sobrecarregar
          },
          { status: response.status }
        );
      } catch (e) {
        console.error('[Proxy] Erro ao processar resposta de erro:', e);
        return NextResponse.json(
          { 
            success: false, 
            error: `Erro na API: ${response.status} - ${response.statusText}` 
          },
          { status: response.status }
        );
      }
    }
    
    // Obter os dados da resposta
    let data;
    
    // Salvar a resposta como texto para debug em caso de erro
    let responseText;
    try {
      responseText = await response.clone().text();
      console.log('[Proxy] Resposta em texto (primeiros 500 caracteres):', responseText.substring(0, 500));
    } catch (e) {
      console.error('[Proxy] Erro ao clonar resposta para texto:', e);
    }
    
    // Verificar se é JSON ou outro tipo de conteúdo
    if (contentType.includes('application/json') || 
       (responseText && (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')))) {
      try {
        // Se temos o texto, tentar parseá-lo diretamente
        if (responseText) {
          try {
            data = JSON.parse(responseText);
            console.log('[Proxy] JSON parseado do texto salvo');
          } catch (parseError) {
            console.error('[Proxy] Erro ao parsear texto como JSON:', parseError);
            // Tentar com a resposta original como fallback
            data = await response.json();
          }
        } else {
          data = await response.json();
        }
        
        console.log('[Proxy] Dados JSON recebidos:', typeof data, Array.isArray(data) ? 'array' : 'objeto');
      } catch (error) {
        console.error('[Proxy] Erro ao processar resposta JSON:', error);
        
        // Se já temos o texto, usamos ele diretamente
        const textResponse = responseText || await response.text();
        console.error('[Proxy] Resposta bruta (primeiros 1000 caracteres):', textResponse.substring(0, 1000));
        
        if (textResponse.includes('DOCTYPE html') || textResponse.includes('<html')) {
          // É uma página HTML, provavelmente uma página de erro ou login
          return NextResponse.json(
            { 
              success: false, 
              error: 'A API retornou uma página HTML em vez de JSON. Provavelmente há um problema com a autenticação.',
              responseText: textResponse.substring(0, 1000)
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: 'Erro ao processar resposta JSON', responseText: textResponse.substring(0, 1000) },
          { status: 500 }
        );
      }
    } else {
      // Se não for JSON, tratar como texto ou binário
      try {
        const textResponse = responseText || await response.text();
        
        if (textResponse.includes('DOCTYPE html') || textResponse.includes('<html')) {
          // É uma página HTML, provavelmente uma página de erro ou login
          return NextResponse.json(
            { 
              success: false, 
              error: 'A API retornou uma página HTML em vez de JSON. Provavelmente há um problema com a autenticação.',
              responseText: textResponse.substring(0, 1000)
            },
            { status: 500 }
          );
        }
        
        if (textResponse.trim().startsWith('{') || textResponse.trim().startsWith('[')) {
          // Parece ser JSON mesmo que o Content-Type não indique isso
          try {
            data = JSON.parse(textResponse);
            console.log('[Proxy] Conteúdo parseado como JSON apesar do Content-Type');
          } catch (e) {
            console.error('[Proxy] Erro ao tentar parsear como JSON:', e);
            return NextResponse.json({
              success: false,
              error: 'Resposta parece ser JSON, mas não pôde ser parseada',
              responseText: textResponse.substring(0, 1000)
            }, { status: 500 });
          }
        } else {
          // Não é JSON, retornar como texto com sucesso
          return NextResponse.json({
            success: true,
            message: 'Conteúdo não-JSON recebido',
            contentType,
            text: textResponse.substring(0, 1000) // Limitamos a 1000 caracteres
          });
        }
      } catch (error) {
        console.error('[Proxy] Erro ao processar resposta de texto:', error);
        return NextResponse.json(
          { success: false, error: 'Não foi possível processar a resposta' },
          { status: 500 }
        );
      }
    }
    
    // Se chegamos aqui, temos um objeto data válido
    // Verificar se o objeto data tem o formato esperado para álbuns
    if (path.includes('/user/albums') && data) {
      // Se a resposta não tem o campo 'albums', possivelmente é um erro
      if (!data.albums && !data.error) {
        console.log('[Proxy] Resposta de álbuns sem campo "albums":', data);
        // Tentar corrigir o formato da resposta
        if (Array.isArray(data)) {
          // Se for um array, assumir que são os álbuns
          console.log('[Proxy] Convertendo array para formato { albums: [...] }');
          data = { success: true, albums: data };
        } else if (typeof data === 'object') {
          // Se for um objeto, verificar se tem propriedades esperadas de um álbum
          if (data.id || data.title) {
            console.log('[Proxy] Convertendo objeto para formato { albums: [obj] }');
            data = { success: true, albums: [data] };
          } else {
            // Caso contrário, adicionar flag de sucesso
            data.success = true;
          }
        }
      } else if (data.albums) {
        // Adicionar flag de sucesso se não existir
        if (data.success === undefined) {
          data.success = true;
        }
      }
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Proxy] Erro no servidor proxy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido no servidor proxy' 
      },
      { status: 500 }
    );
  }
}

// Handler para requisições POST
export async function POST(request: NextRequest) {
  try {
    // Extrair o caminho da API do Pixeldrain da URL
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    const apiKey = url.searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro path não fornecido' },
        { status: 400 }
      );
    }

    // Obter o corpo da requisição
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[Proxy] Erro ao processar corpo da requisição:', error);
      body = {};
    }

    // Construir a URL da API do Pixeldrain
    const pixeldrainUrl = `https://pixeldrain.com/api${path.startsWith('/') ? path : `/${path}`}`;
    
    console.log(`[Proxy] Realizando requisição POST para: ${pixeldrainUrl}`);
    
    // Configurar os headers para a requisição
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Adicionar header de autorização se a API key for fornecida
    if (apiKey) {
      const base64Auth = Buffer.from(`:${apiKey}`).toString('base64');
      headers['Authorization'] = `Basic ${base64Auth}`;
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(pixeldrainUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy] Content-Type da resposta: ${contentType}`);
    
    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      console.error(`[Proxy] Erro na requisição: ${response.status} - ${response.statusText}`);
      
      let errorText;
      try {
        // Tentar ler o corpo como texto primeiro
        errorText = await response.text();
        console.error('[Proxy] Resposta de erro:', errorText);
        
        // Tentar converter o texto em JSON se possível
        if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            { 
              success: false, 
              error: `Erro na API: ${response.status} - ${errorJson.error || errorJson.message || response.statusText}` 
            },
            { status: response.status }
          );
        }
        
        // Se não for JSON, retornar o erro como texto
        return NextResponse.json(
          { 
            success: false, 
            error: `Erro na API: ${response.status} - ${response.statusText}`,
            errorDetails: errorText.slice(0, 500) // Limitamos a 500 caracteres para não sobrecarregar
          },
          { status: response.status }
        );
      } catch (e) {
        console.error('[Proxy] Erro ao processar resposta de erro:', e);
        return NextResponse.json(
          { 
            success: false, 
            error: `Erro na API: ${response.status} - ${response.statusText}` 
          },
          { status: response.status }
        );
      }
    }
    
    // Obter os dados da resposta
    let data;
    
    // Verificar se é JSON ou outro tipo de conteúdo
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (error) {
        console.error('[Proxy] Erro ao processar resposta JSON:', error);
        const textResponse = await response.text();
        console.error('[Proxy] Resposta bruta:', textResponse.slice(0, 500));
        return NextResponse.json(
          { success: false, error: 'Erro ao processar resposta JSON', responseText: textResponse.slice(0, 500) },
          { status: 500 }
        );
      }
    } else {
      // Se não for JSON, tratar como texto ou binário
      try {
        const textResponse = await response.text();
        if (textResponse.trim().startsWith('{') || textResponse.trim().startsWith('[')) {
          // Parece ser JSON mesmo que o Content-Type não indique isso
          data = JSON.parse(textResponse);
        } else {
          // Não é JSON, retornar como texto com sucesso
          return NextResponse.json({
            success: true,
            message: 'Conteúdo não-JSON recebido',
            contentType,
            text: textResponse.slice(0, 1000) // Limitamos a 1000 caracteres
          });
        }
      } catch (error) {
        console.error('[Proxy] Erro ao processar resposta de texto:', error);
        return NextResponse.json(
          { success: false, error: 'Não foi possível processar a resposta' },
          { status: 500 }
        );
      }
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Proxy] Erro no servidor proxy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido no servidor proxy' 
      },
      { status: 500 }
    );
  }
}

// Handler para requisições PUT
export async function PUT(request: NextRequest) {
  try {
    // Extrair o caminho da API do Pixeldrain da URL
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    const apiKey = url.searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro path não fornecido' },
        { status: 400 }
      );
    }

    // Obter o corpo da requisição
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[Proxy] Erro ao processar corpo da requisição:', error);
      body = {};
    }

    // Construir a URL da API do Pixeldrain
    const pixeldrainUrl = `https://pixeldrain.com/api${path.startsWith('/') ? path : `/${path}`}`;
    
    console.log(`[Proxy] Realizando requisição PUT para: ${pixeldrainUrl}`);
    
    // Configurar os headers para a requisição
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Adicionar header de autorização se a API key for fornecida
    if (apiKey) {
      const base64Auth = Buffer.from(`:${apiKey}`).toString('base64');
      headers['Authorization'] = `Basic ${base64Auth}`;
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(pixeldrainUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    // Obter os dados da resposta
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('[Proxy] Erro ao processar resposta JSON:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao processar resposta' },
        { status: 500 }
      );
    }
    
    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      console.error(`[Proxy] Erro na requisição: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro na API: ${response.status} - ${data.error || data.message || response.statusText}` 
        },
        { status: response.status }
      );
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Proxy] Erro no servidor proxy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido no servidor proxy' 
      },
      { status: 500 }
    );
  }
}

// Handler para requisições DELETE
export async function DELETE(request: NextRequest) {
  try {
    // Extrair o caminho da API do Pixeldrain da URL
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    const apiKey = url.searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro path não fornecido' },
        { status: 400 }
      );
    }

    // Construir a URL da API do Pixeldrain
    const pixeldrainUrl = `https://pixeldrain.com/api${path.startsWith('/') ? path : `/${path}`}`;
    
    console.log(`[Proxy] Realizando requisição DELETE para: ${pixeldrainUrl}`);
    
    // Configurar os headers para a requisição
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Adicionar header de autorização se a API key for fornecida
    if (apiKey) {
      const base64Auth = Buffer.from(`:${apiKey}`).toString('base64');
      headers['Authorization'] = `Basic ${base64Auth}`;
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(pixeldrainUrl, {
      method: 'DELETE',
      headers,
    });
    
    // Obter os dados da resposta
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('[Proxy] Erro ao processar resposta JSON:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao processar resposta' },
        { status: 500 }
      );
    }
    
    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      console.error(`[Proxy] Erro na requisição: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro na API: ${response.status} - ${data.error || data.message || response.statusText}` 
        },
        { status: response.status }
      );
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Proxy] Erro no servidor proxy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido no servidor proxy' 
      },
      { status: 500 }
    );
  }
} 