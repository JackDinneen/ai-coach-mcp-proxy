module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    issuer: 'https://' + req.headers.host,
    authorization_endpoint: 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server/authorize',
    token_endpoint: 'https://ddfqlkzmpjckblxwubaq.supabase.co/functions/v1/mcp-server/token',
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
    scopes_supported: ['mcp'],
  })
}
