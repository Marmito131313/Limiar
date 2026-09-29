(() => {
  const expandedRules = [
    ['LIVRO BASE', 'Personagem e progressão · OPRPG pp. 12–37', 'A criação começa pela identidade do agente, origem, classe e distribuição dos atributos. Registre a progressão da campanha e consulte o capítulo para escolhas e benefícios de cada etapa.'],
    ['LIVRO BASE', 'Perícias · OPRPG pp. 38–49', 'As perícias descrevem treinamento e entram nos testes quando a ação exige uma especialidade. A ficha registra o grau; o mestre escolhe a DT e considera circunstâncias, ajuda e condições.'],
    ['LIVRO BASE', 'Equipamento e inventário · OPRPG pp. 50–67', 'Confira categoria, espaços, proficiência e efeitos antes de usar um item. O guia da ficha soma a carga registrada, mas a mesa valida regras especiais, disponibilidade e limites de equipamento.'],
    ['LIVRO BASE', 'Testes, cenas e combate · OPRPG pp. 68–93', 'Este capítulo reúne resolução de ações, turnos, ações, ataques, defesa, dano, condições e recuperação. Use o resumo da ficha para rolar e confira o livro quando uma regra depender de alcance, reação ou efeito específico.'],
    ['LIVRO BASE', 'O Outro Lado, poderes e rituais · OPRPG pp. 94–151', 'A consulta cobre elementos, manifestações, poderes paranormais e conjuração. Cada ritual mantém execução, alcance, alvo, duração, resistência e efeito separados na ficha; custo e consequências devem seguir a edição da mesa.'],
    ['LIVRO BASE', 'Investigações e condução · OPRPG pp. 152–175', 'O capítulo do mestre traz estrutura de mistérios, pistas, cenas e preparação de missões. Organize pistas por origem e relevância; uma falha em teste não deve apagar a única forma de avançar na investigação.'],
    ['LIVRO BASE', 'Ameaças · OPRPG pp. 176–293', 'As fichas de ameaça agrupam VD, defesa, pontos de vida, resistências, vulnerabilidades, ações e poderes. Compare o desafio ao grupo e ajuste a cena de acordo com o objetivo narrativo e os recursos dos agentes.'],
    ['LIVRO BASE', 'Cenário e referências · OPRPG pp. 294–318', 'Use a parte final para consultar o cenário, termos e material de referência da edição. O LIMIAR registra informações da mesa; não substitui o livro nem decide efeitos automaticamente.'],
    ['SUPLEMENTO', 'Sobreviventes e opções · Sobrevivendo ao Horror pp. 6–61', 'O suplemento apresenta origens, caminhos para Combatente, Especialista e Ocultista sobreviventes, a classe Sobrevivente, poderes, equipamento, opções paranormais, novos rituais e itens amaldiçoados. O guia da ficha permite acompanhar estágio, mas escolhas e benefícios vêm do livro.'],
    ['SUPLEMENTO', 'Investigação livre e eventos · Sobrevivendo ao Horror pp. 81–86', 'As regras adicionais ampliam ações de investigação e eventos. O texto também sugere conduzir certas buscas sem turnos rígidos: descreva o local, deixe os agentes proporem ações e peça testes quando o resultado for incerto.'],
    ['SUPLEMENTO', 'Medo em jogo · Sobrevivendo ao Horror pp. 87–89', 'O capítulo oferece formas de colocar medo em cena e uma tabela de consequências. Combine antes o tom da campanha e use as regras da mesa para testes, efeitos e duração; os marcadores do LIMIAR não aplicam penalidades sozinhos.'],
    ['SUPLEMENTO', 'Perseguições · Sobrevivendo ao Horror pp. 90–91', 'Uma perseguição alterna decisões dos participantes com testes e obstáculos. O mestre define quantos sucessos encerram a cena e como falhas mudam o risco; a extensão pode variar conforme a perseguição seja curta ou longa.'],
    ['SUPLEMENTO', 'Furtividade e visibilidade · Sobrevivendo ao Horror pp. 92–93', 'A seção organiza ações cautelosas, chamativas e de distração por visibilidade. Use a descrição da ação para decidir o teste e como a cena reage; esconder-se, mover-se e chamar atenção não são a mesma escolha.'],
    ['SUPLEMENTO', 'Preparação e vida além da Ordem · Sobrevivendo ao Horror pp. 94–97', 'O suplemento inclui fabricação em campo e interesses pessoais entre missões. Buscas pessoais podem ser organizadas como pequenos mistérios, com motivo, pistas e etapas combinadas entre jogador e mestre.'],
    ['SUPLEMENTO', 'Regras opcionais · Sobrevivendo ao Horror pp. 98–113', 'As opções abrangem progressão por NEX e experiência, jogo sem Sanidade, ferimentos debilitantes, partidas sem mapa e evolução por patentes. A mesa escolhe quais usar antes de aplicar mudanças à ficha.'],
    ['SUPLEMENTO', 'Limites e conjuração complexa · Sobrevivendo ao Horror pp. 113–116', 'O capítulo discute limites de compreensão e oferece uma conjuração ritualística em etapas, com preparação do símbolo, componentes e manifestação. São opções de tom e dificuldade; use apenas quando o grupo adotar essa regra.'],
    ['SUPLEMENTO', 'Rituais desconhecidos e desastres · Sobrevivendo ao Horror pp. 117–118', 'Tentar conjurar um ritual não estudado pode gerar consequências graves conforme a regra opcional. Não trate a importação de um ritual para a ficha como aprendizado automático: mestre e jogador definem acesso, custo e consequências.'],
    ['SUPLEMENTO', 'Combate narrativo · Sobrevivendo ao Horror pp. 119–123', 'O combate pode ser descrito sem mapa, preservando posição, alcance aproximado, risco e intenção. O mestre traduz distâncias para categorias claras e mantém decisões táticas compreensíveis para todo mundo.'],
    ['SUPLEMENTO', 'Missões prontas · Sobrevivendo ao Horror pp. 166–221', 'As duas missões do suplemento incluem estrutura, cenas e ameaças para adaptação. O painel de operação do LIMIAR ajuda a separar briefing, pistas, NPCs, criaturas, documentos e linha do tempo.']
  ];
  if (!window.__limiarExpandedRules && Array.isArray(rules)) {
    rules.push(...expandedRules);
    window.__limiarExpandedRules = true;
  }

  const originalRenderTab = renderTab;
  renderTab = function (a) {
    if (tab === 'notas') {
      const d = a.description && typeof a.description === 'object' ? a.description : {};
      const fields = [
        ['notes', 'Anotações', d.notes || a.notes || ''],
        ['appearance', 'Aparência', d.appearance || ''],
        ['personality', 'Personalidade', d.personality || ''],
        ['history', 'Histórico', d.history || ''],
        ['objective', 'Objetivo', d.objective || '']
      ];
      return '<div class="section-title"><h3>Descrição do agente</h3><span class="meta">Salvo ao digitar</span></div>' +
        '<p class="hint">Campos separados como no C.R.I.S.; a descrição não altera atributos nem regras.</p>' +
        '<div class="agent-description-grid">' + fields.map(([key, label, value]) =>
          '<label class="field full">' + label + '<textarea rows="' + (key === 'history' || key === 'notes' ? '6' : '4') + '" data-agent-description="' + key + '" aria-label="' + label + '" placeholder="Escreva ' + label.toLocaleLowerCase('pt-BR') + '…">' + esc(value) + '</textarea></label>'
        ).join('') + '</div><div class="actions" style="margin-top:20px">' +
        button('Duplicar ficha', 'duplicate', 'ghost small') + button('Excluir ficha', 'delete-agent', 'danger small') + '</div>';
    }
    let html = originalRenderTab(a);
    if (tab === 'rituais') {
      for (const ritual of a.abilities.filter(x => x.type === 'Ritual')) {
        const effect = String(ritual.effect || '').trim().replace(/\s+/g, ' ');
        const notes = String(ritual.notes || '').trim().replace(/\s+/g, ' ');
        if (effect && notes && effect === notes) html = html.replace('<p>' + esc(ritual.notes) + '</p>', '');
      }
    }
    return html;
  };

  const originalModal = modal;
  modal = function (title, html, onSubmit) {
    if (title === 'Novo registro' || title === 'Editar personagem') {
      const a = title === 'Novo registro' ? { description: {}, notes: '' } : agent(), d = a.description && typeof a.description === 'object' ? a.description : {};
      const fields = [
        ['notes', 'Anotações', d.notes || a.notes || ''],
        ['appearance', 'Aparência', d.appearance || ''],
        ['personality', 'Personalidade', d.personality || ''],
        ['history', 'Histórico', d.history || ''],
        ['objective', 'Objetivo', d.objective || '']
      ];
      const section = '<div class="full"><h3>Descrição do agente</h3><p class="hint">Anotações, aparência, personalidade, histórico e objetivo ficam separados.</p></div>' +
        fields.map(([key, label, value]) => '<label class="field full">' + label + '<textarea name="profile_' + key + '" rows="' + (key === 'history' || key === 'notes' ? '4' : '3') + '" maxlength="12000">' + esc(value) + '</textarea></label>').join('');
      html = html.replace('<div class="full"><h3>Atributos</h3>', section + '<div class="full"><h3>Atributos</h3>');
      const submit = onSubmit;
      onSubmit = function (form) {
        submit(form);
        const target = state.agents.find(x => x.id === state.selected);
        if (target) {
          target.description = {
            notes: String(form.get('profile_notes') || ''),
            appearance: String(form.get('profile_appearance') || ''),
            personality: String(form.get('profile_personality') || ''),
            history: String(form.get('profile_history') || ''),
            objective: String(form.get('profile_objective') || '')
          };
          target.notes = target.description.notes;
          save();
          render();
        }
      };
    }
    return originalModal(title, html, onSubmit);
  };

  const originalMapCrisAgent = mapCrisAgent;
  mapCrisAgent = function (raw) {
    const imported = originalMapCrisAgent(raw);
    const fields = Object.fromEntries(Object.entries(raw.fields || {}).map(([key, value]) => [key, firestoreValue(value)]));
    const source = fields.description && typeof fields.description === 'object' ? fields.description : {};
    const description = {
      notes: cleanCrisText(source.anotation || source.annotation || source.notes || ''),
      appearance: cleanCrisText(source.physical || source.appearance || ''),
      personality: cleanCrisText(source.personal || source.personality || ''),
      history: cleanCrisText(source.history || ''),
      objective: cleanCrisText(source.goal || source.objective || '')
    };
    if (!Object.values(description).some(Boolean)) description.notes = imported.notes || '';
    imported.description = description;
    imported.notes = description.notes;
    return imported;
  };

  const originalApplyCrisAdvanced = applyCrisAdvanced;
  applyCrisAdvanced = function (imported, targetId, form) {
    originalApplyCrisAdvanced(imported, targetId, form);
    if (!form.has('includeNotes') || !imported.description) return;
    const target = state.agents.find(x => x.id === state.selected);
    if (!target) return;
    const existing = target.description && typeof target.description === 'object' ? target.description : {};
    target.description = { ...existing };
    for (const key of ['notes', 'appearance', 'personality', 'history', 'objective']) {
      const incoming = String(imported.description[key] || '').trim();
      if (incoming && !target.description[key]) target.description[key] = incoming;
    }
    target.notes = target.description.notes || target.notes || '';
    save();
    render();
  };

  const originalRenderRules = renderRules;
  renderRules = function () {
    return originalRenderRules().replace(
      'Esta versão tem cálculos básicos e registros manuais; não inclui um catálogo completo de origens, trilhas, poderes, rituais ou ameaças.',
      'O guia combina resumos de consulta com referências de capítulo e página dos livros. As regras opcionais dependem da escolha da mesa; confirme exceções e efeitos completos na edição usada.'
    );
  };

  const originalRenderHomebrew = renderHomebrew;
  renderHomebrew = function () {
    const html = originalRenderHomebrew();
    const add = button('+ Adicionar ' + homebrewTab.toLocaleLowerCase('pt-BR'), 'new-homebrew', 'primary');
    return html.replace(add, add + button('Importar do C.R.I.S.', 'cris-homebrew-import', 'ghost'));
  };

  const originalRenderUpdates = renderUpdates;
  renderUpdates = function () {
    const html = originalRenderUpdates();
    const cards = '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">◉</span><span class="eyebrow">FICHA / DESCRIÇÃO</span></div><h2>Descrição em campos separados</h2><p>Anotações, aparência, personalidade, histórico e objetivo agora ficam organizados na ficha e acompanham a importação do C.R.I.S.</p></article>' +
      '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">◇</span><span class="eyebrow">C.R.I.S. / HOMEBREWS</span></div><h2>Importação de criações</h2><p>O LIMIAR aceita links públicos ou dados JSON de ameaças, habilidades, rituais e itens, com prévia antes de salvar.</p></article>' +
      '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">✧</span><span class="eyebrow">RITUAIS / FICHA</span></div><h2>Efeito sem duplicação</h2><p>O cartão exibe o texto do efeito uma vez, mesmo em rituais importados com a descrição repetida.</p></article>' +
      '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">▤</span><span class="eyebrow">CONTAS / MESA</span></div><h2>Perfil e rede de amigos</h2><p>Crie sua conta, personalize foto e banner, siga agentes, receba convites de sessão e compartilhe PDFs da biblioteca.</p><div class="update-note">O armazenamento de PDFs depende do vínculo R2 do Worker.</div></article>' +
      '<article class="panel update-card"><div class="update-card-head"><span class="update-card-mark">⌘</span><span class="eyebrow">GUIA / REFERÊNCIAS</span></div><h2>Guia de regras ampliado</h2><p>Novos resumos organizam capítulos do livro base e de Sobrevivendo ao Horror com páginas para consulta durante a sessão.</p></article>';
    return html.replace('</div><div class="updates-footnote">', cards + '</div><div class="updates-footnote">')
      .replace('Registro baseado nas melhorias confirmadas na versão publicada.', 'Versão 32 · importação, descrição, contas, PDFs e guia de regras.');
  };

  document.addEventListener('input', event => {
    const field = event.target.closest('[data-agent-description]');
    if (!field || !loaded) return;
    const a = agent(), key = field.dataset.agentDescription;
    a.description = a.description && typeof a.description === 'object' ? a.description : {};
    a.description[key] = field.value;
    if (key === 'notes') a.notes = field.value;
    save();
  });

  const accountState = { account: null, social: { following: [], followers: [], invites: [] }, sharedBooks: [], ownedShares: [], search: [], loading: false, dataLoaded: false };
  let accountSearchTimer = 0, accountDraft = {};

  async function readJson(response) {
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a solicitação.');
    return data;
  }
  async function getJson(path) {
    return readJson(await fetch(path, { credentials: 'same-origin', headers: { Accept: 'application/json' } }));
  }
  async function postJson(path, body) {
    return readJson(await fetch(path, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }));
  }
  async function putJson(path, body) {
    return readJson(await fetch(path, { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }));
  }
  function pendingArchiveKey() {
    return 'limiar-pending-account-state-' + String(accountState.account?.handle || 'unknown').toLowerCase();
  }
  function preserveGuestArchive() {
    if (!guestMode || !accountState.account?.handle) return;
    try { localStorage.setItem(pendingArchiveKey(), JSON.stringify({ ...state })); } catch {}
  }
  async function finishLogin(result) {
    accountState.account = result.account;
    preserveGuestArchive();
    guestMode = false;
    document.body.classList.remove('guest');
    await boot();
    if (!result.hasArchive) save();
    await refreshAccountData();
    render();
    toast('Conta LIMIAR conectada.');
  }
  async function refreshAccountData() {
    if (!accountState.account) return;
    try {
      const results = await Promise.all([getJson('/api/social'), getJson('/api/books')]);
      accountState.social = results[0];
      books = { ...results[1] };
      accountState.sharedBooks = Array.isArray(results[1]._shared) ? results[1]._shared : [];
      accountState.ownedShares = Array.isArray(results[1]._sharedByMe) ? results[1]._sharedByMe : [];
      accountState.dataLoaded = true;
    } catch (error) {
      if (!guestMode) toast(error.message);
      accountState.dataLoaded = true;
    }
  }
  async function refreshAccount() {
    try {
      const result = await getJson('/api/auth/me');
      accountState.account = result.account || null;
      if (accountState.account) await refreshAccountData();
      if (loaded) render();
    } catch {}
  }

  function accountLink() {
    const nav = document.querySelector('#navigation');
    if (!nav || nav.querySelector('[data-account-link]')) return;
    const active = location.hash.split('/')[0] === '#conta';
    nav.insertAdjacentHTML('beforeend', '<a data-account-link href="#conta" class="' + (active ? 'active' : '') + '"><span class="nav-icon">◎</span>Conta' +
      (accountState.account ? '<span class="account-handle">@' + esc(accountState.account.handle) + '</span>' : '') + '</a>');
  }
  function accountNavRender() {
    const accountPage = location.hash.slice(1).split('/')[0] === 'conta';
    accountLink();
    if (!accountPage) return;
    document.querySelector('#crumb').textContent = 'Conta';
    document.querySelectorAll('#navigation a').forEach(a => a.classList.toggle('active', a.hasAttribute('data-account-link')));
    document.querySelector('#app').innerHTML = renderAccountPage();
    if (accountState.account && !accountState.loading && !accountState.dataLoaded) {
      accountState.loading = true;
      refreshAccountData().then(() => {
        accountState.loading = false;
        if (location.hash.slice(1).split('/')[0] === 'conta') accountNavRender();
      }).catch(() => { accountState.loading = false; });
    }
  }
  const baseRender = render;
  render = function (...args) {
    const result = baseRender.apply(this, args);
    accountNavRender();
    return result;
  };

  function accountAuthMarkup() {
    return '<section class="account-auth-grid"><article class="panel account-auth-card"><span class="eyebrow">ARQUIVO PESSOAL</span><h2>Entrar</h2><p>Use seu nome de usuário LIMIAR.</p><form data-auth-form="login"><label class="field full">Usuário<input name="handle" autocomplete="username" required maxlength="24"></label><label class="field full">Senha<input name="password" type="password" autocomplete="current-password" required maxlength="128"></label><button class="button primary" type="submit">Entrar na conta</button></form></article><article class="panel account-auth-card"><span class="eyebrow">NOVO ACESSO</span><h2>Criar conta</h2><p>Seu perfil pode usar banner, imagem e nome público.</p><form data-auth-form="register"><label class="field full">Nome de usuário<input name="handle" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" required><small>3–24 letras, números ou _.</small></label><label class="field full">Nome de exibição<input name="displayName" autocomplete="nickname" maxlength="50" required></label><label class="field full">Senha<input name="password" type="password" autocomplete="new-password" minlength="10" maxlength="128" required><small>Use ao menos 10 caracteres.</small></label><button class="button primary" type="submit">Criar conta LIMIAR</button></form></article></section><div class="notice">A conta salva seus dados no arquivo LIMIAR. Mantenha sua senha segura; não há recuperação automática de senha nesta versão.</div>';
  }
  function friendOptions() {
    return (accountState.social.following || []).map(p => '<option value="' + esc(p.handle) + '">' + esc(p.display_name) + ' (@' + esc(p.handle) + ')</option>').join('');
  }
  function accountInviteMarkup() {
    const campaigns = (state.campaigns || []).filter(c => c.shareCode);
    return '<section class="panel account-section"><div class="section-title"><h2>Convidar para uma sessão</h2><span class="badge muted">AMIGOS</span></div>' +
      (accountState.social.following?.length ? (campaigns.length ?
        '<form data-social-form="invite"><label class="field">Pessoa<select name="handle" required>' + friendOptions() + '</select></label><label class="field">Campanha<select name="campaignCode" required>' + campaigns.map(c => '<option value="' + esc(c.shareCode) + '">' + esc(c.name) + '</option>').join('') + '</select></label><button class="button primary small" type="submit">Enviar convite</button></form>' :
        '<p class="hint">Compartilhe primeiro uma campanha pela aba Campanhas; depois ela aparecerá aqui para convidar um amigo.</p>') :
        '<p class="hint">Siga alguém para convidar essa pessoa para uma sessão.</p>') + '</section>';
  }
  function renderAccountPage() {
    if (!accountState.account) return pagehead('CONTA / PERFIL','Minha conta','Entre ou crie uma conta para personalizar seu perfil e usar os recursos sociais.') + accountAuthMarkup();
    const a = accountState.account, banner = a.banner ? ' style="background-image:url(' + esc(a.banner) + ')"' : '';
    const avatar = a.avatar ? '<img src="' + esc(a.avatar) + '" alt="Foto de ' + esc(a.displayName) + '">' : '<span>' + esc(a.displayName.split(/\s+/).map(x => x[0]).slice(0, 2).join('')) + '</span>';
    const followers = accountState.social.followers || [], following = accountState.social.following || [], invites = accountState.social.invites || [];
    const pending = localStorage.getItem(pendingArchiveKey());
    const bookKeys = ['base','horror','as1','as2','as3','as4','as5','as6','as7'].filter(key => books[key]);
    const sharedRows = accountState.sharedBooks.map(b => '<article class="account-list-row"><div><b>' + esc(b.name) + '</b><small>Compartilhado por ' + esc(b.ownerName) + ' (@' + esc(b.ownerHandle) + ')</small></div><a class="button small ghost" href="#livros" data-social-action="open-shared" data-id="' + esc(b.id) + '">Abrir PDF</a></article>').join('');
    const ownedRows = accountState.ownedShares.map(b => '<article class="account-list-row"><div><b>' + esc(b.name) + '</b><small>Com @' + esc(b.handle) + '</small></div><button class="button small ghost" data-social-action="revoke-pdf" data-key="' + esc(b.bookKey) + '" data-handle="' + esc(b.handle) + '">Revogar</button></article>').join('');
    const inviteRows = invites.map(i => '<article class="account-list-row"><div><b>' + esc(i.display_name) + ' (@' + esc(i.handle) + ')</b><small>Convite de sessão · ' + new Date(i.created_at).toLocaleDateString('pt-BR') + '</small></div><button class="button small primary" data-social-action="accept-invite" data-id="' + esc(i.id) + '" data-code="' + esc(i.campaign_code) + '">Abrir campanha</button></article>').join('');
    return pagehead('CONTA / PERFIL','Minha conta','Perfil, amigos, convites e documentos compartilhados.') +
      '<div class="account-profile-hero"' + banner + '><div class="account-avatar">' + avatar + '</div><div><span class="eyebrow">@' + esc(a.handle) + '</span><h2>' + esc(a.displayName) + '</h2><p>' + esc(a.bio || 'Agente da rede LIMIAR.') + '</p></div><button class="button small ghost" data-social-action="logout">Sair da conta</button></div>' +
      '<section class="panel account-section"><div class="section-title"><h2>Personalizar perfil</h2><span class="badge muted">COSMÉTICO</span></div><form id="account-profile-form"><div class="form-grid"><label class="field">Nome de exibição<input name="displayName" value="' + esc(a.displayName) + '" maxlength="50" required></label><label class="field">Nome de usuário<input value=" @' + esc(a.handle) + '" disabled></label><label class="field full">Biografia<textarea name="bio" rows="3" maxlength="500">' + esc(a.bio || '') + '</textarea></label><label class="field">Foto de perfil<input type="file" accept="image/jpeg,image/png,image/webp" data-account-image="avatar"><small>JPG, PNG ou WebP; será otimizada.</small></label><label class="field">Banner<input type="file" accept="image/jpeg,image/png,image/webp" data-account-image="banner"><small>Imagem horizontal, otimizada pelo navegador.</small></label></div><div class="account-image-previews"><img id="account-preview-avatar" src="' + esc(accountDraft.avatar || a.avatar || '') + '" alt="Prévia da foto" ' + (accountDraft.avatar || a.avatar ? '' : 'hidden') + '><img id="account-preview-banner" src="' + esc(accountDraft.banner || a.banner || '') + '" alt="Prévia do banner" ' + (accountDraft.banner || a.banner ? '' : 'hidden') + '></div><button class="button primary small" type="submit">Salvar perfil</button></form></section>' +
      (pending ? '<section class="notice account-import-local"><b>Arquivo local encontrado.</b> Você pode mesclar os agentes e campanhas deste navegador com a conta, sem substituir o que já está salvo. <button class="button small primary" data-social-action="merge-local">Importar e mesclar</button></section>' : '') +
      '<section class="account-social-grid"><article class="panel account-section"><div class="section-title"><h2>Encontrar agentes</h2><span class="badge">' + following.length + ' seguindo</span></div><label class="field full">Buscar por nome de usuário<input id="social-search" placeholder="Digite ao menos 2 letras" maxlength="24" autocomplete="off"></label><div id="social-search-results"></div><h3>Seguindo</h3><div class="account-list">' + (following.map(p => '<article class="account-list-row"><div><b>' + esc(p.display_name) + '</b><small>@' + esc(p.handle) + '</small></div><button class="button small ghost" data-social-action="unfollow" data-handle="' + esc(p.handle) + '">Deixar de seguir</button></article>').join('') || '<p class="hint">Você ainda não segue ninguém.</p>') + '</div><h3>Seguidores</h3><div class="account-list">' + (followers.map(p => '<article class="account-list-row"><div><b>' + esc(p.display_name) + '</b><small>@' + esc(p.handle) + '</small></div></article>').join('') || '<p class="hint">Ainda não há seguidores.</p>') + '</div></article><article class="panel account-section"><div class="section-title"><h2>Convites recebidos</h2><span class="badge">' + invites.filter(x => x.status === 'pending').length + ' pendentes</span></div><div class="account-list">' + (inviteRows || '<p class="hint">Nenhum convite recebido.</p>') + '</div><h3>Compartilhar PDFs</h3>' + (books._pdfStorage === false ? '<div class="notice">O vínculo R2 de PDFs ainda não está configurado neste Worker.</div>' : '') + '<form data-social-form="pdf-share"><label class="field full">PDF<select name="bookKey" required>' + bookKeys.map(k => '<option value="' + k + '">' + esc(books[k].name) + '</option>').join('') + '</select></label><label class="field full">Amigo<select name="handle" required>' + friendOptions() + '</select></label><button class="button primary small" type="submit" ' + (!bookKeys.length || !following.length || books._pdfStorage === false ? 'disabled' : '') + '>Compartilhar PDF</button></form><p class="hint">O arquivo continua na sua biblioteca; a pessoa recebe acesso até você revogar.</p><h3>Compartilhados por você</h3><div class="account-list">' + (ownedRows || '<p class="hint">Nenhum PDF compartilhado.</p>') + '</div><h3>Compartilhados comigo</h3><div class="account-list">' + (sharedRows || '<p class="hint">Nenhum PDF recebido.</p>') + '</div></article></section>' +
      accountInviteMarkup();
  }

  async function compressImage(file, maxWidth, maxHeight, maxBytes) {
    if (!file || file.size > 12000000) throw new Error('Escolha uma imagem de até 12 MB.');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('Não foi possível abrir esta imagem.')); image.src = url; });
      const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      let blob;
      for (const quality of [0.86, 0.72, 0.58, 0.45]) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob && blob.size <= maxBytes) break;
      }
      if (!blob || blob.size > maxBytes) throw new Error('A imagem não pôde ser reduzida. Escolha outra.');
      return await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Não foi possível ler a imagem.')); reader.readAsDataURL(blob); });
    } finally { URL.revokeObjectURL(url); }
  }
  function mergeLocalArchive() {
    try {
      const key = pendingArchiveKey(), old = JSON.parse(localStorage.getItem(key) || 'null');
      const data = validateBackup({ version: 1, ...old });
      const merge = (target, incoming) => { const ids = new Set(target.map(x => x.id)); for (const item of incoming || []) if (!ids.has(item.id)) target.push(item); };
      merge(state.agents, data.agents);
      merge(state.campaigns, data.campaigns);
      merge(state.homebrew, data.homebrew || []);
      merge(state.threats, data.threats || []);
      merge(state.rolls, data.rolls || []);
      save();
      localStorage.removeItem(key);
      render();
      toast('O arquivo local foi mesclado sem substituir os dados da conta.');
    } catch (error) { toast(error.message || 'Não foi possível importar o arquivo local.'); }
  }

  const originalRenderBooks = renderBooks;
  renderBooks = function () {
    const html = originalRenderBooks();
    const entries = accountState.sharedBooks.map(b => '<article class="panel account-list-row"><div><b>' + esc(b.name) + '</b><small>De @' + esc(b.ownerHandle) + '</small></div><button class="button small primary" data-social-action="open-shared" data-id="' + esc(b.id) + '">Ler agora</button></article>').join('');
    const storageNotice = books._pdfStorage === false ? '<div class="notice">Os PDFs precisam de um bucket R2 ligado ao Worker para serem enviados e compartilhados.</div>' : '';
    if (!entries) return storageNotice + html;
    return storageNotice + html + '<section class="panel account-section shared-pdf-section"><div class="section-title"><h2>PDFs compartilhados comigo</h2><span class="badge">' + accountState.sharedBooks.length + '</span></div><div class="account-list">' + entries + '</div></section>';
  };

  document.addEventListener('change', async event => {
    const file = event.target.closest('[data-account-image]');
    if (!file || !accountState.account) return;
    try {
      const key = file.dataset.accountImage;
      accountDraft[key] = await compressImage(file.files[0], key === 'avatar' ? 600 : 1600, key === 'avatar' ? 600 : 600, key === 'avatar' ? 220000 : 520000);
      const preview = document.querySelector('#account-preview-' + key);
      if (preview) { preview.src = accountDraft[key]; preview.hidden = false; }
    } catch (error) { toast(error.message); }
  });

  document.addEventListener('input', event => {
    if (event.target.id !== 'social-search') return;
    clearTimeout(accountSearchTimer);
    accountSearchTimer = setTimeout(async () => {
      const q = event.target.value.trim();
      const results = document.querySelector('#social-search-results');
      if (!results) return;
      if (q.length < 2) { results.innerHTML = ''; return; }
      try {
        const data = await getJson('/api/social/search?q=' + encodeURIComponent(q));
        accountState.search = data.people || [];
        results.innerHTML = accountState.search.map(p => '<article class="account-list-row"><div><b>' + esc(p.display_name) + '</b><small>@' + esc(p.handle) + '</small></div><button class="button small ' + (p.following ? 'ghost' : 'primary') + '" data-social-action="' + (p.following ? 'unfollow' : 'follow') + '" data-handle="' + esc(p.handle) + '">' + (p.following ? 'Deixar de seguir' : 'Seguir') + '</button></article>').join('') || '<p class="hint">Nenhum perfil encontrado.</p>';
      } catch (error) { results.innerHTML = '<p class="hint">' + esc(error.message) + '</p>'; }
    }, 250);
  });

  document.addEventListener('submit', async event => {
    const auth = event.target.closest('[data-auth-form]');
    const profile = event.target.closest('#account-profile-form');
    const social = event.target.closest('[data-social-form]');
    if (!auth && !profile && !social) return;
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      if (auth) {
        const mode = auth.dataset.authForm;
        const data = await postJson('/api/auth/' + mode, mode === 'register'
          ? { handle: form.get('handle'), displayName: form.get('displayName'), password: form.get('password') }
          : { handle: form.get('handle'), password: form.get('password') });
        await finishLogin(data);
      } else if (profile) {
        const result = await putJson('/api/account/profile', {
          displayName: form.get('displayName'), bio: form.get('bio'),
          avatar: accountDraft.avatar ?? accountState.account.avatar ?? '',
          banner: accountDraft.banner ?? accountState.account.banner ?? ''
        });
        accountState.account = result.account;
        accountDraft = {};
        render();
        toast('Perfil atualizado.');
      } else if (social.dataset.socialForm === 'invite') {
        await postJson('/api/social/invites', { handle: form.get('handle'), campaignCode: form.get('campaignCode') });
        toast('Convite enviado.');
        await refreshAccountData();
        render();
      } else if (social.dataset.socialForm === 'pdf-share') {
        const key = String(form.get('bookKey') || '');
        if (!/^(base|horror|as[1-7])$/.test(key)) throw new Error('Escolha um PDF da biblioteca.');
        await postJson('/api/books/' + key + '/share', { handle: form.get('handle') });
        toast('PDF compartilhado.');
        await refreshAccountData();
        render();
      }
    } catch (error) { toast(error.message); }
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-social-action]');
    if (!button) return;
    const action = button.dataset.socialAction;
    event.preventDefault();
    try {
      if (action === 'logout') {
        await postJson('/api/auth/logout', {});
        accountState.account = null;
        accountState.social = { following: [], followers: [], invites: [] };
        accountState.dataLoaded = false;
        state = { agents: [example], selected: example.id, campaigns: [], rolls: [], homebrew: [], threats: [] };
        guestMode = true;
        document.body.classList.add('guest');
        await boot();
      } else if (action === 'follow' || action === 'unfollow') {
        await postJson('/api/social/follows', { handle: button.dataset.handle, action });
        await refreshAccountData();
        render();
      } else if (action === 'accept-invite') {
        const data = await postJson('/api/social/invites/' + button.dataset.id, {});
        location.hash = '#campanhas/' + (data.campaignCode || button.dataset.code);
      } else if (action === 'merge-local') {
        mergeLocalArchive();
      } else if (action === 'open-shared') {
        const id = button.dataset.id;
        if (!/^[0-9a-f-]{36}$/i.test(id || '')) throw new Error('Link de PDF inválido.');
        location.hash = '#livros';
        setTimeout(() => {
          const reader = document.querySelector('#reader');
          if (!reader) return;
          reader.innerHTML = '<section class="panel"><div class="panel-head"><h3>PDF compartilhado</h3></div><iframe title="Leitor de PDF compartilhado" src="/api/books/shared/' + id + '"></iframe></section>';
          reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else if (action === 'revoke-pdf') {
        const key = button.dataset.key;
        if (!/^(base|horror|as[1-7])$/.test(key || '')) throw new Error('PDF inválido.');
        await postJson('/api/books/' + key + '/share', { handle: button.dataset.handle, action: 'remove' });
        await refreshAccountData();
        render();
        toast('Acesso ao PDF revogado.');
      }
    } catch (error) { toast(error.message); }
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action="cris-homebrew-import"]');
    if (!button) return;
    event.preventDefault();
      modal('Importar homebrew do C.R.I.S.', '<p class="hint">Cole um link público de ameaça, habilidade, ritual ou item. Se o C.R.I.S. exigir login, você também pode colar os dados JSON do registro exportado. A prévia aparece antes de salvar.</p>' +
      '<label class="field full">Link ou ID<input name="crisHomebrewLink" maxlength="500" placeholder="https://crisordemparanormal.com/homebrews/ritual/…"></label>' +
      '<label class="field full">Categoria<select name="crisHomebrewType"><option value="auto">Detectar pelo link</option><option value="Ameaças">Ameaça</option><option value="Habilidades">Habilidade</option><option value="Rituais">Ritual</option><option value="Itens">Item</option></select></label>' +
      '<label class="field full">Dados JSON (opcional)<textarea name="crisHomebrewJson" rows="5" placeholder="{ &quot;name&quot;: &quot;...&quot; }"></textarea></label>',
      form => { importCrisHomebrew(String(form.get('crisHomebrewLink') || '').trim(), String(form.get('crisHomebrewType') || 'auto'), String(form.get('crisHomebrewJson') || '').trim()).catch(error => toast(error.message)); });
  }, true);

  function parseCrisLink(value, selectedType) {
    let url;
    try { url = new URL(value.startsWith('http') ? value : 'https://' + value); } catch { url = null; }
    const parts = url ? url.pathname.split('/').filter(Boolean) : [];
    let type = selectedType;
    let id = value.trim();
    if (parts.length >= 2 && parts[0] === 'ameaca') { type = 'Ameaças'; id = parts[1]; }
    if (parts.length >= 3 && parts[0] === 'homebrews') {
      id = parts[2];
      const map = { habilidade: 'Habilidades', ritual: 'Rituais', item: 'Itens' };
      type = map[String(parts[1]).toLowerCase()] || type;
    }
    if (type === 'auto') type = '';
    id = String(id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
    return { id, type };
  }
  function firestoreObject(raw) {
    if (raw && raw.fields) return Object.fromEntries(Object.entries(raw.fields).map(([key, value]) => [key, firestoreValue(value)]));
    return raw && typeof raw === 'object' ? raw : {};
  }
  const crisApiKey = 'AIzaSyADXK6U5j_hlSRxK3nfqyylmPXgUeGWsQ';
  function crisCollections(type) {
    if (type === 'Rituais') return ['rituais','rituals','homebrews_ritual','homebrew_ritual','homebrewRituals','customRituals','homebrews/ritual'];
    if (type === 'Itens') return ['items','itens','homebrews_item','homebrew_item','homebrewItems','customItems','homebrews/item'];
    if (type === 'Ameaças') return ['threats','ameaças','ameacas','monsters','homebrews_ameaca','homebrew_ameaca','homebrewThreats','customThreats','homebrews/ameaca'];
    return ['abilities','habilidades','homebrews_habilidade','homebrew_habilidade','homebrewAbilities','customAbilities','homebrews/habilidade'];
  }
  async function fetchCrisHomebrew(id, type) {
    const collections = [...new Set(['homebrews', 'homebrew', ...crisCollections(type)])];
    let lastStatus = 404;
    for (const collection of collections) {
      const paths = collection.includes('/') ? [collection + '/' + id] : [collection + '/' + id];
      for (const path of paths) {
        const url = 'https://firestore.googleapis.com/v1/projects/cris-ordem-paranormal/databases/(default)/documents/' + path + '?key=' + crisApiKey;
        try {
          const response = await fetch(url);
          lastStatus = response.status;
          if (response.ok) return firestoreObject(await response.json());
        } catch {}
      }
    }
    throw new Error(lastStatus === 403 || lastStatus === 401
      ? 'Este registro do C.R.I.S. exige login. Exporte ou copie o JSON para importar.'
      : 'Não encontrei esse registro público nas coleções do C.R.I.S. Confira o link ou cole o JSON.');
  }
  function firstValue(raw, keys, fallback = '') {
    for (const key of keys) if (raw[key] !== undefined && raw[key] !== null && raw[key] !== '') return raw[key];
    return fallback;
  }
  function normalizeCrisThreat(raw, id) {
    const data = { ...raw, id: uid() };
    const map = {
      name: ['name','title','nome'], element: ['element','elementName','elemento'],
      kind: ['kind','type','tipo'], size: ['size','tamanho'],
      movement: ['movement','movimento'], senses: ['senses','sentidos'],
      vd: ['vd','dangerValue','valorDeDesafio'], pv: ['pv','health','hp'],
      defense: ['defense','defesa'], description: ['description','descricao','text'],
      resistances: ['resistances','resistencias'], immunities: ['immunities','imunidades'],
      vulnerabilities: ['vulnerabilities','vulnerabilidades'], image: ['image','imageUrl','imageURL','photo','foto']
    };
    for (const [target, keys] of Object.entries(map)) data[target] = firstValue(raw, keys, data[target] || '');
    data.name = String(data.name || 'Ameaça importada');
    data.importedFrom = String(firstValue(raw, ['source','sourceName','origem'], 'C.R.I.S.'));
    delete data.source;
    data.crisId = id;
    const attributes = raw.attrs || raw.attributes || raw.stats || {};
    data.attrs = {
      AGI: Number(firstValue(attributes, ['AGI','agility','agilidade'], 1)) || 0,
      FOR: Number(firstValue(attributes, ['FOR','strength','forca'], 1)) || 0,
      INT: Number(firstValue(attributes, ['INT','intellect','intelecto'], 1)) || 0,
      PRE: Number(firstValue(attributes, ['PRE','presence','presenca'], 1)) || 0,
      VIG: Number(firstValue(attributes, ['VIG','vigor'], 1)) || 0
    };
    const normalizeAttack = (attack, fallbackName) => {
      if (typeof attack === 'string') return { name: fallbackName || 'Ataque', notes: attack, range: '', dice: null, bonus: 0, count: 1, crit: 20, multiplier: 2, damages: [] };
      const damage = firstValue(attack || {}, ['formula','damage','dano','damageFormula'], '');
      const damages = Array.isArray(attack?.damages) ? attack.damages : damage ? [{ formula: String(damage), type: String(firstValue(attack || {}, ['damageType','damage_type','tipoDano'], '')) }] : [];
      const roll = String(firstValue(attack || {}, ['roll','test','teste'], '')).match(/(\d+)d20\s*([+-]\d+)?/i);
      return {
        name: String(firstValue(attack || {}, ['name','title','nome'], fallbackName || 'Ataque')),
        range: String(firstValue(attack || {}, ['range','alcance'], '')),
        count: Number(firstValue(attack || {}, ['count','quantity','quantidade'], 1)) || 1,
        dice: Number(firstValue(attack || {}, ['dice','diceCount'], roll ? roll[1] : 1)),
        bonus: Number(firstValue(attack || {}, ['bonus','modifier'], roll ? roll[2] || 0 : 0)) || 0,
        crit: Number(firstValue(attack || {}, ['crit','critical'], 20)) || 20,
        multiplier: Number(firstValue(attack || {}, ['multiplier','criticalMultiplier'], 2)) || 2,
        damages: damages.map(d => typeof d === 'string' ? { formula: d, type: '' } : { formula: String(firstValue(d, ['formula','damage','dano'], '')), type: String(firstValue(d, ['type','damageType','tipo'], '')) }).filter(d => d.formula),
        notes: String(firstValue(attack || {}, ['notes','description','observations'], ''))
      };
    };
    const normalizeEntry = (entry, key, index) => {
      if (typeof entry === 'string') return { name: key === 'actions' ? `Ação ${index + 1}` : `Poder ${index + 1}`, kind: key === 'actions' ? 'Ação' : 'Poder', description: entry, attacks: [] };
      const name = String(firstValue(entry || {}, ['name','title','nome'], key === 'actions' ? `Ação ${index + 1}` : `Poder ${index + 1}`));
      let attacks = Array.isArray(entry?.attacks) ? entry.attacks : Array.isArray(entry?.attacksList) ? entry.attacksList : [];
      if (!attacks.length && firstValue(entry || {}, ['damage','dano','damageFormula'], '')) attacks = [entry];
      return { name, kind: String(firstValue(entry || {}, ['kind','type','tipo'], key === 'actions' ? 'Ação' : 'Poder')), description: cleanCrisText(firstValue(entry || {}, ['description','effect','text','notes'], '')), attacks: attacks.map(attack => normalizeAttack(attack, name)) };
    };
    const actionSource = firstValue(raw, ['actions','attacks','acoes'], []), powerSource = firstValue(raw, ['powers','abilities','poderes'], []), skillSource = firstValue(raw, ['skills','pericias','skillsList'], []);
    data.skills = (Array.isArray(skillSource) ? skillSource : Object.entries(skillSource || {}).map(([name, roll]) => typeof roll === 'object' ? { name, ...roll } : { name, roll })).map(skill => typeof skill === 'string' ? { name: skill, dice: 1, bonus: 0 } : skill);
    data.actions = (typeof actionSource === 'string' ? [actionSource] : Array.isArray(actionSource) ? actionSource : Object.values(actionSource || {})).map((x, i) => normalizeEntry(x, 'actions', i));
    data.powers = (Array.isArray(powerSource) ? powerSource : Object.values(powerSource || {})).map((x, i) => normalizeEntry(x, 'powers', i));
    return typeof thNormal === 'function' ? thNormal(data) : data;
  }
  function normalizeCrisHomebrew(raw, type, id) {
    const name = String(firstValue(raw, ['name','title','nome'], 'Conteúdo importado')).trim();
    const description = cleanCrisText(firstValue(raw, ['description','effect','notes','text','descricao','effects'], ''));
    if (type === 'Ameaças') return normalizeCrisThreat(raw, id);
    const textField = (keys, fallback = '') => {
      const value = firstValue(raw, keys, fallback);
      return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    };
    const result = {
      id: uid(), type, name, description, subtype: String(firstValue(raw, ['subtype','class','requirement','prerequisite','categoria'], '')),
      element: String(firstValue(raw, ['element','elementName','elemento'], '')),
      circle: Number(firstValue(raw, ['circle','level','circulo'], 1)) || 1,
      cost: Number(firstValue(raw, ['cost','peCost','costPE','pe','custo'], 0)) || 0,
      category: String(firstValue(raw, ['category','categoria'], '0')),
      space: Number(firstValue(raw, ['space','spaces','slots','espacos'], 1)) || 0,
      image: String(firstValue(raw, ['image','imageUrl','imageURL','photo','foto'], '')),
      source: 'C.R.I.S.', crisId: id
    };
    if (type === 'Rituais') Object.assign(result, {
      execution: textField(['execution','castingTime','execucao','tempoExecucao'], 'Padrão'),
      range: textField(['range','alcance'], 'Pessoal'),
      area: textField(['area','targetArea','areaAlvo']),
      target: textField(['target','targets','alvo']),
      duration: textField(['duration','duracao']),
      resistance: textField(['resistance','resistencia','savingThrow']),
      dice: textField(['dice','damage','dano']),
      diceDiscente: textField(['diceDiscente','discenteDice','discente','danoDiscente']),
      diceVerdadeiro: textField(['diceVerdadeiro','trueDice','verdadeiro','danoVerdadeiro']),
      effect: cleanCrisText(firstValue(raw, ['effect','description','notes','text','descricao','effects'], description)),
      prepared: false
    });
    return result;
  }
  async function importCrisHomebrew(value, selectedType, jsonText) {
    const parsed = parseCrisLink(value, selectedType);
    let type = parsed.type, raw;
    if (jsonText) {
      try { raw = JSON.parse(jsonText); } catch { throw new Error('O JSON não está válido.'); }
      if (raw.fields) raw = firestoreObject(raw);
      if (!type) {
        const hint = String(firstValue(raw, ['type','kind','category'], '')).toLowerCase();
        type = hint.includes('ritual') ? 'Rituais' : hint.includes('item') ? 'Itens' : hint.includes('ameaca') || hint.includes('threat') ? 'Ameaças' : 'Habilidades';
      }
    } else {
      if (!parsed.id || parsed.id.length < 8) throw new Error('Cole um link válido do C.R.I.S. ou os dados JSON.');
      if (!type) throw new Error('Escolha a categoria do registro.');
      raw = await fetchCrisHomebrew(parsed.id, type);
    }
    if (!['Ameaças','Habilidades','Rituais','Itens'].includes(type)) throw new Error('Categoria não compatível com homebrew.');
    const item = normalizeCrisHomebrew(raw, type, parsed.id);
    const duplicates = type === 'Ameaças' ? [...state.threats, ...state.homebrew.filter(x => x.type === 'Ameaças')] : state.homebrew.filter(x => x.type === type);
    const duplicate = duplicates.find(x => (type === 'Ameaças' || x.type === type) && crisNameKey(x.name) === crisNameKey(item.name));
    const summary = type === 'Ameaças'
      ? '<p class="hint">VD ' + esc(item.vd || '—') + ' · PV ' + esc(item.pv || '—') + ' · Defesa ' + esc(item.defense || '—') + '</p>'
      : '<p class="hint">' + esc(type === 'Rituais' ? (item.element || 'Elemento') + ' · ' + item.circle + 'º círculo · ' + item.cost + ' PE' : type === 'Itens' ? 'Categoria ' + item.category + ' · ' + item.space + ' espaços' : item.subtype || 'Habilidade') + '</p>';
    modal('Confirmar importação', '<div class="notice">Revise os dados antes de salvar.</div><h3>' + esc(item.name) + '</h3>' + summary + '<p>' + esc(item.description || 'Sem descrição recebida.') + '</p>' +
      (duplicate ? '<p class="hint">Já existe um registro com esse nome. Uma segunda cópia não será criada.</p>' : '') +
      '<p class="hint">Origem: C.R.I.S. · Link: ' + esc(value || 'JSON fornecido') + '</p>',
      () => {
        if (duplicate) throw new Error('Esse conteúdo já existe no LIMIAR.');
        if (type === 'Ameaças') {
          state.threats.push(item);
        } else {
          const homebrewType = type === 'Habilidades' ? 'Habilidades' : type;
          item.type = homebrewType;
          state.homebrew.push(item);
        }
        save();
        if (type === 'Ameaças') location.hash = '#ameacas';
        else { homebrewTab = type; location.hash = '#homebrew'; render(); }
        toast('“' + item.name + '” importado do C.R.I.S.');
      });
  }

  void refreshAccount();
})();
