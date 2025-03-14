import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave API não fornecida' },
        { status: 400 }
      );
    }

    const response = await fetch('https://pixeldrain.com/api/user/files', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(':' + apiKey).toString('base64'),
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao listar arquivos' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API de arquivos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 