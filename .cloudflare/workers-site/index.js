import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return more detailed error messages from the edge
 *    when they are thrown.
 */
const DEBUG = false

export default {
  async fetch(request, env, ctx) {
    try {
      // Diretório de saída do Next.js
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          cacheControl: {
            browserTTL: 60 * 60 * 24 * 365, // 1 ano
            edgeTTL: 60 * 60 * 24 * 30, // 30 dias
            bypassCache: DEBUG,
          },
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          mapRequestToAsset: (req) => req,
        }
      )
    } catch (e) {
      // Se ocorrer um erro, tente servir o arquivo 404.html
      try {
        let notFoundResponse = await getAssetFromKV(
          {
            request: new Request(`${new URL(request.url).origin}/404.html`, request),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          }
        )

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        })
      } catch (e) {}

      return new Response('Página não encontrada', { status: 404 })
    }
  },
} 