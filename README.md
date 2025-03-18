# Pixeldrain Album Manager

Um gerenciador de álbuns para o Pixeldrain, construído com Next.js e Tailwind CSS.

## Funcionalidades

- 📁 Visualização de álbuns e arquivos do Pixeldrain
- 🎥 Reprodução de vídeos integrada
- 🔄 Atualização automática de conteúdo
- 🌓 Suporte a tema claro/escuro
- 📱 Design responsivo
- 🔒 Autenticação segura com API key

## Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Pré-requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Chave API do Pixeldrain

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pixeldrain-album-manager.git
cd pixeldrain-album-manager
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie um arquivo `.env.local` com as seguintes variáveis:
```env
NEXT_PUBLIC_API_URL=https://pixeldrain.com/api
NEXT_PUBLIC_API_KEY=sua-chave-api-aqui
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Configuração da Chave API

Para utilizar o Pixeldrain Album Manager, você precisa configurar sua chave API do Pixeldrain:

1. Crie uma conta no [Pixeldrain](https://pixeldrain.com/)
2. Acesse suas configurações de conta
3. Gere uma chave API
4. Configure a chave API de uma das seguintes formas:

### Opção 1: Arquivo .env.local

Adicione sua chave API no arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://pixeldrain.com/api
NEXT_PUBLIC_API_KEY=sua-chave-api-aqui
```

### Opção 2: Modificar diretamente o código

Abra o arquivo `app/services/pixeldrain.ts` e substitua a chave API padrão pela sua:

```typescript
export class PixeldrainService {
  private apiKey: string = 'sua-chave-api-aqui';
  // ...
}
```

## Uso

1. Visualize seus álbuns e arquivos
2. Crie novos álbuns e gerencie arquivos
3. Reproduza vídeos diretamente na interface

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Deploy

### GitHub Pages

Este projeto está configurado para ser hospedado automaticamente no GitHub Pages usando GitHub Actions.

1. Vá para seu repositório no GitHub
2. Clique em "Settings" > "Pages"
3. Em "Build and deployment", selecione a fonte como "GitHub Actions"
4. Após configurar, cada push para a branch `main` irá automaticamente fazer deploy da aplicação

URL do site: https://kadu3dg.github.io/indexforpixeldrain/
