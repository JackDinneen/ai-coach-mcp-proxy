const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  const qs = new URLSearchParams(req.query).toString()
  const url = `${SUPABASE}/authorize${qs ? '?' + qs : ''}`

  const upstream = await fetch(url, {
    method: req.method,
    headers: req.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
    body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
  })

  const text = await upstream.text()
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'text/html; charset=utf-8')
  res.status(upstream.status).send(text)
}
