const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  const qs = new URLSearchParams(req.query).toString()
  const url = `${SUPABASE}/authorize${qs ? '?' + qs : ''}`

  const upstream = await fetch(url, {
    method: req.method,
    headers: req.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
    body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
  })

  const buffer = Buffer.from(await upstream.arrayBuffer())
  const ct = upstream.headers.get('content-type') || 'text/html; charset=utf-8'

  res.writeHead(upstream.status, { 'content-type': ct })
  res.end(buffer)
}
