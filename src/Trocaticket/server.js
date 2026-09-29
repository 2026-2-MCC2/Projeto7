const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const db = require('./db');

const port = process.env.PORT || 3000;
const root = __dirname;
const uploadDir = path.join(root, 'public', 'uploads', 'avatars');
const smtpHost = String(process.env.SMTP_HOST || '').trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const smtpUser = String(process.env.SMTP_USER || '').trim();
const smtpPass = String(process.env.SMTP_PASS || '').trim();
const smtpFrom = String(process.env.SMTP_FROM || smtpUser).trim();

let verificationTransporter = null;

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
function getVerificationTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return null;
  }

  if (!verificationTransporter) {
    verificationTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  return verificationTransporter;
}

async function sendVerificationEmail({ to, name, code }) {
  const transporter = getVerificationTransporter();

  if (!transporter) {
    console.warn(`[auth] SMTP não configurado. Código de verificação para ${to}: ${code}`);
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: 'TrocaTicket - código de verificação',
    text: `Olá ${name || 'usuário'}, seu código de verificação do TrocaTicket é ${code}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="margin: 0 0 16px;">TrocaTicket</h2>
        <p>Olá ${name || 'usuário'},</p>
        <p>Use o código abaixo para confirmar seu cadastro:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${code}</div>
        <p>Se você não solicitou este cadastro, pode ignorar esta mensagem.</p>
      </div>
    `
  });

  return { sent: true };
}
function detectCardBrand(cardNumber) {
  const number = String(cardNumber || '').replace(/\D/g, '');

  if (/^4\d{12}(?:\d{3})?(?:\d{3})?$/.test(number)) return 'Visa';
  if (/^(?:5[1-5]\d{14}|2(?:2[2-9]\d{2}|2[3-9]\d{3}|[3-6]\d{4}|7[01]\d{3}|720\d{2})\d{10})$/.test(number)) return 'Mastercard';
  if (/^3[47]\d{13}$/.test(number)) return 'American Express';
  if (/^(?:606282|3841)/.test(number)) return 'Hipercard';
  if (/^(?:401178|431274|438935|451416|457393|4576|504175|5067|5090|627780|636297|636368|6500|6504|6505|6507|6509|6516|6550)/.test(number)) return 'Elo';
  if (/^(?:6011|65|64[4-9])/.test(number)) return 'Discover';
  if (/^(?:30[0-5]|36|38|39)/.test(number)) return 'Diners Club';
  if (/^35(?:2[89]|[3-8]\d)/.test(number)) return 'JCB';
  return 'Outra bandeira';
}
function parseEventDate(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const brazilian = text.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  const normalized = brazilian
    ? `${brazilian[3]}-${brazilian[2]}-${brazilian[1]}T${brazilian[4] || '00'}:${brazilian[5] || '00'}:00`
    : text.length === 16 && text[10] === 'T' ? `${text}:00` : text;
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Data do evento inválida. Use o formato AAAA-MM-DD HH:MM.');
  }
  return parsed;
}
function normalizeTicketLot(lote = {}) {
  const total = Math.max(Number(lote.quantidade_total || lote.quantidadeTotal || lote.quantidade || 0), 0);
  const meia = Math.ceil(total * 0.40);
  const solidaria = Math.min(Math.max(Number(lote.quantidade_solidaria || lote.quantidadeSolidaria || 0), 0), Math.max(total - meia, 0));
  const inteira = Math.max(total - meia - solidaria, 0);
  const precoInteira = Math.max(Number(lote.preco_inteira || lote.precoInteira || lote.preco || 0), 0);
  let customBalance = Math.max(inteira, 0);
  const modalidades = Array.isArray(lote.modalidades) ? lote.modalidades.map(modalidade => {
    const requestedQuantity = Math.max(Number(modalidade.quantidade || 0), 0);
    const quantity = Math.min(requestedQuantity, customBalance);
    customBalance -= quantity;
    return {
      nome: String(modalidade.nome || '').trim(),
      quantidade: quantity,
      preco: Math.max(Number(modalidade.preco || 0), 0)
    };
  }).filter(modalidade => modalidade.nome && modalidade.quantidade > 0) : [];
  const adjustedInteira = Math.max(inteira - modalidades.reduce((sum, modalidade) => sum + modalidade.quantidade, 0), 0);
  return {
    ...lote,
    quantidade: total,
    quantidade_total: total,
    quantidade_meia: meia,
    quantidade_inteira: adjustedInteira,
    quantidade_solidaria: solidaria,
    preco: precoInteira,
    preco_inteira: precoInteira,
    preco_meia: precoInteira / 2,
    modalidades,
    modalidades_json: JSON.stringify(modalidades)
  };
}
function makeCode(prefix) { return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`; }
function makeQrPayload(ticket) { return `TROCATICKET:${ticket.numero_ingresso}:${ticket.evento_id}:${ticket.versao_titularidade}:${crypto.randomBytes(16).toString('hex')}`; }

async function audit(action, description, itemType, itemId, actor = {}) {
  try {
    let actorId = actor.id || null;
    let actorName = actor.nome || 'Sistema';
    let actorType = actor.tipo || 'sistema';
    if (actorId || actor.email) {
      const [actors] = await db.query(
        actorId
          ? 'SELECT id, nome, tipo FROM dbo.usuarios WHERE id = ?'
          : 'SELECT id, nome, tipo FROM dbo.usuarios WHERE email = ?',
        [actorId || normalizeEmail(actor.email)]
      );
      if (actors[0]) {
        actorId = actors[0].id;
        actorName = actors[0].nome;
        actorType = actors[0].tipo;
      }
    }
    await db.query(
      `INSERT INTO dbo.auditoria_admin (ator_id, ator_nome, ator_tipo, acao, descricao, item_tipo, item_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [actorId, actorName, actorType, action, description, itemType, String(itemId || '')]
    );
  } catch (error) {
    console.error('[auditoria] Não foi possível registrar ação:', error.message);
  }
}

