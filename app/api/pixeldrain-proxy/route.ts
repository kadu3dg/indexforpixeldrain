import { NextRequest, NextResponse } from 'next/server';

// Adicionar a configuração para tornar a rota dinâmica
export const dynamic = 'force-dynamic';

// Função para lidar com erros de forma consistente
function handleError(error: unknown, message: string = 'Erro no proxy da API do Pixeldrain') {
  console.error(`[Proxy Error] ${message}:`, error);
  return NextResponse.json(
    { 
      success: false, 
      error: error instanceof Error ? error.message : message 
    },
    { status: 500 }
  );
}

// Processa as requisições GET
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const apiKey = searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro "path" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Proxy GET] Processando requisição para: ${path}`);
    
    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(path, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey && apiKey.trim()) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
      console.log(`[Proxy GET] Usando autenticação com a chave: ${apiKey.substring(0, 5)}...`);
    } else {
      console.log('[Proxy GET] Requisição sem autenticação');
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
    });
    
    // Clonar a resposta antes de processar para evitar "body stream already read"
    const clonedResponse = response.clone();
    
    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy GET] Status: ${response.status}, Content-Type: ${contentType}`);
    
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
            return NextResponse.json(
              { 
                success: false, 
                error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
                details: errorJson
              },
              { status: response.status }
            );
          } catch (jsonError) {
            // Se falhar ao converter, retorna o texto original
            console.error('[Proxy GET] Erro ao processar JSON de erro:', jsonError);
          }
        }
        
        // Se for HTML ou texto puro, retorna mensagem de erro com parte do texto
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          console.error('[Proxy GET] API retornou HTML em vez de JSON', errorText.substring(0, 500));
          return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
              text: errorText.substring(0, 500),
              status: response.status
            },
            { status: 422 }
          );
        }
        
        // Para outros tipos de texto
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
            text: errorText.substring(0, 500)
          },
          { status: response.status }
        );
      } catch (textError) {
        console.error('[Proxy GET] Erro ao ler resposta como texto:', textError);
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro ${response.status} sem dados adicionais`
          },
          { status: response.status }
        );
      }
    }
    
    // Processar a resposta bem-sucedida
    try {
      // Se o content-type for JSON, processar como JSON
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        // Para outros tipos, retornar o texto e informar o content-type
        const textData = await clonedResponse.text();
        
        // Tentar interpretar como JSON mesmo se o content-type não for JSON
        if (textData.trim().startsWith('{') || textData.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(textData);
            return NextResponse.json(jsonData);
          } catch (jsonError) {
            console.error('[Proxy GET] Erro ao interpretar como JSON:', jsonError);
          }
        }
        
        // Fallback para texto
        return NextResponse.json({
          success: true,
          contentType,
          text: textData
        });
      }
    } catch (dataError) {
      console.error('[Proxy GET] Erro ao processar dados da resposta:', dataError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao processar resposta da API do Pixeldrain',
          details: dataError instanceof Error ? dataError.message : String(dataError)
        },
        { status: 422 }
      );
    }
  } catch (error) {
    return handleError(error, 'Erro ao processar requisição GET');
  }
}

// Processa as requisições POST
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const apiKey = searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro "path" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Proxy POST] Processando requisição para: ${path}`);
    
    // Clonar o corpo da requisição para enviar à API do Pixeldrain
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('[Proxy POST] Corpo da requisição:', JSON.stringify(requestBody).substring(0, 200));
    } catch (bodyError) {
      console.log('[Proxy POST] Requisição sem corpo JSON ou com corpo vazio');
    }
    
    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(path, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey && apiKey.trim()) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
      console.log(`[Proxy POST] Usando autenticação com a chave: ${apiKey.substring(0, 5)}...`);
    } else {
      console.log('[Proxy POST] Requisição sem autenticação');
    }
    
    // Preparar as opções da requisição
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
    };
    
    // Adicionar o corpo se existir
    if (requestBody) {
      fetchOptions.body = JSON.stringify(requestBody);
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), fetchOptions);
    
    // Clonar a resposta antes de processar para evitar "body stream already read"
    const clonedResponse = response.clone();
    
    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy POST] Status: ${response.status}, Content-Type: ${contentType}`);
    
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
            return NextResponse.json(
              { 
                success: false, 
                error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
                details: errorJson
              },
              { status: response.status }
            );
          } catch (jsonError) {
            // Se falhar ao converter, retorna o texto original
            console.error('[Proxy POST] Erro ao processar JSON de erro:', jsonError);
          }
        }
        
        // Se for HTML ou texto puro, retorna mensagem de erro com parte do texto
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          console.error('[Proxy POST] API retornou HTML em vez de JSON', errorText.substring(0, 500));
          return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
              text: errorText.substring(0, 500),
              status: response.status
            },
            { status: 422 }
          );
        }
        
        // Para outros tipos de texto
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
            text: errorText.substring(0, 500)
          },
          { status: response.status }
        );
      } catch (textError) {
        console.error('[Proxy POST] Erro ao ler resposta como texto:', textError);
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro ${response.status} sem dados adicionais`
          },
          { status: response.status }
        );
      }
    }
    
    // Processar a resposta bem-sucedida
    try {
      // Se o content-type for JSON, processar como JSON
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        // Para outros tipos, retornar o texto e informar o content-type
        const textData = await clonedResponse.text();
        
        // Tentar interpretar como JSON mesmo se o content-type não for JSON
        if (textData.trim().startsWith('{') || textData.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(textData);
            return NextResponse.json(jsonData);
          } catch (jsonError) {
            console.error('[Proxy POST] Erro ao interpretar como JSON:', jsonError);
          }
        }
        
        // Fallback para texto
        return NextResponse.json({
          success: true,
          contentType,
          text: textData
        });
      }
    } catch (dataError) {
      console.error('[Proxy POST] Erro ao processar dados da resposta:', dataError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao processar resposta da API do Pixeldrain',
          details: dataError instanceof Error ? dataError.message : String(dataError)
        },
        { status: 422 }
      );
    }
  } catch (error) {
    return handleError(error, 'Erro ao processar requisição POST');
  }
}

