export const environment = {
  production: true,
  api: {
    baseUrl: 'https://your-production-api.com/api',
    timeout: 30000,
  },
  mock: false,
  auth: {
    tokenKey: 'ecommerce_token',
    refreshKey: 'ecommerce_refresh',
    userKey: 'ecommerce_user',
  },
  features: {
    enableVoiceCommands: true,
    enableForecasting: true,
    enableReports: true,
  }
};
