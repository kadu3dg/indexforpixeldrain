1. Estilo de Código e Estrutura

Escrever código TypeScript conciso e modular.

Usar padrões funcionais e declarativos; evitar classes.

Modularizar funções e componentes para reduzir repetição de código.

Nomear variáveis descritivamente com verbos auxiliares (e.g., isLoading, hasError).

Estruturar arquivos de componentes da seguinte forma:

Componente principal exportado.

Subcomponentes reutilizáveis.

Helpers e funções auxiliares.

Conteúdo estático.

Tipos e interfaces TypeScript.

2. Convenções de Nomeação

Usar kebab-case (letras minúsculas com hífens) para diretórios (exemplo: components/file-list).

Priorizar exportações nomeadas para componentes.

3. Uso de TypeScript

Todo o código deve ser escrito em TypeScript.

Priorizar interface ao invés de type sempre que possível.

Evitar enum; usar Record ou Map para mapeamentos.

Componentes devem ser funcionais e tipados corretamente.

4. Sintaxe e Formatação

Utilizar function para funções puras.

Evitar chaves desnecessárias em condicionais; usar sintaxe concisa quando apropriado.

Utilizar JSX declarativo e organizado.

5. Interface e Estilização

Usar Shadcn UI, Radix UI e Tailwind CSS para componentes e estilos.

Implementar design responsivo com abordagem mobile-first.

Manter a interface limpa e acessível.

6. Otimização de Performance

Minimizar o uso de 'use client', useEffect e setState; preferir React Server Components (RSC).

Envolver componentes cliente em Suspense com fallback adequado.

Carregar dinamicamente componentes não críticos.

Otimizar imagens com formato WebP, incluir tamanhos adequados e aplicar lazy loading.

7. Outras Convenções Importantes

Usar useSearchParams da biblioteca nuqs para gerenciar parâmetros da URL.

Priorizar a utilização de server-side rendering (SSR) ou static site generation (SSG) no Next.js.

Evitar chamadas de API diretas no client-side, utilizar Next.js API Routes ou Cloudflare Workers como intermediários.

Reduzir requisições desnecessárias e aplicar caching para otimização de desempenho.