async function auditGenericRequest(request, url) {
  const body = request._auditBody || {};
  const actor = auditActor({
    id: body.actor_id,
    email: body.actor_email || body.email || request.headers['x-actor-email'],
    nome: body.actor_name,
    tipo: body.actor_type
  });
  const route = url.pathname.replace(/^\/api\//, '').replaceAll('/', ' ');
  let itemType = 'ação do sistema';
  let itemName = route;

  try {
    const eventId = body.evento_id || (url.pathname.match(/events\/(\d+)/) || [])[1];
    const ticketId = body.ingresso_id || (url.pathname.match(/tickets\/(\d+)/) || [])[1];
    const userId = body.usuario_id || (url.pathname.match(/users\/(\d+)/) || [])[1];
    const orderId = body.pedido_id;
    if (eventId) {
      const [[event]] = await db.query('SELECT nome FROM dbo.eventos WHERE id = ?', [eventId]);
      itemType = 'evento'; itemName = event?.nome || String(body.nome || 'Evento');
    } else if (ticketId) {
      const [[ticket]] = await db.query('SELECT numero_ingresso FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      itemType = 'ingresso'; itemName = ticket?.numero_ingresso || 'Ingresso';
    } else if (userId) {
      const [[user]] = await db.query('SELECT nome FROM dbo.usuarios WHERE id = ?', [userId]);
      itemType = 'usuário'; itemName = user?.nome || 'Usuário';
    } else if (orderId) {
      const [[order]] = await db.query('SELECT codigo_pedido FROM dbo.pedidos WHERE id = ?', [orderId]);
      itemType = 'pedido'; itemName = order?.codigo_pedido || 'Pedido';
    } else if (body.nome) {
      itemType = 'registro'; itemName = body.nome;
    } else if (body.email) {
      itemType = 'conta'; itemName = body.email;
    }
  } catch (error) {
    console.error('[auditoria] Falha ao identificar item:', error.message);
  }

  await audit(`${request.method.toLowerCase()}_${route.replaceAll(' ', '_')}`, `Ação ${request.method} realizada em ${itemName}.`, itemType, itemName, actor);
}

function shouldSkipGenericAudit(pathname) {
  return [
    /^\/api\/events(?:\/\d+)?$/,
    /^\/api\/ingressos\/comprar$/,
    /^\/api\/admin\/users\/\d+$/,
    /^\/api\/admin\/tickets\/\d+\/status$/
  ].some(pattern => pattern.test(pathname));
}

function auditActor(body = {}) {
  return { id: body.actor_id, nome: body.actor_name, tipo: body.actor_type, email: body.actor_email || body.email };
}

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

function getAdminUserStatus(user) {
  if (user.status === 'excluida') return 'excluida';
  if (user.status === 'suspensa' || user.status === 'bloqueado') return 'suspensa';
  if (user.email_verificado === false || user.email_verificado === 0 || user.codigo_verificacao) return 'pendente_verificacao';
  return 'ativa';
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
        const parsed = body ? JSON.parse(body) : {};
        request._auditBody = parsed;
        resolve(parsed);
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
      request._auditBody = result.fields;
      resolve(result);
    });
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  const originalEnd = response.end.bind(response);
  response.end = (chunk, encoding, callback) => {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const isApi = url.pathname.startsWith('/api/');
    if (isMutation && isApi && !shouldSkipGenericAudit(url.pathname) && !request._genericAuditQueued) {
      request._genericAuditQueued = true;
      setImmediate(() => auditGenericRequest(request, url));
    }
    return originalEnd(chunk, encoding, callback);
  };

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
      if (rows[0].email_verificado === false || rows[0].email_verificado === 0 || rows[0].codigo_verificacao) {
        return send(response, 403, { ok: false, message: 'E-mail ainda não verificado. Confira sua caixa de entrada.' });
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
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente_verificacao', ?, FALSE)`,
        [body.nome.trim(), email, senhaHash, 'comprador', cpf, body.telefone || '', body.nascimento || null, body.sexo || null, codigo]
      );
      await sendVerificationEmail({ to: email, name: body.nome.trim(), code: codigo });
      return send(response, 201, { ok: true, message: 'Cadastro criado com sucesso! Enviamos um código de verificação para o seu e-mail.' });
    } catch (error) {
      console.error('[auth] Erro no cadastro:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível concluir o cadastro.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/verificar-codigo') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const codigo = String(body.codigo || '').trim();

      if (!email || !/^\d{6}$/.test(codigo)) {
        return send(response, 400, { ok: false, message: 'Informe um e-mail válido e um código de 6 dígitos.' });
      }

      const [rows] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil, codigo_verificacao, email_verificado FROM usuarios WHERE email = ? LIMIT 1',
        [email]
      );

      if (!rows.length) {
        return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      }

      const user = rows[0];
      if (String(user.codigo_verificacao || '').trim() !== codigo) {
        return send(response, 400, { ok: false, message: 'Código inválido ou expirado.' });
      }

      await db.query(
        'UPDATE usuarios SET email_verificado = TRUE, codigo_verificacao = NULL, status = CASE WHEN status = ? THEN ? ELSE status END WHERE id = ?',
        ['pendente_verificacao', 'aprovado', user.id]
      );

      const [updated] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM usuarios WHERE id = ? LIMIT 1',
        [user.id]
      );

      return send(response, 200, {
        ok: true,
        message: 'E-mail verificado com sucesso!',
        user: formatUser(updated[0])
      });
    } catch (error) {
      console.error('[auth] Erro ao verificar código:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível verificar o código.' });
    }
  }

  // ===== PERFIL DO USUÁRIO =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE email = ? LIMIT 1', [normalizeEmail(url.searchParams.get('email'))]);
      return rows.length ? send(response, 200, { ok: true, user: formatUser(rows[0]) }) : send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
    } catch (error) { return send(response, 500, { ok: false, message: 'Erro ao carregar perfil.' }); }
  }

  if (request.method === 'PUT' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const body = await parseBody(request);
      const emailAtual = normalizeEmail(body.emailAtual || body.currentEmail || body.email);
      const novoEmail = normalizeEmail(body.email || emailAtual);

      if (!emailAtual || !novoEmail) {
        return send(response, 400, { ok: false, message: 'E-mail é obrigatório.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
        return send(response, 400, { ok: false, message: 'E-mail inválido.' });
      }

      const [[existingUser]] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, senha_hash FROM dbo.usuarios WHERE email = ?',
        [emailAtual]
      );
      if (!existingUser) {
        return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      }

      if (novoEmail !== emailAtual) {
        const [[emailOwner]] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ?', [novoEmail]);
        if (emailOwner && emailOwner.id !== existingUser.id) {
          return send(response, 409, { ok: false, message: 'Este e-mail já está em uso.' });
        }
      }

      const nomeInformado = body.nome !== undefined;
      const nome = nomeInformado ? String(body.nome || '').trim() : existingUser.nome;
      const sobrenome = body.sobrenome !== undefined ? String(body.sobrenome || '').trim() : '';
      const nomeCompleto = nomeInformado
        ? [nome, sobrenome].filter(Boolean).join(' ')
        : existingUser.nome;
      const cpf = body.cpf !== undefined ? normalizeCpf(body.cpf) : normalizeCpf(existingUser.cpf);
      const telefone = body.telefone !== undefined ? String(body.telefone || '').trim() : existingUser.telefone;
      const genero = body.genero !== undefined ? String(body.genero || '').trim() : existingUser.genero;
      const dataNascimento = body.data_nascimento !== undefined ? body.data_nascimento || null : existingUser.data_nascimento;

      if (!nomeCompleto) {
        return send(response, 400, { ok: false, message: 'Nome é obrigatório.' });
      }
      if (cpf && cpf.length !== 11) {
        return send(response, 400, { ok: false, message: 'CPF inválido.' });
      }

      const senha = String(body.senha || '');
      const senhaHash = senha ? await bcrypt.hash(senha, 10) : existingUser.senha_hash;

      const [result] = await db.query(
        `UPDATE dbo.usuarios
         SET nome = ?, email = ?, cpf = ?, telefone = ?, genero = ?, data_nascimento = ?, senha_hash = ?
         OUTPUT INSERTED.id
         WHERE email = ?`,
        [
          nomeCompleto,
          novoEmail,
          cpf || null,
          telefone || null,
          genero || null,
          dataNascimento,
          senhaHash,
          emailAtual
        ]
      );

      if (!result.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE id = ?', [result[0].id]);
      await audit('atualizacao_perfil', `Perfil de ${nomeCompleto} atualizado.`, 'usuario', result[0].id, rows[0]);
      return send(response, 200, { ok: true, user: formatUser(rows[0]), message: 'Dados atualizados com sucesso.' });
    } catch (error) {
      console.error('[usuario] Erro ao atualizar perfil:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível atualizar o perfil.' });
    }
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
          e.[local] AS location,
          e.imagem AS imagem,
          CONVERT(varchar(19), e.data_evento, 126) AS date,
          u.nome AS titular, 
          u.cpf,
          tp.id AS transferencia_pendente_id,
          COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome
        FROM dbo.ingressos_emitidos i
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
        LEFT JOIN dbo.transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
        LEFT JOIN dbo.usuarios u2 ON u2.id = tp.destinatario_id
          WHERE u.email = ? AND i.status NOT IN ('cancelado', 'bloqueado')
        ORDER BY i.emitido_em DESC
      `, [normalizeEmail(url.searchParams.get('email'))]);
      return send(response, 200, { ok: true, tickets });
    } catch (error) { 
      console.error('[usuario] Erro nos ingressos:', error.message); 
      return send(response, 500, { ok: false, message: 'Erro ao carregar ingressos.' }); 
    }
  }

  // ===== COMPRA DE INGRESSO =====
  if (request.method === 'POST' && url.pathname === '/api/ingressos/comprar') {
    const connection = await db.getConnection();
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const eventoId = Number(body.evento_id);
      const quantidade = Math.max(1, Math.min(10, Number(body.quantidade) || 1));

      if (!email || !eventoId) {
        return send(response, 400, { ok: false, message: 'Usuário e evento são obrigatórios.' });
      }

      await connection.beginTransaction();
      const [[user]] = await connection.query('SELECT id FROM dbo.usuarios WHERE email = ?', [email]);
      const [[event]] = await connection.query('SELECT id, nome, ticket_calculado FROM dbo.eventos WHERE id = ?', [eventoId]);

      if (!user) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      }
      if (!event) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Evento não encontrado.' });
      }

      const unitPrice = Number(body.preco ?? event.ticket_calculado ?? 0);
      const total = unitPrice * quantidade;
      const codigoPedido = makeCode('PED');
      const [orderRows] = await connection.query(
        `INSERT INTO dbo.pedidos (codigo_pedido, comprador_id, valor_total, status)
         OUTPUT INSERTED.id
         VALUES (?, ?, ?, 'aprovado')`,
        [codigoPedido, user.id, total]
      );
      const pedidoId = orderRows[0].id;

      const tickets = [];
      for (let index = 0; index < quantidade; index += 1) {
        const numero = makeCode('TKT');
        const qrPayload = makeQrPayload({ numero_ingresso: numero, evento_id: eventoId, versao_titularidade: 1 });
        const [ticketRows] = await connection.query(
          `INSERT INTO dbo.ingressos_emitidos
           (pedido_id, comprador_id, evento_id, numero_ingresso, codigo_original_bilheteria, qr_code_payload, versao_titularidade, status)
           OUTPUT INSERTED.id
           VALUES (?, ?, ?, ?, ?, ?, 1, 'ativo')`,
          [pedidoId, user.id, eventoId, numero, numero, qrPayload]
        );
        tickets.push({ id: ticketRows[0].id, numero_ingresso: numero });
      }

      await connection.commit();
      return send(response, 201, { ok: true, pedido_id: pedidoId, codigo_pedido: codigoPedido, tickets });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[ingressos] Erro na compra:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível concluir a compra.' });
    } finally {
      connection.release();
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
        'INSERT INTO transferencias_pendentes (ingresso_id, remetente_id, destinatario_id, token, status) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, \'pendente\')',
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
      await db.query("UPDATE transferencias_pendentes SET status = 'cancelada' WHERE ingresso_id = ? AND status = 'pendente'", [body.ingresso_id]);
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

      await connection.query("UPDATE transferencias_pendentes SET status = 'aceita' WHERE id = ?", [solicitacao.id]);
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
        endDate: r.data_fim ? new Date(r.data_fim).toISOString() : null,
        classification: r.classificacao_etaria || 'Livre',
        price: Number(r.ticket_calculado || 0),
        capacity: Number(r.publico_maximo || 0),
        imagem: r.imagem || null,
        destaque: Boolean(r.destaque),
        status: r.status || 'publicado'
      }));
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && url.pathname === '/api/organizador/dashboard') {
    try {
      const eventoId = Number(url.searchParams.get('evento_id') || 1);
      const [eventRows] = await db.query('SELECT * FROM dbo.eventos WHERE id = ? LIMIT 1', [eventoId]);
      if (!eventRows.length) return send(response, 404, { ok: false, message: 'Evento não encontrado.' });

      const event = eventRows[0];
      const [lots] = await db.query('SELECT * FROM dbo.evento_lotes WHERE evento_id = ? ORDER BY id', [event.id]);
      const [sectorRows] = await db.query('SELECT * FROM dbo.evento_setores WHERE evento_id = ? ORDER BY id', [event.id]);
      const [costItems] = await db.query('SELECT * FROM dbo.evento_itens_custo WHERE evento_id = ? ORDER BY id', [event.id]);
      const [documents] = await db.query('SELECT * FROM dbo.evento_documentos WHERE evento_id = ? ORDER BY prazo', [event.id]);
      const [tasks] = await db.query('SELECT * FROM dbo.evento_tarefas WHERE evento_id = ? ORDER BY horario', [event.id]);
      const [demandsRows] = await db.query('SELECT * FROM dbo.evento_demandas WHERE evento_id = ? ORDER BY id DESC', [event.id]);

      const demands = await Promise.all(demandsRows.map(async demand => {
        const [proposalRows] = await db.query('SELECT * FROM dbo.evento_propostas_fornecedor WHERE demanda_id = ? ORDER BY id', [demand.id]);
        const [messageRows] = await db.query('SELECT * FROM dbo.evento_mensagens_chat WHERE demanda_id = ? ORDER BY enviado_em', [demand.id]);
        return {
          ...demand,
          prazo: demand.prazo ? new Date(demand.prazo).toISOString().slice(0, 10) : null,
          proposals: proposalRows,
          messages: messageRows
        };
      }));

      return send(response, 200, {
        ok: true,
        dashboard: {
          event: {
            id: event.id,
            name: event.nome,
            date: event.data_evento ? new Date(event.data_evento).toISOString() : null,
            endDate: event.data_fim ? new Date(event.data_fim).toISOString() : null,
            classification: event.classificacao_etaria || 'Livre',
            location: event.local,
            capacity: Number(event.publico_maximo || 0),
            avgTicket: Number(event.ticket_calculado || 0),
            status: event.status,
            destaque: Boolean(event.destaque),
            setores: sectorRows.map(sector => ({
              id: sector.id,
              nome: sector.nome,
              capacidade: Number(sector.capacidade || 0),
              lotes: lots.filter(lot => lot.setor_nome === sector.nome)
            }))
          },
          lots: lots.map(lote => ({
            ...lote,
            data_virada: lote.data_virada ? new Date(lote.data_virada).toISOString().slice(0, 10) : null
          })),
          costItems,
          documents,
          tasks,
          demands
        }
      });
    } catch (error) {
      console.error('[organizador] dashboard:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/eventos') {
    try {
      const body = await parseBody(request);
      const nome = String(body.nome || '').trim();
      const local = String(body.local || body.location || '').trim();
      const dataEvento = parseEventDate(body.data_evento || body.date);
      const dataFim = body.data_fim ? parseEventDate(body.data_fim) : null;
      const ticketCalculado = Number(body.preco || body.ticket_calculado || 0);
      const lotacao = Number(body.capacidade || body.publico_maximo || 0);
      const destaque = body.destaque === true || body.destaque === 1 || body.destaque === 'true' ? 1 : 0;
      const classificacaoEtaria = String(body.classificacao || body.classificacao_etaria || 'Livre').trim();

      if (!nome || !local || !dataEvento || !lotacao) {
        return send(response, 400, { ok: false, message: 'Nome, local, lotação e data do evento são obrigatórios.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.eventos (organizador_id, nome, artista, classificacao_etaria, [local], data_evento, data_fim, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, 500, ?, 0.20, ?, ?, ?)`,
        [body.organizador_id || 1, nome, body.artista || null, classificacaoEtaria, local, dataEvento, dataFim, ticketCalculado, lotacao, body.status || 'publicado', destaque, body.imagem || null]
      );

      const eventoId = result[0]?.id || result.insertId;
      if (Array.isArray(body.setores)) {
        for (const setor of body.setores) {
          const setorNome = String(setor.nome || '').trim();
          if (!setorNome) continue;
          await db.query('INSERT INTO dbo.evento_setores (evento_id, nome, capacidade) VALUES (?, ?, ?)', [eventoId, setorNome, Number(setor.capacidade || 0)]);
        }
      }
      const submittedLots = Array.isArray(body.lotes) && body.lotes.length
        ? body.lotes
        : (Array.isArray(body.setores) ? body.setores.flatMap(setor => (setor.lotes || []).map(lote => ({
          ...lote,
          setor_nome: setor.nome,
          setor_capacidade: setor.capacidade
        }))) : []);
      if (submittedLots.length) {
        for (const lote of submittedLots) {
          if (!lote?.nome && !lote?.nomeLote) continue;
          const ticketLot = normalizeTicketLot(lote);
          await db.query(
            'INSERT INTO dbo.evento_lotes (evento_id, nome, quantidade, preco, regra, data_virada, setor_nome, setor_capacidade, tipo_ingresso, data_inicio, data_fim, quantidade_total, quantidade_meia, quantidade_inteira, quantidade_solidaria, preco_inteira, preco_meia, modalidades_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [eventoId, String(ticketLot.nome || ticketLot.nomeLote).trim(), ticketLot.quantidade, ticketLot.preco, String(ticketLot.regra || ticketLot.regraVirada || 'Esgotamento'), ticketLot.data_virada ? parseEventDate(ticketLot.data_virada) : (ticketLot.data_fim ? parseEventDate(ticketLot.data_fim) : null), ticketLot.setor_nome || null, ticketLot.setor_capacidade || null, ticketLot.tipo_ingresso || ticketLot.tipoIngresso || 'Inteira', ticketLot.data_inicio ? parseEventDate(ticketLot.data_inicio) : (ticketLot.dataInicio ? parseEventDate(ticketLot.dataInicio) : null), ticketLot.data_fim ? parseEventDate(ticketLot.data_fim) : (ticketLot.dataFim ? parseEventDate(ticketLot.dataFim) : null), ticketLot.quantidade_total, ticketLot.quantidade_meia, ticketLot.quantidade_inteira, ticketLot.quantidade_solidaria, ticketLot.preco_inteira, ticketLot.preco_meia, ticketLot.modalidades_json]
          );
        }
      }

      return send(response, 201, { ok: true, evento_id: eventoId, message: 'Evento criado com sucesso.' });
    } catch (error) {
      console.error('[organizador] criar evento:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'PUT' && url.pathname === '/api/organizador/eventos') {
    try {
      const body = await parseBody(request);
      const eventoId = Number(body.id || body.evento_id || body.eventId);
      const nome = String(body.nome || '').trim();
      const local = String(body.local || body.location || '').trim();
      const dataEvento = parseEventDate(body.data_evento || body.date);
      const dataFim = body.data_fim ? parseEventDate(body.data_fim) : null;
      const ticketCalculado = Number(body.preco || body.ticket_calculado || 0);
      const lotacao = Number(body.capacidade || body.publico_maximo || 0);
      const destaque = body.destaque === true || body.destaque === 1 || body.destaque === 'true' ? 1 : 0;
      const classificacaoEtaria = String(body.classificacao || body.classificacao_etaria || 'Livre').trim();

      if (!eventoId || !nome || !local || !dataEvento || !lotacao) {
        return send(response, 400, { ok: false, message: 'Evento, nome, local, lotação e data são obrigatórios.' });
      }

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        await connection.query(
          `UPDATE dbo.eventos
           SET nome = ?, artista = ?, classificacao_etaria = ?, [local] = ?, data_evento = ?, data_fim = ?, ticket_calculado = ?, publico_maximo = ?, status = ?, destaque = ?, imagem = ?
           WHERE id = ?`,
          [nome, body.artista || null, classificacaoEtaria, local, dataEvento, dataFim, ticketCalculado, lotacao, body.status || 'publicado', destaque, body.imagem || null, eventoId]
        );

        await connection.query('DELETE FROM dbo.evento_lotes WHERE evento_id = ?', [eventoId]);
        await connection.query('DELETE FROM dbo.evento_setores WHERE evento_id = ?', [eventoId]);
        if (Array.isArray(body.setores)) {
          for (const setor of body.setores) {
            const setorNome = String(setor.nome || '').trim();
            if (!setorNome) continue;
            await connection.query('INSERT INTO dbo.evento_setores (evento_id, nome, capacidade) VALUES (?, ?, ?)', [eventoId, setorNome, Number(setor.capacidade || 0)]);
          }
        }

        const submittedLots = Array.isArray(body.lotes) && body.lotes.length
          ? body.lotes
          : (Array.isArray(body.setores) ? body.setores.flatMap(setor => (setor.lotes || []).map(lote => ({
            ...lote,
            setor_nome: setor.nome,
            setor_capacidade: setor.capacidade
          }))) : []);
        if (submittedLots.length) {
          for (const lote of submittedLots) {
            if (!lote?.nome && !lote?.nomeLote) continue;
            const ticketLot = normalizeTicketLot(lote);
            await connection.query(
              'INSERT INTO dbo.evento_lotes (evento_id, nome, quantidade, preco, regra, data_virada, setor_nome, setor_capacidade, tipo_ingresso, data_inicio, data_fim, quantidade_total, quantidade_meia, quantidade_inteira, quantidade_solidaria, preco_inteira, preco_meia, modalidades_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [eventoId, String(ticketLot.nome || ticketLot.nomeLote).trim(), ticketLot.quantidade, ticketLot.preco, String(ticketLot.regra || ticketLot.regraVirada || 'Esgotamento'), ticketLot.data_virada ? parseEventDate(ticketLot.data_virada) : (ticketLot.data_fim ? parseEventDate(ticketLot.data_fim) : null), ticketLot.setor_nome || null, ticketLot.setor_capacidade || null, ticketLot.tipo_ingresso || ticketLot.tipoIngresso || 'Inteira', ticketLot.data_inicio ? parseEventDate(ticketLot.data_inicio) : (ticketLot.dataInicio ? parseEventDate(ticketLot.dataInicio) : null), ticketLot.data_fim ? parseEventDate(ticketLot.data_fim) : (ticketLot.dataFim ? parseEventDate(ticketLot.dataFim) : null), ticketLot.quantidade_total, ticketLot.quantidade_meia, ticketLot.quantidade_inteira, ticketLot.quantidade_solidaria, ticketLot.preco_inteira, ticketLot.preco_meia, ticketLot.modalidades_json]
            );
          }
        }

        await connection.commit();
        return send(response, 200, { ok: true, evento_id: eventoId, message: 'Evento atualizado com sucesso.' });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('[organizador] atualizar evento:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/cotacoes') {
    try {
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id || body.eventId);
      const itemId = body.item_id ? Number(body.item_id) : null;
      const titulo = String(body.titulo || '').trim();
      const servico = String(body.servico || '').trim();
      const escopo = String(body.escopo || '').trim();
      const prazo = body.prazo ? new Date(body.prazo) : new Date(Date.now() + 5 * 86400000);
      const valorEstimado = Number(body.valor_estimado || body.value || 0);

      if (!eventoId || !titulo || !escopo || !valorEstimado) {
        return send(response, 400, { ok: false, message: 'Dados da cotação incompletos.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.evento_demandas (evento_id, titulo, servico, escopo, prazo, valor_estimado, status)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, 'em cotacao')`,
        [eventoId, titulo, servico || 'Solicitação', escopo, prazo, valorEstimado]
      );

      const demandaId = result[0]?.id || result.insertId;
      if (itemId) {
        await db.query(
          'UPDATE dbo.evento_itens_custo SET status = ?, demanda_id = ? WHERE id = ?',
          ['em cotacao', demandaId, itemId]
        );
      }

      return send(response, 201, { ok: true, demanda_id: demandaId, message: 'Cotação registrada com sucesso.' });
    } catch (error) {
      console.error('[organizador] criar cotação:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/propostas\/.+\/aprovar$/.test(url.pathname)) {
    const connection = await db.getConnection();
    try {
      const proposalId = Number(url.pathname.split('/')[3]);
      await connection.beginTransaction();

      const [[proposal]] = await connection.query(
        `SELECT p.id, p.demanda_id, p.empresa, p.valor, p.escopo, d.evento_id, d.titulo, d.valor_estimado
         FROM dbo.evento_propostas_fornecedor p
         JOIN dbo.evento_demandas d ON d.id = p.demanda_id
         WHERE p.id = ?`,
        [proposalId]
      );

      if (!proposal) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Proposta não encontrada.' });
      }

      await connection.query(
        'UPDATE dbo.evento_propostas_fornecedor SET status = CASE WHEN id = ? THEN ? ELSE ? END WHERE demanda_id = ?',
        [proposalId, 'aprovada', 'recusada', proposal.demanda_id]
      );

      await connection.query(
        'UPDATE dbo.evento_demandas SET status = ?, valor_estimado = ? WHERE id = ?',
        ['aprovada', proposal.valor, proposal.demanda_id]
      );

      const [itemRows] = await connection.query(
        'SELECT id FROM dbo.evento_itens_custo WHERE demanda_id = ? LIMIT 1',
        [proposal.demanda_id]
      );

      if (itemRows.length) {
        await connection.query(
          'UPDATE dbo.evento_itens_custo SET status = ?, custo_contratado = ?, fornecedor = ? WHERE id = ?',
          ['contratado', proposal.valor, proposal.empresa, itemRows[0].id]
        );
      }

      await connection.commit();
      return send(response, 200, {
        ok: true,
        message: 'Proposta aprovada com sucesso. O custo foi atualizado automaticamente.'
      });
    } catch (error) {
      await connection.rollback();
      console.error('[organizador] aprovar proposta:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/demandas\/.+\/mensagens$/.test(url.pathname)) {
    try {
      const demandId = Number(url.pathname.split('/')[3]);
      const body = await parseBody(request);
      const texto = String(body.texto || '').trim();
      if (!demandId || !texto) {
        return send(response, 400, { ok: false, message: 'Mensagem inválida.' });
      }
      const [result] = await db.query(
        'INSERT INTO dbo.evento_mensagens_chat (demanda_id, remetente, texto) OUTPUT INSERTED.id VALUES (?, ?, ?)',
        [demandId, String(body.remetente || 'organizador'), texto]
      );
      return send(response, 201, { ok: true, mensagem_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[organizador] mensagem:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/propostas') {
    try {
      const body = await parseBody(request);
      const demandaId = Number(body.demanda_id);
      const empresa = String(body.empresa || '').trim();
      const valor = Number(body.valor || 0);
      const escopo = String(body.escopo || '').trim();
      const prazo = String(body.prazo || '');
      const anexos = Array.isArray(body.anexos) ? body.anexos.join(',') : '';

      if (!demandaId || !empresa || !valor || !escopo) {
        return send(response, 400, { ok: false, message: 'Proposta incompleta.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.evento_propostas_fornecedor (demanda_id, empresa, valor, escopo, prazo, anexos, status)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, 'em analise')`,
        [demandaId, empresa, valor, escopo, prazo, anexos]
      );
      return send(response, 201, { ok: true, proposta_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[organizador] proposta:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/documentos') {
    try {
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id);
      const nome = String(body.nome || '').trim();
      const prazo = body.prazo ? new Date(body.prazo) : new Date(Date.now() + 7 * 86400000);
      if (!eventoId || !nome) return send(response, 400, { ok: false, message: 'Documento incompleto.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_documentos (evento_id, nome, prazo, status) OUTPUT INSERTED.id VALUES (?, ?, ?, ?)',
        [eventoId, nome, prazo, body.status || 'pendente']
      );
      return send(response, 201, { ok: true, documento_id: result[0]?.id || result.insertId });
    } catch (error) {
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/custos') {
    try {
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id);
      const categoria = String(body.categoria || '').trim();
      const nomeItem = String(body.nome_item || '').trim();
      const custoEstimado = Number(body.custo_estimado);
      if (!eventoId || !categoria || !nomeItem || !Number.isFinite(custoEstimado) || custoEstimado < 0) {
        return send(response, 400, { ok: false, message: 'Dados do item de custo inválidos.' });
      }
      const [rows] = await db.query(
        `INSERT INTO dbo.evento_itens_custo (evento_id, categoria, nome_item, custo_estimado, status)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, 'pendente')`,
        [eventoId, categoria, nomeItem, custoEstimado]
      );
      return send(response, 201, { ok: true, item_id: rows[0]?.id });
    } catch (error) {
      console.error('[organizador] criar item de custo:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/tarefas') {
    try {
      const body = await parseBody(request);
      if (!body.evento_id || !body.atividade || !body.responsavel) {
        return send(response, 400, { ok: false, message: 'Dados da tarefa incompletos.' });
      }
      const [result] = await db.query(
        'INSERT INTO dbo.evento_tarefas (evento_id, horario, atividade, responsavel, concluida) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?)',
        [Number(body.evento_id), body.horario || '09:00', String(body.atividade).trim(), String(body.responsavel).trim(), body.concluida ? 1 : 0]
      );
      return send(response, 201, { ok: true, tarefa_id: result[0]?.id || result.insertId });
    } catch (error) {
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/tarefas\/\d+\/status$/.test(url.pathname)) {
    try {
      const taskId = Number(url.pathname.split('/')[4]);
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id);
      if (!taskId || !eventoId || typeof body.concluida !== 'boolean') {
        return send(response, 400, { ok: false, message: 'Status da tarefa inválido.' });
      }
      const [rows] = await db.query(
        'UPDATE dbo.evento_tarefas SET concluida = ? OUTPUT INSERTED.id WHERE id = ? AND evento_id = ?',
        [body.concluida ? 1 : 0, taskId, eventoId]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'Tarefa não encontrada.' });
      return send(response, 200, { ok: true, tarefa_id: taskId, concluida: body.concluida });
    } catch (error) {
      console.error('[organizador] atualizar tarefa:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/events') {
    try {
      const body = await parseBody(request);
      const eventDate = parseEventDate(body.data_evento || body.date);
      if (!eventDate) return send(response, 400, { ok: false, message: 'Informe a data do evento.' });
      const [result] = await db.query(
        `INSERT INTO eventos (organizador_id, nome, artista, \`local\`, data_evento, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem) OUTPUT INSERTED.id VALUES (1, ?, ?, ?, ?, ?, 500, 2000, 0.20, 'publicado', ?, ?)`,
        [body.nome.trim(), body.artista || null, body.local.trim(), eventDate, parseFloat(body.preco) || 0, body.destaque ? 1 : 0, body.imagem || null]
      );
      await audit('criacao_evento', `Evento criado: ${body.nome.trim()}.`, 'evento', body.nome.trim(), auditActor(body));
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
      const eventDate = parseEventDate(body.data_evento || body.date);
      if (!eventDate) return send(response, 400, { ok: false, message: 'Informe a data do evento.' });
      
      const [eventRows] = await db.query('SELECT nome FROM dbo.eventos WHERE id = ?', [eventId]);
      const eventName = eventRows[0]?.nome || `Evento ${eventId}`;
      await db.query(
        `UPDATE eventos SET nome = ?, artista = ?, \`local\` = ?, data_evento = ?, ticket_calculado = ?, status = ?, destaque = ?, imagem = ? WHERE id = ?`,
        [
          body.name || body.nome, 
          body.artista || null, 
          body.location || body.local, 
          eventDate, 
          parseFloat(body.price || body.preco) || 0, 
          body.status || 'publicado', 
          body.destaque ? 1 : 0, 
          body.imagem || null, 
          eventId
        ]
      );
      await audit('edicao_evento', `Evento ${eventName} atualizado pelo painel.`, 'evento', eventName, auditActor(body));
      return send(response, 200, { ok: true, message: 'Evento atualizado com sucesso!' });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  if (request.method === 'DELETE' && /^\/api\/events\/\d+$/.test(url.pathname)) {
    try {
      const eventId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const [eventRows] = await db.query('SELECT nome FROM dbo.eventos WHERE id = ?', [eventId]);
      const eventName = eventRows[0]?.nome || `Evento ${eventId}`;
      await db.query('DELETE FROM eventos WHERE id = ?', [eventId]);
      await audit('exclusao_evento', `Evento ${eventName} excluído pelo painel.`, 'evento', eventName, auditActor(body));
      return send(response, 200, { ok: true, message: 'Evento excluído com sucesso!' });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  // ===== PAINEL ADMIN STATS =====
  if (request.method === 'GET' && url.pathname === '/api/admin/stats') {
    try {
      const [baseRows] = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM dbo.usuarios) AS totalUsers,
          (SELECT COUNT(*) FROM dbo.eventos WHERE status = 'publicado') AS totalEvents
      `);
      const [objects] = await db.query("SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') AND name IN ('ingressos_emitidos', 'pedidos')");
      const tableNames = new Set(objects.map(object => object.name));
      let totalTickets = 0;
      let totalRevenue = 0;
      let pendingCancellations = 0;
      let gmvSeries = [];
      let trendSeries = [];

      if (tableNames.has('ingressos_emitidos')) {
        const [ticketRows] = await db.query('SELECT COUNT(*) AS totalTickets FROM dbo.ingressos_emitidos');
        totalTickets = Number(ticketRows[0]?.totalTickets || 0);
      }
      if (tableNames.has('pedidos')) {
        const [revenueRows] = await db.query("SELECT COALESCE(SUM(valor_total), 0) AS totalRevenue FROM dbo.pedidos WHERE status = 'aprovado'");
        totalRevenue = Number(revenueRows[0]?.totalRevenue || 0);
        const eventId = Number(url.searchParams.get('event_id') || 0);
        const gmvPeriod = ['daily', 'weekly', 'monthly'].includes(url.searchParams.get('gmv_period')) ? url.searchParams.get('gmv_period') : 'daily';
        const trendPeriod = ['daily', 'weekly', 'monthly', 'yearly'].includes(url.searchParams.get('trend_period')) ? url.searchParams.get('trend_period') : 'daily';
        const gmvBucket = gmvPeriod === 'weekly'
          ? "DATEADD(week, DATEDIFF(week, 0, p.criado_em), 0)"
          : gmvPeriod === 'monthly'
            ? "DATEFROMPARTS(YEAR(p.criado_em), MONTH(p.criado_em), 1)"
            : "CAST(p.criado_em AS date)";
        const gmvSince = gmvPeriod === 'weekly' ? 'DATEADD(week, -7, CAST(SYSUTCDATETIME() AS date))' : gmvPeriod === 'monthly' ? 'DATEADD(month, -11, CAST(SYSUTCDATETIME() AS date))' : 'DATEADD(day, -6, CAST(SYSUTCDATETIME() AS date))';
        if (eventId) {
          const [gmvRows] = await db.query(`SELECT CONVERT(varchar(10), bucket, 103) AS label, SUM(valor_total) AS value FROM (
            SELECT DISTINCT p.id, p.valor_total, ${gmvBucket} AS bucket
            FROM dbo.pedidos p JOIN dbo.ingressos_emitidos i ON i.pedido_id = p.id
            WHERE p.status = 'aprovado' AND i.evento_id = ? AND p.criado_em >= ${gmvSince}
          ) sales GROUP BY bucket ORDER BY bucket`, [eventId]);
          gmvSeries = gmvRows.map(row => ({ label: row.label, value: Number(row.value || 0) }));
        }
        const trendBucket = trendPeriod === 'yearly'
          ? "DATEFROMPARTS(YEAR(p.criado_em), 1, 1)"
          : trendPeriod === 'monthly'
            ? "DATEFROMPARTS(YEAR(p.criado_em), MONTH(p.criado_em), 1)"
            : trendPeriod === 'weekly'
              ? "DATEADD(week, DATEDIFF(week, 0, p.criado_em), 0)"
              : "CAST(p.criado_em AS date)";
        const trendSince = trendPeriod === 'yearly' ? 'DATEADD(year, -4, CAST(SYSUTCDATETIME() AS date))' : trendPeriod === 'monthly' ? 'DATEADD(month, -11, CAST(SYSUTCDATETIME() AS date))' : trendPeriod === 'weekly' ? 'DATEADD(week, -7, CAST(SYSUTCDATETIME() AS date))' : 'DATEADD(day, -6, CAST(SYSUTCDATETIME() AS date))';
        const [trendRows] = await db.query(`SELECT CONVERT(varchar(10), bucket, 103) AS label, SUM(valor_total) AS value FROM (
          SELECT ${trendBucket} AS bucket, valor_total FROM dbo.pedidos p WHERE p.status = 'aprovado' AND p.criado_em >= ${trendSince}
        ) sales GROUP BY bucket ORDER BY bucket`);
        trendSeries = trendRows.map(row => ({ label: row.label, value: Number(row.value || 0) }));
      }

      const [cancelObjects] = await db.query("SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') AND name = 'cancelamentos'");
      if (cancelObjects.length) {
        const [cancelRows] = await db.query("SELECT COUNT(*) AS pendingCancellations FROM dbo.cancelamentos WHERE status = 'pendente'");
        pendingCancellations = Number(cancelRows[0]?.pendingCancellations || 0);
      }

      return send(response, 200, {
        ok: true,
        stats: { ...baseRows[0], totalTickets, totalRevenue, pendingCancellations, gmvSeries, trendSeries }
      });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && (url.pathname === '/api/admin/users' || url.pathname === '/api/admin/usuarios')) {
    try {
      const [users] = await db.query('SELECT id, nome, email, tipo, status, cpf, telefone, criado_em, email_verificado, codigo_verificacao FROM dbo.usuarios ORDER BY id DESC');
      return send(response, 200, { ok: true, users: users.map(user => ({ ...user, status: getAdminUserStatus(user) })) });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'PATCH' && /^\/api\/admin\/users\/\d+$/.test(url.pathname)) {
    try {
      const userId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const adminEmail = normalizeEmail(body.admin_email);
      const adminPassword = String(body.admin_password || '');
      const allowedTypes = ['admin', 'comum', 'organizador', 'fornecedor', 'bilheteria'];
      const allowedStatuses = ['ativa', 'suspensa'];
      const tipo = String(body.tipo || '').toLowerCase();
      const requestedStatus = String(body.status || '').toLowerCase();

      if (!allowedTypes.includes(tipo) || !allowedStatuses.includes(requestedStatus)) {
        return send(response, 400, { ok: false, message: 'Tipo ou status de usuário inválido.' });
      }

      const [[admin]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [adminEmail]);
      if (!admin || admin.tipo !== 'admin' || !(await bcrypt.compare(adminPassword, admin.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Senha do administrador inválida.' });
      }
      if (admin.id === userId && tipo !== 'admin') {
        return send(response, 400, { ok: false, message: 'A conta do administrador não pode perder o tipo admin.' });
      }

      const [[affectedUser]] = await db.query('SELECT nome FROM dbo.usuarios WHERE id = ?', [userId]);
      const [updated] = await db.query(
        `UPDATE dbo.usuarios
         SET tipo = ?, status = ?
         OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.tipo, INSERTED.status
         WHERE id = ?`,
        [tipo, requestedStatus === 'suspensa' ? 'suspensa' : 'aprovado', userId]
      );
      if (!updated.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      await audit('alteracao_acesso', `Tipo alterado para ${tipo} e status para ${requestedStatus}.`, 'usuario', `Conta de ${affectedUser?.nome || 'usuário'}`, { id: admin.id, nome: admin.nome, tipo: 'admin' });
      return send(response, 200, { ok: true, user: { ...updated[0], status: requestedStatus } });
    } catch (error) {
      console.error('[admin] Erro ao atualizar usuário:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível atualizar o usuário.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/tickets') {
    try {
      const [objects] = await db.query("SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') AND name = 'ingressos_emitidos'");
      if (!objects.length) return send(response, 200, { ok: true, tickets: [] });

      const [tickets] = await db.query(`
        SELECT
          i.id,
          i.numero_ingresso,
          CASE
            WHEN i.status = 'ativo' AND e.data_evento < SYSUTCDATETIME() THEN 'expirado'
            WHEN i.status = 'valido' THEN 'ativo'
            ELSE i.status
          END AS status,
          i.emitido_em AS createdAt,
          p.codigo_pedido,
          p.valor_total AS orderTotal,
          u.nome AS ownerName,
          e.nome AS eventName
        FROM dbo.ingressos_emitidos i
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
        ORDER BY i.emitido_em DESC
      `);
      return send(response, 200, { ok: true, tickets });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'PATCH' && /^\/api\/admin\/tickets\/\d+\/status$/.test(url.pathname)) {
    try {
      const ticketId = Number(url.pathname.split('/')[4]);
      const body = await parseBody(request);
      const status = String(body.status || '').trim().toLowerCase();
      if (!['cancelado', 'bloqueado'].includes(status)) {
        return send(response, 400, { ok: false, message: 'O painel só pode definir os status cancelado ou bloqueado.' });
      }

      const [result] = await db.query(
        `UPDATE dbo.ingressos_emitidos
         SET status = ?
         OUTPUT INSERTED.id, INSERTED.status
         WHERE id = ?`,
        [status, ticketId]
      );
      if (!result.length) return send(response, 404, { ok: false, message: 'Ingresso não encontrado.' });
      const [[ticket]] = await db.query(`SELECT e.nome AS evento FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id WHERE i.id = ?`, [ticketId]);
      const actor = auditActor(body);
      const [[ticketCode]] = await db.query('SELECT numero_ingresso FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      await audit('alteracao_status_ingresso', `Status do ingresso do evento ${ticket?.evento || 'evento'} alterado para ${status}.`, 'ingresso', ticketCode?.numero_ingresso || 'Ingresso não identificado', actor);
      return send(response, 200, { ok: true, ticket: result[0] });
    } catch (error) {
      console.error('[admin] Erro ao alterar status do ingresso:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível alterar o status.' });
    }
  }

  // ===== ROTAS AUXILIARES DO ADMIN (LOGS E DESTAQUES) =====
  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/activity-log')) {
    try {
      const actor = url.searchParams.get('actor') || '';
      const type = url.searchParams.get('type') || '';
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
      const [logs] = await db.query(`
        SELECT TOP (${limit}) id, ator_id AS actorId, ator_nome AS actorName, ator_tipo AS actorType,
          acao AS action, descricao AS description, item_tipo AS itemType, item_id AS itemId, criado_em AS timestamp
        FROM dbo.auditoria_admin
        WHERE (? = '' OR ator_nome LIKE '%' + ? + '%')
          AND (? = '' OR ator_tipo = ?)
        ORDER BY criado_em DESC`, [actor, actor, type, type]);
      return send(response, 200, { ok: true, logs, activities: logs });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/user-history') {
    try {
      const search = String(url.searchParams.get('q') || '').trim();
      if (!search) return send(response, 400, { ok: false, message: 'Informe nome, telefone, e-mail ou CPF.' });
      const [users] = await db.query(`SELECT TOP (1) id, nome, email, cpf, telefone, tipo, status, criado_em
        FROM dbo.usuarios WHERE nome LIKE '%' + ? + '%' OR email LIKE '%' + ? + '%' OR telefone LIKE '%' + ? + '%' OR cpf LIKE '%' + ? + '%'`, [search, search, search, search]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      const user = users[0];
      const [purchases] = await db.query(`SELECT p.id, p.codigo_pedido, p.valor_total, p.status, p.criado_em
        FROM dbo.pedidos p WHERE p.comprador_id = ? ORDER BY p.criado_em DESC`, [user.id]);
      const [tickets] = await db.query(`SELECT i.id, i.numero_ingresso, i.status, i.emitido_em, e.nome AS evento
        FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id
        WHERE i.comprador_id = ? ORDER BY i.emitido_em DESC`, [user.id]);
      const [logs] = await db.query(`SELECT id, acao AS action, descricao AS description, item_tipo AS itemType, item_id AS itemId, criado_em AS timestamp
        FROM dbo.auditoria_admin WHERE item_tipo = 'usuario' AND item_id = ? ORDER BY criado_em DESC`, [String(user.id)]);
      return send(response, 200, { ok: true, user: { ...user, status: getAdminUserStatus(user) }, purchases, tickets, support: [], transactions: purchases, logs });
    } catch (error) {
      console.error('[admin] Erro no histórico do usuário:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar o histórico.' });
    }
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/featured-events')) {
    try {
      const [events] = await db.query(`SELECT id, nome AS name, artista, [local] AS location, data_evento AS date,
        ticket_calculado AS price, imagem, destaque, status FROM dbo.eventos
        WHERE destaque = 1 AND status = 'publicado' ORDER BY id DESC`);
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== CARTÕES DO USUÁRIO (ROBUSTO E SEGURO) =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/cartoes') {
    try {
      const email = normalizeEmail(url.searchParams.get('email'));
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });
      
      const [cards] = await db.query('SELECT id, nome_titular, ultimos_digitos, bandeira, validade_mes, validade_ano, criado_em FROM dbo.cartoes_usuario WHERE usuario_id = ? ORDER BY id DESC', [users[0].id]);
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
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Comprador não encontrado.' });

      const numCartao = String(body.numero_cartao || body.numero || '').trim();
      const numLimpo = numCartao.replace(/\D/g, '');
      if (numLimpo.length < 13 || numLimpo.length > 19) {
        return send(response, 400, { ok: false, message: 'Número de cartão inválido.' });
      }
      const ultimos_digitos = numLimpo.slice(-4) || '0000';
      const bandeira = detectCardBrand(numLimpo);

      let mes = body.validade_mes || '';
      let ano = body.validade_ano || '';
      if (!mes && body.validade && String(body.validade).includes('/')) {
        const parts = String(body.validade).split('/');
        mes = parts[0].trim();
        ano = parts[1].trim();
      }

      const cardHash = crypto.createHash('sha256').update(numLimpo + users[0].id, 'utf8').digest('hex');

      await db.query(
        `INSERT INTO dbo.cartoes_usuario 
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
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Usuário não encontrado.' });

      await db.query('DELETE FROM dbo.cartoes_usuario WHERE id = ? AND usuario_id = ?', [cardId, users[0].id]);
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