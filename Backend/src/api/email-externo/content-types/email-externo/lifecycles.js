'use strict';
const notify = require('../../../../utils/notify');

module.exports = {
  async afterCreate(event) {
    const r = event.result;
    notify({
      assunto: `Novo email recebido: ${r.assunto}`,
      replyTo: r.remetente_email,
      linhas: [`De: ${r.remetente_nome || ''} <${r.remetente_email}>`, '', r.corpo],
    });
  },
};
