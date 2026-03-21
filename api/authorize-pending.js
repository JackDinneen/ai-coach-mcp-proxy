module.exports = async function handler(req, res) {
  // Just confirm the authorize request is valid and let the UI show the login form
  const { client_id, redirect_uri, code_challenge, code_challenge_method, state, scope } = req.query

  if (!client_id || !redirect_uri || !code_challenge || !state) {
    return res.status(400).json({ error: 'Missing required OAuth parameters' })
  }

  res.status(200).json({ status: 'pending', client_id, scope: scope || 'mcp:1' })
}
