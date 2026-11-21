import assert from 'node:assert/strict';
import worker from './worker.mjs';
const origin = 'https://example.com';
const saved = new Map();
let offline = false;
const env = { ALLOWED_ORIGIN: origin, DB: { prepare(sql) {
  assert.match(sql, /^INSERT INTO messages/);
  return { bind(hash, nickname, message, version) { return { async run() {
    if (offline) throw new Error('offline');
    const exists = saved.has(hash);
    saved.set(hash, { nickname, message, version });
    return { success: true, meta: { changes: exists ? 0 : 1 } };
  } }; } };
} } };
const valid = { nickname: '访客', message: '你好\n很高兴来过。', consent: true, token: 'b'.repeat(64) };
function request(body = valid, headers = {}) {
  return new Request('https://api.example/messages', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
assert.equal((await worker.fetch(request(), env)).status, 201);
assert.equal(saved.size, 1);
assert.equal([...saved.values()][0].message, valid.message);
assert.equal((await worker.fetch(request(), env)).status, 409);
for (const message of ['', ' ', 'a'.repeat(501), '\u0000', null]) {
  assert.equal((await worker.fetch(request({ ...valid, message }), env)).status, 400);
}
assert.equal((await worker.fetch(request({ ...valid, consent: false }), env)).status, 400);
assert.equal((await worker.fetch(request(valid, { Origin: 'https://other.example' }), env)).status, 403);
assert.equal((await worker.fetch(new Request('https://api.example/messages', { headers: { Origin: origin } }), env)).status, 405);
assert.equal((await worker.fetch(request(), { ALLOWED_ORIGIN: origin })).status, 503);
offline = true;
assert.equal((await worker.fetch(request(), env)).status, 503);
console.log('PASS: private messages, retry deduplication, validation, origin restriction, no public reads, storage failure.');
