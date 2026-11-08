const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const { EventEmitter } = require('node:events');

const db = require('./db');
const serverPath = path.resolve(__dirname, 'server.js');

function createRequest(method, url, body, sessionId = 15) {
  const request = new EventEmitter();
  request.method = method;
  request.url = url;
  request.headers = {
    host: 'localhost:3010',
    authorization: `Bearer ${createSessionToken(sessionId)}`
  };
  process.nextTick(() => {
    if (body !== undefined) request.emit('data', JSON.stringify(body));
    request.emit('end');
  });
  return request;
}

function createResponse() {
  return {
    status: null,
    headers: null,
    payload: null,
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(payload) {
      this.payload = payload;
    }
  };
}

function createSessionToken(id) {
  const secret = process.env.TROCATICKET_SESSION_SECRET
    || process.env.DB_PASSWORD
    || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
  const claims = Buffer.from(JSON.stringify({
    sub: id,
    email: 'mock@example.invalid',
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function mockSchemaQuery(sql) {
  if (/OBJECT_ID/i.test(sql)) return [[{ id: 1 }], { affectedRows: 0 }];
  if (/COL_LENGTH/i.test(sql)) {
    return [[{
      valor_cobranca: 1,
      lucro_empresa: 1,
      taxa_admin_percentual: 1,
      taxa_admin_valor: 1,
      valor_taxa_admin: 1,
      preco_original: 1,
      revoked: 1,
      revogado_em: 1
    }], { affectedRows: 0 }];
  }
  if (/^\s*UPDATE r\s+SET/i.test(sql)) return [[], { affectedRows: 0 }];
  return [[], { affectedRows: 0 }];
}

async function invoke(handler, request) {
  const response = createResponse();
  await handler(request, response);
  return { response, payload: JSON.parse(response.payload) };
}

test('cancelamento responde 200 quando o UPDATE afeta uma linha e 404 quando não afeta', async () => {
  const originalQuery = db.query;
  let affectedRows = 1;
  db.query = async sql => {
    if (/UPDATE dbo\.revendas SET status = 'cancelada'/i.test(sql)) {
      return [[], { affectedRows }];
    }
    return mockSchemaQuery(sql);
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);

    const success = await invoke(handler, createRequest('DELETE', '/api/revenda/10'));
    assert.equal(success.response.status, 200);
    assert.equal(success.payload.ok, true);

    affectedRows = 0;
    const missing = await invoke(handler, createRequest('DELETE', '/api/revenda/10'));
    assert.equal(missing.response.status, 404);
    assert.equal(missing.payload.ok, false);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('alterar taxa responde 404 quando o UPDATE não afeta o anúncio', async () => {
  const originalQuery = db.query;
  db.query = async sql => {
    if (/SELECT id, taxa_percentual, preco_original, status FROM dbo\.revendas/i.test(sql)) {
      return [[{ id: 10, taxa_percentual: 2, preco_original: 100, status: 'disponivel' }], { affectedRows: 0 }];
    }
    if (/UPDATE dbo\.revendas\s+SET taxa_percentual/i.test(sql)) {
      return [[], { affectedRows: 0 }];
    }
    return mockSchemaQuery(sql);
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, createRequest(
      'PATCH',
      '/api/revenda/10/prioridade',
      { taxa: 'premium' }
    ));
    assert.equal(result.response.status, 404);
    assert.equal(result.payload.message, 'Anúncio ativo não encontrado.');
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});
