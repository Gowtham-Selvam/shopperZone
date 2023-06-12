export default {
  oidc: {
    clientId: '0oa9sbgk4eyTRjAh85d7', //public identified
    issuer: 'https://dev-03065622.okta.com/oauth2/default', //issuer of the token
    redirectUri: 'https://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  },
};
