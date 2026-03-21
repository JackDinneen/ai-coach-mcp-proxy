module.exports = function handler(req, res) {
  const base = 'https://' + req.headers.host
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    issuer: base,
    authorization_endpoint: base + '/authorize.html',
    token_endpoint: base + '/token',
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
    scopes_supported: ['mcp'],
  })
}
