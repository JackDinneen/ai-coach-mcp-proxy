const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  const qs = new URLSearchParams(req.query).toString()
  const upstream = await fetch(`${SUPABASE}/authorize${qs ? '?' + qs : ''}`, {
    headers: { 'Accept': 'application/json' },
  })
  const data = await upstream.json()
  res.status(upstream.status).json(data)
}
