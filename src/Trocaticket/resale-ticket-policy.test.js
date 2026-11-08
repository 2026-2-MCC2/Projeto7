const test = require('node:test');
const assert = require('node:assert/strict');
const { isTicketInResale, resaleRestriction } = require('./resale-ticket-policy');

function mockResaleQuery(rows) {
  return async query => {
    assert.match(query, /status = 'disponivel'/i);
    return [rows, { affectedRows: 0 }];
  };
}

test('banco simulado marca apenas anúncio disponivel como ingresso em revenda', async () => {
  const activeRows = await mockResaleQuery([{ revendaId: 9 }])('SELECT id FROM dbo.revendas WHERE status = \'disponivel\'');
  const inactiveRows = await mockResaleQuery([])('SELECT id FROM dbo.revendas WHERE status = \'disponivel\'');

  assert.equal(isTicketInResale({ revendaId: activeRows[0][0].revendaId }), true);
  assert.equal(isTicketInResale({ revendaId: inactiveRows[0][0]?.revendaId }), false);
  assert.equal(isTicketInResale({ emRevenda: false, revendaId: null }), false);
});

test('ingresso normal mantém QR e ações, ingresso em revenda recebe bloqueios', () => {
  assert.equal(resaleRestriction({ emRevenda: false }, 'qr'), null);
  assert.equal(resaleRestriction({ emRevenda: true, revendaId: 9 }, 'qr'), 'Ingresso em revenda. Cancele o anúncio para usar o QR Code.');
  assert.equal(resaleRestriction({ revendaId: 9 }, 'transfer'), 'Ingresso em revenda. Cancele o anúncio antes de transferir.');
  assert.equal(resaleRestriction({ revendaId: 9 }, 'checkin'), 'Ingresso em revenda, entrada não permitida.');
});
