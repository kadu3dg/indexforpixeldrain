import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Obter a chave API do corpo da requisição
    const body = await request.json();
    const apiKey = body.apiKey;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key não fornecida' },
        { status: 400 }
      );
    }
    
    // URL da API do Pixeldrain para verificar a chave API
    // Usamos a API de listar arquivos para verificar se a chave é válida
    const apiUrl = 'https://pixeldrain.com/api/user/files';
    
    // Fazer a requisição para a API do Pixeldrain
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API do Pixeldrain: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { success: false, error: `Chave API inválida ou expirada` },
        { status: 401 }
      );
    }
    
    // Se chegou até aqui, a chave API é válida
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 