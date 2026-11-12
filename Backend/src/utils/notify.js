'use strict';

// Avisa por email a equipa quando chega uma mensagem nova.
// Se o SMTP não estiver configurado (.env), não faz nada; falhas só ficam no log e nunca bloqueiam o pedido.
module.exports = async function notify({ assunto, linhas, replyTo }) {
  const to = process.env.MAIL_TO;
  if (!process.env.SMTP_HOST || !to || !process.env.MAIL_FROM) {
    strapi.log.info('[email] SMTP não configurado: aviso por email não enviado');
    return;
  }
  try {
    await strapi.plugin('email').service('email').send({
      to,
      subject: assunto,
      text: linhas.filter((l) => l !== undefined && l !== null && l !== false).join('\n'),
      ...(replyTo ? { replyTo } : {}),
    });
    strapi.log.info(`[email] aviso enviado: ${assunto}`);
  } catch (e) {
    strapi.log.error(`[email] falha ao enviar aviso: ${e.message}`);
  }
};
