import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Obter o ID do álbum dos parâmetros da rota
    const albumId = params.id;
    
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
    
    // URL da API do Pixeldrain para obter detalhes do álbum
    const apiUrl = `https://pixeldrain.com/api/list/${albumId}`;
    
    console.log(`Fazendo requisição para a API do Pixeldrain (album/${albumId})...`);
    
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
    console.log(`Resposta da API do Pixeldrain (album/${albumId}) recebida com sucesso`);
    
    // Formatar a resposta para o formato esperado pelo cliente
    const formattedData = {
      id: data.id,
      title: data.title,
      description: data.description,
      date_created: data.date_created,
      files: data.files ? data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        views: file.views,
        date_upload: file.date_upload,
        date_last_view: file.date_last_view,
        mime_type: file.mime_type
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