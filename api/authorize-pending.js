module.exports = async function handler(req, res) {
  const { client_id, redirect_uri, code_challenge, code_challenge_method, state } = req.query

  if (!client_id || !redirect_uri || !code_challenge || !code_challenge_method || !state) {
    return res.status(400).json({ error: 'Missing required OAuth parameters' })
  }

  res.status(200).json({ status: 'pending' })
}
