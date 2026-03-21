const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''

module.exports = async function handler(req, res) {
  try {
    const qs = new URLSearchParams(req.query).toString()
    const url = `${SUPABASE}/authorize?${qs}&_format=json`

    const upstream = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    const text = await upstream.text()

    // Try JSON first (works once Supabase function is redeployed with _format=json)
    try {
      const data = JSON.parse(text)
      return res.status(upstream.status).json(data)
    } catch {
      // Supabase returned the HTML form — extract pending_id from the inline script:
      // const pid = "some-uuid";
      const match = text.match(/const pid = "([^"]+)"/)
      if (match) {
        return res.status(200).json({ pending_id: match[1] })
      }

      return res.status(502).json({
        error: `Could not extract pending_id (HTTP ${upstream.status})`,
        upstream_body: text.slice(0, 500),
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
