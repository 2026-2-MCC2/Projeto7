const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const path = require('node:path');

function sessionToken() {
  const secret = process.env.TROCATICKET_SESSION_SECRET
    || process.env.DB_PASSWORD
    || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
  const claims = Buffer.from(JSON.stringify({
    sub: 7,
    email: 'admin@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function createRequest(body) {
  const request = new EventEmitter();
  request.method = 'PUT';
  request.url = '/api/organizador/eventos';
  request.headers = { host: 'localhost:3010', authorization: `Bearer ${sessionToken()}` };
  process.nextTick(() => {
    request.emit('data', JSON.stringify(body));
    request.emit('end');
  });
  return request;
}

function createResponse() {
  return {
    status: null,
    payload: null,
    writeHead(status) {
      this.status = status;
    },
    end(payload) {
      this.payload = payload;
    }
  };
}

test('edição preserva imagens quando o painel envia URLs gerenciadas', async () => {
  const queries = [];
  const connection = {
    async beginTransaction() {},
    async query(sql, params) {
      queries.push({ sql, params });
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'admin@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }]];
      }
      return [[]];
    },
    async commit() {},
    async rollback() {},
    release() {}
  };
  const mockDb = {
    async query(sql, params) {
      queries.push({ sql, params });
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'admin@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }]];
      }
      return [[]];
    },
    async getConnection() {
      return connection;
    }
  };
  const serverPath = path.resolve(__dirname, 'server.js');
  const dbPath = path.resolve(__dirname, 'db.js');
  delete require.cache[dbPath];
  const db = require(dbPath);
  const originalQuery = db.query;
  const originalGetConnection = db.getConnection;
  db.query = mockDb.query;
  db.getConnection = mockDb.getConnection;

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const response = createResponse();
    await handler(createRequest({
      id: 7,
      nome: 'Evento de teste',
      artista: 'Artista',
      descricao: 'Descrição',
      local: 'Local',
      data_evento: '2026-12-01T18:00',
      data_fim: '2026-12-01T23:00',
      capacidade: 100,
      classificacao: 'Livre',
      status: 'publicado',
      destaque: false,
      preco: 120,
      imagem: '/api/events/7/imagem?campo=imagem&v=249347',
      imagem_horizontal: '/api/events/7/imagem?campo=banner&v=4132843',
      setores: [],
      lotes: []
    }), response);

    const update = queries.find(({ sql }) => /^\s*UPDATE dbo\.eventos/i.test(sql));
    assert.ok(update, `a rota deveria gerar um UPDATE de evento; status=${response.status}; payload=${response.payload}; queries=${queries.map(query => query.sql).join(' | ')}`);
    assert.equal(update.params[11], null);
    assert.equal(update.params[12], null);
    assert.equal(response.status, 200);
  } finally {
    db.query = originalQuery;
    db.getConnection = originalGetConnection;
    delete require.cache[serverPath];
  }
});
