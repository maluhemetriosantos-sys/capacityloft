module.exports = [
  'global::rate-limit',
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // sites autorizados a chamar a API (em produção: só o domínio real)
      origin: (process.env.CORS_ORIGINS || ('http://localhost:8080,http://127.0.0.1:8080,https://capacityloft.pt,https://www.capacityloft.pt' + (process.env.NODE_ENV === 'production' ? '' : ',null'))).split(','), // 'null' = site aberto como ficheiro (só em desenvolvimento)
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
