const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const { EventEmitter } = require('node:events');

const db = require('./db');
const serverPath = path.resolve(__dirname, 'server.js');

function sessionToken(id = 7, email = 'atual@example.com') {
  const secret = process.env.TROCATICKET_SESSION_SECRET
    || process.env.DB_PASSWORD
    || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
  const claims = Buffer.from(JSON.stringify({
    sub: id,
    email,
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function request(method, url, body, token = sessionToken()) {
  const request = new EventEmitter();
  request.method = method;
  request.url = url;
  request.headers = token ? { authorization: `Bearer ${token}` } : {};
  process.nextTick(() => {
    if (body !== undefined) request.emit('data', JSON.stringify(body));
    request.emit('end');
  });
  return request;
}

function response() {
  return {
    status: null,
    payload: null,
    writeHead(status) {
      this.status = status;
    },
    end(payload) {
      this.payload = JSON.parse(payload);
    }
  };
}

async function invoke(handler, req) {
  const res = response();
  await handler(req, res);
  return res;
}

test('rotas de perfil respondem 401 sem sessão e 403 para outro titular', async () => {
  const originalQuery = db.query;
  let queries = 0;
  db.query = async () => {
    queries += 1;
    return [[{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const unauthenticated = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=atual@example.com', undefined, null));
    assert.equal(unauthenticated.status, 401);
    assert.equal(queries, 0);

    const other = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=outro@example.com'));
    assert.equal(other.status, 403);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('rota de perfil responde 200 para o titular atual', async () => {
  const originalQuery = db.query;
  db.query = async () => [[{
    id: 7,
    nome: 'Pessoa',
    email: 'atual@example.com',
    tipo: 'comum',
    status: 'aprovado',
    foto_perfil: null
  }], {}];

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=atual@example.com'));
    assert.equal(result.status, 200);
    assert.equal(result.payload.ok, true);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('compra rejeita e-mail diferente antes de consultar esquema ou evento', async () => {
  const originalQuery = db.query;
  let queries = 0;
  db.query = async () => {
    queries += 1;
    return [[{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('POST', '/api/ingressos/comprar', {
      email: 'outro@example.com',
      evento_id: 1,
      quantidade: 1
    }));
    assert.equal(result.status, 403);
    assert.equal(result.payload.message, 'Acesso negado.');
    assert.equal(queries, 1);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('rotas administrativas exigem admin e não devolvem segredos de usuários', async () => {
  const originalQuery = db.query;
  let usersSql = '';
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: 'hash',
        codigo_verificacao: '123456'
      }], {}];
    }
    usersSql = String(sql);
    return [[{
      id: 8,
      nome: 'Pessoa',
      email: 'pessoa@example.com',
      tipo: 'comum',
      status: 'aprovado',
      cpf: '00000000000',
      telefone: '11999999999',
      email_verificado: true
    }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const unauthenticated = await invoke(handler, request('GET', '/api/admin/users', undefined, null));
    assert.equal(unauthenticated.status, 401);

    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Comprador',
          email: 'atual@example.com',
          tipo: 'comprador',
          status: 'aprovado'
        }], {}];
      }
      return [[], {}];
    };
    const buyer = await invoke(handler, request('GET', '/api/admin/users'));
    assert.equal(buyer.status, 403);

    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'atual@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }], {}];
      }
      return [[{
        id: 8,
        nome: 'Pessoa',
        email: 'pessoa@example.com',
        tipo: 'comprador',
        status: 'aprovado',
        email_verificado: true
      }], {}];
    };
    const admin = await invoke(handler, request('GET', '/api/admin/users'));
    assert.equal(admin.status, 200);
    assert.equal(usersSql.includes('codigo_verificacao'), false);
    assert.equal(admin.payload.users[0].codigo_verificacao, undefined);
    assert.equal(admin.payload.users[0].senha_hash, undefined);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('admin_email diferente da sessão é rejeitado', async () => {
  const originalQuery = db.query;
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: 'hash'
      }], {}];
    }
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('PATCH', '/api/admin/users/8', {
      admin_email: 'outro@example.com',
      admin_password: 'qualquer',
      tipo: 'comum',
      status: 'ativa'
    }));
    assert.equal(result.status, 403);
    assert.equal(result.payload.message, 'Acesso negado.');
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});
