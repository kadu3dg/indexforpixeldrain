import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Iniciando busca de álbuns...');
    
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');

    if (!apiKey) {
      console.error('Chave API não fornecida');
      return NextResponse.json(
        { error: 'Chave API não fornecida' },
        { status: 400 }
      );
    }

    console.log('Fazendo requisição para o Pixeldrain...');
    
    const response = await fetch('https://pixeldrain.com/api/user/lists', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(':' + apiKey).toString('base64'),
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Resposta do Pixeldrain:', data);

    if (!response.ok) {
      console.error('Erro na resposta do Pixeldrain:', data);
      return NextResponse.json(
        { error: data.message || 'Erro ao listar álbuns' },
        { status: response.status }
      );
    }

    // Verificar se data.lists existe, se não, tentar data.list
    const albums = data.lists || data.list || [];
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Erro detalhado na API de álbuns:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 