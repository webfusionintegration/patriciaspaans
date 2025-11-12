import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const url = new URL(event.request.url)

  // Si on demande /robots.txt, on sert le fichier du répertoire /dist
  if (url.pathname === '/robots.txt') {
    try {
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/robots.txt`)
      })

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    } catch (err) {
      return new Response('robots.txt not found', { status: 404 })
    }
  }

  // Pour tout le reste, laisser passer normalement
  return fetch(event.request)
}
