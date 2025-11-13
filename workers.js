import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const startTime = Date.now()
  const url = new URL(event.request.url)

  // Fonction utilitaire pour servir un fichier depuis dist/
  async function serveAsset(path, contentType = 'text/plain; charset=utf-8') {
    try {
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}${path}`)
      })
      const duration = Date.now() - startTime
      const newHeaders = new Headers(response.headers)
      newHeaders.set('X-Processing-Time-ms', duration.toString())
      newHeaders.set('Content-Type', contentType) // <-- UTF-8 ici
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      })
    } catch (err) {
      const duration = Date.now() - startTime
      return new Response(`${path} not found`, {
        status: 404,
        headers: { 'X-Processing-Time-ms': duration.toString() }
      })
    }
  }

  // Servir robots.txt
  if (url.pathname === '/robots.txt') {
    return serveAsset('/robots.txt', 'text/plain; charset=utf-8')
  }

  // Servir sitemap-video.xml
  if (url.pathname === '/sitemap-video.xml') {
    return serveAsset('/sitemap-video.xml', 'application/xml; charset=utf-8')
  }

  // Servir llms.txt
  if (url.pathname === '/llms.txt') {
    return serveAsset('/llms.txt', 'text/plain; charset=utf-8') // texte avec accents en UTF-8
  }

  // Servir llms-full.txt
  if (url.pathname === '/llms-full.txt') {
    return serveAsset('/llms-full.txt', 'text/plain; charset=utf-8') // texte avec accents en UTF-8
  }

  // Pour tout le reste, laisser passer
  return fetch(event.request)
}
