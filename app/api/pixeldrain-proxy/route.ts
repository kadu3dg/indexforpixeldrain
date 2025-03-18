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
      method: 'GET',
      headers,
      // No servidor não temos problema com CORS, então não precisamos especificar mode
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