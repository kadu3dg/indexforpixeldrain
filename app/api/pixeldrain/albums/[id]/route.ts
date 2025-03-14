import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Buscando arquivos do álbum:', params.id);
    
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
    
    const response = await fetch(`https://pixeldrain.com/api/list/${params.id}`, {
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
        { error: data.message || 'Erro ao listar arquivos do álbum' },
        { status: response.status }
      );
    }

    // Verificar se data.files existe, se não, tentar data.list.files
    const files = data.files || (data.list && data.list.files) || [];
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Erro detalhado na API de arquivos do álbum:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 