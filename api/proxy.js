const SUPABASE_MCP_URL = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

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

  upstream.headers.forEach((value, key) => {
    if (!['content-encoding', 'transfer-encoding'].includes(key)) {
      res.setHeader(key, value)
    }
  })

  res.status(upstream.status)
  const body = await upstream.text()
  res.send(body)
}
