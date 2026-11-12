'use strict';
const notify = require('../../../../utils/notify');

module.exports = {
  async afterCreate(event) {
    const r = event.result;
    notify({
      assunto: `Novo contacto pelo site: ${r.nome}`,
      replyTo: r.email,
      linhas: [`Nome: ${r.nome}`, `Email: ${r.email}`, r.empresa && `Empresa: ${r.empresa}`, '', r.texto],
    });
  },
};
