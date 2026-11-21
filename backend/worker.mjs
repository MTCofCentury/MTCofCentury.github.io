// Write-only API. Records are viewed through the owner's Cloudflare D1 dashboard.
const MAX_BYTES = 2048;
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
});

async function readLimitedJSON(request) {
  if (!request.body) throw new Error('Empty body');
  const reader = request.body.getReader();
  let bytes = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) { await reader.cancel(); throw new Error('Too large'); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['/votes', '/messages'].includes(url.pathname)) return json({ error: 'Not found' }, 404);
    const origin = request.headers.get('Origin');
    if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) return json({ error: 'Origin not allowed' }, 403);
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { ...cors, Allow: 'POST, OPTIONS' });
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'JSON required' }, 415, cors);
    if (!env.DB) return json({ error: 'Service not configured' }, 503, cors);
    let data;
    try { data = await readLimitedJSON(request); }
    catch { return json({ error: 'Invalid or oversized JSON' }, 400, cors); }
    if (!data || typeof data.nickname !== 'string' || data.consent !== true || typeof data.token !== 'string' || !/^[a-f0-9]{64}$/.test(data.token)) {
      return json({ error: 'Name, consent, and browser ID required' }, 400, cors);
    }
    const nickname = data.nickname.trim().normalize('NFC');
    if (!nickname || Array.from(nickname).length > 60 || /[\p{Cc}\p{Cf}]/u.test(nickname)) return json({ error: 'Invalid name' }, 400, cors);
    const isMessage = url.pathname === '/messages';
    const message = typeof data.message === 'string' ? data.message.trim().normalize('NFC') : '';
    if (isMessage && (!message || Array.from(message).length > 500 || /[\p{Cc}\p{Cf}]/u.test(message.replace(/[\n\r\t]/g, '')))) return json({ error: 'Invalid message' }, 400, cors);
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.token));
      const tokenHash = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
      const result = isMessage
        ? await env.DB.prepare('INSERT INTO messages (token_hash, nickname, message, consent_version) VALUES (?, ?, ?, ?) ON CONFLICT(token_hash) DO NOTHING')
          .bind(tokenHash, nickname, message, '2026-11-21').run()
        : await env.DB.prepare('INSERT INTO votes (token_hash, nickname, consent_version) VALUES (?, ?, ?) ON CONFLICT(token_hash) DO NOTHING')
          .bind(tokenHash, nickname, '2026-11-01').run();
      if (!result.success) throw new Error('Write failed');
      if (result.meta.changes === 0) return json({ code: 'ALREADY_RECORDED' }, 409, cors);
      return json({ saved: true }, 201, cors);
    } catch {
      // Never put names or request bodies into application logs.
      return json({ error: 'Unable to save right now' }, 503, cors);
    }
  },
};
