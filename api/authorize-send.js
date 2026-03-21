const SUPABASE = 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server'

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email, ...oauthParams } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const upstream = await fetch(`${SUPABASE}/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...oauthParams }),
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('authorize-send: upstream non-JSON', upstream.status, text.slice(0, 500))
      return res.status(502).json({ error: 'Upstream error', status: upstream.status })
    }

    res.status(upstream.status).json(data)
  } catch (err) {
    console.error('authorize-send error:', err)
    res.status(500).json({ error: err.message })
  }
}
