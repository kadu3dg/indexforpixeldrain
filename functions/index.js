// Este arquivo serve como ponto de entrada para o Cloudflare Workers
// Ele é referenciado pelo campo "main" no arquivo wrangler.toml

export default {
  async fetch(request, env, ctx) {
    // Redirecionar todas as solicitações para o Next.js
    return new Response("Redirecionando para o Next.js", {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  }
}; 