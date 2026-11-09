const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuthGuards } = require('./auth-guards');

function createHarness({ token = { sub: 7 }, rows = [{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'admin', status: 'aprovado' }] } = {}) {
  const responses = [];
  const db = {
    queries: [],
    async query(sql, params) {
      this.queries.push({ sql, params });
      return [rows, { affectedRows: 0 }];
    }
  };
  const send = (_response, status, payload) => responses.push({ status, payload });
  const guards = createAuthGuards({
    db,
    readSessionToken: () => token,
    send
  });
  return { db, guards, responses };
}

test('requireSession valida o usuário atual pelo sub do token', async () => {
  const harness = createHarness();

  const user = await harness.guards.requireSession({}, {});

  assert.equal(user.email, 'atual@example.com');
  assert.deepEqual(harness.db.queries[0].params, [7]);
  assert.equal(harness.responses.length, 0);
});

test('requireSession responde 401 para token ausente ou inválido', async () => {
  const harness = createHarness({ token: null });

  const user = await harness.guards.requireSession({}, {});

  assert.equal(user, null);
  assert.deepEqual(harness.responses, [{
    status: 401,
    payload: { ok: false, message: 'Sessão inválida ou expirada.' }
  }]);
  assert.equal(harness.db.queries.length, 0);
});

test('requireSession recusa usuário inexistente ou inativo sem expor detalhes', async () => {
  for (const status of ['bloqueado', 'suspensa', 'excluida']) {
    const harness = createHarness({ rows: [{ id: 7, email: 'atual@example.com', tipo: 'admin', status }] });
    const user = await harness.guards.requireSession({}, {});
    assert.equal(user, null);
    assert.equal(harness.responses[0].status, 401);
    assert.equal(harness.responses[0].payload.message, 'Sessão inválida ou expirada.');
  }

  const missing = createHarness({ rows: [] });
  assert.equal(await missing.guards.requireSession({}, {}), null);
  assert.equal(missing.responses[0].status, 401);
});

test('requireSameUser usa o e-mail atual do banco, não o claim antigo', async () => {
  const harness = createHarness();

  assert.equal(await harness.guards.requireSameUser({}, {}, 'ATUAL@example.com').then(Boolean), true);
  assert.equal(await harness.guards.requireSameUser({}, {}, 'antigo@example.com'), null);
  assert.deepEqual(harness.responses, [{
    status: 403,
    payload: { ok: false, message: 'Acesso negado.' }
  }]);
});

test('requireRole aceita somente os tipos autorizados', async () => {
  const allowed = createHarness();
  assert.equal(await allowed.guards.requireRole({}, {}, ['admin', 'organizador']).then(Boolean), true);

  const denied = createHarness({ rows: [{ id: 7, email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }] });
  assert.equal(await denied.guards.requireRole({}, {}, ['admin']), null);
  assert.deepEqual(denied.responses, [{
    status: 403,
    payload: { ok: false, message: 'Acesso negado.' }
  }]);
});
