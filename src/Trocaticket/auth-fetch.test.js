const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('./auth-fetch.js'), 'utf8');

function createHarness(storageValues = {}) {
  const calls = [];
  const localStorage = {
    getItem(key) {
      return storageValues[key] ?? null;
    }
  };
  const window = {
    location: { href: 'https://example.test/account/page.html', origin: 'https://example.test' },
    localStorage,
    fetch(...args) {
      calls.push(args);
      return Promise.resolve({ ok: true });
    }
  };
  vm.runInNewContext(source, {
    window,
    URL,
    Headers,
    Request,
    Promise
  });
  return { window, calls };
}

test('adiciona o Bearer em chamada same-origin para API quando há token', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: 'abc' }) });
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1].headers.get('Authorization'), 'Bearer abc');
});

test('mantém a chamada sem token', async () => {
  const harness = createHarness();
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1], undefined);
});

test('não substitui Authorization já enviado', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: 'abc' }) });
  await harness.window.fetch('/api/events', { headers: { Authorization: 'Bearer original' } });
  assert.equal(new Headers(harness.calls[0][1].headers).get('Authorization'), 'Bearer original');
});

test('preserva FormData sem definir Content-Type', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: 'abc' }) });
  const body = new FormData();
  body.append('file', 'content');
  await harness.window.fetch('/api/avatar', { method: 'POST', body });
  const options = harness.calls[0][1];
  assert.equal(options.headers.get('Authorization'), 'Bearer abc');
  assert.equal(options.headers.has('Content-Type'), false);
  assert.equal(options.body, body);
});

test('ignora JSON inválido no armazenamento', async () => {
  const harness = createHarness({ 'trocaticket-user': '{invalid' });
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1], undefined);
});
