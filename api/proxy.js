const SUPABASE_MCP_URL = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

export default async function handler(req, res) {
  try {
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

    const responseHeaders = {}
    upstream.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key)) {
        responseHeaders[key] = value
      }
    })

    const body = await upstream.arrayBuffer()
    res.writeHead(upstream.status, responseHeaders)
    res.end(Buffer.from(body))
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'proxy error', detail: err.message }))
  }
}
