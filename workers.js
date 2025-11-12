addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/robots.txt') {
    const robots = `
User-agent: *
Content-signal: search=yes,ai-train=yes
Allow: /
Disallow: /private/

User-agent: Amazonbot
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: CCBot
Disallow: /

Sitemap: https://www.patriciaspaans.com/sitemap.xml
Sitemap: https://sitemaps.patriciaspaans.com/sitemap-video.xml
`
    return new Response(robots, {
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
    })
  }

  return fetch(request)
}
