# Index for Pixeldrain

Interface web para gerenciar arquivos e álbuns no Pixeldrain.

## Funcionalidades

- Visualização de arquivos e álbuns
- Upload de arquivos
- Criação e gerenciamento de álbuns
- Reprodução de vídeos
- Interface responsiva
- Tema claro/escuro
- Visualização pública de álbuns

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Pixeldrain API

## Configuração Local

1. Clone o repositório:
```bash
git clone https://github.com/kadu3dg/indexforpixeldrain.git
cd indexforpixeldrain
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure suas variáveis de ambiente no arquivo `.env.local`

5. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## Deploy no Cloudflare Pages

1. Faça fork deste repositório no GitHub

2. Acesse o [Cloudflare Pages](https://pages.cloudflare.com)

3. Clique em "Create a project"

4. Conecte sua conta do GitHub e selecione o repositório

5. Configure o projeto:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node.js version: 18.x

6. Configure as variáveis de ambiente (opcional):
   - PIXELDRAIN_API_KEY: Sua chave da API do Pixeldrain
   - NEXT_PUBLIC_API_URL: URL base da API

7. Clique em "Save and Deploy"

## Uso

### Visualização Pública de Álbuns

Para compartilhar um álbum publicamente:

1. Copie o ID do álbum do Pixeldrain
2. Compartilhe o link no formato: `https://seu-dominio.pages.dev/album/ID_DO_ALBUM`

Os usuários poderão:
- Ver todos os arquivos do álbum
- Fazer download dos arquivos
- Reproduzir vídeos diretamente no navegador

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
