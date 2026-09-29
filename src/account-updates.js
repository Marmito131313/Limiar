(() => {
  const previousRenderUpdates = window.renderUpdates;
  if (typeof previousRenderUpdates !== 'function') return;
  window.renderUpdates = function (...args) {
    let html = previousRenderUpdates.apply(this, args);
    const card = '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">↻</span><span class="eyebrow">CONTAS / CONFIABILIDADE</span></div><h2>Erros de conta identificáveis</h2><p>Falhas de cadastro, login e perfil agora exibem um código de diagnóstico. Problemas de banco deixam de ser confundidos com nome de usuário repetido.</p></article>';
    html = html.replace('</div><div class="updates-footnote">', card + '</div><div class="updates-footnote">');
    return html.replace(/Versão 32[^<]*\./, 'Versão 33 · confiabilidade e diagnóstico de contas.');
  };
})();
