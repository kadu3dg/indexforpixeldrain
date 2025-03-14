import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey, fileId } = await request.json();

    if (!apiKey || !fileId) {
      return NextResponse.json(
        { error: 'Chave API ou ID do arquivo não fornecidos' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://pixeldrain.com/api/file/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(':' + apiKey).toString('base64'),
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao deletar arquivo' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API de deleção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 