import assert from 'node:assert/strict';
import worker from './worker.mjs';

const origin = 'https://mtcofcentury.github.io';
const records = new Map();
let unavailable = false;
const env = {
  ALLOWED_ORIGIN: origin,
  DB: { prepare(sql) {
    assert.match(sql, /^INSERT INTO votes/);
    assert.match(sql, /ON CONFLICT\(token_hash\) DO NOTHING/);
    return { bind(hash, nickname, version) { return { async run() {
      if (unavailable) throw new Error('DB offline');
      const exists = records.has(hash);
      if (!exists) records.set(hash, { nickname, version });
      return { success: true, meta: { changes: exists ? 0 : 1 } };
    } }; } };
  } },
};
const valid = { nickname: '小马', token: 'a'.repeat(64), consent: true };
function request(body = valid, options = {}) {
  return new Request('https://api.example/votes', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body), ...options,
  });
}
let response = await worker.fetch(request(), env);
assert.equal(response.status, 201);
assert.deepEqual(await response.json(), { saved: true });
assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
assert.equal(records.size, 1);
assert.ok(!records.has(valid.token)); // Raw browser ID is not retained.
response = await worker.fetch(request(), env);
assert.equal(response.status, 409);
assert.equal(records.size, 1);
for (const body of [null, {}, { ...valid, consent: false }, { ...valid, nickname: ' ' }, { ...valid, nickname: 'a'.repeat(61) }, { ...valid, nickname: 'a\u200bb' }, { ...valid, token: 'invalid' }]) {
  assert.equal((await worker.fetch(request(body), env)).status, 400);
}
assert.equal((await worker.fetch(request(valid, { body: '{' }), env)).status, 400);
assert.equal((await worker.fetch(request(valid, { body: ' '.repeat(2049) }), env)).status, 400);
response = await worker.fetch(request(valid, { headers: { Origin: 'https://other.example', 'Content-Type': 'application/json' } }), env);
assert.equal(response.status, 403);
assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
assert.equal((await worker.fetch(request(valid, { headers: { Origin: origin, 'Content-Type': 'text/plain' } }), env)).status, 415);
response = await worker.fetch(new Request('https://api.example/votes', { headers: { Origin: origin } }), env);
assert.equal(response.status, 405); // No public read endpoint.
assert.ok(!(await response.text()).includes('小马'));
assert.equal((await worker.fetch(new Request('https://api.example/votes', { method: 'OPTIONS', headers: { Origin: origin } }), env)).status, 204);
assert.equal((await worker.fetch(request(), { ALLOWED_ORIGIN: origin })).status, 503);
unavailable = true;
response = await worker.fetch(request(), env);
assert.equal(response.status, 503);
assert.ok(!(await response.text()).includes('小马'));
console.log('PASS: save, deduplication, validation, CORS, no public reads, and storage failure.');
