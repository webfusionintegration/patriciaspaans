import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const startTime = Date.now() // Début du calcul du temps
  const url = new URL(event.request.url)

  // Si on demande /robots.txt, on sert le fichier du répertoire /dist
  if (url.pathname === '/robots.txt') {
    try {
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/robots.txt`)
      })

      const endTime = Date.now() // Fin du calcul du temps
      console.log(`Execution time for /robots.txt: ${endTime - startTime} ms`)

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    } catch (err) {
      const endTime = Date.now()
      console.log(`Execution time for /robots.txt (error): ${endTime - startTime} ms`)
      return new Response('robots.txt not found', { status: 404 })
    }
  }

  // Pour tout le reste, laisser passer normalement
  const fetchResponse = await fetch(event.request)
  const endTime = Date.now()
  console.log(`Execution time for ${url.pathname}: ${endTime - startTime} ms`)
  return fetchResponse
}
