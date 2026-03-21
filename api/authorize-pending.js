const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''

module.exports = async function handler(req, res) {
  try {
    const qs = new URLSearchParams(req.query).toString()
    const upstream = await fetch(`${SUPABASE}/authorize${qs ? '?' + qs : ''}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      // Return the raw body so we can diagnose
      return res.status(502).json({
        error: `Upstream returned non-JSON (HTTP ${upstream.status})`,
        upstream_body: text.slice(0, 1000),
      })
    }

    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
