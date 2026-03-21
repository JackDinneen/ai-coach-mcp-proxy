const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  const upstream = await fetch(`${SUPABASE}/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  })
  const data = await upstream.json()
  res.status(upstream.status).json(data)
}
