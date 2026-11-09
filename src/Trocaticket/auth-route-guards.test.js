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

test('meus ingressos usa o e-mail atual do usuário da sessão', async () => {
  const originalQuery = db.query;
  const currentUser = {
    id: 7,
    nome: 'Pessoa',
    email: 'novo@example.com',
    tipo: 'comum',
    status: 'aprovado'
  };
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) return [[currentUser], {}];
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);

    const unauthenticated = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=novo@example.com', undefined, null));
    assert.equal(unauthenticated.status, 401);

    const otherUser = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=outro@example.com', undefined, sessionToken(7, 'antigo@example.com')));
    assert.equal(otherUser.status, 403);

    const currentEmail = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=novo@example.com', undefined, sessionToken(7, 'antigo@example.com')));
    assert.equal(currentEmail.status, 200);
    assert.equal(currentEmail.payload.ok, true);
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

test('rotas de eventos e organizador exigem sessão e papel autorizado', async () => {
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
    return [[{ id: 42 }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const routes = [
      ['POST', '/api/events'],
      ['PUT', '/api/events/1'],
      ['DELETE', '/api/events/1'],
      ['GET', '/api/organizador/dashboard?evento_id=1'],
      ['GET', '/api/organizador/chat'],
      ['POST', '/api/organizador/eventos'],
      ['POST', '/api/organizador/eventos/1/imagem'],
      ['PUT', '/api/organizador/eventos'],
      ['POST', '/api/organizador/cotacoes']
    ];

    for (const [method, route] of routes) {
      const unauthenticated = await invoke(handler, request(method, route, {}, null));
      assert.equal(unauthenticated.status, 401, route);
    }

    const buyerQuery = db.query;
    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{ id: 7, nome: 'Comprador', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
      }
      return [[], {}];
    };
    const buyer = await invoke(handler, request('POST', '/api/events', {}, sessionToken()));
    assert.equal(buyer.status, 403);
    db.query = buyerQuery;

    const created = await invoke(handler, request('POST', '/api/organizador/cotacoes', {
      evento_id: 1,
      titulo: 'Som',
      escopo: 'Contratação',
      valor_estimado: 100
    }));
    assert.equal(created.status, 201);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('upload de imagem de evento rejeita sem sessão antes de ler o corpo', async () => {
  const originalQuery = db.query;
  db.query = async () => {
    throw new Error('não deveria consultar o banco sem sessão');
  };

  const uploadRequest = new EventEmitter();
  uploadRequest.method = 'POST';
  uploadRequest.url = '/api/organizador/eventos/1/imagem';
  uploadRequest.headers = {};
  uploadRequest.on = () => {
    throw new Error('não deveria ler o corpo sem sessão');
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, uploadRequest);
    assert.equal(result.status, 401);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('impede remover o último administrador e permite alteração com outro admin ativo', async () => {
  const originalQuery = db.query;
  const passwordHash = '$2b$04$ySqOnCxwNp3Uw/o9ywcbAucTOTZAa0rLq2XrCOTWhBuYr75S1mi7.';
  let activeAdminCount = 0;
  let target = { id: 7, nome: 'Admin', tipo: 'admin', status: 'aprovado' };
  db.query = async (sql) => {
    const text = String(sql);
    if (text.includes('SELECT id, nome, email, cpf, telefone') && text.includes('foto_perfil')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: passwordHash
      }], {}];
    }
    if (text.includes('SELECT id, nome, tipo, status FROM dbo.usuarios WHERE id = ?')) {
      return [[target], {}];
    }
    if (text.includes('COUNT(*) AS total')) {
      return [[{ total: activeAdminCount }], {}];
    }
    if (text.includes('UPDATE dbo.usuarios')) {
      return [[{ id: target.id, nome: target.nome, email: 'target@example.com', tipo: 'admin', status: 'suspensa' }], {}];
    }
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const payload = { admin_email: 'atual@example.com', admin_password: 'senha', tipo: 'admin', status: 'suspensa' };

    const lastAdmin = await invoke(handler, request('PATCH', '/api/admin/users/7', payload));
    assert.equal(lastAdmin.status, 409);
    assert.equal(lastAdmin.payload.message, 'Não é possível remover o último administrador.');

    activeAdminCount = 1;
    const withAnotherAdmin = await invoke(handler, request('PATCH', '/api/admin/users/7', payload));
    assert.equal(withAnotherAdmin.status, 200);

    target = { id: 8, nome: 'Pessoa', tipo: 'comum', status: 'aprovado' };
    const commonUser = await invoke(handler, request('PATCH', '/api/admin/users/8', {
      ...payload,
      tipo: 'admin',
      status: 'ativa'
    }));
    assert.equal(commonUser.status, 200);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});
