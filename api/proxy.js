const SUPABASE_MCP_URL = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'
const SKIP_HEADERS = ['content-encoding', 'transfer-encoding', 'x-frame-options', 'content-security-policy']

export default async function handler(req, res) {
  const path = req.url.replace(/^\/api\/proxy/, '') || '/'
  const target = `${SUPABASE_MCP_URL}${path}`

  const headers = { ...req.headers }
  delete headers['host']
  delete headers['x-forwarded-for']

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : JSON.stringify(req.body),
  })

  if (path.startsWith('/.well-known/oauth-authorization-server')) {
    const proxyBase = `https://${req.headers.host}`
    const metadata = await upstream.json()
    const rewritten = JSON.parse(
      JSON.stringify(metadata).replaceAll(SUPABASE_MCP_URL, proxyBase)
    )
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(upstream.status).json(rewritten)
    return
  }

  upstream.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.includes(key.toLowerCase())) {
      res.setHeader(key, value)
    }
  })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type, mcp-session-id')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  res.status(upstream.status)
  const body = await upstream.text()
  res.send(body)
}
