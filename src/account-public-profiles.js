(() => {
  if (window.limiarPublicProfilesReady) return;
  window.limiarPublicProfilesReady = true;

  const profiles = new Map();
  const profileTtl = 30000;
  let renderId = 0;
  let currentAccount = null;
  let accountCheckedAt = 0;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const routeHandle = () => {
    const match = location.hash.match(/^#perfil\/([^/]+)\/?$/i);
    if (!match) return null;
    try { return decodeURIComponent(match[1]); } catch { return ''; }
  };

  async function readResponse(response) {
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.error || 'Não foi possível carregar este perfil.');
    return data;
  }

  async function loadProfile(handle) {
    const key = handle.toLowerCase(), cached = profiles.get(key);
    if (cached && Date.now() - cached.at < profileTtl) return cached.value;
    const response = await fetch('/api/social/profile/' + encodeURIComponent(handle), {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    });
    const data = await readResponse(response);
    if (!data.profile) throw new Error('Este perfil não existe ou não está disponível.');
    profiles.set(key, { value: data.profile, at: Date.now() });
    return data.profile;
  }

  async function loadCurrentAccount() {
    if (Date.now() - accountCheckedAt < 5000) return currentAccount;
    accountCheckedAt = Date.now();
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      const data = await readResponse(response);
      currentAccount = data.account || null;
    } catch { currentAccount = null; }
    return currentAccount;
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || '?';
  }

  function profileMarkup(profile) {
    const avatar = profile.avatar
      ? '<img src="' + escapeHtml(profile.avatar) + '" alt="Foto de ' + escapeHtml(profile.displayName) + '">'
      : '<span aria-hidden="true">' + escapeHtml(initials(profile.displayName)) + '</span>';
    const banner = profile.banner
      ? '<img src="' + escapeHtml(profile.banner) + '" alt="Banner de ' + escapeHtml(profile.displayName) + '">'
      : '';
    let action = '';
    if (profile.isSelf) {
      action = '<a class="button small primary" href="#conta">Editar meu perfil</a>';
    } else if (currentAccount) {
      const following = !!profile.isFollowing;
      action = '<button type="button" class="button small ' + (following ? 'ghost' : 'primary') + '" data-social-action="' + (following ? 'unfollow' : 'follow') + '" data-handle="' + escapeHtml(profile.handle) + '" aria-pressed="' + following + '">' + (following ? 'Deixar de seguir' : 'Seguir') + '</button>';
    } else {
      action = '<a class="button small primary" href="#conta">Entrar para seguir</a>';
    }
    return '<section class="public-profile-page" aria-label="Perfil público">' +
      '<div class="public-profile-toolbar"><span class="eyebrow">REDE LIMIAR / PERFIL</span><a class="button small ghost" href="#conta">← Voltar</a></div>' +
      '<div class="public-profile-banner" aria-hidden="' + (!profile.banner) + '">' + banner + '</div>' +
      '<article class="public-profile-card"><div class="public-profile-avatar">' + avatar + '</div><div class="public-profile-info">' +
      '<span class="eyebrow">@' + escapeHtml(profile.handle) + '</span><h1>' + escapeHtml(profile.displayName) + '</h1>' +
      '<p class="public-profile-bio">' + escapeHtml(profile.bio || 'Agente da rede LIMIAR.') + '</p>' +
      '<div class="public-profile-stats"><span class="public-profile-stat"><b>' + Number(profile.followerCount || 0) + '</b> seguidores</span><span class="public-profile-stat"><b>' + Number(profile.followingCount || 0) + '</b> seguindo</span></div>' +
      '<div class="public-profile-actions">' + action + '</div></div></article></section>';
  }

  function setAccountNavigation(handle) {
    const crumb = document.querySelector('#crumb');
    if (crumb) crumb.textContent = 'Perfil / @' + handle;
    const nav = document.querySelector('#navigation');
    if (nav) nav.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hasAttribute('data-account-link')));
    document.title = '@' + handle + ' — LIMIAR';
  }

  function showProfileError(error) {
    const app = document.querySelector('#app');
    if (!app) return;
    app.innerHTML = '<section class="panel public-profile-loading"><span class="eyebrow">PERFIL INDISPONÍVEL</span><h2>Não foi possível abrir este perfil</h2><p>' + escapeHtml(error?.message || 'Verifique o nome de usuário e tente novamente.') + '</p><a class="button small ghost" href="#conta">Voltar para a conta</a></section>';
  }

  async function renderProfile(handle) {
    const id = ++renderId;
    const app = document.querySelector('#app');
    if (!app) return;
    setAccountNavigation(handle || '');
    app.innerHTML = '<section class="panel public-profile-loading" aria-live="polite">Consultando arquivo público…</section>';
    if (!/^[a-z0-9_]{3,24}$/i.test(handle)) {
      showProfileError(new Error('Nome de usuário inválido.'));
      return;
    }
    try {
      const [profile] = await Promise.all([loadProfile(handle), loadCurrentAccount()]);
      if (id !== renderId || routeHandle()?.toLowerCase() !== handle.toLowerCase()) return;
      setAccountNavigation(profile.handle);
      app.innerHTML = profileMarkup(profile);
    } catch (error) {
      if (id === renderId && routeHandle()?.toLowerCase() === handle.toLowerCase()) showProfileError(error);
    }
  }

  function enhanceSocialRows(root = document) {
    root.querySelectorAll('.account-list-row').forEach(row => {
      const socialPanel = row.closest('.account-social-grid')?.querySelector('.account-section');
      const isSocialRow = row.closest('#social-search-results') || (socialPanel && socialPanel.contains(row));
      if (!isSocialRow || row.querySelector('.public-profile-link')) return;
      const text = [row.querySelector('small')?.textContent, row.querySelector('b')?.textContent].filter(Boolean).join(' ');
      const match = text.match(/@([a-z0-9_]{3,24})\b/i);
      if (!match) return;
      const link = document.createElement('a');
      link.className = 'button small ghost public-profile-link';
      link.href = '#perfil/' + encodeURIComponent(match[1]);
      link.textContent = 'Ver perfil';
      link.setAttribute('aria-label', 'Ver perfil de @' + match[1]);
      row.append(link);
    });
  }

  const previousRender = window.render;
  if (typeof previousRender === 'function') {
    window.render = function (...args) {
      const result = previousRender.apply(this, args);
      const handle = routeHandle();
      if (handle !== null) renderProfile(handle);
      else {
        renderId++;
        document.title = 'LIMIAR — Arquivo Paranormal';
        enhanceSocialRows(document.querySelector('#app') || document);
      }
      return result;
    };
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-social-action="follow"], [data-social-action="unfollow"]');
    if (!action) return;
    profiles.delete(String(action.dataset.handle || '').toLowerCase());
    accountCheckedAt = 0;
  }, true);

  const app = document.querySelector('#app');
  if (app && 'MutationObserver' in window) {
    new MutationObserver(() => enhanceSocialRows(app)).observe(app, { childList: true, subtree: true });
  }
  enhanceSocialRows(app || document);
})();
