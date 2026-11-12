'use strict';

// limita envios públicos (formulário): máx. 5 pedidos POST por IP a cada 10 minutos
const hits = new Map();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

module.exports = () => async (ctx, next) => {
  if (ctx.method === 'POST' && ctx.path === '/api/mensagens') {
    const now = Date.now();
    const arr = (hits.get(ctx.ip) || []).filter((t) => now - t < WINDOW);
    if (arr.length >= MAX) {
      ctx.status = 429;
      ctx.body = { error: { status: 429, name: 'TooManyRequests', message: 'Demasiados pedidos. Tente mais tarde.' } };
      return;
    }
    arr.push(now);
    hits.set(ctx.ip, arr);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW)) hits.delete(k);
  }
  await next();
};
