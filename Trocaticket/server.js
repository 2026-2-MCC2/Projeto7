const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');

const port = process.env.PORT || 3000;
const root = __dirname;
const uploadDir = path.join(root, 'public', 'uploads', 'avatars');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

function normalizeEmail(value) { return String(value || '').trim().toLowerCase(); }
function normalizeCpf(value) { return String(value || '').replace(/\D/g, ''); }
function makeCode(prefix) { return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`; }
function makeQrPayload(ticket) { return `TROCATICKET:${ticket.numero_ingresso}:${ticket.evento_id}:${ticket.versao_titularidade}:${crypto.randomBytes(16).toString('hex')}`; }

function formatUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    name: user.nome,
    email: user.email,
    cpf: user.cpf,
    telefone: user.telefone,
    genero: user.genero,
    data_nascimento: user.data_nascimento,
    tipo: user.tipo,
    status: user.status,
    foto_perfil: user.foto_perfil || null
  };
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) reject(new Error('Payload muito grande (máximo 15MB)'));
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
  });
}

function parseMultipart(request) {
  return new Promise((resolve, reject) => {
    const contentType = request.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) return reject(new Error('Boundary não encontrado'));
    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const chunks = [];

    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundaryBuf = Buffer.from(`--${boundary}`);
      const parts = [];
      let start = 0;

      while (true) {
        const idx = buffer.indexOf(boundaryBuf, start);
        if (idx === -1) break;
        if (start > 0) parts.push(buffer.subarray(start, idx));
        start = idx + boundaryBuf.length;
      }

      const result = { fields: {}, file: null };
      for (const part of parts) {
        const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd === -1) continue;
        const headerStr = part.subarray(0, headerEnd).toString('latin1');
        const bodyPart = part.subarray(headerEnd + 4, part.length - 2);

        const nameMatch = headerStr.match(/name="([^"]+)"/);
        const filenameMatch = headerStr.match(/filename="([^"]+)"/);

        if (filenameMatch && nameMatch) {
          result.file = {
            fieldname: nameMatch[1],
            filename: filenameMatch[1],
            data: bodyPart
          };
        } else if (nameMatch) {
          result.fields[nameMatch[1]] = bodyPart.toString('utf8');
        }
      }
      resolve(result);
    });
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return response.end();
  }

  // ===== UPLOAD DE FOTO DE PERFIL =====
  if (request.method === 'POST' && url.pathname === '/api/usuario/avatar') {
    try {
      const { fields, file } = await parseMultipart(request);
      const email = normalizeEmail(fields.email);

      if (!email || !file || !file.data || !file.filename) {
        return send(response, 400, { ok: false, message: 'Arquivo ou e-mail ausente.' });
      }

      const ext = path.extname(file.filename).toLowerCase() || '.png';
      const uniqueName = `avatar-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      fs.writeFileSync(path.join(uploadDir, uniqueName), file.data);

      const relativeUrl = `public/uploads/avatars/${uniqueName}`;
      await db.query('UPDATE usuarios SET foto_perfil = ? WHERE email = ?', [relativeUrl, email]);

      return send(response, 200, { ok: true, avatarUrl: relativeUrl, message: 'Foto atualizada com sucesso!' });
    } catch (error) {
      console.error('[usuario] Erro no upload:', error.message);
      return send(response, 500, { ok: false, message: 'Falha ao salvar a imagem no servidor.' });
    }
  }

  // ===== AUTENTICAÇÃO =====
  if (request.method === 'POST' && (url.pathname === '/api/auth/login' || url.pathname === '/api/login')) {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
      
      if (!rows.length || !(await bcrypt.compare(String(body.senha || ''), rows[0].senha_hash))) {
        return send(response, 401, { ok: false, message: 'E-mail ou senha inválidos.' });
      }
      if (rows[0].status === 'bloqueado') {
        return send(response, 403, { ok: false, message: 'Usuário bloqueado pelo administrador.' });
      }

      return send(response, 200, { ok: true, user: formatUser(rows[0]) });
    } catch (error) {
      console.error('[auth] Erro no login:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível realizar o login.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/register-pf') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const cpf = normalizeCpf(body.cpf);
      if (!body.nome || !/^\S+@\S+\.\S+$/.test(email) || cpf.length !== 11 || !body.senha || body.senha.length < 6) {
        return send(response, 400, { ok: false, message: 'Informe nome, e-mail, CPF válido e senha com ao menos 6 caracteres.' });
      }
      const [duplicate] = await db.query('SELECT id FROM usuarios WHERE email = ? OR cpf = ? LIMIT 1', [email, cpf]);
      if (duplicate.length) return send(response, 409, { ok: false, message: 'E-mail ou CPF já cadastrado.' });
      const codigo = String(crypto.randomInt(100000, 1000000));
      const senhaHash = await bcrypt.hash(body.senha, 10);
      await db.query(
        `INSERT INTO usuarios (nome, email, senha_hash, tipo, cpf, telefone, data_nascimento, genero, status, codigo_verificacao, email_verificado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'aprovado', ?, TRUE)`,
        [body.nome.trim(), email, senhaHash, 'comprador', cpf, body.telefone || '', body.nascimento || null, body.sexo || null, codigo]
      );
      return send(response, 201, { ok: true, message: 'Cadastro criado com sucesso!' });
    } catch (error) {
      console.error('[auth] Erro no cadastro:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível concluir o cadastro.' });
    }
  }

  // ===== PERFIL DO USUÁRIO =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM usuarios WHERE email = ? LIMIT 1', [normalizeEmail(url.searchParams.get('email'))]);
      return rows.length ? send(response, 200, { ok: true, user: formatUser(rows[0]) }) : send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
    } catch (error) { return send(response, 500, { ok: false, message: 'Erro ao carregar perfil.' }); }
  }

  // ===== MEUS INGRESSOS =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/meus-ingressos') {
    try {
      const [tickets] = await db.query(`
        SELECT 
          i.id, 
          i.numero_ingresso, 
          i.qr_code_payload, 
          i.status, 
          COALESCE(i.versao_titularidade, 1) AS versao_titularidade,
          p.codigo_pedido, 
          e.nome AS evento, 
          e.nome AS eventName, 
          e.artista AS artista,
          e.local AS location,
          e.imagem AS imagem,
          DATE_FORMAT(e.data_evento, '%Y-%m-%dT%H:%i:%s') AS date,
          u.nome AS titular, 
          u.cpf,
          tp.id AS transferencia_pendente_id,
          COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome
        FROM ingressos_emitidos i
        JOIN usuarios u ON u.id = i.comprador_id
        JOIN eventos e ON e.id = i.evento_id
        LEFT JOIN pedidos p ON p.id = i.pedido_id
        LEFT JOIN transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
        LEFT JOIN usuarios u2 ON u2.id = tp.destinatario_id
        WHERE u.email = ? AND i.status = 'valido'
        ORDER BY i.emitido_em DESC
      `, [normalizeEmail(url.searchParams.get('email'))]);
      return send(response, 200, { ok: true, tickets });
    } catch (error) { 
      console.error('[usuario] Erro nos ingressos:', error.message); 
      return send(response, 500, { ok: false, message: 'Erro ao carregar ingressos.' }); 
    }
  }

  // ===== TRANSFERÊNCIA NOMINAL =====
  if (request.method === 'POST' && url.pathname === '/api/ingressos/solicitar-transferencia') {
    const connection = await db.getConnection();
    try {
      const body = await parseBody(request);
      const { ingresso_id, destinatario_email } = body;
      const targetEmail = normalizeEmail(destinatario_email);

      await connection.beginTransaction();

      const [[ticket]] = await connection.query(
        'SELECT i.*, u.nome AS remetente_nome, u.email AS remetente_email, e.nome AS evento_nome FROM ingressos_emitidos i JOIN usuarios u ON u.id = i.comprador_id JOIN eventos e ON e.id = i.evento_id WHERE i.id = ? FOR UPDATE',
        [ingresso_id]
      );

      if (!ticket || ticket.status !== 'valido') {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'Ingresso indisponível para transferência.' });
      }

      if (Number(ticket.versao_titularidade || 1) > 1) {
        await connection.rollback();
        return send(response, 403, { ok: false, message: 'Este ingresso já foi transferido uma vez.' });
      }

      const [[hasPending]] = await connection.query(
        'SELECT id FROM transferencias_pendentes WHERE ingresso_id = ? AND status = "pendente" LIMIT 1',
        [ticket.id]
      );
      if (hasPending) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'Já existe uma solicitação pendente.' });
      }

      const [[destUser]] = await connection.query('SELECT id, nome, email FROM usuarios WHERE email = ? LIMIT 1', [targetEmail]);
      if (!destUser) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Destinatário não encontrado no TrocaTicket.' });
      }

      if (destUser.id === ticket.comprador_id) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'Você não pode transferir para si mesmo.' });
      }

      const nomeDestinatarioFinal = (destUser.nome && destUser.nome.trim()) ? destUser.nome.trim() : destUser.email;
      const token = crypto.randomBytes(32).toString('hex');
      const [insertResult] = await connection.query(
        'INSERT INTO transferencias_pendentes (ingresso_id, remetente_id, destinatario_id, token, status) VALUES (?, ?, ?, ?, "pendente")',
        [ticket.id, ticket.comprador_id, destUser.id, token]
      );

      await connection.commit();
      return send(response, 200, { 
        ok: true, 
        transferencia_id: insertResult.insertId,
        destinatario_nome: nomeDestinatarioFinal,
        message: `Solicitação enviada para ${nomeDestinatarioFinal}!`
      });
    } catch (error) {
      await connection.rollback();
      return send(response, 500, { ok: false, message: 'Falha ao solicitar repasse.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingressos/cancelar-transferencia') {
    try {
      const body = await parseBody(request);
      await db.query('UPDATE transferencias_pendentes SET status = "cancelada" WHERE ingresso_id = ? AND status = "pendente"', [body.ingresso_id]);
      return send(response, 200, { ok: true, message: 'Transferência cancelada.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao cancelar.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/ingressos/confirmar-transferencia') {
    const token = url.searchParams.get('token');
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [[solicitacao]] = await connection.query(
        'SELECT tp.*, i.evento_id, i.bilheteria_id, i.codigo_original_bilheteria, i.versao_titularidade, i.qr_code_payload, i.pedido_id FROM transferencias_pendentes tp JOIN ingressos_emitidos i ON i.id = tp.ingresso_id WHERE tp.token = ? FOR UPDATE',
        [token]
      );

      if (!solicitacao || solicitacao.status !== 'pendente') {
        await connection.rollback();
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        return response.end('<h1>Link expirado ou cancelado!</h1>');
      }

      const revokedQr = `${solicitacao.qr_code_payload}_REVOGADO_${Date.now()}`;
      await connection.query("UPDATE ingressos_emitidos SET status = 'invalidado_por_revenda', qr_code_payload = ? WHERE id = ?", [revokedQr, solicitacao.ingresso_id]);

      const novoNumero = makeCode('TKT');
      const novoQr = makeQrPayload({
        numero_ingresso: novoNumero,
        evento_id: solicitacao.evento_id,
        versao_titularidade: Number(solicitacao.versao_titularidade || 1) + 1
      });

      await connection.query(
        `INSERT INTO ingressos_emitidos (pedido_id, comprador_id, evento_id, bilheteria_id, numero_ingresso, codigo_original_bilheteria, qr_code_payload, versao_titularidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'valido')`,
        [solicitacao.pedido_id, solicitacao.destinatario_id, solicitacao.evento_id, solicitacao.bilheteria_id || null, novoNumero, solicitacao.codigo_original_bilheteria || novoNumero, novoQr, Number(solicitacao.versao_titularidade || 1) + 1]
      );

      await connection.query('UPDATE transferencias_pendentes SET status = "aceita" WHERE id = ?', [solicitacao.id]);
      await connection.commit();

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end('<h1>Ingresso Aceito com Sucesso!</h1><a href="/meus-ingressos.html">Ver Meus Ingressos</a>');
    } catch (error) {
      await connection.rollback();
      response.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end('<h1>Erro ao confirmar transferência.</h1>');
    } finally {
      connection.release();
    }
  }

  // ===== EVENTOS (ADMIN) =====
  if (request.method === 'GET' && url.pathname === '/api/events') {
    try {
      const [rows] = await db.query('SELECT * FROM eventos ORDER BY id DESC');
      const events = rows.map(r => ({
        id: r.id,
        name: r.nome || '',
        artista: r.artista || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        price: Number(r.ticket_calculado || 0),
        imagem: r.imagem || null,
        destaque: Boolean(r.destaque),
        status: r.status || 'publicado'
      }));
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'POST' && url.pathname === '/api/events') {
    try {
      const body = await parseBody(request);
      const [result] = await db.query(
        `INSERT INTO eventos (organizador_id, nome, artista, \`local\`, data_evento, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem) VALUES (1, ?, ?, ?, ?, ?, 500, 2000, 0.20, 'publicado', ?, ?)`,
        [body.nome.trim(), body.artista || null, body.local.trim(), body.data_evento, parseFloat(body.preco) || 0, body.destaque ? 1 : 0, body.imagem || null]
      );
      return send(response, 201, { ok: true, eventId: result.insertId });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== EVENTOS (ADMIN - GET por ID, PUT e DELETE) =====
  if (request.method === 'GET' && /^\/api\/events\/\d+$/.test(url.pathname)) {
    try {
      const eventId = Number(url.pathname.split('/').pop());
      const [rows] = await db.query('SELECT * FROM eventos WHERE id = ? LIMIT 1', [eventId]);
      if (!rows.length) return send(response, 404, { ok: false, message: 'Evento não encontrado.' });
      
      const r = rows[0];
      const event = {
        id: r.id,
        name: r.nome || '',
        artista: r.artista || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        price: Number(r.ticket_calculado || 0),
        imagem: r.imagem || null,
        destaque: Boolean(r.destaque),
        status: r.status || 'publicado'
      };
      return send(response, 200, { ok: true, event });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  if (request.method === 'PUT' && /^\/api\/events\/\d+$/.test(url.pathname)) {
    try {
      const eventId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      
      await db.query(
        `UPDATE eventos SET nome = ?, artista = ?, \`local\` = ?, data_evento = ?, ticket_calculado = ?, status = ?, destaque = ?, imagem = ? WHERE id = ?`,
        [
          body.name || body.nome, 
          body.artista || null, 
          body.location || body.local, 
          body.date || body.data_evento, 
          parseFloat(body.price || body.preco) || 0, 
          body.status || 'publicado', 
          body.destaque ? 1 : 0, 
          body.imagem || null, 
          eventId
        ]
      );
      return send(response, 200, { ok: true, message: 'Evento atualizado com sucesso!' });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  if (request.method === 'DELETE' && /^\/api\/events\/\d+$/.test(url.pathname)) {
    try {
      const eventId = Number(url.pathname.split('/').pop());
      await db.query('DELETE FROM eventos WHERE id = ?', [eventId]);
      return send(response, 200, { ok: true, message: 'Evento excluído com sucesso!' });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  // ===== PAINEL ADMIN STATS =====
  if (request.method === 'GET' && url.pathname === '/api/admin/stats') {
    try {
      const [rows] = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM usuarios) AS totalUsers,
          (SELECT COUNT(*) FROM ingressos_emitidos) AS totalTickets,
          (SELECT COUNT(*) FROM eventos) AS totalEvents,
          (SELECT COALESCE(SUM(p.valor_total), 0) FROM pedidos p WHERE p.status = 'aprovado') AS totalRevenue
      `);
      return send(response, 200, { ok: true, stats: rows[0] });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && (url.pathname === '/api/admin/users' || url.pathname === '/api/admin/usuarios')) {
    try {
      const [users] = await db.query('SELECT id, nome, email, tipo, status, cpf, telefone, criado_em FROM usuarios ORDER BY id DESC');
      return send(response, 200, { ok: true, users });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/tickets') {
    try {
      const [tickets] = await db.query(`SELECT i.id, i.numero_ingresso, i.status, i.emitido_em AS createdAt, u.nome AS ownerName, e.nome AS eventName FROM ingressos_emitidos i JOIN usuarios u ON u.id = i.comprador_id JOIN eventos e ON e.id = i.evento_id ORDER BY i.emitido_em DESC`);
      return send(response, 200, { ok: true, tickets });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== ROTAS AUXILIARES DO ADMIN (LOGS E DESTAQUES) =====
  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/activity-log')) {
    try {
      return send(response, 200, { ok: true, logs: [] });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/featured-events')) {
    try {
      const [events] = await db.query('SELECT * FROM eventos WHERE destaque = 1 ORDER BY id DESC');
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== CARTÕES DO USUÁRIO (ROBUSTO E SEGURO) =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/cartoes') {
    try {
      const email = normalizeEmail(url.searchParams.get('email'));
      const [users] = await db.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      
      const [cards] = await db.query('SELECT id, nome_titular, ultimos_digitos, bandeira, validade_mes, validade_ano, criado_em FROM cartoes_usuario WHERE usuario_id = ? ORDER BY id DESC', [users[0].id]);
      return send(response, 200, { ok: true, cards });
    } catch (error) {
      console.error('[cartoes GET]', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao carregar cartões.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/usuario/cartoes') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Comprador não encontrado.' });

      const numCartao = String(body.numero_cartao || body.numero || '').trim();
      const numLimpo = numCartao.replace(/\D/g, '');
      const ultimos_digitos = numLimpo.slice(-4) || '0000';
      const bandeira = numLimpo.startsWith('4') ? 'Visa' : numLimpo.startsWith('5') ? 'Mastercard' : 'Cartão';

      let mes = body.validade_mes || '';
      let ano = body.validade_ano || '';
      if (!mes && body.validade && String(body.validade).includes('/')) {
        const parts = String(body.validade).split('/');
        mes = parts[0].trim();
        ano = parts[1].trim();
      }

      const cardHash = crypto.createHash('sha256').update(numLimpo + users[0].id, 'utf8').digest('hex');

      await db.query(
        `INSERT INTO cartoes_usuario 
          (usuario_id, nome_titular, ultimos_digitos, validade_mes, validade_ano, bandeira, cartao_hash) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          users[0].id, 
          String(body.nome_titular || body.nome || 'Titular').trim().toUpperCase(), 
          ultimos_digitos, 
          mes || '12', 
          ano.length === 2 ? `20${ano}` : (ano || '2030'), 
          bandeira,
          cardHash
        ]
      );

      return send(response, 201, { ok: true, message: 'Cartão salvo com segurança!' });
    } catch (error) {
      console.error('[cartoes POST] Erro:', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao salvar o cartão no banco de dados.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/usuario\/cartoes\/\d+$/.test(url.pathname)) {
    try {
      const cardId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });

      await db.query('DELETE FROM cartoes_usuario WHERE id = ? AND usuario_id = ?', [cardId, users[0].id]);
      return send(response, 200, { ok: true, message: 'Cartão excluído com sucesso.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao excluir o cartão.' });
    }
  }

  // ===== ARQUIVOS ESTÁTICOS =====
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(url.pathname);
  } catch {
    return response.writeHead(400).end('Caminho inválido');
  }

  const filePath = path.join(root, requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, ''));
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return response.writeHead(404).end('Não encontrado');
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-system' });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, () => console.log(`TrocaTicket rodando em http://localhost:${port}`));