const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const db = require('./db');

const port = process.env.PORT || 3000;
const root = __dirname;
const sessionTokenSecret = process.env.TROCATICKET_SESSION_SECRET
  || process.env.DB_PASSWORD
  || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
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
function normalizePhone(value) { return String(value || '').replace(/\D/g, ''); }
function hasValidPhoneLength(value) {
  const digits = normalizePhone(value);
  return digits.length >= 10 && digits.length <= 15;
}
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
    console.warn(`[auth] SMTP nÃ£o configurado. CÃ³digo de verificaÃ§Ã£o para ${to}: ${code}`);
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: 'TrocaTicket - cÃ³digo de verificaÃ§Ã£o',
    text: `OlÃ¡ ${name || 'usuÃ¡rio'}, seu cÃ³digo de verificaÃ§Ã£o do TrocaTicket Ã© ${code}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="margin: 0 0 16px;">TrocaTicket</h2>
        <p>OlÃ¡ ${name || 'usuÃ¡rio'},</p>
        <p>Use o cÃ³digo abaixo para confirmar seu cadastro:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${code}</div>
        <p>Se vocÃª nÃ£o solicitou este cadastro, pode ignorar esta mensagem.</p>
      </div>
    `
  });

  return { sent: true };
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function formatEmailDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'A confirmar'
    : date.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
}

function slugifyEventName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'evento';
}

function createOfflineTicketEmailHtml(ticket, filename, expiresAt, walletUrl, bannerSrc) {
  const eventName = escapeHtml(ticket.eventName);
  const eventStart = escapeHtml(formatEmailDateTime(ticket.eventDate));
  const eventEnd = escapeHtml(formatEmailDateTime(expiresAt));
  const location = escapeHtml(ticket.location || 'A confirmar');
  const holder = escapeHtml(ticket.holder || 'Titular do ingresso');
  const email = escapeHtml(ticket.email);
  const ticketNumber = escapeHtml(ticket.numero_ingresso);
  const orderCode = escapeHtml(ticket.orderCode || ticket.pedido_id || 'A confirmar');
  const sector = escapeHtml(ticket.sector || 'Setor a confirmar');
  const safeFilename = escapeHtml(filename);
  const supportUrl = escapeHtml(process.env.TROCATICKET_SUPPORT_URL || 'https://trocaticket.com/suporte');
  const title = escapeHtml(`Seu ingresso offline para o ${ticket.eventName} estÃ¡ pronto, aguardamos sua presenÃ§a!`);
  const walletButton = walletUrl
    ? `<a href="${escapeHtml(walletUrl)}" target="_blank" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#111827;border:1px solid #374151;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;"><span style="display:inline-block;margin-right:8px;color:#4285f4;font-size:18px;font-weight:bold;">G</span>Adicionar Ã  Carteira do Google</a>`
    : '<span role="button" aria-disabled="true" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#111827;border:1px solid #374151;color:#ffffff;opacity:.55;font-size:15px;font-weight:bold;cursor:not-allowed;"><span style="display:inline-block;margin-right:8px;color:#4285f4;font-size:18px;font-weight:bold;">G</span>Adicionar Ã  Carteira do Google</span><p style="margin:8px 0 0;color:#64748b;font-size:12px;line-height:1.6;">A Carteira do Google ainda nÃ£o estÃ¡ habilitada para este ingresso.</p>';

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Seu ingresso Troca Ticket</title>
<style>@media only screen and (max-width:600px){.email-shell{width:100%!important}.email-pad{padding-left:18px!important;padding-right:18px!important}.event-title{font-size:23px!important}.step-cell{padding:12px!important}}</style></head>
<body style="width:100%;margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Seu ingresso digital para ${eventName} estÃ¡ pronto, com acesso offline e QR dinÃ¢mico.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;"><tr><td align="center" style="padding:0;">
<table role="presentation" class="email-shell" width="680" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;margin:0 auto;background:#ffffff;">
<tr><td align="center" style="padding:0;background:#000000;">
<img src="${escapeHtml(bannerSrc)}" width="680" alt="Troca Ticket" style="display:block;width:100%;max-width:680px;height:auto;margin:0 auto;border:0;">
</td></tr>
<tr><td class="email-pad" style="padding:30px 36px 10px;">
<p style="margin:0 0 8px;color:#475569;font-size:15px;">OlÃ¡, ${holder}.</p>
<h1 class="event-title" style="margin:0;color:#0f172a;font-size:28px;line-height:1.25;">${title}</h1>
</td></tr>
<tr><td class="email-pad" style="padding:18px 36px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:8px;"><tr><td width="42" valign="top" style="padding:16px 0 16px 16px;color:#2563eb;font-size:24px;">&#8681;</td><td style="padding:16px 16px 16px 10px;"><p style="margin:0 0 4px;color:#1e3a8a;font-size:14px;font-weight:bold;">Baixar ingresso offline</p><p style="margin:0;color:#334155;font-size:13px;line-height:1.5;">O arquivo estÃ¡ anexado a este e-mail: <strong>${safeFilename}</strong>. Guarde-o no seu smartphone antes de chegar ao evento.</p></td></tr></table>
</td></tr>
<tr><td class="email-pad" align="center" style="padding:8px 36px 24px;">${walletButton}</td></tr>
<tr><td class="email-pad" style="padding:0 36px 22px;">
<h2 style="margin:0 0 6px;color:#0f172a;font-size:18px;line-height:1.4;">InstruÃ§Ãµes de utilizaÃ§Ã£o do acesso offline (sem internet)</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="step-cell" style="padding:15px 16px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 1 Â· Descarregue o anexo</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Guarde <strong>${safeFilename}</strong> no seu smartphone antes de ir ao evento.</p>
</td></tr><tr><td class="step-cell" style="padding:15px 16px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 2 Â· Abra no navegador</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Abra o arquivo no Google Chrome, Samsung Internet ou Safari. Se solicitado, escolha <strong>â€œSempreâ€</strong> ou <strong>â€œDesta vezâ€</strong>. O arquivo funciona localmente, sem dados mÃ³veis.</p>
</td></tr><tr><td class="step-cell" style="padding:15px 16px;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 3 Â· Apresente na entrada</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Na fila, mesmo sem rede ou em modo de voo, o QR continuarÃ¡ atualizando a cada 60 segundos. Apresente a tela do navegador Ã  equipe da portaria.</p>
</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:14px;background:#eff6ff;border-left:3px solid #2563eb;"><tr><td style="padding:12px 14px;color:#1e3a8a;font-size:13px;line-height:1.6;"><strong>Validade do CÃ³digo QR Offline:</strong> Ativo atÃ© ao tÃ©rmino oficial do evento em ${eventEnd}.</td></tr></table>
</td></tr>
<tr><td class="email-pad" style="padding:0 36px 24px;">
<h2 style="margin:0 0 10px;color:#0f172a;font-size:18px;">Resumo do ingresso</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;background:#f1f5f9;">
<tr><td style="padding:16px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Data e horÃ¡rio de inÃ­cio</p><p style="margin:0;color:#0f172a;font-size:14px;font-weight:bold;">${eventStart}</p></td></tr>
<tr><td style="padding:10px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Local</p><p style="margin:0;color:#0f172a;font-size:14px;">${location}</p></td></tr>
<tr><td style="padding:10px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Titular</p><p style="margin:0;color:#0f172a;font-size:14px;">${holder} <span style="color:#64748b;">(${email})</span></p></td></tr>
<tr><td style="padding:10px 18px 16px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Bilhete e setor</p><p style="margin:0;color:#0f172a;font-size:14px;font-weight:bold;">#${ticketNumber} <span style="font-weight:normal;color:#475569;">Â· ${sector}</span></p></td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:20px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">NÃ£o responda a este e-mail. Este Ã© um e-mail automÃ¡tico enviado pela plataforma Troca Ticket.</p>
<p style="margin:8px 0;color:#94a3b8;font-size:12px;">DÃºvidas ou suporte? Acesse nossa central de ajuda no site da <a href="${supportUrl}" style="color:#00e5ff;text-decoration:underline;font-weight:bold;">Troca Ticket</a>.</p>
<p style="margin:12px 0 0;color:#94a3b8;font-size:11px;">Â© 2026 Troca Ticket. Todos os direitos reservados.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return html
    .replace('Baixar ingresso offline (.html)', 'Baixar ingresso offline')
    .replace('Bilhete e setor', 'Bilhete, pedido e setor')
    .replace(
      `#${ticketNumber} <span style="font-weight:normal;color:#475569;">Â· ${sector}</span>`,
      `#${ticketNumber} <span style="font-weight:normal;color:#475569;">Â· Pedido #${orderCode} Â· ${sector}</span>`
    );
}

