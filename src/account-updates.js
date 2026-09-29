(() => {
  const previousRenderUpdates = window.renderUpdates;
  if (typeof previousRenderUpdates !== 'function') return;
  window.renderUpdates = function (...args) {
    let html = previousRenderUpdates.apply(this, args);
    const cards = '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">↻</span><span class="eyebrow">CONTAS / CONFIABILIDADE</span></div><h2>Cadastro compatível com Workers</h2><p>A derivação PBKDF2 da senha foi ajustada para 100.000 iterações, limite aceito pelo Cloudflare Workers. Erros inesperados continuam com código de diagnóstico.</p></article>' +
      '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">◎</span><span class="eyebrow">CONTAS / COMUNIDADE</span></div><h2>Perfis públicos de agentes</h2><p>Abra perfis a partir da busca, da lista de quem você segue ou de seus seguidores. Cada perfil mostra nome, biografia, banner, foto e números da rede; informações de conta e autenticação continuam privadas.</p></article>';
    html = html.replace('</div><div class="updates-footnote">', cards + '</div><div class="updates-footnote">');
    return html.replace(/Versão 32[^<]*\./, 'Versão 35 · perfis públicos de agentes na rede LIMIAR.');
  };
})();
