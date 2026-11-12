'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

// o público só pode enviar nome, email, empresa e texto; estado e notas são internos
module.exports = createCoreController('api::mensagem.mensagem', () => ({
  async create(ctx) {
    const d = (ctx.request.body && ctx.request.body.data) || {};
    ctx.request.body = { data: { nome: d.nome, email: d.email, empresa: d.empresa, texto: d.texto } };
    return super.create(ctx);
  },
}));