// Processa as requisições PUT
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const apiKey = searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro "path" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Proxy PUT] Processando requisição para: ${path}`);
    
    // Clonar o corpo da requisição para enviar à API do Pixeldrain
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('[Proxy PUT] Corpo da requisição:', JSON.stringify(requestBody).substring(0, 200));
    } catch (bodyError) {
      console.log('[Proxy PUT] Requisição sem corpo JSON ou com corpo vazio');
    }
    
    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(path, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey && apiKey.trim()) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
      console.log(`[Proxy PUT] Usando autenticação com a chave: ${apiKey.substring(0, 5)}...`);
    } else {
      console.log('[Proxy PUT] Requisição sem autenticação');
    }
    
    // Preparar as opções da requisição
    const fetchOptions: RequestInit = {
      method: 'PUT',
      headers,
    };
    
    // Adicionar o corpo se existir
    if (requestBody) {
      fetchOptions.body = JSON.stringify(requestBody);
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), fetchOptions);
    
    // Clonar a resposta antes de processar para evitar "body stream already read"
    const clonedResponse = response.clone();
    
    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy PUT] Status: ${response.status}, Content-Type: ${contentType}`);
    
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
            return NextResponse.json(
              { 
                success: false, 
                error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
                details: errorJson
              },
              { status: response.status }
            );
          } catch (jsonError) {
            // Se falhar ao converter, retorna o texto original
            console.error('[Proxy PUT] Erro ao processar JSON de erro:', jsonError);
          }
        }
        
        // Se for HTML ou texto puro, retorna mensagem de erro com parte do texto
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          console.error('[Proxy PUT] API retornou HTML em vez de JSON', errorText.substring(0, 500));
          return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
              text: errorText.substring(0, 500),
              status: response.status
            },
            { status: 422 }
          );
        }
        
        // Para outros tipos de texto
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
            text: errorText.substring(0, 500)
          },
          { status: response.status }
        );
      } catch (textError) {
        console.error('[Proxy PUT] Erro ao ler resposta como texto:', textError);
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro ${response.status} sem dados adicionais`
          },
          { status: response.status }
        );
      }
    }
    
    // Processar a resposta bem-sucedida
    try {
      // Se o content-type for JSON, processar como JSON
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        // Para outros tipos, retornar o texto e informar o content-type
        const textData = await clonedResponse.text();
        
        // Tentar interpretar como JSON mesmo se o content-type não for JSON
        if (textData.trim().startsWith('{') || textData.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(textData);
            return NextResponse.json(jsonData);
          } catch (jsonError) {
            console.error('[Proxy PUT] Erro ao interpretar como JSON:', jsonError);
          }
        }
        
        // Fallback para texto
        return NextResponse.json({
          success: true,
          contentType,
          text: textData
        });
      }
    } catch (dataError) {
      console.error('[Proxy PUT] Erro ao processar dados da resposta:', dataError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao processar resposta da API do Pixeldrain',
          details: dataError instanceof Error ? dataError.message : String(dataError)
        },
        { status: 422 }
      );
    }
  } catch (error) {
    return handleError(error, 'Erro ao processar requisição PUT');
  }
}

// Processa as requisições DELETE
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const apiKey = searchParams.get('apiKey');
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro "path" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Proxy DELETE] Processando requisição para: ${path}`);
    
    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(path, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey && apiKey.trim()) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
      console.log(`[Proxy DELETE] Usando autenticação com a chave: ${apiKey.substring(0, 5)}...`);
    } else {
      console.log('[Proxy DELETE] Requisição sem autenticação');
    }
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), {
      method: 'DELETE',
      headers,
    });
    
    // Clonar a resposta antes de processar para evitar "body stream already read"
    const clonedResponse = response.clone();
    
    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Proxy DELETE] Status: ${response.status}, Content-Type: ${contentType}`);
    
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
            return NextResponse.json(
              { 
                success: false, 
                error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
                details: errorJson
              },
              { status: response.status }
            );
          } catch (jsonError) {
            // Se falhar ao converter, retorna o texto original
            console.error('[Proxy DELETE] Erro ao processar JSON de erro:', jsonError);
          }
        }
        
        // Se for HTML ou texto puro, retorna mensagem de erro com parte do texto
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          console.error('[Proxy DELETE] API retornou HTML em vez de JSON', errorText.substring(0, 500));
          return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta contém HTML em vez de JSON. Possível erro na API.',
              text: errorText.substring(0, 500),
              status: response.status
            },
            { status: 422 }
          );
        }
        
        // Para outros tipos de texto
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
            text: errorText.substring(0, 500)
          },
          { status: response.status }
        );
      } catch (textError) {
        console.error('[Proxy DELETE] Erro ao ler resposta como texto:', textError);
        return NextResponse.json(
          { 
            success: false, 
            error: `API do Pixeldrain retornou erro ${response.status} sem dados adicionais`
          },
          { status: response.status }
        );
      }
    }
    
    // Processar a resposta bem-sucedida
    try {
      // Se o content-type for JSON, processar como JSON
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        // Para outros tipos, retornar o texto e informar o content-type
        const textData = await clonedResponse.text();
        
        // Tentar interpretar como JSON mesmo se o content-type não for JSON
        if (textData.trim().startsWith('{') || textData.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(textData);
            return NextResponse.json(jsonData);
          } catch (jsonError) {
            console.error('[Proxy DELETE] Erro ao interpretar como JSON:', jsonError);
          }
        }
        
        // Fallback para texto
        return NextResponse.json({
          success: true,
          contentType,
          text: textData
        });
      }
    } catch (dataError) {
      console.error('[Proxy DELETE] Erro ao processar dados da resposta:', dataError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao processar resposta da API do Pixeldrain',
          details: dataError instanceof Error ? dataError.message : String(dataError)
        },
        { status: 422 }
      );
    }
  } catch (error) {
    return handleError(error, 'Erro ao processar requisição DELETE');
  }
}