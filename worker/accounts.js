const encoder = new TextEncoder();
const cookieName = 'limiar_session';
const sessionDays = 30;
const passwordIterations = 100000; // Cloudflare Workers rejects PBKDF2 counts above 100,000.
let accountSchemaReady;

const json = (data, status = 200, headers = {}) => Response.json(data, {
  status,
  headers: { 'Cache-Control': 'no-store', ...headers }
});

function cookieValue(request) {
  const part = (request.headers.get('Cookie') || '').split(';').map(x => x.trim())
    .find(x => x.startsWith(cookieName + '='));
  return part ? decodeURIComponent(part.slice(cookieName.length + 1)) : '';
}

function randomHex(size = 32) {
  return [...crypto.getRandomValues(new Uint8Array(size))]
    .map(x => x.toString(16).padStart(2, '0')).join('');
}

function fromHex(value) {
  return new Uint8Array(value.match(/.{2}/g).map(x => parseInt(x, 16)));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: fromHex(salt), iterations: passwordIterations, hash: 'SHA-256' }, key, 256);
  return [...new Uint8Array(bits)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function equalText(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function safeAccount(row) {
  if (!row) return null;
  return { handle: row.handle, displayName: row.display_name, bio: row.bio || '', avatar: row.avatar_data || '', banner: row.banner_data || '' };
}

async function accountById(env, id) {
  if (!id) return null;
  return env.DB.prepare('SELECT id, handle, display_name, bio, avatar_data, banner_data FROM accounts WHERE id = ?').bind(id).first();
}

export async function ensureAccountSchema(env) {
  if (!accountSchemaReady) accountSchemaReady = env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY NOT NULL,
      handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
      display_name TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      avatar_data TEXT NOT NULL DEFAULT '',
      banner_data TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS account_follows (
      follower_id TEXT NOT NULL,
      followed_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (follower_id, followed_id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS session_invites (
      id TEXT PRIMARY KEY NOT NULL,
      sender_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      campaign_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS book_shares (
      id TEXT PRIMARY KEY NOT NULL,
      book_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE (book_id, recipient_id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS auth_attempts (
      attempt_key TEXT PRIMARY KEY NOT NULL,
      window_start INTEGER NOT NULL,
      attempts INTEGER NOT NULL
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS follows_target_idx ON account_follows(followed_id)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS invites_recipient_idx ON session_invites(recipient_id, status, created_at)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS shares_recipient_idx ON book_shares(recipient_id)')
  ]).catch(error => { accountSchemaReady = null; throw error; });
  await accountSchemaReady;
}

export async function resolveUser(request, env) {
  const token = cookieValue(request);
  if (token && env.DB) {
    const tokenHash = await sha256(token);
    const session = await env.DB.prepare('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?').bind(tokenHash, Date.now()).first();
    if (session) return session.user_id;
  }
  return '';
}

async function issueSession(env, userId, account) {
  const token = randomHex(32), tokenHash = await sha256(token), now = Date.now();
  await env.DB.prepare('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)')
    .bind(tokenHash, userId, now + sessionDays * 86400000, now).run();
  const cookie = `${cookieName}=${encodeURIComponent(token)}; Path=/; Max-Age=${sessionDays * 86400}; HttpOnly; Secure; SameSite=Strict`;
  return json({ account: safeAccount(account) }, 200, { 'Set-Cookie': cookie });
}

async function requestBody(request, max = 12000) {
  const raw = await request.text();
  if (raw.length > max) throw new Error('Dados muito grandes.');
  try { return JSON.parse(raw); } catch { throw new Error('Envie dados válidos.'); }
}

async function rateLimited(request, env, handle) {
  const now = Date.now(), windowMs = 15 * 60 * 1000;
  const key = await sha256(`${request.headers.get('CF-Connecting-IP') || 'unknown'}:${handle.toLowerCase()}`);
  const row = await env.DB.prepare('SELECT window_start, attempts FROM auth_attempts WHERE attempt_key = ?').bind(key).first();
  if (row && now - row.window_start < windowMs && row.attempts >= 12) return true;
  if (!row || now - row.window_start >= windowMs) {
    await env.DB.prepare('INSERT INTO auth_attempts (attempt_key,window_start,attempts) VALUES (?,?,1) ON CONFLICT(attempt_key) DO UPDATE SET window_start = excluded.window_start, attempts = 1').bind(key, now).run();
  } else {
    await env.DB.prepare('UPDATE auth_attempts SET attempts = attempts + 1 WHERE attempt_key = ?').bind(key).run();
  }
  return false;
}

async function register(request, env) {
  const input = await requestBody(request), handle = String(input.handle || '').trim().toLowerCase();
  const displayName = String(input.displayName || '').trim(), password = String(input.password || '');
  if (!/^[a-z0-9_]{3,24}$/.test(handle) || ['admin', 'limiar', 'system', 'suporte'].includes(handle)) return json({ error: 'Use um nome de usuário com 3 a 24 letras, números ou _.' }, 400);
  if (displayName.length < 1 || displayName.length > 50) return json({ error: 'Informe um nome de exibição de até 50 caracteres.' }, 400);
  if (password.length < 10 || password.length > 128) return json({ error: 'A senha precisa ter entre 10 e 128 caracteres.' }, 400);
  const id = crypto.randomUUID();
  const salt = randomHex(16), digest = await passwordHash(password, salt), now = Date.now();
  try {
    await env.DB.prepare('INSERT INTO accounts (id,handle,display_name,password_salt,password_hash,created_at) VALUES (?,?,?,?,?,?)')
      .bind(id, handle, displayName, salt, digest, now).run();
  } catch (error) {
    if (/UNIQUE constraint failed:\s*accounts\.handle/i.test(String(error?.message || error))) {
      return json({ error: 'Esse nome de usuário já está em uso. Escolha outro.' }, 409);
    }
    throw error;
  }
  const account = await accountById(env, id);
  const result = await issueSession(env, id, account);
  const body = await result.json();
  const archive = await env.DB.prepare('SELECT 1 AS present FROM archives WHERE user_id = ?').bind(id).first();
  return json({ ...body, hasArchive: !!archive }, 201, { 'Set-Cookie': result.headers.get('Set-Cookie') });
}

async function login(request, env) {
  const input = await requestBody(request), handle = String(input.handle || '').trim().toLowerCase(), password = String(input.password || '');
  if (!/^[a-z0-9_]{3,24}$/.test(handle) || password.length > 128 || await rateLimited(request, env, handle)) return json({ error: 'Usuário ou senha inválidos, ou muitas tentativas. Aguarde alguns minutos.' }, 429);
  const row = await env.DB.prepare('SELECT id, handle, display_name, password_salt, password_hash, bio, avatar_data, banner_data FROM accounts WHERE handle = ? COLLATE NOCASE').bind(handle).first();
  const digest = row ? await passwordHash(password, row.password_salt) : await passwordHash(password || 'invalid-password', '00112233445566778899aabbccddeeff');
  if (!row || !equalText(digest, row.password_hash)) return json({ error: 'Usuário ou senha inválidos.' }, 401);
  await env.DB.prepare('DELETE FROM auth_attempts WHERE attempt_key = ?').bind(await sha256(`${request.headers.get('CF-Connecting-IP') || 'unknown'}:${handle}`)).run();
  const result = await issueSession(env, row.id, row);
  const body = await result.json();
  const archive = await env.DB.prepare('SELECT 1 AS present FROM archives WHERE user_id = ?').bind(row.id).first();
  return json({ ...body, hasArchive: !!archive }, 200, { 'Set-Cookie': result.headers.get('Set-Cookie') });
}

function validImage(value, max) {
  if (value === '') return true;
  return typeof value === 'string' && value.length <= max && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
}

async function socialSnapshot(env, userId) {
  const [following, followers, invites] = await Promise.all([
    env.DB.prepare('SELECT a.handle, a.display_name FROM account_follows f JOIN accounts a ON a.id=f.followed_id WHERE f.follower_id=? ORDER BY a.handle LIMIT 100').bind(userId).all(),
    env.DB.prepare('SELECT a.handle, a.display_name FROM account_follows f JOIN accounts a ON a.id=f.follower_id WHERE f.followed_id=? ORDER BY a.handle LIMIT 100').bind(userId).all(),
    env.DB.prepare('SELECT i.id,i.campaign_code,i.status,i.created_at,a.handle,a.display_name FROM session_invites i JOIN accounts a ON a.id=i.sender_id WHERE i.recipient_id=? ORDER BY i.created_at DESC LIMIT 30').bind(userId).all()
  ]);
  return { following: following.results, followers: followers.results, invites: invites.results };
}

export async function accountRoute(request, env, path, url) {
  if (!path.startsWith('/api/auth') && !path.startsWith('/api/account') && !path.startsWith('/api/social')) return null;
  if (!env.DB) return json({ error: 'Banco de contas indisponível.' }, 503);
  if (!['GET', 'HEAD'].includes(request.method) && request.headers.get('Origin') !== url.origin) return json({ error: 'Origem inválida.' }, 403);
  const userId = await resolveUser(request, env), sessionToken = cookieValue(request);

  if (path === '/api/auth/me' && request.method === 'GET') {
    const account = await accountById(env, userId);
    return json({ account: safeAccount(account), authenticated: !!userId, workspace: false });
  }
  if (path === '/api/auth/register' && request.method === 'POST') return register(request, env);
  if (path === '/api/auth/login' && request.method === 'POST') return login(request, env);
  if (path === '/api/auth/logout' && request.method === 'POST') {
    if (sessionToken) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(sessionToken)).run();
    return json({ ok: true }, 200, { 'Set-Cookie': `${cookieName}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict` });
  }
  const publicProfile = path.match(/^\/api\/social\/profile\/([^/]+)$/i);
  if (publicProfile && request.method === 'GET') {
    let handle = '';
    try { handle = decodeURIComponent(publicProfile[1]).trim(); } catch {}
    if (!/^[a-z0-9_]{3,24}$/i.test(handle)) return json({ error: 'Nome de usuário inválido.' }, 400);
    const profile = await env.DB.prepare(`SELECT a.id, a.handle, a.display_name, a.bio, a.avatar_data, a.banner_data,
      (SELECT COUNT(*) FROM account_follows f WHERE f.followed_id=a.id) AS follower_count,
      (SELECT COUNT(*) FROM account_follows f WHERE f.follower_id=a.id) AS following_count,
      CASE WHEN a.id=? THEN 1 ELSE 0 END AS is_self,
      EXISTS(SELECT 1 FROM account_follows f WHERE f.follower_id=? AND f.followed_id=a.id) AS is_following
      FROM accounts a WHERE a.handle=? COLLATE NOCASE`).bind(userId, userId, handle).first();
    if (!profile) return json({ error: 'Este perfil não existe ou não está disponível.' }, 404);
    return json({ profile: {
      handle: profile.handle,
      displayName: profile.display_name,
      bio: profile.bio || '',
      avatar: profile.avatar_data || '',
      banner: profile.banner_data || '',
      followerCount: Number(profile.follower_count) || 0,
      followingCount: Number(profile.following_count) || 0,
      isSelf: !!profile.is_self,
      isFollowing: !!profile.is_following
    } });
  }
  if (!userId) return json({ error: 'Entre na sua conta para continuar.' }, 401);
  const account = await accountById(env, userId);
  if (!account) return json({ error: 'Crie um perfil LIMIAR para usar contas e recursos sociais.' }, 403);

  if (path === '/api/account/profile' && request.method === 'GET') return json({ account: safeAccount(account) });
  if (path === '/api/account/profile' && request.method === 'PUT') {
    const input = await requestBody(request, 1100000), displayName = String(input.displayName || '').trim(), bio = String(input.bio || '').trim();
    const avatar = String(input.avatar || ''), banner = String(input.banner || '');
    if (!displayName || displayName.length > 50 || bio.length > 500) return json({ error: 'Revise o nome de exibição e a biografia.' }, 400);
    if (!validImage(avatar, 300000) || !validImage(banner, 700000)) return json({ error: 'A imagem é inválida ou grande demais. Avatar: 220 KB; banner: 520 KB.' }, 413);
    await env.DB.prepare('UPDATE accounts SET display_name=?,bio=?,avatar_data=?,banner_data=? WHERE id=?').bind(displayName,bio,avatar,banner,userId).run();
    return json({ account: safeAccount(await accountById(env,userId)) });
  }
  if (path === '/api/social' && request.method === 'GET') return json(await socialSnapshot(env, userId));
  if (path === '/api/social/search' && request.method === 'GET') {
    const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
    if (!/^[a-z0-9_]{2,24}$/.test(q)) return json({ people: [] });
    const people = await env.DB.prepare(`SELECT a.handle,a.display_name,
      EXISTS(SELECT 1 FROM account_follows f WHERE f.follower_id=? AND f.followed_id=a.id) AS following
      FROM accounts a WHERE a.id<>? AND a.handle LIKE ? COLLATE NOCASE ORDER BY a.handle LIMIT 12`).bind(userId,userId,q+'%').all();
    return json({ people: people.results });
  }
  if (path === '/api/social/follows' && request.method === 'POST') {
    const input = await requestBody(request), handle = String(input.handle || '').trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(handle)) return json({ error: 'Nome de usuário inválido.' }, 400);
    const target = await env.DB.prepare('SELECT id FROM accounts WHERE handle=? COLLATE NOCASE').bind(handle).first();
    if (!target || target.id === userId) return json({ error: 'Esse perfil não está disponível.' }, 404);
    if (input.action === 'unfollow') await env.DB.prepare('DELETE FROM account_follows WHERE follower_id=? AND followed_id=?').bind(userId,target.id).run();
    else await env.DB.prepare('INSERT INTO account_follows (follower_id,followed_id,created_at) VALUES (?,?,?) ON CONFLICT(follower_id,followed_id) DO NOTHING').bind(userId,target.id,Date.now()).run();
    return json({ ok: true, ...(await socialSnapshot(env,userId)) });
  }
  if (path === '/api/social/invites' && request.method === 'POST') {
    const input = await requestBody(request), handle = String(input.handle || '').trim().toLowerCase(), code = String(input.campaignCode || '').toUpperCase();
    if (!/^[A-F0-9]{20}$/.test(code)) return json({ error: 'A campanha precisa ter um link de convite ativo.' }, 400);
    const target = await env.DB.prepare('SELECT id FROM accounts WHERE handle=? COLLATE NOCASE').bind(handle).first();
    if (!target || target.id === userId) return json({ error: 'Escolha uma pessoa da lista de amigos.' }, 404);
    const follows = await env.DB.prepare('SELECT 1 AS ok FROM account_follows WHERE follower_id=? AND followed_id=?').bind(userId,target.id).first();
    if (!follows) return json({ error: 'Siga essa pessoa antes de enviar o convite.' }, 403);
    const campaign = await env.DB.prepare('SELECT 1 AS ok FROM shared_campaigns WHERE code=?').bind(code).first();
    if (!campaign) return json({ error: 'O link da campanha expirou ou não existe.' }, 404);
    await env.DB.prepare('INSERT INTO session_invites (id,sender_id,recipient_id,campaign_code,status,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,target.id,code,'pending',Date.now()).run();
    return json({ ok: true });
  }
  const invite = path.match(/^\/api\/social\/invites\/([0-9a-f-]{36})$/i);
  if (invite && request.method === 'POST') {
    await env.DB.prepare("UPDATE session_invites SET status='accepted' WHERE id=? AND recipient_id=?").bind(invite[1],userId).run();
    const row = await env.DB.prepare('SELECT campaign_code FROM session_invites WHERE id=? AND recipient_id=?').bind(invite[1],userId).first();
    return row ? json({ ok: true, campaignCode: row.campaign_code }) : json({ error: 'Convite não encontrado.' }, 404);
  }
  return json({ error: 'Método ou rota inválida.' }, 405);
}
