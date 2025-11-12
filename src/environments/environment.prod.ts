export const environment = {
  production: true,
  api: {
    baseUrl: 'https://YOUR_BACKEND_API_URL/api', // ⚠️ Cambiar por URL real de producción
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