function createOfflineTicketHtml(ticket, qrLibrary) {
  const ticketData = JSON.stringify({
    number: ticket.numero_ingresso,
    secretKey: ticket.secret_key,
    eventName: ticket.eventName,
    eventDate: ticket.eventDate,
    eventEndDate: ticket.eventEndDate,
    location: ticket.location,
    holder: ticket.holder,
    sector: ticket.sector,
    expiresAt: new Date(ticket.eventEndDate).getTime()
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Ingresso offline | TrocaTicket</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0e14;color:#fff;font:16px system-ui,sans-serif}.pass{width:min(340px,calc(100vw - 40px));padding:24px;box-sizing:border-box;background:#171a24;border:1px solid #30364a;border-radius:16px;text-align:center;box-shadow:0 16px 48px #0008}h1{font-size:20px;margin:0 0 8px}p{color:#aeb5c8;font-size:14px;margin:6px 0}.qr{width:220px;height:220px;margin:20px auto;background:#fff;border-radius:10px;display:grid;place-items:center}.qr canvas{max-width:100%;max-height:100%}.notice{color:#ff9f43!important;min-height:20px}.tag{color:#27b7ff;font-weight:700;font-size:12px;text-transform:uppercase}</style></head>
<body><main class="pass"><p class="tag">TrocaTicket Â· Ingresso digital</p><h1 id="event-name"></h1><p id="event-details"></p><div class="qr" id="qr"><canvas id="qr-canvas"></canvas></div><p class="notice" id="status" aria-live="polite">Gerando QR offline...</p><p id="ticket-number"></p><p id="event-end"></p></main>
<script>${qrLibrary}</script><script>
const ticket=${ticketData};
const encoder=new TextEncoder();
const keyBytes=Uint8Array.from(ticket.secretKey.match(/.{2}/g),part=>parseInt(part,16));
document.getElementById('event-name').textContent=ticket.eventName;
document.getElementById('event-details').textContent=[new Date(ticket.eventDate).toLocaleString('pt-BR'),ticket.location,ticket.sector].filter(Boolean).join(' Â· ');
document.getElementById('ticket-number').textContent='Ingresso #'+ticket.number+' Â· '+ticket.holder;
document.getElementById('event-end').textContent='VÃ¡lido atÃ© '+new Date(ticket.eventEndDate).toLocaleString('pt-BR');
async function refresh(){const status=document.getElementById('status');if(Date.now()>ticket.expiresAt){document.getElementById('qr').hidden=true;status.textContent='Ingresso expirado: evento encerrado';return}try{const step=Math.floor(Date.now()/60000);const key=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-256'},false,['sign']);const digest=await crypto.subtle.sign('HMAC',key,encoder.encode(ticket.number+':'+step));const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');await QRCode.toCanvas(document.getElementById('qr-canvas'),ticket.number+':'+step+':'+hash,{width:200,margin:1,errorCorrectionLevel:'M'});status.textContent='QR atualizado Â· prÃ³ximo em atÃ© 60 segundos'}catch(error){status.textContent='NÃ£o foi possÃ­vel gerar o QR offline neste navegador.'}}
refresh();setInterval(refresh,Math.max(1000,60000-(Date.now()%60000)+150));
</script></body></html>`;
}

function getQrBrowserBundle() {
  const entryFile = require.resolve('qrcode/lib/browser.js');
  const moduleIds = new Map();
  const modules = [];

  function addModule(filename) {
    if (moduleIds.has(filename)) return moduleIds.get(filename);
    const id = modules.length;
    moduleIds.set(filename, id);
    modules.push('');
    let source = fs.readFileSync(filename, 'utf8');
    source = source.replace(/require\((['"])([^'"]+)\1\)/g, (match, quote, request) => {
      if (request === 'fs') return '({})';
      const dependency = require.resolve(request, { paths: [path.dirname(filename)] });
      return `__require(${addModule(dependency)})`;
    });
    modules[id] = `function(module,exports,__require){${source}\n}`;
    return id;
  }

  const entryId = addModule(entryFile);
  return `(function(root){var modules=[${modules.join(',')}],cache={};function __require(id){if(cache[id])return cache[id].exports;var module={exports:{}};cache[id]=module;modules[id](module,module.exports,__require);return module.exports}root.QRCode=__require(${entryId})})(window);`;
}

function gerarLinkGoogleWallet(ingresso) {
  const ticket = ingresso && typeof ingresso === 'object' ? ingresso : {};
  const debugPayload = {
    codigo_bilhete: String(ticket.codigo_bilhete || ticket.numero_ingresso || 'N/A').slice(0, 80),
    qr_code_interno: ticket.qr_code_interno || ticket.qr_code_payload ? '[REDACTED]' : 'N/A',
    titular_nome: ticket.titular_nome || ticket.holder ? '[PRESENTE]' : 'N/A',
    setor: String(ticket.setor || ticket.sector || 'Pista').slice(0, 80)
  };
  console.log('Payload do Ingresso recebido:', JSON.stringify(debugPayload));

  const issuerId = String(process.env.GOOGLE_ISSUER_ID || process.env.GOOGLE_WALLET_ISSUER_ID || '').trim();
  const classId = String(process.env.GOOGLE_WALLET_CLASS_ID || '').trim();
  const serviceEmail = String(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL || '').trim();
  const privateKey = String(process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_WALLET_PRIVATE_KEY || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\n/g, '\n')
    .trim();
  if (!issuerId || !classId || !serviceEmail || !privateKey || /COLE_A_CHAVE/i.test(privateKey)) return null;

  const rawTicketCode = String(ticket.codigo_bilhete || ticket.numero_ingresso || 'N/A').trim();
  const ticketCode = rawTicketCode
    .replace(/[^A-Za-z0-9._]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^[._]+|[._]+$/g, '')
    .slice(0, 64) || 'N_A';
  const qrCode = String(ticket.qr_code_interno || ticket.qr_code_payload || rawTicketCode || 'N/A').trim().slice(0, 500) || 'N/A';
  const holderName = String(ticket.titular_nome || ticket.holder || 'N/A').trim().slice(0, 128) || 'N/A';
  const seatName = String(ticket.setor || ticket.sector || 'Pista').trim().slice(0, 128) || 'Pista';

  const claims = {
    iss: serviceEmail,
    aud: 'google',
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    origins: [],
    payload: {
      eventTicketObjects: [{
        id: `${issuerId}.${ticketCode}`,
        classId,
        state: 'ACTIVE',
        barcode: {
          type: 'QR_CODE',
          value: qrCode,
          alternateText: ticketCode
        },
        ticketHolderName: holderName,
        ticketSeat: {
          seat: {
            defaultValue: {
              language: 'pt-BR',
              value: seatName
            }
          }
        }
      }]
    }
  };

  return `https://pay.google.com/gp/v/save/${jwt.sign(claims, privateKey, { algorithm: 'RS256' })}`;
}

function createWalletMockUrl(ticket) {
  const details = [ticket.eventDate && new Date(ticket.eventDate).toLocaleString('pt-BR'), ticket.location, ticket.sector, ticket.holder, ticket.numero_ingresso]
    .filter(Boolean).map(escapeHtml);
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PrÃ©via Google Wallet</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f1f3f4;font:16px Arial,sans-serif;color:#202124}.pass{width:min(360px,calc(100vw - 40px));background:#171a24;color:#fff;border-radius:18px;padding:24px;box-sizing:border-box;box-shadow:0 8px 28px #0003}.brand{font-size:14px;color:#b9c4d8}.g{font-size:20px;font-weight:700;background:conic-gradient(#4285f4,#34a853,#fbbc05,#ea4335,#4285f4);color:transparent;background-clip:text;-webkit-background-clip:text}h1{font-size:23px;margin:24px 0 18px}p{margin:10px 0;color:#d2d7e2}.mock{margin-top:24px;color:#aeb5c8;font-size:12px}</style><main class="pass"><div class="brand"><span class="g">G</span> Carteira do Google Â· DemonstraÃ§Ã£o</div><h1>${escapeHtml(ticket.eventName)}</h1>${details.map(detail => `<p>${detail}</p>`).join('')}<p class="mock">Passe de demonstraÃ§Ã£o. Configure as credenciais do Google Wallet para habilitar a emissÃ£o real.</p></main></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

async function getTicketForSession(request, ticketId) {
  const session = readSessionToken(request);
  if (!session) return { error: { status: 401, message: 'SessÃ£o invÃ¡lida. Entre novamente para continuar.' } };
  await ensureTicketSecuritySchema();
  const [rows] = await db.query(`
          SELECT i.id, i.numero_ingresso, i.pedido_id, i.secret_key, i.status,
      COALESCE(NULLIF(TRIM(i.setor_nome), ''), (
        SELECT CASE WHEN COUNT(DISTINCT NULLIF(TRIM(l.setor_nome), '')) = 1
          THEN MAX(NULLIF(TRIM(l.setor_nome), '')) END
        FROM dbo.evento_lotes l
        WHERE l.evento_id = i.evento_id AND NULLIF(TRIM(l.setor_nome), '') IS NOT NULL
      )) AS sector,
      e.nome AS eventName, e.[local] AS location,
      CONVERT(varchar(19), e.data_evento, 126) AS eventDate,
      CONVERT(varchar(19), e.data_fim, 126) AS eventEndDate,
      u.nome AS holder, u.email AS email, p.codigo_pedido AS orderCode
    FROM dbo.ingressos_emitidos i
    JOIN dbo.usuarios u ON u.id = i.comprador_id
    JOIN dbo.eventos e ON e.id = i.evento_id
    LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
    WHERE i.id = ? AND i.comprador_id = ? AND u.email = ?
  `, [ticketId, session.sub, session.email]);
  if (!rows.length) return { error: { status: 404, message: 'Ingresso nÃ£o encontrado para esta conta.' } };
  const ticket = rows[0];
  if (!['ativo', 'valido'].includes(String(ticket.status).toLowerCase()) || !ticket.secret_key) {
    return { error: { status: 409, message: 'Este ingresso nÃ£o estÃ¡ ativo para acesso digital.' } };
  }
  return { ticket };
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
    throw new Error('Data do evento invÃ¡lida. Use o formato AAAA-MM-DD HH:MM.');
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
function makeTicketSecret() { return crypto.randomBytes(32).toString('hex'); }
function makeTicketHash(ticketId, timeStep, secretKey) {
  return crypto.createHmac('sha256', Buffer.from(secretKey, 'hex')).update(`${ticketId}:${timeStep}`).digest('hex');
}
function makeActiveTicketPayload(ticketId, secretKey, timeStep = Math.floor(Date.now() / 1000 / 60)) {
  return `${ticketId}:${timeStep}:${makeTicketHash(ticketId, timeStep, secretKey)}`;
}
function safeHashEqual(expected, received) {
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

let ticketSecuritySchemaPromise;
let supplierSchemaPromise;
function ensureSupplierSchema() {
  if (!supplierSchemaPromise) {
    supplierSchemaPromise = (async () => {
      await db.query(`
        IF OBJECT_ID(N'dbo.fornecedor_empresas', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.fornecedor_empresas (
            id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_fornecedor_empresas PRIMARY KEY,
            usuario_id int NOT NULL,
            razao_social varchar(180) NOT NULL,
            cnpj varchar(30) NOT NULL,
            categoria varchar(120) NOT NULL,
            contato varchar(160) NOT NULL,
            email_comercial varchar(180) NOT NULL,
            telefone varchar(40) NOT NULL,
            descricao varchar(max) NOT NULL,
            status varchar(30) NOT NULL CONSTRAINT df_fornecedor_empresas_status DEFAULT 'pendente',
            criado_em datetime2(0) NOT NULL CONSTRAINT df_fornecedor_empresas_criado DEFAULT SYSUTCDATETIME(),
            atualizado_em datetime2(0) NOT NULL CONSTRAINT df_fornecedor_empresas_atualizado DEFAULT SYSUTCDATETIME(),
            CONSTRAINT uq_fornecedor_empresas_usuario UNIQUE (usuario_id),
            CONSTRAINT uq_fornecedor_empresas_cnpj UNIQUE (cnpj)
          );
        END;
        IF COL_LENGTH('dbo.fornecedor_empresas', 'logo_url') IS NULL
          ALTER TABLE dbo.fornecedor_empresas ADD logo_url varchar(500) NULL;
        IF COL_LENGTH('dbo.evento_propostas_fornecedor', 'fornecedor_usuario_id') IS NULL
          ALTER TABLE dbo.evento_propostas_fornecedor ADD fornecedor_usuario_id int NULL;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'anexo_url') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD anexo_url varchar(500) NULL;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'anexo_nome') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD anexo_nome varchar(255) NULL;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'anexo_tipo') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD anexo_tipo varchar(120) NULL;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'lida_organizador') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD lida_organizador bit NOT NULL CONSTRAINT df_evento_mensagens_chat_lida_organizador DEFAULT 0;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'lida_fornecedor') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD lida_fornecedor bit NOT NULL CONSTRAINT df_evento_mensagens_chat_lida_fornecedor DEFAULT 0;
        IF COL_LENGTH('dbo.evento_mensagens_chat', 'fornecedor_usuario_id') IS NULL
          ALTER TABLE dbo.evento_mensagens_chat ADD fornecedor_usuario_id int NULL;
        IF OBJECT_ID(N'dbo.evento_proposta_documentos', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.evento_proposta_documentos (
            id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_evento_proposta_documentos PRIMARY KEY,
            proposta_id int NOT NULL,
            nome_arquivo varchar(255) NOT NULL,
            caminho varchar(500) NOT NULL,
            criado_em datetime2(0) NOT NULL CONSTRAINT df_evento_proposta_documentos_criado DEFAULT SYSUTCDATETIME(),
            CONSTRAINT fk_evento_proposta_documentos_proposta FOREIGN KEY (proposta_id) REFERENCES dbo.evento_propostas_fornecedor(id) ON DELETE CASCADE
          );
        END;
        IF OBJECT_ID(N'dbo.evento_chat_leituras', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.evento_chat_leituras (
            usuario_id int NOT NULL,
            demanda_id int NOT NULL,
            ultima_mensagem_id int NOT NULL CONSTRAINT df_evento_chat_leituras_mensagem DEFAULT 0,
            lida_em datetime2(0) NOT NULL CONSTRAINT df_evento_chat_leituras_lida DEFAULT SYSUTCDATETIME(),
            CONSTRAINT pk_evento_chat_leituras PRIMARY KEY (usuario_id, demanda_id)
          );
        END;
        IF COL_LENGTH('dbo.evento_chat_leituras', 'ultima_mensagem_id') IS NULL
          ALTER TABLE dbo.evento_chat_leituras ADD ultima_mensagem_id int NOT NULL CONSTRAINT df_evento_chat_leituras_mensagem_mig DEFAULT 0;
        IF OBJECT_ID(N'dbo.trocaticket_chat_migrations', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.trocaticket_chat_migrations (
            chave varchar(120) NOT NULL CONSTRAINT pk_trocaticket_chat_migrations PRIMARY KEY,
            executada_em datetime2(0) NOT NULL CONSTRAINT df_trocaticket_chat_migrations_executada DEFAULT SYSUTCDATETIME()
          );
        END;
        IF NOT EXISTS (SELECT 1 FROM dbo.trocaticket_chat_migrations WHERE chave = 'mark-existing-chat-messages-read')
        BEGIN
          UPDATE dbo.evento_mensagens_chat SET lida_organizador = 1, lida_fornecedor = 1;
          INSERT INTO dbo.trocaticket_chat_migrations (chave) VALUES ('mark-existing-chat-messages-read');
        END;
        IF OBJECT_ID(N'dbo.fornecedor_documentos', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.fornecedor_documentos (
            id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_fornecedor_documentos PRIMARY KEY,
            fornecedor_usuario_id int NOT NULL,
            nome varchar(180) NOT NULL,
            nome_arquivo varchar(255) NOT NULL,
            caminho varchar(500) NOT NULL,
            status varchar(30) NOT NULL CONSTRAINT df_fornecedor_documentos_status DEFAULT 'pendente',
            criado_em datetime2(0) NOT NULL CONSTRAINT df_fornecedor_documentos_criado DEFAULT SYSUTCDATETIME(),
            atualizado_em datetime2(0) NOT NULL CONSTRAINT df_fornecedor_documentos_atualizado DEFAULT SYSUTCDATETIME(),
            CONSTRAINT uq_fornecedor_documentos_tipo UNIQUE (fornecedor_usuario_id, nome)
          );
        END;
        IF COL_LENGTH('dbo.fornecedor_documentos', 'motivo_recusa') IS NULL
          ALTER TABLE dbo.fornecedor_documentos ADD motivo_recusa varchar(1000) NULL;
        IF OBJECT_ID(N'dbo.fornecedor_colaboradores', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.fornecedor_colaboradores (
            id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_fornecedor_colaboradores PRIMARY KEY,
            empresa_id int NOT NULL,
            usuario_id int NOT NULL,
            papel varchar(30) NOT NULL CONSTRAINT df_fornecedor_colaboradores_papel DEFAULT 'colaborador',
            criado_em datetime2(0) NOT NULL CONSTRAINT df_fornecedor_colaboradores_criado DEFAULT SYSUTCDATETIME(),
            CONSTRAINT uq_fornecedor_colaboradores_usuario UNIQUE (empresa_id, usuario_id)
          );
        END;
        IF OBJECT_ID(N'dbo.evento_demanda_documentos', N'U') IS NULL
        BEGIN
          CREATE TABLE dbo.evento_demanda_documentos (
            id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_evento_demanda_documentos PRIMARY KEY,
            demanda_id int NOT NULL,
            nome varchar(180) NOT NULL,
            nome_arquivo varchar(255) NOT NULL,
            caminho varchar(500) NOT NULL,
            criado_em datetime2(0) NOT NULL CONSTRAINT df_evento_demanda_documentos_criado DEFAULT SYSUTCDATETIME(),
            CONSTRAINT fk_evento_demanda_documentos_demanda FOREIGN KEY (demanda_id) REFERENCES dbo.evento_demandas(id) ON DELETE CASCADE
          );
        END;
      `);
    })().catch(error => {
      supplierSchemaPromise = null;
      throw error;
    });
  }

  return supplierSchemaPromise;
}

async function saveChatAttachment(attachment) {
    if (!attachment || !attachment.data) return null;
    const dataUrl = String(attachment.data);
    const match = dataUrl.match(/^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,(.+)$/i);
    if (!match) throw new Error('Arquivo invÃ¡lido.');
    const mimeType = match[1].toLowerCase();
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv', 'application/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(mimeType)) throw new Error('Formato nÃ£o permitido. Use imagem, PDF ou TXT.');
    const fileData = Buffer.from(match[2], 'base64');
    if (fileData.length > 50 * 1024 * 1024) throw new Error('O arquivo deve ter atÃ© 50 MB.');
    const extension = mimeType.split('/')[1].replace('jpeg', 'jpg');
    const safeName = String(attachment.name || `anexo.${extension}`).replace(/[^a-z0-9._-]/gi, '_').slice(0, 120);
    const storedName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeName}`;
    const attachmentDir = path.join(root, 'public', 'uploads', 'chat-attachments');
    fs.mkdirSync(attachmentDir, { recursive: true });
    fs.writeFileSync(path.join(attachmentDir, storedName), fileData);
    return { url: `/uploads/chat-attachments/${storedName}`, name: safeName, type: mimeType };
}

async function getSupplierUser(request) {
  const session = readSessionToken(request);
  if (!session) return null;
  const [rows] = await db.query('SELECT id, nome, email, tipo, status, senha_hash FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
  return rows.find(user => ['fornecedor', 'admin', 'comum', 'comprador', 'cliente', ''].includes(String(user.tipo || '').trim().toLowerCase()) && !['bloqueado', 'suspensa', 'excluida'].includes(String(user.status || '').trim().toLowerCase())) || null;
}

async function getSupplierCompanyForUser(user) {
  const [[ownedCompany]] = await db.query(`
    SELECT TOP 1 id, usuario_id AS owner_id, razao_social, cnpj, categoria,
      contato, email_comercial, telefone, descricao, logo_url, status
    FROM dbo.fornecedor_empresas
    WHERE usuario_id = ?
  `, [user.id]);
  if (ownedCompany) return ownedCompany;
  const [[company]] = await db.query(`
    SELECT TOP 1 fe.id, fe.usuario_id AS owner_id, fe.razao_social, fe.cnpj, fe.categoria,
      fe.contato, fe.email_comercial, fe.telefone, fe.descricao, fe.logo_url, fe.status
    FROM dbo.fornecedor_empresas fe
    LEFT JOIN dbo.fornecedor_colaboradores fc ON fc.empresa_id = fe.id AND fc.usuario_id = ?
    WHERE fe.usuario_id = ? OR fc.usuario_id = ?
  `, [user.id, user.id, user.id]);
  return company || null;
}

async function getSupplierChatDemandIds(user, company) {
  const [rows] = await db.query(`
    SELECT DISTINCT p.demanda_id
    FROM dbo.evento_propostas_fornecedor p
    WHERE p.fornecedor_usuario_id IN (?, ?)
      OR LOWER(LTRIM(RTRIM(ISNULL(p.empresa, '')))) = LOWER(LTRIM(RTRIM(?)))
      OR EXISTS (
        SELECT 1
        FROM dbo.fornecedor_colaboradores fc
        WHERE fc.empresa_id = ? AND fc.usuario_id = p.fornecedor_usuario_id
      )
  `, [user.id, company?.owner_id || -1, company?.razao_social || '', company?.id || -1]);
  return rows.map(row => Number(row.demanda_id)).filter(Number.isInteger);
}

async function getSupplierHomologation(ownerId) {
  if (!ownerId) return false;
  const [[company]] = await db.query('SELECT status FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [ownerId]);
  return String(company?.status || '').trim().toLowerCase() === 'homologado';
}

async function getSupplierDocumentationStatus(ownerId) {
  if (!ownerId) return 'em anÃ¡lise';
  const [[company]] = await db.query(
    'SELECT status FROM dbo.fornecedor_empresas WHERE usuario_id = ?',
    [ownerId]
  );
  const companyStatus = String(company?.status || '').toLowerCase();
  if (companyStatus === 'recusado') return 'recusado';
  if (companyStatus === 'homologado') return 'homologado';
  const [documents] = await db.query(
    'SELECT status FROM dbo.fornecedor_documentos WHERE fornecedor_usuario_id = ?',
    [ownerId]
  );
  if (!documents.length) return 'em anÃ¡lise';
  if (documents.some(document => String(document.status || '').toLowerCase() === 'recusado')) return 'recusado';
  return 'em anÃ¡lise';
}

function ensureTicketSecuritySchema() {
  if (!ticketSecuritySchemaPromise) {
    ticketSecuritySchemaPromise = (async () => {
      const [columns] = await db.query(`
        SELECT
          COL_LENGTH('dbo.ingressos_emitidos', 'secret_key') AS secret_key,
          COL_LENGTH('dbo.ingressos_emitidos', 'setor_nome') AS setor_nome,
          COL_LENGTH('dbo.ingressos_emitidos', 'bilheteria_origem') AS bilheteria_origem,
          COL_LENGTH('dbo.ingressos_emitidos', 'utilizado_em') AS utilizado_em,
          COL_LENGTH('dbo.ingressos_emitidos', 'motivo_checkin') AS motivo_checkin,
          COL_LENGTH('dbo.ingressos_emitidos', 'checkin_operador') AS checkin_operador,
          COL_LENGTH('dbo.ingressos_emitidos', 'lote_nome') AS lote_nome,
          COL_LENGTH('dbo.ingressos_emitidos', 'categoria_ingresso') AS categoria_ingresso
      `);
      const existing = columns[0] || {};
      if (existing.secret_key === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD secret_key varchar(64) NULL');
      if (existing.setor_nome === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD setor_nome varchar(120) NULL');
      if (existing.bilheteria_origem === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD bilheteria_origem varchar(40) NULL');
      if (existing.utilizado_em === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD utilizado_em datetime2(0) NULL');
      if (existing.motivo_checkin === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD motivo_checkin varchar(240) NULL');
      if (existing.checkin_operador === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD checkin_operador varchar(160) NULL');
      if (existing.lote_nome === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD lote_nome varchar(120) NULL');
      if (existing.categoria_ingresso === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD categoria_ingresso varchar(120) NULL');
      await db.query("UPDATE dbo.ingressos_emitidos SET bilheteria_origem = 'Troca Ticket' WHERE bilheteria_origem IS NULL AND bilheteria_id IS NULL");
      const [ticketsWithoutSecret] = await db.query("SELECT id FROM dbo.ingressos_emitidos WHERE secret_key IS NULL AND status IN ('ativo', 'valido')");
      for (const ticket of ticketsWithoutSecret) {
        await db.query('UPDATE dbo.ingressos_emitidos SET secret_key = ? WHERE id = ? AND secret_key IS NULL', [makeTicketSecret(), ticket.id]);
      }
    })().catch(error => {
      ticketSecuritySchemaPromise = null;
      throw error;
    });
  }
  return ticketSecuritySchemaPromise;
}

async function getTicketSecret(ticketId) {
  await ensureTicketSecuritySchema();
  const [rows] = await db.query('SELECT numero_ingresso, secret_key FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
  if (!rows.length) return null;
  if (!rows[0].secret_key) {
    const secret = makeTicketSecret();
    await db.query('UPDATE dbo.ingressos_emitidos SET secret_key = ? WHERE id = ? AND secret_key IS NULL', [secret, ticketId]);
    const [updated] = await db.query('SELECT numero_ingresso, secret_key FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
    return updated[0] || null;
  }
  return rows[0];
}

function createSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(JSON.stringify({ sub: Number(user.id), email: normalizeEmail(user.email), iat: now, exp: now + (12 * 60 * 60) })).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionTokenSecret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function readSessionToken(request) {
  const match = String(request.headers.authorization || '').match(/^Bearer\s+([\w.-]+)$/i);
  if (!match) return null;
  const [claims, receivedSignature] = match[1].split('.');
  if (!claims || !receivedSignature) return null;
  const expectedSignature = crypto.createHmac('sha256', sessionTokenSecret).update(claims).digest();
  const signature = Buffer.from(receivedSignature, 'base64url');
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(signature, expectedSignature)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8'));
    if (!Number.isInteger(parsed.sub) || !parsed.email || !Number.isFinite(parsed.exp) || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch { return null; }
}

async function getTicketOperator(request) {
  const session = readSessionToken(request);
  if (!session) return null;
  const [rows] = await db.query('SELECT id, nome, email, tipo, status FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
  return rows.find(user => ['admin', 'bilheteria', 'organizador'].includes(String(user.tipo).toLowerCase()) && !['bloqueado', 'suspensa', 'excluida'].includes(String(user.status || '').toLowerCase())) || null;
}

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
    console.error('[auditoria] NÃ£o foi possÃ­vel registrar aÃ§Ã£o:', error.message);
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
  let itemType = 'aÃ§Ã£o do sistema';
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
      itemType = 'usuÃ¡rio'; itemName = user?.nome || 'UsuÃ¡rio';
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

  await audit(`${request.method.toLowerCase()}_${route.replaceAll(' ', '_')}`, `AÃ§Ã£o ${request.method} realizada em ${itemName}.`, itemType, itemName, actor);
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
      if (body.length > 75 * 1024 * 1024) reject(new Error('Payload muito grande (mÃ¡ximo 75 MB)'));
    });
    request.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        request._auditBody = parsed;
        resolve(parsed);
      } catch {
        reject(new Error('JSON invÃ¡lido'));
      }
    });
  });
}

function parseMultipart(request) {
  return new Promise((resolve, reject) => {
    const contentType = request.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) return reject(new Error('Boundary nÃ£o encontrado'));
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

  // ===== AUTENTICAÃ‡ÃƒO =====
  if (request.method === 'POST' && (url.pathname === '/api/auth/login' || url.pathname === '/api/login')) {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
      
      if (!rows.length || !(await bcrypt.compare(String(body.senha || ''), rows[0].senha_hash))) {
        return send(response, 401, { ok: false, message: 'E-mail ou senha invÃ¡lidos.' });
      }
      if (rows[0].email_verificado === false || rows[0].email_verificado === 0 || rows[0].codigo_verificacao) {
        return send(response, 403, { ok: false, message: 'E-mail ainda nÃ£o verificado. Confira sua caixa de entrada.' });
      }
      if (['bloqueado', 'excluida'].includes(String(rows[0].status || '').toLowerCase())) {
        return send(response, 403, { ok: false, message: 'UsuÃ¡rio bloqueado pelo administrador.' });
      }

      return send(response, 200, { ok: true, user: formatUser(rows[0]), session_token: createSessionToken(rows[0]) });
    } catch (error) {
      console.error('[auth] Erro no login:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel realizar o login.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/register-pf') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const cpf = normalizeCpf(body.cpf);
      const telefone = normalizePhone(body.telefone);
      if (!body.nome || !/^\S+@\S+\.\S+$/.test(email) || cpf.length !== 11 || !hasValidPhoneLength(telefone) || !body.senha || body.senha.length < 6) {
        return send(response, 400, { ok: false, message: 'Informe nome, e-mail, CPF com 11 nÃºmeros, telefone com 10 a 15 nÃºmeros e senha com ao menos 6 caracteres.' });
      }
      const [excludedUsers] = await db.query(
        `SELECT id FROM dbo.usuarios
         WHERE status = 'excluida' AND (email = ? OR cpf = ?)`,
        [email, cpf]
      );
      for (const [index, excludedUser] of excludedUsers.entries()) {
        await db.query(
          `UPDATE dbo.usuarios
           SET email = ?, cpf = NULL, telefone = NULL
           WHERE id = ? AND status = 'excluida'`,
          [`excluida-${excludedUser.id}-${Date.now()}-${index}@invalid.trocaticket.local`, excludedUser.id]
        );
      }
      const [duplicate] = await db.query('SELECT id FROM usuarios WHERE email = ? OR cpf = ? LIMIT 1', [email, cpf]);
      if (duplicate.length) return send(response, 409, { ok: false, message: 'E-mail ou CPF jÃ¡ cadastrado.' });
      const codigo = String(crypto.randomInt(100000, 1000000));
      const senhaHash = await bcrypt.hash(body.senha, 10);
      await db.query(
        `INSERT INTO usuarios (nome, email, senha_hash, tipo, cpf, telefone, data_nascimento, genero, status, codigo_verificacao, email_verificado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente_verificacao', ?, FALSE)`,
        [body.nome.trim(), email, senhaHash, 'comprador', cpf, telefone, body.nascimento || null, body.sexo || null, codigo]
      );
      await sendVerificationEmail({ to: email, name: body.nome.trim(), code: codigo });
      return send(response, 201, { ok: true, message: 'Cadastro criado com sucesso! Enviamos um cÃ³digo de verificaÃ§Ã£o para o seu e-mail.' });
    } catch (error) {
      console.error('[auth] Erro no cadastro:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel concluir o cadastro.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/verificar-codigo') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const codigo = String(body.codigo || '').trim();

      if (!email || !/^\d{6}$/.test(codigo)) {
        return send(response, 400, { ok: false, message: 'Informe um e-mail vÃ¡lido e um cÃ³digo de 6 dÃ­gitos.' });
      }

      const [rows] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil, codigo_verificacao, email_verificado FROM usuarios WHERE email = ? LIMIT 1',
        [email]
      );

      if (!rows.length) {
        return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      }

      const user = rows[0];
      if (String(user.codigo_verificacao || '').trim() !== codigo) {
        return send(response, 400, { ok: false, message: 'CÃ³digo invÃ¡lido ou expirado.' });
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
      console.error('[auth] Erro ao verificar cÃ³digo:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel verificar o cÃ³digo.' });
    }
  }

  // ===== PERFIL DO USUÃRIO =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE email = ? LIMIT 1', [normalizeEmail(url.searchParams.get('email'))]);
      return rows.length ? send(response, 200, { ok: true, user: formatUser(rows[0]) }) : send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
    } catch (error) { return send(response, 500, { ok: false, message: 'Erro ao carregar perfil.' }); }
  }

  if (request.method === 'PUT' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const body = await parseBody(request);
      const emailAtual = normalizeEmail(body.emailAtual || body.currentEmail || body.email);
      const novoEmail = normalizeEmail(body.email || emailAtual);

      if (!emailAtual || !novoEmail) {
        return send(response, 400, { ok: false, message: 'E-mail Ã© obrigatÃ³rio.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
        return send(response, 400, { ok: false, message: 'E-mail invÃ¡lido.' });
      }

      const [[existingUser]] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, senha_hash FROM dbo.usuarios WHERE email = ?',
        [emailAtual]
      );
      if (!existingUser) {
        return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      }

      if (novoEmail !== emailAtual) {
        const [[emailOwner]] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ?', [novoEmail]);
        if (emailOwner && emailOwner.id !== existingUser.id) {
          return send(response, 409, { ok: false, message: 'Este e-mail jÃ¡ estÃ¡ em uso.' });
        }
      }

      const nomeInformado = body.nome !== undefined;
      const nome = nomeInformado ? String(body.nome || '').trim() : existingUser.nome;
      const sobrenome = body.sobrenome !== undefined ? String(body.sobrenome || '').trim() : '';
      const nomeCompleto = nomeInformado
        ? [nome, sobrenome].filter(Boolean).join(' ')
        : existingUser.nome;
      const cpf = body.cpf !== undefined ? normalizeCpf(body.cpf) : normalizeCpf(existingUser.cpf);
      const telefone = body.telefone !== undefined ? normalizePhone(body.telefone) : normalizePhone(existingUser.telefone);
      const genero = body.genero !== undefined ? String(body.genero || '').trim() : existingUser.genero;
      const dataNascimento = body.data_nascimento !== undefined ? body.data_nascimento || null : existingUser.data_nascimento;

      if (!nomeCompleto) {
        return send(response, 400, { ok: false, message: 'Nome Ã© obrigatÃ³rio.' });
      }
      if (cpf && cpf.length !== 11) {
        return send(response, 400, { ok: false, message: 'CPF invÃ¡lido.' });
      }
      if (body.telefone !== undefined && telefone && !hasValidPhoneLength(telefone)) {
        return send(response, 400, { ok: false, message: 'Telefone invÃ¡lido. Informe de 10 a 15 nÃºmeros.' });
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

      if (!result.length) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE id = ?', [result[0].id]);
      await audit('atualizacao_perfil', `Perfil de ${nomeCompleto} atualizado.`, 'usuario', result[0].id, rows[0]);
      return send(response, 200, { ok: true, user: formatUser(rows[0]), message: 'Dados atualizados com sucesso.' });
    } catch (error) {
      console.error('[usuario] Erro ao atualizar perfil:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel atualizar o perfil.' });
    }
  }

  // ===== MEUS INGRESSOS =====
  if (request.method === 'GET' && /^\/api\/usuario\/meus-ingressos(?:\/\d+)?$/.test(url.pathname)) {
    try {
      const session = readSessionToken(request);
      const requestedEmail = normalizeEmail(url.searchParams.get('email'));
      if (!session || session.email !== requestedEmail) return send(response, 403, { ok: false, message: 'SessÃ£o invÃ¡lida. Entre novamente para acessar seus ingressos.' });
      await ensureTicketSecuritySchema();
      const ticketId = url.pathname.match(/\/(\d+)$/)?.[1];
      const includeQr = url.searchParams.get('includeQr') === 'true';
      if (ticketId) {
        const [tickets] = await db.query(`
          SELECT TOP (1)
            i.id, i.numero_ingresso, i.qr_code_payload, i.setor_nome AS setor,
            i.bilheteria_origem, i.status, i.utilizado_em AS checkinAt,
            COALESCE(i.versao_titularidade, 1) AS versao_titularidade,
            p.codigo_pedido, e.nome AS evento, e.nome AS eventName, e.artista,
            e.[local] AS location, e.imagem, CONVERT(varchar(19), e.data_evento, 126) AS date,
            u.nome AS titular, u.cpf,
            tp.id AS transferencia_pendente_id,
            COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome
          FROM dbo.ingressos_emitidos i
          JOIN dbo.usuarios u ON u.id = i.comprador_id
          JOIN dbo.eventos e ON e.id = i.evento_id
          LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
          LEFT JOIN dbo.transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
          LEFT JOIN dbo.usuarios u2 ON u2.id = tp.destinatario_id
          WHERE i.id = ? AND u.email = ? AND i.status NOT IN ('cancelado', 'bloqueado')
        `, [Number(ticketId), requestedEmail]);
        if (!tickets.length) return send(response, 404, { ok: false, message: 'Ingresso nÃ£o encontrado.' });
        const ticket = tickets[0];
        if (includeQr && ['ativo', 'valido'].includes(String(ticket.status).toLowerCase())) {
          const ticketSecret = await getTicketSecret(ticket.id);
          const timeStep = Math.floor(Date.now() / 1000 / 60);
          const payload = makeActiveTicketPayload(ticket.numero_ingresso, ticketSecret.secret_key, timeStep);
          ticket.qr_code_payload = payload;
          ticket.qr_code_image = await QRCode.toDataURL(payload, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
          ticket.qr_time_step = timeStep;
        } else {
          ticket.qr_code_payload = null;
          ticket.qr_code_image = null;
          ticket.qr_time_step = null;
        }
        return send(response, 200, { ok: true, ticket });
      }

      const requestedLimit = Number(url.searchParams.get('limit') || 20);
      const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
      let cursor = null;
      const cursorValue = url.searchParams.get('cursor');
      if (cursorValue) {
        try {
          const parsed = JSON.parse(Buffer.from(cursorValue, 'base64url').toString('utf8'));
          if (parsed && parsed.emittedAt && Number.isInteger(parsed.id)) cursor = parsed;
        } catch {
          return send(response, 400, { ok: false, message: 'Cursor de paginaÃ§Ã£o invÃ¡lido.' });
        }
      }
      const cursorClause = cursor ? 'AND (i.emitido_em < ? OR (i.emitido_em = ? AND i.id < ?))' : '';
      const queryParams = cursor
        ? [limit, requestedEmail, cursor.emittedAt, cursor.emittedAt, cursor.id]
        : [limit, requestedEmail];
      const [tickets] = await db.query(`
        SELECT 
          TOP (?)
          i.id, i.numero_ingresso, i.setor_nome AS setor, i.bilheteria_origem,
          i.status, i.utilizado_em AS checkinAt,
          COALESCE(i.versao_titularidade, 1) AS versao_titularidade,
          p.codigo_pedido, e.nome AS evento, e.nome AS eventName, e.artista,
          e.[local] AS location, e.imagem,
          CONVERT(varchar(19), e.data_evento, 126) AS date,
          CONVERT(varchar(19), i.emitido_em, 126) AS emittedAt,
          u.nome AS titular, u.cpf, tp.id AS transferencia_pendente_id,
          COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome
        FROM dbo.ingressos_emitidos i
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
        LEFT JOIN dbo.transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
        LEFT JOIN dbo.usuarios u2 ON u2.id = tp.destinatario_id
        WHERE u.email = ? AND i.status NOT IN ('cancelado', 'bloqueado') ${cursorClause}
        ORDER BY i.emitido_em DESC, i.id DESC
      `, queryParams);
      const last = tickets[tickets.length - 1];
      const nextCursor = tickets.length === limit && last && last.emittedAt
        ? Buffer.from(JSON.stringify({ emittedAt: last.emittedAt, id: Number(last.id) })).toString('base64url')
        : null;
      return send(response, 200, { ok: true, tickets, nextCursor, hasMore: Boolean(nextCursor) });
    } catch (error) { 
      console.error('[usuario] Erro nos ingressos:', error.message); 
      return send(response, 500, { ok: false, message: 'Erro ao carregar ingressos.' }); 
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingresso/download-offline') {
    try {
      const body = await parseBody(request);
      const ticketId = Number(body.ingresso_id);
      if (!Number.isInteger(ticketId) || ticketId <= 0) {
        return send(response, 400, { ok: false, message: 'ID de ingresso invÃ¡lido.' });
      }
      const result = await getTicketForSession(request, ticketId);
      if (result.error) return send(response, result.error.status, { ok: false, message: result.error.message });

      const { ticket } = result;
      const eventDate = new Date(ticket.eventDate);
      if (Number.isNaN(eventDate.getTime())) return send(response, 400, { ok: false, message: 'A data do evento nÃ£o estÃ¡ configurada.' });
      const expiresAt = new Date(ticket.eventEndDate);
      if (!ticket.eventEndDate || Number.isNaN(expiresAt.getTime())) {
        return send(response, 409, { ok: false, message: 'O horÃ¡rio oficial de encerramento do evento ainda nÃ£o foi configurado.' });
      }
      if (Date.now() >= expiresAt.getTime()) return send(response, 409, { ok: false, message: 'Ingresso expirado: evento encerrado.' });

      const filename = `ingresso-${slugifyEventName(ticket.eventName)}-offline-trocaticket.html`;
      const offlineHtml = createOfflineTicketHtml(ticket, getQrBrowserBundle());
      let walletUrl = null;
      try {
        walletUrl = gerarLinkGoogleWallet({
          codigo_bilhete: ticket.numero_ingresso,
          qr_code_interno: makeActiveTicketPayload(ticket.numero_ingresso, ticket.secret_key),
          titular_nome: ticket.holder,
          setor: ticket.sector
        });
      } catch (error) {
        console.error('[google wallet] NÃ£o foi possÃ­vel gerar o link para o e-mail:', error.message);
      }
      const transporter = getVerificationTransporter();
      const banner = fs.readFileSync(path.join(root, 'imagens', 'banner troca ticket.jpg'));
      const bannerSrc = transporter ? 'cid:trocaticket-banner' : `data:image/jpeg;base64,${banner.toString('base64')}`;
      const emailHtml = createOfflineTicketEmailHtml(ticket, filename, expiresAt, walletUrl, bannerSrc);
      if (transporter) {
        await transporter.sendMail({
          from: smtpFrom,
          to: ticket.email,
          subject: `TrocaTicket - ingresso offline para ${ticket.eventName}`,
          text: `OlÃ¡ ${ticket.holder || 'titular'},\n\nSeu ingresso para ${ticket.eventName} estÃ¡ pronto. Baixe o anexo antes do evento e abra-o no navegador do celular; o QR continuarÃ¡ atualizando a cada 60 segundos mesmo sem internet.\n\nValidade do CÃ³digo QR Offline: ativo atÃ© ao tÃ©rmino oficial do evento em ${formatEmailDateTime(expiresAt)}.${walletUrl ? `\n\nAdicionar Ã  Carteira do Google: ${walletUrl}` : ''}\n\nDÃºvidas ou suporte: ${process.env.TROCATICKET_SUPPORT_URL || 'https://trocaticket.com/suporte'}\n\nNÃ£o responda a este e-mail. Este Ã© um e-mail automÃ¡tico enviado pela plataforma Troca Ticket.`,
          html: emailHtml,
          attachments: [
            { filename, content: offlineHtml, contentType: 'text/html; charset=utf-8' },
            { filename: 'banner-trocaticket.jpg', content: banner, contentType: 'image/jpeg', cid: 'trocaticket-banner' }
          ]
        });
      } else {
        console.info(`[ingresso offline mock] Pacote preparado para ${ticket.email}: ${filename}`);
      }
      return send(response, 200, {
        ok: true,
        mock: !transporter,
        email: ticket.email,
        filename,
        offlineHtml,
        emailPreviewHtml: transporter ? undefined : emailHtml,
        message: transporter ? 'Pacote offline enviado por e-mail.' : 'Pacote offline preparado em modo de demonstraÃ§Ã£o; SMTP nÃ£o configurado.'
      });
    } catch (error) {
      console.error('[ingresso offline] Falha ao preparar pacote:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel preparar o pacote offline.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingresso/google-wallet-jwt') {
    try {
      const body = await parseBody(request);
      const ticketId = Number(body.ingresso_id);
      if (!Number.isInteger(ticketId) || ticketId <= 0) {
        return send(response, 400, { ok: false, message: 'ID de ingresso invÃ¡lido.' });
      }
      const result = await getTicketForSession(request, ticketId);
      if (result.error) return send(response, result.error.status, { ok: false, message: result.error.message });
      const { ticket } = result;
      if (Number.isNaN(new Date(ticket.eventDate).getTime())) {
        return send(response, 400, { ok: false, message: 'A data do evento nÃ£o estÃ¡ configurada.' });
      }

      const walletUrl = gerarLinkGoogleWallet({
        codigo_bilhete: ticket.numero_ingresso,
        qr_code_interno: makeActiveTicketPayload(ticket.numero_ingresso, ticket.secret_key),
        titular_nome: ticket.holder,
        setor: ticket.sector
      });
      const mock = !walletUrl;
      const mockJwt = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify({ mock: true, ingresso: ticket.numero_ingresso }))}.mock-signature`;
      return send(response, 200, {
        ok: true,
        mock,
        walletUrl: walletUrl || `https://pay.google.com/gp/v/save/${mockJwt}`,
        mockUrl: mock ? createWalletMockUrl(ticket) : null,
        message: mock ? 'Passe demonstrativo pronto.' : 'Passe Google Wallet assinado.',
        rotatingBarcode: { type: 'TOTP_SHA1', periodMillis: 60000 }
      });
    } catch (error) {
      console.error('[google wallet] Falha ao preparar passe:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel preparar o passe Google Wallet.' });
    }
  }

  // ===== COMPRA DE INGRESSO =====
  if (request.method === 'POST' && url.pathname === '/api/ingressos/comprar') {
    await ensureTicketSecuritySchema();
    const connection = await db.getConnection();
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const eventoId = Number(body.evento_id);
      const quantidade = Math.max(1, Math.min(10, Number(body.quantidade) || 1));

      if (!email || !eventoId) {
        return send(response, 400, { ok: false, message: 'UsuÃ¡rio e evento sÃ£o obrigatÃ³rios.' });
      }

      await connection.beginTransaction();
      const [[user]] = await connection.query('SELECT id FROM dbo.usuarios WHERE email = ?', [email]);
      const [[event]] = await connection.query('SELECT id, nome, ticket_calculado FROM dbo.eventos WHERE id = ?', [eventoId]);

      if (!user) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      }
      if (!event) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Evento nÃ£o encontrado.' });
      }

      const purchaseItems = Array.isArray(body.items) && body.items.length
        ? body.items.map(item => ({
          quantity: Math.max(0, Math.min(10, Number(item.quantity) || 0)),
          price: Number(item.price ?? body.preco ?? event.ticket_calculado ?? 0),
          sector: item.sector || body.setor_nome || null,
          lotName: item.lotName || item.lote_nome || null,
          category: item.category || item.categoria_ingresso || null
        })).filter(item => item.quantity > 0)
        : [{ quantity, price: Number(body.preco ?? event.ticket_calculado ?? 0), sector: body.setor_nome || null, lotName: body.lote_nome || null, category: body.categoria_ingresso || null }];
      const totalQuantity = purchaseItems.reduce((sum, item) => sum + item.quantity, 0);
      if (!totalQuantity || totalQuantity > 10) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'A quantidade de ingressos deve estar entre 1 e 10.' });
      }
      const unitPrice = Number(body.preco ?? event.ticket_calculado ?? 0);
      const requestedTotal = Number(body.valor_total);
      const calculatedTotal = purchaseItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = Number.isFinite(requestedTotal) && requestedTotal >= 0 ? requestedTotal : calculatedTotal || unitPrice * totalQuantity;
      const codigoPedido = makeCode('PED');
      const [orderRows] = await connection.query(
        `INSERT INTO dbo.pedidos (codigo_pedido, comprador_id, valor_total, status)
         OUTPUT INSERTED.id
         VALUES (?, ?, ?, 'aprovado')`,
        [codigoPedido, user.id, total]
      );
      const pedidoId = orderRows[0].id;

      const tickets = [];
      for (const item of purchaseItems) for (let index = 0; index < item.quantity; index += 1) {
          const numero = makeCode('TKT');
          const secretKey = makeTicketSecret();
          const qrPayload = makeActiveTicketPayload(numero, secretKey);
          const [ticketRows] = await connection.query(
            `INSERT INTO dbo.ingressos_emitidos
             (pedido_id, comprador_id, evento_id, numero_ingresso, codigo_original_bilheteria, qr_code_payload, secret_key, setor_nome, lote_nome, categoria_ingresso, bilheteria_origem, versao_titularidade, status)
             OUTPUT INSERTED.id
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Troca Ticket', 1, 'ativo')`,
            [pedidoId, user.id, eventoId, numero, numero, qrPayload, secretKey, item.sector, item.lotName, item.category]
          );
          tickets.push({ id: ticketRows[0].id, numero_ingresso: numero });
        }

      await connection.commit();
      return send(response, 201, { ok: true, pedido_id: pedidoId, codigo_pedido: codigoPedido, tickets });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[ingressos] Erro na compra:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel concluir a compra.' });
    } finally {
      connection.release();
    }
  }

  // ===== TRANSFERÃŠNCIA NOMINAL =====
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
        return send(response, 400, { ok: false, message: 'Ingresso indisponÃ­vel para transferÃªncia.' });
      }

      if (Number(ticket.versao_titularidade || 1) > 1) {
        await connection.rollback();
        return send(response, 403, { ok: false, message: 'Este ingresso jÃ¡ foi transferido uma vez.' });
      }

      const [[hasPending]] = await connection.query(
        'SELECT id FROM transferencias_pendentes WHERE ingresso_id = ? AND status = "pendente" LIMIT 1',
        [ticket.id]
      );
      if (hasPending) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'JÃ¡ existe uma solicitaÃ§Ã£o pendente.' });
      }

      const [[destUser]] = await connection.query('SELECT id, nome, email FROM usuarios WHERE email = ? LIMIT 1', [targetEmail]);
      if (!destUser) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'DestinatÃ¡rio nÃ£o encontrado no TrocaTicket.' });
      }

      if (destUser.id === ticket.comprador_id) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'VocÃª nÃ£o pode transferir para si mesmo.' });
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
        message: `SolicitaÃ§Ã£o enviada para ${nomeDestinatarioFinal}!`
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
      return send(response, 200, { ok: true, message: 'TransferÃªncia cancelada.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao cancelar.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/ingressos/confirmar-transferencia') {
    await ensureTicketSecuritySchema();
    const token = url.searchParams.get('token');
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [[solicitacao]] = await connection.query(
        'SELECT tp.*, i.evento_id, i.bilheteria_id, i.bilheteria_origem, i.setor_nome, i.codigo_original_bilheteria, i.versao_titularidade, i.qr_code_payload, i.pedido_id FROM transferencias_pendentes tp JOIN ingressos_emitidos i ON i.id = tp.ingresso_id WHERE tp.token = ? FOR UPDATE',
        [token]
      );

      if (!solicitacao || solicitacao.status !== 'pendente') {
        await connection.rollback();
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        return response.end('<h1>Link expirado ou cancelado!</h1>');
      }

      const revokedQr = `${solicitacao.qr_code_payload}_REVOGADO_${Date.now()}`;
      await connection.query("UPDATE ingressos_emitidos SET status = 'invalidado_por_revenda', qr_code_payload = ?, secret_key = NULL WHERE id = ?", [revokedQr, solicitacao.ingresso_id]);

      const novoNumero = makeCode('TKT');
      const novaSecretKey = makeTicketSecret();
      const novoQr = makeActiveTicketPayload(novoNumero, novaSecretKey);

      await connection.query(
        `INSERT INTO ingressos_emitidos (pedido_id, comprador_id, evento_id, bilheteria_id, bilheteria_origem, setor_nome, numero_ingresso, codigo_original_bilheteria, qr_code_payload, secret_key, versao_titularidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
        [solicitacao.pedido_id, solicitacao.destinatario_id, solicitacao.evento_id, solicitacao.bilheteria_id || null, solicitacao.bilheteria_origem || 'Troca Ticket', solicitacao.setor_nome || null, novoNumero, solicitacao.codigo_original_bilheteria || novoNumero, novoQr, novaSecretKey, Number(solicitacao.versao_titularidade || 1) + 1]
      );

      await connection.query("UPDATE transferencias_pendentes SET status = 'aceita' WHERE id = ?", [solicitacao.id]);
      await connection.commit();

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end('<h1>Ingresso Aceito com Sucesso!</h1><a href="/meus-ingressos.html">Ver Meus Ingressos</a>');
    } catch (error) {
      await connection.rollback();
      response.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end('<h1>Erro ao confirmar transferÃªncia.</h1>');
    } finally {
      connection.release();
    }
  }

  // ===== EVENTOS (ADMIN) =====
  if (request.method === 'GET' && url.pathname === '/api/events') {
    try {
      const [rows] = await db.query('SELECT * FROM eventos ORDER BY id DESC');
      const [sectorRows] = await db.query('SELECT id, evento_id, nome, capacidade FROM dbo.evento_setores ORDER BY id');
      const [lotRows] = await db.query('SELECT * FROM dbo.evento_lotes ORDER BY id');
      const events = rows.map(r => ({
        id: r.id,
        name: String(r.nome || '').replace(/edi\?\?o/gi, 'ediÃ§Ã£o'),
        artista: r.artista || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        endDate: r.data_fim ? new Date(r.data_fim).toISOString() : null,
        classification: r.classificacao_etaria || 'Livre',
        price: Number(r.ticket_calculado || 0),
        capacity: Number(r.publico_maximo || 0),
        imagem: r.imagem || null,
        lots: lotRows.filter(lot => Number(lot.evento_id) === Number(r.id)).map(lot => ({
          id: lot.id,
          sector: lot.setor_nome || 'Setor geral',
          name: lot.nome || 'Lote atual',
          ticketType: lot.tipo_ingresso || 'Inteira',
          price: Number(lot.preco_inteira ?? lot.preco ?? r.ticket_calculado ?? 0),
          halfPrice: Number(lot.preco_meia || 0),
          fullAvailable: Number(lot.quantidade_inteira ?? lot.quantidade ?? 0),
          available: Number(lot.quantidade_total ?? lot.quantidade ?? 0),
          halfAvailable: Number(lot.quantidade_meia || 0),
          startDate: lot.data_inicio ? new Date(lot.data_inicio).toISOString() : null,
          endDate: lot.data_fim ? new Date(lot.data_fim).toISOString() : null,
          switchDate: lot.data_virada ? new Date(lot.data_virada).toISOString() : null,
          modalities: (() => { try { return lot.modalidades_json ? JSON.parse(lot.modalidades_json) : []; } catch { return []; } })(),
          rule: lot.regra || 'Esgotamento'
        })),
        destaque: Boolean(r.destaque),
        status: r.status || 'publicado',
        sectors: [...new Map([
          ...sectorRows.filter(sector => Number(sector.evento_id) === Number(r.id)).map(sector => [sector.nome, { id: sector.id, name: sector.nome, capacity: Number(sector.capacidade || 0) }]),
          ...lotRows.filter(lot => Number(lot.evento_id) === Number(r.id)).map(lot => [lot.setor_nome, { id: null, name: lot.setor_nome, capacity: 0 }])
        ]).values()]
      }));
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && url.pathname === '/api/organizador/dashboard') {
    try {
      await ensureSupplierSchema();
      const eventoId = Number(url.searchParams.get('evento_id') || 1);
      const [eventRows] = await db.query('SELECT * FROM dbo.eventos WHERE id = ? LIMIT 1', [eventoId]);
      if (!eventRows.length) return send(response, 404, { ok: false, message: 'Evento nÃ£o encontrado.' });

      const event = eventRows[0];
      const [lots] = await db.query('SELECT * FROM dbo.evento_lotes WHERE evento_id = ? ORDER BY id', [event.id]);
      const [sectorRows] = await db.query('SELECT * FROM dbo.evento_setores WHERE evento_id = ? ORDER BY id', [event.id]);
      const [costItems] = await db.query('SELECT * FROM dbo.evento_itens_custo WHERE evento_id = ? ORDER BY id', [event.id]);
      const [documents] = await db.query('SELECT * FROM dbo.evento_documentos WHERE evento_id = ? ORDER BY prazo', [event.id]);
      const [tasks] = await db.query('SELECT * FROM dbo.evento_tarefas WHERE evento_id = ? ORDER BY horario', [event.id]);
      const [demandsRows] = await db.query('SELECT * FROM dbo.evento_demandas WHERE evento_id = ? ORDER BY id DESC', [event.id]);

      const demands = await Promise.all(demandsRows.map(async demand => {
        const [proposalRows] = await db.query('SELECT * FROM dbo.evento_propostas_fornecedor WHERE demanda_id = ? ORDER BY id', [demand.id]);
        const proposals = await Promise.all(proposalRows.map(async proposal => {
          const [documents] = await db.query('SELECT id, nome_arquivo, caminho AS url, criado_em FROM dbo.evento_proposta_documentos WHERE proposta_id = ? ORDER BY criado_em DESC', [proposal.id]);
          return { ...proposal, documentos: documents };
        }));
        const [messageRows] = await db.query('SELECT * FROM dbo.evento_mensagens_chat WHERE demanda_id = ? ORDER BY enviado_em', [demand.id]);
        return {
          ...demand,
          prazo: demand.prazo ? new Date(demand.prazo).toISOString().slice(0, 10) : null,
          proposals,
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

  if (request.method === 'GET' && url.pathname === '/api/organizador/chat') {
    try {
      await ensureSupplierSchema();
      const [rows] = await db.query(`
        SELECT
          d.id AS demanda_id,
          d.titulo,
          d.evento_id,
          e.nome AS evento_nome,
          p.id AS proposta_id,
          p.empresa,
          p.status AS proposta_status,
          COALESCE(fe.logo_url, '') AS logo_url,
          last_message.ultima_mensagem_em,
          last_message.ultima_mensagem_texto
        FROM dbo.evento_demandas d
        JOIN dbo.evento_propostas_fornecedor p ON p.demanda_id = d.id
        JOIN dbo.eventos e ON e.id = d.evento_id
        LEFT JOIN dbo.fornecedor_empresas fe
          ON fe.usuario_id = p.fornecedor_usuario_id
          OR LOWER(LTRIM(RTRIM(fe.razao_social))) = LOWER(LTRIM(RTRIM(p.empresa)))
        OUTER APPLY (
          SELECT TOP 1 m.enviado_em AS ultima_mensagem_em, m.texto AS ultima_mensagem_texto
          FROM dbo.evento_mensagens_chat m
          WHERE m.demanda_id = d.id
          ORDER BY m.enviado_em DESC, m.id DESC
        ) last_message
        ORDER BY COALESCE(last_message.ultima_mensagem_em, p.criado_em) DESC, p.id DESC
      `);
      return send(response, 200, { ok: true, conversations: rows });
    } catch (error) {
      console.error('[organizador] carregar conversas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar as conversas.' });
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
        return send(response, 400, { ok: false, message: 'Nome, local, lotaÃ§Ã£o e data do evento sÃ£o obrigatÃ³rios.' });
      }
      if (!dataFim || dataFim <= dataEvento) {
        return send(response, 400, { ok: false, message: 'Informe um horÃ¡rio de encerramento posterior ao inÃ­cio do evento.' });
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
        return send(response, 400, { ok: false, message: 'Evento, nome, local, lotaÃ§Ã£o e data sÃ£o obrigatÃ³rios.' });
      }
      if (!dataFim || dataFim <= dataEvento) {
        return send(response, 400, { ok: false, message: 'Informe um horÃ¡rio de encerramento posterior ao inÃ­cio do evento.' });
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
        return send(response, 400, { ok: false, message: 'Dados da cotaÃ§Ã£o incompletos.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.evento_demandas (evento_id, titulo, servico, escopo, prazo, valor_estimado, status)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, 'em cotacao')`,
        [eventoId, titulo, servico || 'SolicitaÃ§Ã£o', escopo, prazo, valorEstimado]
      );

      const demandaId = result[0]?.id || result.insertId;
      if (itemId) {
        await db.query(
          'UPDATE dbo.evento_itens_custo SET status = ?, demanda_id = ? WHERE id = ?',
          ['em cotacao', demandaId, itemId]
        );
      }

      return send(response, 201, { ok: true, demanda_id: demandaId, message: 'CotaÃ§Ã£o registrada com sucesso.' });
    } catch (error) {
      console.error('[organizador] criar cotaÃ§Ã£o:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/fornecedor/perfil') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      return send(response, 200, { ok: true, company, user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo } });
    } catch (error) {
      console.error('[fornecedor] perfil:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar o cadastro da empresa.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/perfil') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const existingCompany = await getSupplierCompanyForUser(user);
      if (existingCompany && existingCompany.owner_id !== user.id) {
        return send(response, 403, { ok: false, message: 'Somente o proprietÃ¡rio pode editar os dados da empresa.' });
      }
      const body = await parseBody(request);
      const values = [String(body.razao_social || '').trim(), String(body.cnpj || '').trim(), String(body.categoria || '').trim(), String(body.contato || '').trim(), String(body.email_comercial || '').trim(), String(body.telefone || '').trim(), String(body.descricao || '').trim()];
      if (values.some(value => !value)) return send(response, 400, { ok: false, message: 'Preencha todos os dados obrigatÃ³rios da empresa.' });
      let logoUrl = existingCompany?.logo_url || null;
      if (body.logo) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(String(body.logo.type || '').toLowerCase())) {
          return send(response, 400, { ok: false, message: 'A logo deve ser uma imagem JPG, PNG ou WEBP.' });
        }
        const logo = await saveChatAttachment(body.logo);
        if (!logo) {
          return send(response, 400, { ok: false, message: 'A logo deve ser uma imagem JPG, PNG ou WEBP.' });
        }
        logoUrl = logo.url;
      }
      const [updatedRows, updateResult] = await db.query(`
        UPDATE dbo.fornecedor_empresas
        SET razao_social = ?, cnpj = ?, categoria = ?, contato = ?, email_comercial = ?, telefone = ?, descricao = ?, logo_url = ?, atualizado_em = SYSUTCDATETIME()
        WHERE usuario_id = ?
      `, [...values, logoUrl, user.id]);
      if (!updateResult.affectedRows) {
        await db.query(`
          INSERT INTO dbo.fornecedor_empresas
            (usuario_id, razao_social, cnpj, categoria, contato, email_comercial, telefone, descricao, logo_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user.id, ...values, logoUrl]);
      }
      if (String(user.tipo || '').toLowerCase() !== 'admin') {
        await db.query('UPDATE dbo.usuarios SET tipo = ? WHERE id = ?', ['fornecedor', user.id]);
      }
      const [rows] = await db.query('SELECT * FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [user.id]);
      return send(response, 200, { ok: true, company: rows[0] });
    } catch (error) {
      console.error('[fornecedor] salvar perfil:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel salvar o cadastro da empresa.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/fornecedor/colaboradores') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      if (!company) return send(response, 200, { ok: true, company: null, collaborators: [] });
      const [rows] = await db.query(`
        SELECT u.id, u.nome, u.email, u.tipo, fc.papel, fc.criado_em
        FROM dbo.fornecedor_colaboradores fc
        JOIN dbo.usuarios u ON u.id = fc.usuario_id
        WHERE fc.empresa_id = ?
        ORDER BY u.nome
      `, [company.id]);
      return send(response, 200, {
        ok: true,
        company: { id: company.id, name: company.razao_social, owner_id: company.owner_id },
        collaborators: rows
      });
    } catch (error) {
      console.error('[fornecedor] colaboradores:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar os colaboradores.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/colaboradores') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const [[company]] = await db.query('SELECT id FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [user.id]);
      if (!company) return send(response, 409, { ok: false, message: 'Cadastre sua empresa antes de adicionar colaboradores.' });
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return send(response, 400, { ok: false, message: 'Informe um e-mail vÃ¡lido.' });
      const [[member]] = await db.query(
        `SELECT id, nome, email, tipo, status FROM dbo.usuarios
         WHERE email = ? AND LOWER(tipo) IN ('admin', 'fornecedor')`,
        [email]
      );
      if (!member) return send(response, 404, { ok: false, message: 'O e-mail precisa pertencer a um usuÃ¡rio admin ou fornecedor cadastrado.' });
      if (member.id === user.id) return send(response, 400, { ok: false, message: 'O proprietÃ¡rio jÃ¡ faz parte da empresa.' });
      if (['bloqueado', 'suspensa', 'excluida'].includes(String(member.status || '').toLowerCase())) {
        return send(response, 400, { ok: false, message: 'Este usuÃ¡rio estÃ¡ bloqueado ou inativo.' });
      }
      const [[existing]] = await db.query('SELECT id FROM dbo.fornecedor_colaboradores WHERE empresa_id = ? AND usuario_id = ?', [company.id, member.id]);
      if (existing) return send(response, 409, { ok: false, message: 'Este usuÃ¡rio jÃ¡ Ã© colaborador da empresa.' });
      await db.query('INSERT INTO dbo.fornecedor_colaboradores (empresa_id, usuario_id) VALUES (?, ?)', [company.id, member.id]);
      return send(response, 201, { ok: true, collaborator: member });
    } catch (error) {
      console.error('[fornecedor] adicionar colaborador:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel adicionar o colaborador.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/fornecedor\/colaboradores\/\d+$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const [[company]] = await db.query('SELECT id FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [user.id]);
      const collaboratorId = Number(url.pathname.split('/').pop());
      if (!company || !collaboratorId) return send(response, 404, { ok: false, message: 'Colaborador nÃ£o encontrado.' });
      await db.query('DELETE FROM dbo.fornecedor_colaboradores WHERE id = ? AND empresa_id = ?', [collaboratorId, company.id]);
      return send(response, 200, { ok: true });
    } catch (error) {
      console.error('[fornecedor] remover colaborador:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel remover o colaborador.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/fornecedor/oportunidades') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const homologated = await getSupplierHomologation(company?.owner_id || user.id);
      const [rows] = await db.query(`
        SELECT d.id, d.evento_id, d.titulo, d.servico, d.escopo, d.prazo, d.valor_estimado, d.status, e.nome AS evento_nome,
          (SELECT COUNT(*) FROM dbo.evento_propostas_fornecedor p WHERE p.demanda_id = d.id AND p.fornecedor_usuario_id = ?) AS minha_proposta
        FROM dbo.evento_demandas d JOIN dbo.eventos e ON e.id = d.evento_id
        WHERE d.status IN ('em cotacao', 'em anÃ¡lise', 'em analise')
        ORDER BY d.criado_em DESC
      `, [user.id]);
      return send(response, 200, {
        ok: true,
        opportunities: rows,
        homologated: Boolean(company && homologated),
        message: company && homologated ? null : 'As demandas ficam disponÃ­veis para consulta, mas o envio de propostas serÃ¡ liberado apÃ³s a homologaÃ§Ã£o.'
      });
    } catch (error) {
      console.error('[fornecedor] oportunidades:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar as oportunidades.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/fornecedor/propostas') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const [rows] = await db.query(`
        SELECT p.id, p.demanda_id, p.empresa, p.valor, p.escopo, p.prazo, p.status, p.anexos, p.criado_em, d.titulo, d.evento_id, e.nome AS evento_nome,
          (SELECT COUNT(*) FROM dbo.evento_proposta_documentos pd WHERE pd.proposta_id = p.id) AS documento_count,
          (SELECT MAX(m.enviado_em) FROM dbo.evento_mensagens_chat m WHERE m.demanda_id = p.demanda_id AND (m.fornecedor_usuario_id = p.fornecedor_usuario_id OR m.fornecedor_usuario_id = ?)) AS ultima_mensagem_em
        FROM dbo.evento_propostas_fornecedor p JOIN dbo.evento_demandas d ON d.id = p.demanda_id
        JOIN dbo.eventos e ON e.id = d.evento_id
        WHERE p.fornecedor_usuario_id = ?
          OR p.fornecedor_usuario_id = ?
          OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
          OR EXISTS (
            SELECT 1 FROM dbo.fornecedor_colaboradores fc
            WHERE fc.empresa_id = ? AND fc.usuario_id = p.fornecedor_usuario_id
          )
        ORDER BY ultima_mensagem_em DESC, p.criado_em DESC, p.id DESC
      `, [user.id, user.id, company?.owner_id || -1, company?.razao_social || '', company?.id || -1]);
      return send(response, 200, { ok: true, proposals: rows });
    } catch (error) {
      console.error('[fornecedor] propostas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar suas propostas.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/propostas') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const homologated = await getSupplierHomologation(company?.owner_id || user.id);
      if (!company || !homologated) return send(response, 403, { ok: false, message: 'Aguarde a aprovaÃ§Ã£o de todos os documentos para enviar propostas.' });
      const body = await parseBody(request);
      const demandaId = Number(body.demanda_id);
      const valor = Number(body.valor || 0);
      const escopo = String(body.escopo || '').trim();
      const prazo = String(body.prazo || '').trim();
      if (!demandaId || !valor || !escopo || !prazo) return send(response, 400, { ok: false, message: 'Informe valor, prazo e escopo da proposta.' });
      const [[demand]] = await db.query('SELECT id FROM dbo.evento_demandas WHERE id = ? AND status IN (?, ?, ?)', [demandaId, 'em cotacao', 'em anÃ¡lise', 'em analise']);
      if (!demand) return send(response, 404, { ok: false, message: 'Oportunidade indisponÃ­vel.' });
      const [[existing]] = await db.query('SELECT id FROM dbo.evento_propostas_fornecedor WHERE demanda_id = ? AND fornecedor_usuario_id = ?', [demandaId, user.id]);
      if (existing) return send(response, 409, { ok: false, message: 'VocÃª jÃ¡ enviou uma proposta para esta demanda.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_propostas_fornecedor (demanda_id, fornecedor_usuario_id, empresa, valor, escopo, prazo, status) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?)',
        [demandaId, user.id, company.razao_social, valor, escopo, prazo, 'em analise']
      );
      return send(response, 201, { ok: true, proposta_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[fornecedor] criar proposta:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel enviar a proposta.' });
    }
  }

  if (request.method === 'GET' && /^\/api\/fornecedor\/propostas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const proposalId = Number(url.pathname.match(/^\/api\/fornecedor\/propostas\/(\d+)\/documentos$/)?.[1]);
      const company = await getSupplierCompanyForUser(user);
      const [[proposal]] = await db.query(`
        SELECT TOP 1 p.id
        FROM dbo.evento_propostas_fornecedor p
        WHERE p.id = ? AND (
          p.fornecedor_usuario_id = ? OR p.fornecedor_usuario_id = ?
          OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
        )
      `, [proposalId, user.id, company?.owner_id || -1, company?.razao_social || '']);
      if (!proposal) return send(response, 404, { ok: false, message: 'Proposta nÃ£o encontrada.' });
      const [documents] = await db.query('SELECT id, nome_arquivo, caminho AS url, criado_em FROM dbo.evento_proposta_documentos WHERE proposta_id = ? ORDER BY criado_em DESC', [proposalId]);
      return send(response, 200, { ok: true, documents });
    } catch (error) {
      console.error('[fornecedor] documentos da proposta:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar os anexos da proposta.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/fornecedor\/propostas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const proposalId = Number(url.pathname.match(/^\/api\/fornecedor\/propostas\/(\d+)\/documentos$/)?.[1]);
      const body = await parseBody(request);
      const company = await getSupplierCompanyForUser(user);
      const [[proposal]] = await db.query(`
        SELECT TOP 1 p.id
        FROM dbo.evento_propostas_fornecedor p
        WHERE p.id = ? AND (
          p.fornecedor_usuario_id = ? OR p.fornecedor_usuario_id = ?
          OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
        )
      `, [proposalId, user.id, company?.owner_id || -1, company?.razao_social || '']);
      const attachment = await saveChatAttachment(body.arquivo);
      if (!proposal || !attachment) return send(response, 400, { ok: false, message: 'Selecione um arquivo vÃ¡lido para anexar.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_proposta_documentos (proposta_id, nome_arquivo, caminho) OUTPUT INSERTED.id VALUES (?, ?, ?)',
        [proposalId, attachment.name, attachment.url]
      );
      return send(response, 201, { ok: true, documento_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[fornecedor] anexar documento Ã  proposta:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel anexar o documento Ã  proposta.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/fornecedor/documentos') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const ownerId = company?.owner_id || user.id;
      const [rows] = await db.query('SELECT id, nome, nome_arquivo, status, motivo_recusa, criado_em, atualizado_em FROM dbo.fornecedor_documentos WHERE fornecedor_usuario_id = ? ORDER BY nome', [ownerId]);
      return send(response, 200, { ok: true, status: await getSupplierDocumentationStatus(ownerId), documents: rows });
    } catch (error) {
      console.error('[fornecedor] documentos:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar os documentos.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/documentos') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const ownerId = company?.owner_id || user.id;
      if (company && company.owner_id !== user.id) return send(response, 403, { ok: false, message: 'Somente o proprietÃ¡rio pode atualizar documentos.' });
      const body = await parseBody(request);
      const nome = String(body.nome || '').trim();
      const nomeArquivo = String(body.nome_arquivo || '').trim();
      const encodedFile = String(body.conteudo_base64 || '');
      const match = encodedFile.match(/^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,(.+)$/i);
      if (!nome || !nomeArquivo || !match) return send(response, 400, { ok: false, message: 'Arquivo de documento invÃ¡lido.' });
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(match[1].toLowerCase())) return send(response, 400, { ok: false, message: 'Envie um PDF, PNG ou JPG.' });
      const fileData = Buffer.from(match[2], 'base64');
      if (!fileData.length || fileData.length > 10 * 1024 * 1024) return send(response, 400, { ok: false, message: 'O documento deve ter atÃ© 10 MB.' });
      const safeName = nomeArquivo.replace(/[^a-z0-9._-]/gi, '_');
      const documentDir = path.join(root, 'public', 'uploads', 'supplier-documents');
      if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir, { recursive: true });
      const storedName = `${ownerId}-${crypto.randomUUID()}-${safeName}`;
      fs.writeFileSync(path.join(documentDir, storedName), fileData);
      await db.query(`
        MERGE dbo.fornecedor_documentos AS target
        USING (SELECT ? AS fornecedor_usuario_id, ? AS nome) AS source
        ON target.fornecedor_usuario_id = source.fornecedor_usuario_id AND target.nome = source.nome
        WHEN MATCHED THEN UPDATE SET nome_arquivo = ?, caminho = ?, status = 'em analise', motivo_recusa = NULL, atualizado_em = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN INSERT (fornecedor_usuario_id, nome, nome_arquivo, caminho, status) VALUES (?, ?, ?, ?, 'em analise');
      `, [ownerId, nome, safeName, `/uploads/supplier-documents/${storedName}`, ownerId, nome, safeName, `/uploads/supplier-documents/${storedName}`]);
      return send(response, 201, { ok: true, message: 'Documento enviado para validaÃ§Ã£o.' });
    } catch (error) {
      console.error('[fornecedor] upload documento:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel salvar o documento.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/organizador/fornecedor-documentos') {
    try {
      await ensureSupplierSchema();
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito a administradores e organizadores.' });
      const [rows] = await db.query(`
        SELECT fd.id, fd.fornecedor_usuario_id, fd.nome, fd.nome_arquivo, fd.caminho, fd.status, fd.motivo_recusa,
          fd.criado_em, fd.atualizado_em, fe.id AS empresa_id, fe.razao_social, fe.cnpj, fe.categoria,
          fe.email_comercial, fe.status AS empresa_status, u.nome AS fornecedor_nome, u.email
        FROM dbo.fornecedor_documentos fd
        LEFT JOIN dbo.fornecedor_empresas fe ON fe.usuario_id = fd.fornecedor_usuario_id
        LEFT JOIN dbo.usuarios u ON u.id = fd.fornecedor_usuario_id
        ORDER BY fd.atualizado_em DESC, fe.razao_social, fd.nome
      `);
      const documents = await Promise.all(rows.map(async row => ({
        ...row,
        file_url: row.caminho,
        documentacao_status: await getSupplierDocumentationStatus(row.fornecedor_usuario_id)
      })));
      return send(response, 200, { ok: true, documents });
    } catch (error) {
      console.error('[organizador] documentos de fornecedores:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar os documentos dos fornecedores.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/organizador/fornecedores') {
    try {
      await ensureSupplierSchema();
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito a administradores e organizadores.' });
      const [companies] = await db.query(`
        SELECT fe.id, fe.usuario_id, fe.razao_social, fe.cnpj, fe.categoria, fe.email_comercial, fe.logo_url,
          fe.status AS empresa_status, u.nome AS fornecedor_nome, u.email
        FROM dbo.fornecedor_empresas fe
        LEFT JOIN dbo.usuarios u ON u.id = fe.usuario_id
        ORDER BY fe.razao_social
      `);
      const suppliers = await Promise.all(companies.map(async company => {
        const [documents] = await db.query(
          'SELECT status FROM dbo.fornecedor_documentos WHERE fornecedor_usuario_id = ?',
          [company.usuario_id]
        );
        const [proposals] = await db.query(`
          SELECT p.escopo, p.prazo, p.status, p.criado_em
          FROM dbo.evento_propostas_fornecedor p
          WHERE p.fornecedor_usuario_id = ? OR LOWER(LTRIM(RTRIM(ISNULL(p.empresa, '')))) = LOWER(LTRIM(RTRIM(?)))
          ORDER BY p.criado_em DESC
        `, [company.usuario_id, company.razao_social || '']);
        const [messages] = await db.query(`
          SELECT remetente, enviado_em
          FROM dbo.evento_mensagens_chat
          WHERE fornecedor_usuario_id = ?
          ORDER BY enviado_em ASC
        `, [company.usuario_id]);
        const responseIntervals = [];
        for (let index = 1; index < messages.length; index += 1) {
          if (String(messages[index - 1].remetente).toLowerCase() === 'organizador' &&
              String(messages[index].remetente).toLowerCase() === 'fornecedor') {
            const start = new Date(messages[index - 1].enviado_em).getTime();
            const end = new Date(messages[index].enviado_em).getTime();
            if (Number.isFinite(start) && Number.isFinite(end) && end >= start) responseIntervals.push((end - start) / 3600000);
          }
        }
        const approvedDocuments = documents.filter(document => String(document.status || '').toLowerCase() === 'aprovado').length;
        const totalDocuments = documents.length;
        const complianceScore = totalDocuments ? Math.round((approvedDocuments / totalDocuments) * 100) : (String(company.empresa_status || '').toLowerCase() === 'homologado' ? 100 : 0);
        const deliveryDays = proposals
          .map(proposal => (new Date(proposal.prazo).getTime() - new Date(proposal.criado_em).getTime()) / 86400000)
          .filter(value => Number.isFinite(value) && value >= 0);
        return {
          company_id: company.id,
          company_name: company.razao_social || company.fornecedor_nome || 'Fornecedor não identificado',
          logo_url: company.logo_url || null,
          email: company.email_comercial || company.email || '',
          category: company.categoria || 'Categoria não informada',
          status: company.empresa_status || 'em análise',
          services: [...new Set(proposals.map(proposal => String(proposal.escopo || '').trim()).filter(Boolean))].slice(0, 5),
          metrics: {
            service_count: proposals.length,
            confirmed_count: proposals.filter(proposal => ['aprovado', 'aceito', 'contratado'].includes(String(proposal.status || '').toLowerCase())).length,
            average_delivery_days: deliveryDays.length ? Math.round((deliveryDays.reduce((sum, value) => sum + value, 0) / deliveryDays.length) * 10) / 10 : null,
            response_hours: responseIntervals.length ? Math.round((responseIntervals.reduce((sum, value) => sum + value, 0) / responseIntervals.length) * 10) / 10 : null
          },
          compliance: {
            status: String(company.empresa_status || 'em análise').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === 'homologado' ? 'homologado' : String(company.empresa_status || '').toLowerCase() === 'recusado' ? 'recusado' : 'em análise',
            score: complianceScore,
            approved_documents: approvedDocuments,
            total_documents: totalDocuments
          }
        };
      }));
      return send(response, 200, { ok: true, suppliers });
    } catch (error) {
      console.error('[organizador] histórico de fornecedores:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar o histórico operacional dos fornecedores.' });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/organizador\/fornecedor-documentos\/\d+$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito a administradores e organizadores.' });
      const documentId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const session = readSessionToken(request);
      const password = String(body.password || '');
      const [[approver]] = await db.query('SELECT id, senha_hash, tipo FROM dbo.usuarios WHERE id = ? AND email = ?', [session?.sub, session?.email]);
      if (!session || !approver || !['admin', 'organizador'].includes(String(approver.tipo).toLowerCase()) || !(await bcrypt.compare(password, approver.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Confirme sua senha de login para revisar o documento.' });
      }
      const status = String(body.status || '').trim().toLowerCase();
      const motivoRecusa = String(body.motivo_recusa || '').trim();
      if (!['aprovado', 'recusado'].includes(status)) return send(response, 400, { ok: false, message: 'Status invÃ¡lido. Use aprovado ou recusado.' });
      if (status === 'recusado' && !motivoRecusa) return send(response, 400, { ok: false, message: 'Informe o motivo da recusa.' });
      const [result] = await db.query(
        'UPDATE dbo.fornecedor_documentos SET status = ?, motivo_recusa = ?, atualizado_em = SYSUTCDATETIME() WHERE id = ?',
        [status, status === 'recusado' ? motivoRecusa : null, documentId]
      );
      if (!result.affectedRows) return send(response, 404, { ok: false, message: 'Documento nÃ£o encontrado.' });
      return send(response, 200, { ok: true, message: status === 'aprovado' ? 'Documento aprovado.' : 'Documento recusado.', status });
    } catch (error) {
      console.error('[organizador] revisar documento de fornecedor:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel atualizar o documento.' });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/organizador\/fornecedor-empresas\/\d+\/homologacao$/.test(url.pathname)) {
      try {
        await ensureSupplierSchema();
        const operator = await getTicketOperator(request);
        if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito a administradores e organizadores.' });
        const companyMatch = url.pathname.match(/^\/api\/organizador\/fornecedor-empresas\/(\d+)\/homologacao$/);
        const companyId = Number(companyMatch?.[1]);
        if (!companyId) return send(response, 400, { ok: false, message: 'Empresa invÃ¡lida.' });
        const body = await parseBody(request);
        const password = String(body.password || '');
        const [[approver]] = await db.query('SELECT senha_hash FROM dbo.usuarios WHERE id = ?', [operator.id]);
        if (!password || !approver || !(await bcrypt.compare(password, approver.senha_hash))) {
          return send(response, 403, { ok: false, message: 'Confirme sua senha de login para homologar a empresa.' });
        }
        const requestedStatus = String(body.status || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const status = requestedStatus === 'em analise' ? 'em análise' : requestedStatus;
        if (!['homologado', 'em análise', 'recusado'].includes(status)) return send(response, 400, { ok: false, message: 'Status de homologaÃ§Ã£o invÃ¡lido.' });
        const [[company]] = await db.query('SELECT id FROM dbo.fornecedor_empresas WHERE id = ?', [companyId]);
        if (!company) return send(response, 404, { ok: false, message: 'Empresa nÃ£o encontrada.' });
        await db.query('UPDATE dbo.fornecedor_empresas SET status = ?, atualizado_em = SYSUTCDATETIME() WHERE id = ?', [status, companyId]);
        return send(response, 200, { ok: true, status });
      } catch (error) {
        console.error('[organizador] homologaÃ§Ã£o de fornecedor:', error.message);
        return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel atualizar a homologaÃ§Ã£o.' });
    }
  }

  if (request.method === 'GET' && ['/api/chat/nao-lidas', '/api/organizador/chat/nao-lidas', '/api/fornecedor/chat/nao-lidas'].includes(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 403, { ok: false, message: 'SessÃ£o invÃ¡lida.' });
      const [[user]] = await db.query('SELECT id, tipo FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
      if (!user) return send(response, 403, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      let rows;
      const notificationPanel = url.pathname.startsWith('/api/fornecedor/') ? 'fornecedor' : url.pathname.startsWith('/api/organizador/') ? 'organizador' : null;
      if (notificationPanel === 'organizador' || (!notificationPanel && ['admin', 'organizador'].includes(String(user.tipo || '').trim().toLowerCase()))) {
        const [unreadRows] = await db.query(`
          SELECT demanda_id, COUNT(*) AS total
          FROM dbo.evento_mensagens_chat
          WHERE LOWER(LTRIM(RTRIM(remetente))) = 'fornecedor'
            AND ISNULL(lida_organizador, 0) = 0
          GROUP BY demanda_id
        `);
        const unreadByDemand = Object.fromEntries(unreadRows.map(row => [String(row.demanda_id), Number(row.total || 0)]));
        return send(response, 200, {
          ok: true,
          unread: Object.values(unreadByDemand).reduce((total, count) => total + count, 0),
          unreadByDemand
        });
      } else {
        const company = await getSupplierCompanyForUser(user);
        const [unreadRows] = await db.query(`
          SELECT m.demanda_id, COUNT(*) AS total
          FROM dbo.evento_mensagens_chat m
          LEFT JOIN dbo.evento_chat_leituras l
            ON l.usuario_id = ? AND l.demanda_id = m.demanda_id
          WHERE LOWER(LTRIM(RTRIM(m.remetente))) = 'organizador'
            AND ISNULL(m.lida_fornecedor, 0) = 0
            AND (
              m.fornecedor_usuario_id = ?
              OR EXISTS (
                SELECT 1
                FROM dbo.evento_propostas_fornecedor p
                WHERE p.demanda_id = m.demanda_id
                  AND (
                    p.fornecedor_usuario_id = ?
                    OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
                    OR EXISTS (
                      SELECT 1
                      FROM dbo.fornecedor_colaboradores fc
                      WHERE fc.empresa_id = ? AND fc.usuario_id = p.fornecedor_usuario_id
                    )
                  )
              )
            )
          GROUP BY m.demanda_id
        `, [user.id, user.id, user.id, company?.razao_social || '', company?.id || -1]);
        const unreadByDemand = Object.fromEntries(unreadRows.map(row => [String(row.demanda_id), Number(row.total || 0)]));
        return send(response, 200, {
          ok: true,
          unread: Object.values(unreadByDemand).reduce((total, count) => total + count, 0),
          unreadByDemand
        });
      }
      return send(response, 200, { ok: true, unread: Number(rows[0]?.total || 0) });
    } catch (error) {
      console.error('[chat] mensagens nÃ£o lidas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel consultar as mensagens pendentes.' });
    }
  }

  if (request.method === 'POST' && ['/api/chat/marcar-lidas', '/api/organizador/chat/marcar-lidas', '/api/fornecedor/chat/marcar-lidas'].includes(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 403, { ok: false, message: 'SessÃ£o invÃ¡lida.' });
      const [[user]] = await db.query('SELECT id, tipo FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
      if (!user) return send(response, 403, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      const notificationPanel = url.pathname.startsWith('/api/fornecedor/') ? 'fornecedor' : url.pathname.startsWith('/api/organizador/') ? 'organizador' : null;
      const body = await parseBody(request);
      const demandId = Number(body.demanda_id || 0);
      if (!demandId && url.pathname !== '/api/chat/marcar-lidas') {
        return send(response, 400, { ok: false, message: 'Informe a conversa que deve ser marcada como lida.' });
      }
      if (notificationPanel === 'organizador' || (!notificationPanel && ['admin', 'organizador'].includes(String(user.tipo || '').trim().toLowerCase()))) {
        await db.query(
          "UPDATE dbo.evento_mensagens_chat SET lida_organizador = 1 WHERE remetente = 'fornecedor' AND (? = 0 OR demanda_id = ?)",
          [demandId, demandId]
        );
      } else {
        const company = await getSupplierCompanyForUser(user);
        const [demands] = await db.query(`
          SELECT m.demanda_id, MAX(m.id) AS ultima_mensagem_id
          FROM dbo.evento_mensagens_chat m
          WHERE LOWER(LTRIM(RTRIM(m.remetente))) = 'organizador'
            AND m.demanda_id = CASE WHEN ? = 0 THEN m.demanda_id ELSE ? END
            AND (
              m.fornecedor_usuario_id = ?
              OR EXISTS (
                SELECT 1
                FROM dbo.evento_propostas_fornecedor p
                WHERE p.demanda_id = m.demanda_id
                  AND (
                    p.fornecedor_usuario_id = ?
                    OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
                    OR EXISTS (
                      SELECT 1
                      FROM dbo.fornecedor_colaboradores fc
                      WHERE fc.empresa_id = ?
                        AND fc.usuario_id = p.fornecedor_usuario_id
                    )
                  )
              )
            )
          GROUP BY m.demanda_id
        `, [demandId, demandId, user.id, user.id, company?.razao_social || '', company?.id || -1]);
        for (const demand of demands) {
          await db.query(`
            UPDATE m
            SET lida_fornecedor = 1
            FROM dbo.evento_mensagens_chat m
            WHERE m.demanda_id = ?
              AND LOWER(LTRIM(RTRIM(m.remetente))) = 'organizador'
              AND (
                m.fornecedor_usuario_id = ?
                OR EXISTS (
                  SELECT 1
                  FROM dbo.evento_propostas_fornecedor p
                  WHERE p.demanda_id = m.demanda_id
                    AND (
                      p.fornecedor_usuario_id = ?
                      OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
                      OR EXISTS (
                        SELECT 1
                        FROM dbo.fornecedor_colaboradores fc
                        WHERE fc.empresa_id = ? AND fc.usuario_id = p.fornecedor_usuario_id
                      )
                    )
                )
              )
          `, [demand.demanda_id, user.id, user.id, company?.razao_social || '', company?.id || -1]);
          await db.query(`
            UPDATE dbo.evento_chat_leituras
            SET ultima_mensagem_id = ?, lida_em = SYSUTCDATETIME()
            WHERE usuario_id = ? AND demanda_id = ?
          `, [demand.ultima_mensagem_id, user.id, demand.demanda_id]);
          await db.query(`
            IF NOT EXISTS (
              SELECT 1 FROM dbo.evento_chat_leituras
              WHERE usuario_id = ? AND demanda_id = ?
            )
            INSERT INTO dbo.evento_chat_leituras (usuario_id, demanda_id, ultima_mensagem_id)
            VALUES (?, ?, ?)
          `, [user.id, demand.demanda_id, user.id, demand.demanda_id, demand.ultima_mensagem_id]);
        }
      }
      return send(response, 200, { ok: true });
    } catch (error) {
      console.error('[chat] marcar mensagens como lidas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel marcar as mensagens como lidas.' });
    }
  }

  if (request.method === 'GET' && /^\/api\/fornecedor\/demandas\/\d+\/mensagens$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const demandId = Number(url.pathname.match(/^\/api\/fornecedor\/demandas\/(\d+)\/mensagens$/)?.[1]);
      const [rows] = await db.query(`
        SELECT m.id, m.remetente, m.texto, m.anexo_url, m.anexo_nome, m.anexo_tipo, m.enviado_em
        FROM dbo.evento_mensagens_chat m
        WHERE m.demanda_id = ? AND (
          m.fornecedor_usuario_id = ? OR EXISTS (
            SELECT 1 FROM dbo.evento_propostas_fornecedor p WHERE p.demanda_id = m.demanda_id AND (
              p.fornecedor_usuario_id = ?
              OR p.fornecedor_usuario_id = ?
              OR (p.fornecedor_usuario_id IS NULL AND p.empresa = ?)
              OR EXISTS (
                SELECT 1 FROM dbo.fornecedor_colaboradores fc
                WHERE fc.empresa_id = ? AND fc.usuario_id = p.fornecedor_usuario_id
              )
            )
          )
        ) ORDER BY m.enviado_em
      `, [demandId, user.id, user.id, user.id, company?.razao_social || '', company?.id || -1]);
      return send(response, 200, { ok: true, messages: rows });
    } catch (error) {
      console.error('[fornecedor] mensagens:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar o chat.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/fornecedor\/demandas\/\d+\/mensagens$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const demandId = Number(url.pathname.match(/^\/api\/fornecedor\/demandas\/(\d+)\/mensagens$/)?.[1]);
      const body = await parseBody(request);
      const texto = String(body.texto || '').trim();
      const attachment = await saveChatAttachment(body.anexo);
      const [[company]] = await db.query('SELECT razao_social FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [user.id]);
      const proposalId = Number(body.proposta_id || body.proposal_id || 0);
      const [[proposal]] = await db.query(
        proposalId
          ? `SELECT TOP 1 id, fornecedor_usuario_id FROM dbo.evento_propostas_fornecedor
             WHERE id = ? AND demanda_id = ? AND (
               fornecedor_usuario_id = ? OR (fornecedor_usuario_id IS NULL AND empresa = ?)
             )`
          : `SELECT TOP 1 id, fornecedor_usuario_id
             FROM dbo.evento_propostas_fornecedor
             WHERE demanda_id = ? AND (
               fornecedor_usuario_id = ?
               OR (fornecedor_usuario_id IS NULL AND empresa = ?)
             )
             ORDER BY id DESC`,
        proposalId
          ? [proposalId, demandId, user.id, company?.razao_social || '']
          : [demandId, user.id, company?.razao_social || '']
      );
      if (!proposal || (!texto && !attachment)) return send(response, 400, { ok: false, message: 'Escreva uma mensagem ou selecione um anexo.' });
      if (!proposal.fornecedor_usuario_id) {
        await db.query('UPDATE dbo.evento_propostas_fornecedor SET fornecedor_usuario_id = ? WHERE id = ?', [user.id, proposal.id]);
      }
      const [result] = await db.query(
        'INSERT INTO dbo.evento_mensagens_chat (demanda_id, fornecedor_usuario_id, remetente, texto, anexo_url, anexo_nome, anexo_tipo, lida_organizador, lida_fornecedor) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [demandId, user.id, 'fornecedor', texto, attachment?.url || null, attachment?.name || null, attachment?.type || null, 0, 1]
      );
      return send(response, 201, { ok: true, mensagem_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[fornecedor] enviar mensagem:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel enviar a mensagem.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/propostas\/.+\/aprovar$/.test(url.pathname)) {
    let connection;
    try {
      const proposalId = Number(url.pathname.match(/^\/api\/organizador\/propostas\/(\d+)\/aprovar$/)?.[1]);
      if (!proposalId) return send(response, 400, { ok: false, message: 'Identificador de proposta invÃ¡lido.' });
      const approvalBody = await parseBody(request);
      const session = readSessionToken(request);
      const approvalEmail = normalizeEmail(approvalBody.email || session?.email);
      const approvalPassword = String(approvalBody.password || '');
      const [[approver]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [approvalEmail]);
      if (!session || !approver || !['admin', 'organizador'].includes(String(approver.tipo).toLowerCase()) || !(await bcrypt.compare(approvalPassword, approver.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Confirme sua senha de login para aceitar esta proposta.' });
      }
      connection = await db.getConnection();
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
        return send(response, 404, { ok: false, message: 'Proposta nÃ£o encontrada.' });
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
      await audit('aprovar_proposta_fornecedor', `Proposta ${proposalId} aceita para a demanda ${proposal.demanda_id}.`, 'proposta_fornecedor', proposalId, approver);
      return send(response, 200, {
        ok: true,
        message: 'Proposta aprovada com sucesso. O custo foi atualizado automaticamente.'
      });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('[organizador] aprovar proposta:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  if (request.method === 'GET' && /^\/api\/organizador\/demandas\/\d+\/mensagens$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const demandId = Number(url.pathname.match(/^\/api\/organizador\/demandas\/(\d+)\/mensagens$/)?.[1]);
      if (!demandId) return send(response, 400, { ok: false, message: 'Demanda invÃ¡lida.' });
      const [rows] = await db.query(
        `SELECT m.id, m.remetente, m.texto, m.anexo_url, m.anexo_nome, m.anexo_tipo, m.enviado_em,
         COALESCE(fe.logo_url, '') AS remetente_logo_url
         FROM dbo.evento_mensagens_chat m
         OUTER APPLY (
           SELECT TOP 1 company.logo_url
           FROM dbo.fornecedor_empresas company
           LEFT JOIN dbo.evento_propostas_fornecedor proposal
             ON proposal.fornecedor_usuario_id = company.usuario_id
             OR LOWER(LTRIM(RTRIM(company.razao_social))) = LOWER(LTRIM(RTRIM(proposal.empresa)))
           WHERE company.usuario_id = m.fornecedor_usuario_id
              OR (proposal.demanda_id = m.demanda_id AND proposal.empresa IS NOT NULL)
           ORDER BY CASE WHEN company.usuario_id = m.fornecedor_usuario_id THEN 0 ELSE 1 END
         ) fe
         WHERE m.demanda_id = ? ORDER BY m.enviado_em`,
        [demandId]
      );
      return send(response, 200, { ok: true, messages: rows });
    } catch (error) {
      console.error('[organizador] carregar mensagens:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar as mensagens.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/demandas\/.+\/mensagens$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const demandId = Number(url.pathname.match(/^\/api\/organizador\/demandas\/(\d+)\/mensagens$/)?.[1]);
      const body = await parseBody(request);
      const texto = String(body.texto || '').trim();
      const attachment = await saveChatAttachment(body.anexo);
      if (!demandId || (!texto && !attachment)) {
        return send(response, 400, { ok: false, message: 'Escreva uma mensagem ou selecione um anexo.' });
      }
      const proposalId = Number(body.proposta_id || body.proposal_id || 0);
      const [[proposal]] = await db.query(
        proposalId
          ? `SELECT TOP 1 p.id, COALESCE(p.fornecedor_usuario_id, fe.usuario_id) AS fornecedor_usuario_id
             FROM dbo.evento_propostas_fornecedor p
             LEFT JOIN dbo.fornecedor_empresas fe
               ON LOWER(LTRIM(RTRIM(fe.razao_social))) = LOWER(LTRIM(RTRIM(p.empresa)))
             WHERE p.id = ? AND p.demanda_id = ?`
          : `SELECT TOP 1 p.id, COALESCE(p.fornecedor_usuario_id, fe.usuario_id) AS fornecedor_usuario_id
             FROM dbo.evento_propostas_fornecedor p
             LEFT JOIN dbo.fornecedor_empresas fe
               ON LOWER(LTRIM(RTRIM(fe.razao_social))) = LOWER(LTRIM(RTRIM(p.empresa)))
             WHERE p.demanda_id = ? AND (p.fornecedor_usuario_id IS NOT NULL OR fe.usuario_id IS NOT NULL)
             ORDER BY p.id DESC`,
        proposalId ? [proposalId, demandId] : [demandId]
      );
      if (proposal?.fornecedor_usuario_id) {
        await db.query(
          'UPDATE dbo.evento_propostas_fornecedor SET fornecedor_usuario_id = ? WHERE id = ? AND fornecedor_usuario_id IS NULL',
          [proposal.fornecedor_usuario_id, proposal.id]
        );
      }
      const [result] = await db.query(
        'INSERT INTO dbo.evento_mensagens_chat (demanda_id, fornecedor_usuario_id, remetente, texto, anexo_url, anexo_nome, anexo_tipo, lida_organizador, lida_fornecedor) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [demandId, proposal?.fornecedor_usuario_id || null, 'organizador', texto, attachment?.url || null, attachment?.name || null, attachment?.type || null, 1, 0]
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

  if (request.method === 'GET' && /^\/api\/organizador\/demandas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      if (!readSessionToken(request)) return send(response, 403, { ok: false, message: 'SessÃ£o invÃ¡lida.' });
      const demandId = Number(url.pathname.match(/^\/api\/organizador\/demandas\/(\d+)\/documentos$/)?.[1]);
      const [documents] = await db.query('SELECT id, nome, nome_arquivo, caminho AS url, criado_em FROM dbo.evento_demanda_documentos WHERE demanda_id = ? ORDER BY criado_em DESC', [demandId]);
      return send(response, 200, { ok: true, documents });
    } catch (error) {
      console.error('[organizador] documentos da demanda:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar os documentos da cotaÃ§Ã£o.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/demandas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      if (!readSessionToken(request)) return send(response, 403, { ok: false, message: 'SessÃ£o invÃ¡lida.' });
      const demandId = Number(url.pathname.match(/^\/api\/organizador\/demandas\/(\d+)\/documentos$/)?.[1]);
      const body = await parseBody(request);
      const nome = String(body.nome || '').trim();
      const attachment = await saveChatAttachment(body.arquivo);
      if (!demandId || !nome || !attachment) return send(response, 400, { ok: false, message: 'Informe o nome e o arquivo do documento.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_demanda_documentos (demanda_id, nome, nome_arquivo, caminho) OUTPUT INSERTED.id VALUES (?, ?, ?, ?)',
        [demandId, nome, attachment.name, attachment.url]
      );
      return send(response, 201, { ok: true, documento_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[organizador] upload de documento da demanda:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel salvar o documento da cotaÃ§Ã£o.' });
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
        return send(response, 400, { ok: false, message: 'Dados do item de custo invÃ¡lidos.' });
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
        return send(response, 400, { ok: false, message: 'Status da tarefa invÃ¡lido.' });
      }
      const [rows] = await db.query(
        'UPDATE dbo.evento_tarefas SET concluida = ? OUTPUT INSERTED.id WHERE id = ? AND evento_id = ?',
        [body.concluida ? 1 : 0, taskId, eventoId]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'Tarefa nÃ£o encontrada.' });
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
      const eventEndDate = body.data_fim ? parseEventDate(body.data_fim) : null;
      if (!eventDate) return send(response, 400, { ok: false, message: 'Informe a data do evento.' });
      if (!eventEndDate || eventEndDate <= eventDate) return send(response, 400, { ok: false, message: 'Informe um horÃ¡rio de encerramento posterior ao inÃ­cio do evento.' });
      const [result] = await db.query(
        `INSERT INTO eventos (organizador_id, nome, artista, \`local\`, data_evento, data_fim, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem) OUTPUT INSERTED.id VALUES (1, ?, ?, ?, ?, ?, ?, 500, 2000, 0.20, 'publicado', ?, ?)`,
        [body.nome.trim(), body.artista || null, body.local.trim(), eventDate, eventEndDate, parseFloat(body.preco) || 0, body.destaque ? 1 : 0, body.imagem || null]
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
      if (!rows.length) return send(response, 404, { ok: false, message: 'Evento nÃ£o encontrado.' });
      const [sectorRows] = await db.query('SELECT id, evento_id, nome, capacidade FROM dbo.evento_setores WHERE evento_id = ? ORDER BY id', [eventId]);
      const [lotRows] = await db.query('SELECT * FROM dbo.evento_lotes WHERE evento_id = ? ORDER BY id', [eventId]);
      const resolveLotSectorName = (lot, lotIndex) => {
        if (lot.setor_nome) return lot.setor_nome;
        const capacityMatch = sectorRows.find(sector => Number(sector.capacidade || 0) === Number(lot.setor_capacidade || -1));
        if (capacityMatch) return capacityMatch.nome;
        if (sectorRows.length === lotRows.length) return sectorRows[lotIndex]?.nome || 'Setor';
        return sectorRows[0]?.nome || 'Setor';
      };
      const r = rows[0];
      const event = {
        id: r.id,
        name: r.nome || '',
        artista: r.artista || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        endDate: r.data_fim ? new Date(r.data_fim).toISOString() : null,
        classification: r.classificacao_etaria || 'Livre',
        price: Number(r.ticket_calculado || 0),
        imagem: r.imagem || null,
        sectors: sectorRows.map(sector => ({ id: sector.id, name: sector.nome, capacity: Number(sector.capacidade || 0) })),
        lots: lotRows.map((lot, lotIndex) => ({
          id: lot.id,
          sector: resolveLotSectorName(lot, lotIndex),
          name: lot.nome || 'Lote atual',
          ticketType: lot.tipo_ingresso || 'Inteira',
          price: Number(lot.preco_inteira ?? lot.preco ?? r.ticket_calculado ?? 0),
          halfPrice: Number(lot.preco_meia || 0),
          fullAvailable: Number(lot.quantidade_inteira ?? lot.quantidade ?? 0),
          available: Number(lot.quantidade_total ?? lot.quantidade ?? 0),
          halfAvailable: Number(lot.quantidade_meia || 0),
          startDate: lot.data_inicio ? new Date(lot.data_inicio).toISOString() : null,
          endDate: lot.data_fim ? new Date(lot.data_fim).toISOString() : null,
          switchDate: lot.data_virada ? new Date(lot.data_virada).toISOString() : null,
          modalities: (() => { try { return lot.modalidades_json ? JSON.parse(lot.modalidades_json) : []; } catch { return []; } })()
        })),
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
      const eventEndDate = body.data_fim ? parseEventDate(body.data_fim) : null;
      if (!eventDate) return send(response, 400, { ok: false, message: 'Informe a data do evento.' });
      if (!eventEndDate || eventEndDate <= eventDate) return send(response, 400, { ok: false, message: 'Informe um horÃ¡rio de encerramento posterior ao inÃ­cio do evento.' });
      
      const [eventRows] = await db.query('SELECT nome FROM dbo.eventos WHERE id = ?', [eventId]);
      const eventName = eventRows[0]?.nome || `Evento ${eventId}`;
      await db.query(
        `UPDATE eventos SET nome = ?, artista = ?, \`local\` = ?, data_evento = ?, data_fim = ?, ticket_calculado = ?, status = ?, destaque = ?, imagem = ? WHERE id = ?`,
        [
          body.name || body.nome, 
          body.artista || null, 
          body.location || body.local, 
          eventDate,
          eventEndDate,
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
      await audit('exclusao_evento', `Evento ${eventName} excluÃ­do pelo painel.`, 'evento', eventName, auditActor(body));
      return send(response, 200, { ok: true, message: 'Evento excluÃ­do com sucesso!' });
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
        return send(response, 400, { ok: false, message: 'Tipo ou status de usuÃ¡rio invÃ¡lido.' });
      }

      const [[admin]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [adminEmail]);
      if (!admin || admin.tipo !== 'admin' || !(await bcrypt.compare(adminPassword, admin.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Senha do administrador invÃ¡lida.' });
      }
      if (admin.id === userId && tipo !== 'admin') {
        return send(response, 400, { ok: false, message: 'A conta do administrador nÃ£o pode perder o tipo admin.' });
      }

      const [[affectedUser]] = await db.query('SELECT nome FROM dbo.usuarios WHERE id = ?', [userId]);
      const [updated] = await db.query(
        `UPDATE dbo.usuarios
         SET tipo = ?, status = ?
         OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.tipo, INSERTED.status
         WHERE id = ?`,
        [tipo, requestedStatus === 'suspensa' ? 'suspensa' : 'aprovado', userId]
      );
      if (!updated.length) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      await audit('alteracao_acesso', `Tipo alterado para ${tipo} e status para ${requestedStatus}.`, 'usuario', `Conta de ${affectedUser?.nome || 'usuÃ¡rio'}`, { id: admin.id, nome: admin.nome, tipo: 'admin' });
      return send(response, 200, { ok: true, user: { ...updated[0], status: requestedStatus } });
    } catch (error) {
      console.error('[admin] Erro ao atualizar usuÃ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel atualizar o usuÃ¡rio.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/admin\/users\/\d+$/.test(url.pathname)) {
    try {
      const userId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const adminEmail = normalizeEmail(body.admin_email);
      const adminPassword = String(body.admin_password || '');
      if (!adminEmail || !adminPassword) {
        return send(response, 400, { ok: false, message: 'E-mail e senha do administrador sÃ£o obrigatÃ³rios.' });
      }

      const [[admin]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [adminEmail]);
      if (!admin || String(admin.tipo).toLowerCase() !== 'admin' || !(await bcrypt.compare(adminPassword, admin.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Senha do administrador invÃ¡lida.' });
      }
      if (admin.id === userId) {
        return send(response, 400, { ok: false, message: 'A conta do administrador logado nÃ£o pode ser excluÃ­da por este painel.' });
      }

      const [[affectedUser]] = await db.query('SELECT id, nome, email, tipo, status FROM dbo.usuarios WHERE id = ?', [userId]);
      if (!affectedUser) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      if (String(affectedUser.tipo).toLowerCase() === 'admin') {
        return send(response, 403, { ok: false, message: 'Contas de administrador nÃ£o podem ser excluÃ­das por este fluxo.' });
      }

      const releasedEmail = `excluida-${userId}-${Date.now()}@invalid.trocaticket.local`;
      await db.query(
        `UPDATE dbo.usuarios
         SET status = 'excluida', email = ?, cpf = NULL, telefone = NULL,
             email_verificado = 0, codigo_verificacao = NULL
         WHERE id = ?`,
        [releasedEmail, userId]
      );
      await audit('exclusao_usuario', `Conta de ${affectedUser.nome || affectedUser.email} excluÃ­da pelo painel administrativo; dados de acesso liberados para novo cadastro.`, 'usuario', userId, { id: admin.id, nome: admin.nome, tipo: 'admin' });
      return send(response, 200, { ok: true, message: 'Conta excluÃ­da. O e-mail, CPF e telefone jÃ¡ podem ser usados em um novo cadastro.', user_id: userId });
    } catch (error) {
      console.error('[admin] Erro ao excluir usuÃ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel excluir a conta.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/tickets') {
    try {
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito Ã  equipe de operaÃ§Ã£o.' });
      await ensureTicketSecuritySchema();
      const [objects] = await db.query("SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') AND name = 'ingressos_emitidos'");
      if (!objects.length) return send(response, 200, { ok: true, tickets: [] });

      const [tickets] = await db.query(`
        SELECT
          i.id,
          i.numero_ingresso,
          i.evento_id AS eventId,
          i.codigo_original_bilheteria AS externalCode,
          i.bilheteria_id AS integratorId,
          i.bilheteria_origem AS provider,
          i.setor_nome AS sector,
          i.lote_nome AS lotName,
          i.categoria_ingresso AS ticketCategory,
          i.utilizado_em AS checkinAt,
          i.motivo_checkin AS checkinReason,
          i.checkin_operador AS checkinOperator,
          'nÃ£o identificado' AS lotCategory,
          p.criado_em AS purchaseDate,
          CASE WHEN i.bilheteria_id IS NULL THEN 'EmissÃ£o prÃ³pria' ELSE 'EmissÃ£o por bilheteria parceira' END AS emissionMethod,
          CASE
            WHEN i.status = 'ativo' AND e.data_evento < SYSUTCDATETIME() THEN 'expirado'
            WHEN i.status = 'valido' THEN 'ativo'
            ELSE i.status
          END AS status,
          i.emitido_em AS createdAt,
          p.codigo_pedido,
          p.valor_total AS orderTotal,
          u.nome AS ownerName,
          u.cpf AS ownerCpf,
          e.nome AS eventName,
          e.data_evento AS eventDate
        FROM dbo.ingressos_emitidos i
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
        ORDER BY i.emitido_em DESC
      `);
      tickets.forEach(ticket => {
        if (!ticket.provider) ticket.provider = ticket.integratorId ? `Parceira #${ticket.integratorId}` : 'Troca Ticket';
        if (!ticket.externalCode) ticket.externalCode = ticket.numero_ingresso;
      });
      return send(response, 200, { ok: true, tickets });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  if (request.method === 'GET' && /^\/api\/admin\/tickets\/\d+\/qr$/.test(url.pathname)) {
    try {
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito Ã  equipe de operaÃ§Ã£o.' });
      await ensureTicketSecuritySchema();
      const ticketId = Number(url.pathname.split('/')[4]);
      const [rows] = await db.query('SELECT id, numero_ingresso, status FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      if (!rows.length) return send(response, 404, { ok: false, message: 'Ingresso nÃ£o encontrado.' });
      if (!['ativo', 'valido'].includes(String(rows[0].status).toLowerCase())) {
        return send(response, 409, { ok: false, message: 'Este ingresso nÃ£o possui um hash ativo.' });
      }
      const ticketSecret = await getTicketSecret(ticketId);
      const timeStep = Math.floor(Date.now() / 1000 / 60);
      const payload = makeActiveTicketPayload(rows[0].numero_ingresso, ticketSecret.secret_key, timeStep);
      const qrImage = await QRCode.toDataURL(payload, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
      return send(response, 200, { ok: true, ticketId, timeStep, hash: payload.split(':')[2], payload, qrImage, expiresAt: (timeStep + 1) * 60000 });
    } catch (error) {
      console.error('[bilheteria] Erro ao gerar QR ativo:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel gerar o QR ativo.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/bilheteria/validar-acesso') {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito Ã  equipe de operaÃ§Ã£o.' });
    const connection = await db.getConnection();
    try {
      await ensureTicketSecuritySchema();
      const body = await parseBody(request);
      const parts = String(body.qr_code_payload || '').trim().split(':');
      if (parts.length !== 3 || !parts[0] || !/^\d+$/.test(parts[1]) || !/^[a-f\d]{64}$/i.test(parts[2])) {
        return send(response, 400, { ok: false, kind: 'error', message: 'Ingresso InvÃ¡lido ou NÃ£o Encontrado.' });
      }
      const [ticketId, timeStepText, receivedHash] = parts;
      await connection.beginTransaction();
      const [rows] = await connection.query(`
        SELECT TOP (1) i.id, i.numero_ingresso, i.evento_id, i.status, i.secret_key,
          i.setor_nome, i.utilizado_em, i.bilheteria_origem, u.nome AS titular,
          e.nome AS evento
        FROM dbo.ingressos_emitidos i WITH (UPDLOCK, ROWLOCK)
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        WHERE i.numero_ingresso = ?
      `, [ticketId]);
      const ticket = rows[0];
      if (!ticket || Number(ticket.evento_id) !== Number(body.evento_id)) {
        await connection.rollback();
        return send(response, 404, { ok: false, kind: 'error', message: 'Ingresso InvÃ¡lido ou NÃ£o Encontrado.' });
      }
      const status = String(ticket.status || '').toLowerCase();
      if (['utilizado', 'usado', 'checked_in'].includes(status)) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso jÃ¡ utilizado.', checkinAt: ticket.utilizado_em });
      }
      if (!['ativo', 'valido'].includes(status)) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso revogado, cancelado ou expirado.' });
      }
      if (body.setor_catraca && body.setor_catraca !== '*' && ticket.setor_nome !== body.setor_catraca) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'warning', message: `SETOR INCORRETO: Ingresso emitido para ${ticket.setor_nome || 'setor nÃ£o informado'}. Direcione o cliente para o portÃ£o correto.`, sector: ticket.setor_nome || null });
      }
      const timeStep = Number(timeStepText);
      const currentStep = Math.floor(Date.now() / 1000 / 60);
      if (Math.abs(currentStep - timeStep) > 1) {
        await connection.rollback();
        return send(response, 400, { ok: false, kind: 'error', message: 'QR Code Expirado (Print detectado).' });
      }
      let secretKey = ticket.secret_key;
      if (!secretKey) {
        secretKey = makeTicketSecret();
        await connection.query('UPDATE dbo.ingressos_emitidos SET secret_key = ? WHERE id = ?', [secretKey, ticket.id]);
      }
      if (!safeHashEqual(makeTicketHash(ticket.numero_ingresso, timeStep, secretKey), receivedHash)) {
        await connection.rollback();
        return send(response, 401, { ok: false, kind: 'error', message: 'Hash invÃ¡lido ou chave revogada.' });
      }
      const [updated] = await connection.query(`
        UPDATE dbo.ingressos_emitidos
        SET status = 'utilizado', utilizado_em = SYSUTCDATETIME(), motivo_checkin = 'Leitura por QR Code', checkin_operador = ?
        OUTPUT INSERTED.utilizado_em
        WHERE id = ? AND status IN ('ativo', 'valido')
      `, [operator.nome || operator.email, ticket.id]);
      if (!updated.length) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso jÃ¡ utilizado por outra catraca.' });
      }
      await connection.commit();
      await audit('checkin_ingresso', `Check-in validado no evento ${ticket.evento}.`, 'ingresso', ticket.numero_ingresso, operator);
      return send(response, 200, { ok: true, kind: 'success', message: 'ACESSO LIBERADO', ticket: { id: ticket.id, numero_ingresso: ticket.numero_ingresso, titular: ticket.titular, setor: ticket.setor_nome, evento: ticket.evento, bilheteria: ticket.bilheteria_origem || 'Troca Ticket' }, checkinAt: updated[0].utilizado_em });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro ao validar ingresso:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel validar o ingresso.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && /^\/api\/bilheteria\/tickets\/\d+\/checkin-manual$/.test(url.pathname)) {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito Ã  equipe de operaÃ§Ã£o.' });
    const ticketId = Number(url.pathname.split('/')[4]);
    const connection = await db.getConnection();
    try {
      await ensureTicketSecuritySchema();
      const body = await parseBody(request);
      const reason = String(body.motivo || '').trim();
      if (!reason) return send(response, 400, { ok: false, message: 'Informe o motivo da liberaÃ§Ã£o manual.' });
      await connection.beginTransaction();
      const [rows] = await connection.query('SELECT id, numero_ingresso, status FROM dbo.ingressos_emitidos WITH (UPDLOCK, ROWLOCK) WHERE id = ?', [ticketId]);
      if (!rows.length) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Ingresso nÃ£o encontrado.' });
      }
      if (!['ativo', 'valido'].includes(String(rows[0].status).toLowerCase())) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Ingresso nÃ£o estÃ¡ disponÃ­vel para check-in.' });
      }
      const [updated] = await connection.query(`
        UPDATE dbo.ingressos_emitidos
        SET status = 'utilizado', utilizado_em = SYSUTCDATETIME(), motivo_checkin = ?, checkin_operador = ?
        OUTPUT INSERTED.utilizado_em
        WHERE id = ? AND status IN ('ativo', 'valido')
      `, [reason.slice(0, 240), operator.nome || operator.email, ticketId]);
      if (!updated.length) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Ingresso jÃ¡ utilizado por outra catraca.' });
      }
      await connection.commit();
      await audit('checkin_manual_ingresso', `Check-in manual: ${reason}.`, 'ingresso', rows[0].numero_ingresso, operator);
      return send(response, 200, { ok: true, message: 'Check-in manual aprovado.', checkinAt: updated[0].utilizado_em });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro no check-in manual:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel concluir o check-in manual.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/bilheteria/transferencias') {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito Ã  equipe de operaÃ§Ã£o.' });
    const connection = await db.getConnection();
    try {
      await ensureTicketSecuritySchema();
      const body = await parseBody(request);
      const ticketCode = String(body.ticket_id || '').trim();
      const contact = String(body.novo_titular_contato || '').trim();
      const holderName = String(body.novo_titular_nome || '').trim();
      if (!ticketCode || !contact || !holderName) return send(response, 400, { ok: false, message: 'Preencha ingresso e dados do novo titular.' });
      await connection.beginTransaction();
      const [ticketRows] = await connection.query(`
        SELECT TOP (1) i.*, u.nome AS titular_anterior
        FROM dbo.ingressos_emitidos i WITH (UPDLOCK, ROWLOCK)
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        WHERE i.numero_ingresso = ?
      `, [ticketCode]);
      const ticket = ticketRows[0];
      if (!ticket) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Ingresso nÃ£o encontrado.' });
      }
      if (!['ativo', 'valido'].includes(String(ticket.status).toLowerCase())) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Somente ingressos disponÃ­veis podem ser transferidos.' });
      }
      const contactDigits = normalizeCpf(contact);
      const [recipientRows] = await connection.query(
        'SELECT id, nome, cpf, email FROM dbo.usuarios WHERE email = ? OR (? <> ? AND cpf = ?)',
        [normalizeEmail(contact), contactDigits, '', contactDigits]
      );
      const recipient = recipientRows[0];
      if (!recipient) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'O novo titular precisa ter uma conta Troca Ticket cadastrada com esse CPF ou e-mail.' });
      }
      if (Number(recipient.id) === Number(ticket.comprador_id)) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'O novo titular jÃ¡ Ã© o titular deste ingresso.' });
      }
      const revokedPayload = `${ticket.qr_code_payload || ''}_REVOGADO_${Date.now()}`;
      await connection.query("UPDATE dbo.ingressos_emitidos SET status = 'invalidado_por_revenda', qr_code_payload = ?, secret_key = NULL WHERE id = ?", [revokedPayload, ticket.id]);
      const newNumber = makeCode('TKT');
      const newSecret = makeTicketSecret();
      const newPayload = makeActiveTicketPayload(newNumber, newSecret);
      const nextVersion = Number(ticket.versao_titularidade || 1) + 1;
      const [newTicketRows] = await connection.query(`
        INSERT INTO dbo.ingressos_emitidos
          (pedido_id, comprador_id, evento_id, bilheteria_id, bilheteria_origem, setor_nome, numero_ingresso, codigo_original_bilheteria, qr_code_payload, secret_key, versao_titularidade, status)
        OUTPUT INSERTED.id
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')
      `, [ticket.pedido_id, recipient.id, ticket.evento_id, ticket.bilheteria_id || null, ticket.bilheteria_origem || 'Troca Ticket', ticket.setor_nome || null, newNumber, ticket.codigo_original_bilheteria || newNumber, newPayload, newSecret, nextVersion]);
      await connection.commit();
      const matrixSync = ticket.bilheteria_origem && ticket.bilheteria_origem !== 'Troca Ticket' ? 'not_configured' : 'not_applicable';
      await audit('transferencia_ingresso_painel', `${body.motivo || 'TransferÃªncia'}: titular anterior ${ticket.titular_anterior}; novo titular ${recipient.nome}; hash anterior invalidado e novo hash criado.`, 'ingresso', newNumber, operator);
      return send(response, 200, { ok: true, message: 'TransferÃªncia concluÃ­da. Hash antigo revogado e nova chave criada.', matrixSync, ticket: { id: newTicketRows[0].id, numero_ingresso: newNumber, titular: recipient.nome, cpf: recipient.cpf, setor: ticket.setor_nome, evento_id: ticket.evento_id, bilheteria_origem: ticket.bilheteria_origem || 'Troca Ticket' } });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro na transferÃªncia:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel concluir a transferÃªncia.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'PATCH' && /^\/api\/admin\/tickets\/\d+\/status$/.test(url.pathname)) {
    try {
      const ticketId = Number(url.pathname.split('/')[4]);
      const body = await parseBody(request);
      const status = String(body.status || '').trim().toLowerCase();
      if (!['cancelado', 'bloqueado'].includes(status)) {
        return send(response, 400, { ok: false, message: 'O painel sÃ³ pode definir os status cancelado ou bloqueado.' });
      }

      const [result] = await db.query(
        `UPDATE dbo.ingressos_emitidos
         SET status = ?
         OUTPUT INSERTED.id, INSERTED.status
         WHERE id = ?`,
        [status, ticketId]
      );
      if (!result.length) return send(response, 404, { ok: false, message: 'Ingresso nÃ£o encontrado.' });
      const [[ticket]] = await db.query(`SELECT e.nome AS evento FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id WHERE i.id = ?`, [ticketId]);
      const actor = auditActor(body);
      const [[ticketCode]] = await db.query('SELECT numero_ingresso FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      await audit('alteracao_status_ingresso', `Status do ingresso do evento ${ticket?.evento || 'evento'} alterado para ${status}.`, 'ingresso', ticketCode?.numero_ingresso || 'Ingresso nÃ£o identificado', actor);
      return send(response, 200, { ok: true, ticket: result[0] });
    } catch (error) {
      console.error('[admin] Erro ao alterar status do ingresso:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel alterar o status.' });
    }
  }

  // ===== ROTAS AUXILIARES DO ADMIN (LOGS E DESTAQUES) =====
  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/activity-log')) {
    try {
      const actor = url.searchParams.get('actor') || '';
      const type = url.searchParams.get('type') || '';
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
      const [logs] = await db.query(`
        SELECT TOP (${limit}) a.id, a.ator_id AS actorId, a.ator_nome AS actorName, a.ator_tipo AS actorType,
          a.acao AS action, a.descricao AS description, a.item_tipo AS itemType, a.item_id AS itemId, a.criado_em AS timestamp,
          current_holder.nome AS currentHolder
        FROM dbo.auditoria_admin a
        OUTER APPLY (
          SELECT TOP (1) u.nome
          FROM dbo.ingressos_emitidos i
          JOIN dbo.usuarios u ON u.id = i.comprador_id
          WHERE a.item_tipo = 'ingresso' AND i.numero_ingresso = a.item_id
        ) current_holder
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
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
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
      console.error('[admin] Erro no histÃ³rico do usuÃ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar o histÃ³rico.' });
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

  // ===== CARTÃ•ES DO USUÃRIO (ROBUSTO E SEGURO) =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/cartoes') {
    try {
      const email = normalizeEmail(url.searchParams.get('email'));
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });
      
      const [cards] = await db.query('SELECT id, nome_titular, ultimos_digitos, bandeira, validade_mes, validade_ano, criado_em FROM dbo.cartoes_usuario WHERE usuario_id = ? ORDER BY id DESC', [users[0].id]);
      return send(response, 200, { ok: true, cards });
    } catch (error) {
      console.error('[cartoes GET]', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao carregar cartÃµes.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/usuario/cartoes') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Comprador nÃ£o encontrado.' });

      const cpf = normalizeCpf(body.cpf);
      if (cpf.length !== 11) return send(response, 400, { ok: false, message: 'Informe um CPF com 11 nÃºmeros. A pontuaÃ§Ã£o Ã© opcional.' });

      const numCartao = String(body.numero_cartao || body.numero || '').trim();
      const numLimpo = numCartao.replace(/\D/g, '');
      if (numLimpo.length < 13 || numLimpo.length > 19) {
        return send(response, 400, { ok: false, message: 'NÃºmero de cartÃ£o invÃ¡lido.' });
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

      return send(response, 201, { ok: true, message: 'CartÃ£o salvo com seguranÃ§a!' });
    } catch (error) {
      console.error('[cartoes POST] Erro:', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao salvar o cartÃ£o no banco de dados.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/usuario\/cartoes\/\d+$/.test(url.pathname)) {
    try {
      const cardId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃ¡rio nÃ£o encontrado.' });

      await db.query('DELETE FROM dbo.cartoes_usuario WHERE id = ? AND usuario_id = ?', [cardId, users[0].id]);
      return send(response, 200, { ok: true, message: 'CartÃ£o excluÃ­do com sucesso.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao excluir o cartÃ£o.' });
    }
  }

  // ===== ARQUIVOS ESTÃTICOS =====
  const legacyPageRedirects = {
    '/evento.html': '/events/evento.html',
    '/login.html': '/auth/login.html',
    '/cadastro.html': '/auth/cadastro.html',
    '/cadastro-pj.html': '/auth/cadastro-pj.html',
    '/ajuda.html': '/info/ajuda.html',
    '/eventos.html': '/events/eventos.html',
    '/ingressos.html': '/events/ingressos.html',
    '/checkout.html': '/events/checkout.html',
    '/meus-ingressos.html': '/account/meus-ingressos.html',
    '/ingresso.html': '/account/ingresso.html',
    '/perfil.html': '/account/perfil.html',
    '/editar-perfil.html': '/account/editar-perfil.html',
    '/editar-telefone.html': '/account/editar-telefone.html',
    '/cartoes.html': '/account/cartoes.html',
    '/revenda.html': '/account/revenda.html',
    '/admin.html': '/admin/admin.html',
    '/bilheteria.html': '/operations/bilheteria.html',
    '/organizador.html': '/operations/organizador.html',
    '/fornecedor.html': '/operations/fornecedor.html',
    '/chat.html': '/operations/chat.html',
    '/chat-fornecedor.html': '/operations/chat-fornecedor.html'
  };
  const isReactRoute = url.pathname === '/app' || url.pathname === '/app/'
    || ['/events', '/orders', '/login'].includes(url.pathname)
    || /^\/ticket\/\d+$/.test(url.pathname);
  if (request.method === 'GET' && isReactRoute) {
    const appFilePath = path.join(root, 'public', 'app', 'index.html');
    if (fs.existsSync(appFilePath)) {
      response.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
      return fs.createReadStream(appFilePath).pipe(response);
    }
  }
  if (request.method === 'GET' && legacyPageRedirects[url.pathname]) {
    response.writeHead(302, { Location: `${legacyPageRedirects[url.pathname]}${url.search}` });
    return response.end();
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(url.pathname);
  } catch {
    return response.writeHead(400).end('Caminho invÃ¡lido');
  }

  const filePath = requestedPath.startsWith('/app/')
    ? path.join(root, 'public', requestedPath.replace(/^\/+/, ''))
    : requestedPath.startsWith('/uploads/')
      ? path.join(root, 'public', requestedPath.replace(/^\/+/, ''))
      : path.join(root, requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, ''));
  const normalizedRoot = path.resolve(root) + path.sep;
  const normalizedFilePath = path.resolve(filePath);
  if (!normalizedFilePath.startsWith(normalizedRoot) || !fs.existsSync(normalizedFilePath) || fs.statSync(normalizedFilePath).isDirectory()) {
    return response.writeHead(404).end('NÃ£o encontrado');
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(normalizedFilePath).toLowerCase()] || 'application/octet-system' });
  fs.createReadStream(normalizedFilePath).pipe(response);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`A porta ${port} jÃ¡ estÃ¡ em uso. Feche o servidor existente ou use outra porta com PORT=3010.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, () => console.log(`TrocaTicket rodando em http://localhost:${port}`));