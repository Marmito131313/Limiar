(() => {
  const previousRenderUpdates = window.renderUpdates;
  if (typeof previousRenderUpdates !== 'function') return;
  window.renderUpdates = function (...args) {
    let html = previousRenderUpdates.apply(this, args);
    const card = '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">↻</span><span class="eyebrow">CONTAS / CONFIABILIDADE</span></div><h2>Cadastro compatível com Workers</h2><p>A derivação PBKDF2 da senha foi ajustada para 100.000 iterações, limite aceito pelo Cloudflare Workers. Erros inesperados continuam com código de diagnóstico.</p></article>';
    html = html.replace('</div><div class="updates-footnote">', card + '</div><div class="updates-footnote">');
    return html.replace(/Versão 32[^<]*\./, 'Versão 34 · cadastro de contas compatível com Cloudflare Workers.');
  };
})();
