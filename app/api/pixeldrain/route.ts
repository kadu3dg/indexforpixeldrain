import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const apiKey = searchParams.get('apiKey');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }

    const url = new URL(endpoint, 'https://pixeldrain.com/api');
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    if (apiKey) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
    }

    const response = await fetch(url.toString(), { headers });
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
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
        { error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const url = new URL(endpoint, 'https://pixeldrain.com/api');
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    if (apiKey) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const apiKey = searchParams.get('apiKey');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }

    const url = new URL(endpoint, 'https://pixeldrain.com/api');
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    if (apiKey) {
      const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;
      headers.append('Authorization', authHeader);
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

// Rota removida para suportar exportação estática
export const dynamic = 'error'; 