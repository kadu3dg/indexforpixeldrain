import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave API não fornecida' },
        { status: 400 }
      );
    }

    const response = await fetch('https://pixeldrain.com/api/user/files', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(':' + apiKey).toString('base64'),
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro na autenticação' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 