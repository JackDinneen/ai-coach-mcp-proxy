const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  try {
    const qs = new URLSearchParams(req.query).toString()
    const upstream = await fetch(`${SUPABASE}/authorize${qs ? '?' + qs : ''}`, {
      headers: { 'Accept': 'application/json' },
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('authorize-pending: upstream non-JSON', upstream.status, text.slice(0, 500))
      return res.status(502).json({ error: 'Upstream returned non-JSON', status: upstream.status })
    }

    res.status(upstream.status).json(data)
  } catch (err) {
    console.error('authorize-pending error:', err)
    res.status(500).json({ error: err.message })
  }
}
