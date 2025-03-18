import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Obter o token de autorização do cabeçalho
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Basic ', '').replace('Bearer ', '') : '';
    
    // Decodificar a chave API do formato Base64 se necessário
    let decodedApiKey = apiKey;
    try {
      if (apiKey.includes('==')) {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
        // O formato é ":apiKey", então removemos o ":" inicial
        decodedApiKey = decoded.startsWith(':') ? decoded.substring(1) : decoded;
      }
    } catch (e) {
      console.error('Erro ao decodificar a chave API:', e);
    }
    
    if (!decodedApiKey) {
      return NextResponse.json(
        { error: 'API key não fornecida' },
        { status: 401 }
      );
    }
    
    // URL da API do Pixeldrain para listar álbuns
    const apiUrl = 'https://pixeldrain.com/api/user/lists';
    
    console.log('Fazendo requisição para a API do Pixeldrain (albums)...');
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${decodedApiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API do Pixeldrain: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Erro na API do Pixeldrain: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Processar a resposta
    const data = await response.json();
    console.log('Resposta da API do Pixeldrain (albums) recebida com sucesso');
    
    // Formatar a resposta para o formato esperado pelo cliente
    const formattedData = {
      albums: data.lists ? data.lists.map((list: any) => ({
        id: list.id,
        title: list.title,
        description: list.description,
        date_created: list.date_created
      })) : []
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 