'use strict';

const pages = require('./seed-pages.json');

const SEED = {
  solucao: [
    { slug: 'globalconnect', titulo: 'GlobalConnect Pack', descricao: 'Solução única de comunicações gerida por uma central telefónica virtual.', categoria: 'Comunicações' },
    { slug: 'office365', titulo: 'Office 365', descricao: 'Ferramentas de produtividade e colaboração para a sua equipa, onde quer que esteja.', categoria: 'TI/SI' },
    { slug: 'smart-marketing', titulo: 'Smart Marketing Pack', descricao: 'Pacote de marketing digital para dar visibilidade e crescimento ao seu negócio.', categoria: 'Negócio' },
    { slug: 'sectoriais', titulo: 'Soluções Sectoriais', descricao: 'Respostas desenhadas para as necessidades específicas do seu sector de atividade.', categoria: 'Negócio' },
    { slug: 'm4', titulo: 'Pacotes M4', descricao: 'Pacotes de voz e internet para profissionais e PME.', categoria: 'Comunicações' },
    { slug: 'a-medida', titulo: 'À medida da organização', descricao: 'Soluções TI/SI à medida, do diagnóstico à implementação.', categoria: 'TI/SI' },
  ],
  servico: [
    { slug: 'voz-internet', titulo: 'Voz e Internet', descricao: 'Gestão dos seus serviços de telecomunicações como Agente Autorizado Altice Empresas.', pontos: 'Central telefónica virtual (GlobalConnect Pack)\nVoz fixa e móvel num só pacote\nPacotes M4 de voz e internet para profissionais e PME\nCatálogo de equipamentos para a sua empresa' },
    { slug: 'cloud', titulo: 'Cloud e Colaboração', descricao: 'Office 365 e ferramentas de produtividade para equipas ligadas.', pontos: 'Office 365: produtividade e colaboração onde quer que a equipa esteja\nAconselhamento em Cloud\nUm único parceiro para os serviços e as ferramentas' },
    { slug: 'ti-si', titulo: 'Soluções TI/SI', descricao: 'Aconselhamento em novas tecnologias: Cloud, IoT e gestão de frotas.', pontos: 'Soluções à medida, do diagnóstico à implementação\nSoluções sectoriais para a sua área de atividade\nAconselhamento em IoT e gestão de frotas' },
  ],
};

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    // permissões públicas: ler soluções/serviços, criar mensagens (nunca ler)
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    const wanted = [
      'api::solucao.solucao.find', 'api::solucao.solucao.findOne',
      'api::servico.servico.find', 'api::servico.servico.findOne',
      'api::mensagem.mensagem.create',
      ...Object.keys(pages).map((n) => `api::${n}.${n}.find`),
    ];
    for (const action of wanted) {
      const has = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
      if (!has) await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
    }
    // dados iniciais (só se vazio): textos que já existem no site
    for (const [name, rows] of Object.entries(SEED)) {
      const uid = `api::${name}.${name}`;
      if ((await strapi.db.query(uid).count()) === 0) {
        for (const data of rows) await strapi.db.query(uid).create({ data });
      }
    }
    // serviços já existentes sem "pontos": preenche
    for (const row of SEED.servico) {
      const cur = await strapi.db.query('api::servico.servico').findOne({ where: { slug: row.slug } });
      if (cur && !cur.pontos && row.pontos) await strapi.db.query('api::servico.servico').update({ where: { id: cur.id }, data: { pontos: row.pontos } });
    }
    // páginas (single types): só cria se ainda não existirem
    for (const [name, data] of Object.entries(pages)) {
      const uid = `api::${name}.${name}`;
      if ((await strapi.db.query(uid).count()) === 0) await strapi.db.query(uid).create({ data });
    }
  },
};
