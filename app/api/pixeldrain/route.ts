import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const apiKey = searchParams.get('apiKey');

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }

    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(endpoint, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
    }

    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), {
      headers,
      cache: 'no-store'
    });

    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type');

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    // Se o content-type for JSON, retornar como JSON
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Para outros tipos, retornar o texto
    const text = await response.text();
    return NextResponse.json({ success: true, text });

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const apiKey = searchParams.get('apiKey');

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }

    // Obter o corpo da requisição
    const body = await request.json();

    // Construir URL para a API do Pixeldrain
    const apiUrl = new URL(endpoint, 'https://pixeldrain.com/api');
    
    // Configurar os cabeçalhos
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    
    // Adicionar autenticação se a apiKey estiver presente
    if (apiKey) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
    }

    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type');

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `API do Pixeldrain retornou erro: ${response.status} ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    // Se o content-type for JSON, retornar como JSON
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Para outros tipos, retornar o texto
    const text = await response.text();
    return NextResponse.json({ success: true, text });

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 