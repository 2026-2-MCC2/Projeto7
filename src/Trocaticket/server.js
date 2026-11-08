const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { waitUntil } = require('@vercel/functions');
const db = require('./db');
const { MAX_UPLOAD_BYTES, salvarArquivo } = require('./armazenamento');
const {
  EVENT_IMAGE_FIELDS,
  decodeDataImage,
  eventImageResponse,
  eventImageVersion,
  preserveEventImageInput
} = require('./event-images');
const {
  RESALE_FEES,
  calculateResalePayout
} = require('./resale-calculations');

const port = process.env.PORT || 3000;
const root = __dirname;
if (process.env.VERCEL && !String(process.env.TROCATICKET_SESSION_SECRET || '').trim()) {
  throw new Error('TROCATICKET_SESSION_SECRET is required on Vercel.');
}
const sessionTokenSecret = process.env.TROCATICKET_SESSION_SECRET
  || process.env.DB_PASSWORD
  || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
const smtpHost = String(process.env.SMTP_HOST || '').trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const smtpUser = String(process.env.SMTP_USER || '').trim();
const smtpPass = String(process.env.SMTP_PASS || '').trim();
const smtpFrom = String(process.env.SMTP_FROM || smtpUser).trim();

let verificationTransporter = null;

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
const serverFiles = /^(server|db|armazenamento|status|generate-admin-token|fix-name-once|inserir_evento|resale-calculations(?:\.test)?|event-images(?:\.test)?)\.js$/i;
const serverDirectories = /^(data|sql|scripts|node_modules|frontend|\.vscode|\.git)(\/|$)/i;
const testFiles = /\.test\.(?:js|mjs)$/i;

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

async function sendTransferEmail({ to, recipientName, senderName, ticket, acceptanceUrl }) {
  const transporter = getVerificationTransporter();
  const eventName = escapeHtml(ticket.evento_nome || 'seu evento');
  const holder = escapeHtml(recipientName || to);
  const sender = escapeHtml(senderName || 'Um usuário');
  const ticketCode = escapeHtml(ticket.codigo_original_bilheteria || ticket.numero_ingresso || 'A confirmar');
  const orderCode = escapeHtml(ticket.codigo_pedido || ticket.pedido_id || 'A confirmar');
  const eventDate = escapeHtml(formatEmailDateTime(ticket.data_evento));
  const link = escapeHtml(acceptanceUrl);

  if (!transporter) {
    console.warn(`[transferencia] SMTP não configurado. Link de aceite para ${to}: ${acceptanceUrl}`);
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: `TrocaTicket - aceite de transferência para ${ticket.evento_nome || 'seu ingresso'}`,
    text: [
      `Olá ${recipientName || to},`,
      '',
      `${senderName || 'Um usuário'} enviou uma solicitação de transferência de titularidade para o evento ${ticket.evento_nome || 'seu evento'}.`,
      `Ingresso: ${ticketCode}`,
      `Pedido: ${orderCode}`,
      `Data: ${eventDate}`,
      '',
      `Aceite a transferência neste link: ${acceptanceUrl}`,
      '',
      'O link só pode ser usado uma vez. Após o aceite, um novo QR Code será gerado na sua conta.'
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033;max-width:640px;margin:auto;background:#ffffff">
        <div style="background:#101827;color:#ffffff;padding:22px 26px;border-radius:14px 14px 0 0">
          <strong style="font-size:22px">Troca<span style="background:linear-gradient(90deg,#27b7ff,#d946ef,#8b7cff);-webkit-background-clip:text;background-clip:text;color:transparent">Ticket</span></strong>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;padding:26px">
        <p>Olá, <strong>${holder}</strong>.</p>
        <p><strong>${sender}</strong> enviou uma solicitação para transferir a titularidade do ingresso do evento <strong>${eventName}</strong> para você.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:20px 0">
          <p style="margin:0 0 6px"><strong>Ingresso:</strong> ${ticketCode}</p>
          <p style="margin:0 0 6px"><strong>Pedido:</strong> ${orderCode}</p>
          <p style="margin:0"><strong>Data:</strong> ${eventDate}</p>
        </div>
        <p style="margin:24px 0">
          <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#27b7ff,#8b7cff 55%,#d946ef);color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Aceitar transferência</a>
        </p>
        <p>Ao aceitar, o ingresso aparecerá na sua conta com seus dados de titularidade e um novo QR Code. O pedido e o código original do ingresso serão mantidos.</p>
        <p style="font-size:12px;color:#64748b">Se você não esperava esta solicitação, ignore este email. O link só pode ser usado uma vez.</p>
        </div>
      </div>
    `
  });

  return { sent: true };
}

async function sendTransferConfirmationEmail({ to, name, role, ticket, newTicketNumber }) {
  const transporter = getVerificationTransporter();
  const eventName = escapeHtml(ticket.evento_nome || 'seu evento');
  const personName = escapeHtml(name || to);
  const ticketCode = escapeHtml(ticket.codigo_original_bilheteria || 'A confirmar');
  const orderCode = escapeHtml(ticket.codigo_pedido || ticket.pedido_id || 'A confirmar');
  const newCode = escapeHtml(newTicketNumber || 'A confirmar');
  const eventDate = escapeHtml(formatEmailDateTime(ticket.data_evento));
  const roleText = role === 'sender' ? 'Sua solicitação de transferência foi aceita.' : 'A transferência foi concluída e o ingresso já está na sua conta.';
  const counterpartLabel = role === 'sender' ? 'Destinatário' : 'Remetente';
  const counterpartName = escapeHtml(role === 'sender'
    ? (ticket.destinatario_nome || 'A confirmar')
    : (ticket.remetente_nome || 'A confirmar'));

  if (!transporter) {
    console.warn(`[transferencia] SMTP não configurado. Confirmação não enviada para ${to}.`);
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: `TrocaTicket - transferência concluída | ${ticket.evento_nome || 'Ingresso'}`,
    text: [
      `Olá ${name || to},`,
      '',
      roleText,
      `Evento: ${ticket.evento_nome || 'A confirmar'}`,
      `Ingresso: ${ticketCode}`,
      `Pedido: ${orderCode}`,
      ...(role === 'sender' ? [] : [`Novo código do ingresso: ${newCode}`]),
      `${counterpartLabel}: ${counterpartName}`,
      `Data: ${eventDate}`,
      '',
      role === 'sender'
        ? 'O QR Code anterior foi invalidado e o ingresso agora pertence ao destinatário.'
        : 'Acesse sua conta TrocaTicket para visualizar o novo QR Code e os dados de titularidade.'
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033;max-width:640px;margin:auto">
        <div style="background:#101827;color:#fff;padding:22px 26px;border-radius:14px 14px 0 0">
          <strong style="font-size:22px">Troca<span style="background:linear-gradient(90deg,#27b7ff,#d946ef,#8b7cff);-webkit-background-clip:text;background-clip:text;color:transparent">Ticket</span></strong>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px;padding:26px">
          <p>Olá, <strong>${personName}</strong>.</p>
          <h1 style="font-size:24px;margin:12px 0;color:#111827">Transferência concluída</h1>
          <p>${roleText}</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:20px 0">
            <p style="margin:0 0 7px"><strong>Evento:</strong> ${eventName}</p>
            <p style="margin:0 0 7px"><strong>Ingresso:</strong> ${ticketCode}</p>
            ${role === 'sender' ? '' : `<p style="margin:0 0 7px"><strong>Novo código:</strong> ${newCode}</p>`}
            <p style="margin:0 0 7px"><strong>Pedido:</strong> ${orderCode}</p>
            <p style="margin:0 0 7px"><strong>${counterpartLabel}:</strong> ${counterpartName}</p>
            <p style="margin:0"><strong>Data:</strong> ${eventDate}</p>
          </div>
          <p>${role === 'sender'
            ? 'O QR Code anterior foi invalidado para manter a segurança do ingresso.'
            : 'Entre na sua conta para visualizar o novo QR Code e os dados atualizados de titularidade.'}</p>
          <p style="margin-top:24px;color:#64748b;font-size:12px">Este é um email automático do TrocaTicket.</p>
        </div>
      </div>
    `
  });

  return { sent: true };
}

function transferResultPage({ success, title, message, eventName, ticketNumber, orderCode }) {
  const details = success
    ? `<div class="details"><span>Evento</span><strong>${escapeHtml(eventName)}</strong><span>Novo ingresso</span><strong>${escapeHtml(ticketNumber)}</strong><span>Pedido</span><strong>${escapeHtml(orderCode)}</strong></div>`
    : '';
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} | TrocaTicket</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#0b0f19;color:#f8fafc;font-family:Inter,Arial,sans-serif;display:grid;place-items:center;padding:24px}
.card{width:min(100%,560px);background:#151b27;border:1px solid #283244;border-radius:22px;box-shadow:0 24px 70px #0008;padding:42px;text-align:center}
.brand{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:32px}.brand img{display:block;width:30px;height:30px;object-fit:contain;border-radius:50%}.brand span{color:#fff;font-size:21px;font-weight:800;letter-spacing:-.7px}.brand span b{background:linear-gradient(90deg,#27b7ff,#d946ef,#8b7cff);-webkit-background-clip:text;background-clip:text;color:transparent}
.icon{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;margin:0 auto 22px;background:${success ? '#123c32' : '#3d2429'};color:${success ? '#52e0b0' : '#ff8793'};font-size:36px}
h1{font-size:28px;margin:0 0 12px}p{color:#aab5c7;line-height:1.6;margin:0 auto 24px}.details{display:grid;grid-template-columns:1fr 1fr;text-align:left;background:#0f1520;border-radius:14px;padding:17px;margin:22px 0;gap:8px 16px}.details span{color:#8491a6;font-size:12px}.details strong{font-size:14px;overflow-wrap:anywhere}.button{display:inline-block;background:linear-gradient(135deg,#27b7ff,#8b7cff 55%,#d946ef);color:#fff;text-decoration:none;padding:13px 22px;border-radius:9px;font-weight:800;box-shadow:0 8px 22px #5146b855}
@media(max-width:480px){.card{padding:30px 20px}.details{grid-template-columns:1fr}}
</style></head><body><main class="card"><div class="brand"><img src="/imagens/logo troca ticket.png" alt=""><span>Troca<b>Ticket</b></span></div>
<div class="icon">${success ? '✓' : '!'}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${details}
${success ? '<a class="button" href="/meus-ingressos.html">Acessar meus ingressos</a>' : '<a class="button" href="/">Voltar ao TrocaTicket</a>'}
</main></body></html>`;
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
  const title = escapeHtml(`Seu ingresso offline para o ${ticket.eventName} está pronto, aguardamos sua presença!`);
  const walletButton = walletUrl
    ? `<a href="${escapeHtml(walletUrl)}" target="_blank" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#111827;border:1px solid #374151;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;"><span style="display:inline-block;margin-right:8px;color:#4285f4;font-size:18px;font-weight:bold;">G</span>Adicionar à Carteira do Google</a>`
    : '<span role="button" aria-disabled="true" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#111827;border:1px solid #374151;color:#ffffff;opacity:.55;font-size:15px;font-weight:bold;cursor:not-allowed;"><span style="display:inline-block;margin-right:8px;color:#4285f4;font-size:18px;font-weight:bold;">G</span>Adicionar à Carteira do Google</span><p style="margin:8px 0 0;color:#64748b;font-size:12px;line-height:1.6;">A Carteira do Google ainda não está habilitada para este ingresso.</p>';

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Seu ingresso Troca Ticket</title>
<style>@media only screen and (max-width:600px){.email-shell{width:100%!important}.email-pad{padding-left:18px!important;padding-right:18px!important}.event-title{font-size:23px!important}.step-cell{padding:12px!important}}</style></head>
<body style="width:100%;margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Seu ingresso digital para ${eventName} está pronto, com acesso offline e QR dinâmico.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;"><tr><td align="center" style="padding:0;">
<table role="presentation" class="email-shell" width="680" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;margin:0 auto;background:#ffffff;">
<tr><td align="center" style="padding:0;background:#000000;">
<img src="${escapeHtml(bannerSrc)}" width="680" alt="Troca Ticket" style="display:block;width:100%;max-width:680px;height:auto;margin:0 auto;border:0;">
</td></tr>
<tr><td class="email-pad" style="padding:30px 36px 10px;">
<p style="margin:0 0 8px;color:#475569;font-size:15px;">Olá, ${holder}.</p>
<h1 class="event-title" style="margin:0;color:#0f172a;font-size:28px;line-height:1.25;">${title}</h1>
</td></tr>
<tr><td class="email-pad" style="padding:18px 36px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:8px;"><tr><td width="42" valign="top" style="padding:16px 0 16px 16px;color:#2563eb;font-size:24px;">&#8681;</td><td style="padding:16px 16px 16px 10px;"><p style="margin:0 0 4px;color:#1e3a8a;font-size:14px;font-weight:bold;">Baixar ingresso offline</p><p style="margin:0;color:#334155;font-size:13px;line-height:1.5;">O arquivo está anexado a este e-mail: <strong>${safeFilename}</strong>. Guarde-o no seu smartphone antes de chegar ao evento.</p></td></tr></table>
</td></tr>
<tr><td class="email-pad" align="center" style="padding:8px 36px 24px;">${walletButton}</td></tr>
<tr><td class="email-pad" style="padding:0 36px 22px;">
<h2 style="margin:0 0 6px;color:#0f172a;font-size:18px;line-height:1.4;">Instruções de utilização do acesso offline (sem internet)</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="step-cell" style="padding:15px 16px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 1 · Descarregue o anexo</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Guarde <strong>${safeFilename}</strong> no seu smartphone antes de ir ao evento.</p>
</td></tr><tr><td class="step-cell" style="padding:15px 16px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 2 · Abra no navegador</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Abra o arquivo no Google Chrome, Samsung Internet ou Safari. Se solicitado, escolha <strong>“Sempre”</strong> ou <strong>“Desta vez”</strong>. O arquivo funciona localmente, sem dados móveis.</p>
</td></tr><tr><td class="step-cell" style="padding:15px 16px;background:#ffffff;">
<p style="margin:0 0 6px;color:#2563eb;font-size:13px;font-weight:bold;">Passo 3 · Apresente na entrada</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Na fila, mesmo sem rede ou em modo de voo, o QR continuará atualizando a cada 60 segundos. Apresente a tela do navegador à equipe da portaria.</p>
</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:14px;background:#eff6ff;border-left:3px solid #2563eb;"><tr><td style="padding:12px 14px;color:#1e3a8a;font-size:13px;line-height:1.6;"><strong>Validade do Código QR Offline:</strong> Ativo até ao término oficial do evento em ${eventEnd}.</td></tr></table>
</td></tr>
<tr><td class="email-pad" style="padding:0 36px 24px;">
<h2 style="margin:0 0 10px;color:#0f172a;font-size:18px;">Resumo do ingresso</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;background:#f1f5f9;">
<tr><td style="padding:16px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Data e horário de início</p><p style="margin:0;color:#0f172a;font-size:14px;font-weight:bold;">${eventStart}</p></td></tr>
<tr><td style="padding:10px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Local</p><p style="margin:0;color:#0f172a;font-size:14px;">${location}</p></td></tr>
<tr><td style="padding:10px 18px 5px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Titular</p><p style="margin:0;color:#0f172a;font-size:14px;">${holder} <span style="color:#64748b;">(${email})</span></p></td></tr>
<tr><td style="padding:10px 18px 16px;"><p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Bilhete e setor</p><p style="margin:0;color:#0f172a;font-size:14px;font-weight:bold;">#${ticketNumber} <span style="font-weight:normal;color:#475569;">· ${sector}</span></p></td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:20px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">Não responda a este e-mail. Este é um e-mail automático enviado pela plataforma Troca Ticket.</p>
<p style="margin:8px 0;color:#94a3b8;font-size:12px;">Dúvidas ou suporte? Acesse nossa central de ajuda no site da <a href="${supportUrl}" style="color:#00e5ff;text-decoration:underline;font-weight:bold;">Troca Ticket</a>.</p>
<p style="margin:12px 0 0;color:#94a3b8;font-size:11px;">© 2026 Troca Ticket. Todos os direitos reservados.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return html
    .replace('Baixar ingresso offline (.html)', 'Baixar ingresso offline')
    .replace('Bilhete e setor', 'Bilhete, pedido e setor')
    .replace(
      `#${ticketNumber} <span style="font-weight:normal;color:#475569;">· ${sector}</span>`,
      `#${ticketNumber} <span style="font-weight:normal;color:#475569;">· Pedido #${orderCode} · ${sector}</span>`
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
<body><main class="pass"><p class="tag">TrocaTicket · Ingresso digital</p><h1 id="event-name"></h1><p id="event-details"></p><div class="qr" id="qr"><canvas id="qr-canvas"></canvas></div><p class="notice" id="status" aria-live="polite">Gerando QR offline...</p><p id="ticket-number"></p><p id="event-end"></p></main>
<script>${qrLibrary}</script><script>
const ticket=${ticketData};
const encoder=new TextEncoder();
const keyBytes=Uint8Array.from(ticket.secretKey.match(/.{2}/g),part=>parseInt(part,16));
document.getElementById('event-name').textContent=ticket.eventName;
document.getElementById('event-details').textContent=[new Date(ticket.eventDate).toLocaleString('pt-BR'),ticket.location,ticket.sector].filter(Boolean).join(' · ');
document.getElementById('ticket-number').textContent='Ingresso #'+ticket.number+' · '+ticket.holder;
document.getElementById('event-end').textContent='Válido até '+new Date(ticket.eventEndDate).toLocaleString('pt-BR');
async function refresh(){const status=document.getElementById('status');if(Date.now()>ticket.expiresAt){document.getElementById('qr').hidden=true;status.textContent='Ingresso expirado: evento encerrado';return}try{const step=Math.floor(Date.now()/60000);const key=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-256'},false,['sign']);const digest=await crypto.subtle.sign('HMAC',key,encoder.encode(ticket.number+':'+step));const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');await QRCode.toCanvas(document.getElementById('qr-canvas'),ticket.number+':'+step+':'+hash,{width:200,margin:1,errorCorrectionLevel:'M'});status.textContent='QR atualizado · próximo em até 60 segundos'}catch(error){status.textContent='Não foi possível gerar o QR offline neste navegador.'}}
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
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PrÃƒÂ©via Google Wallet</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f1f3f4;font:16px Arial,sans-serif;color:#202124}.pass{width:min(360px,calc(100vw - 40px));background:#171a24;color:#fff;border-radius:18px;padding:24px;box-sizing:border-box;box-shadow:0 8px 28px #0003}.brand{font-size:14px;color:#b9c4d8}.g{font-size:20px;font-weight:700;background:conic-gradient(#4285f4,#34a853,#fbbc05,#ea4335,#4285f4);color:transparent;background-clip:text;-webkit-background-clip:text}h1{font-size:23px;margin:24px 0 18px}p{margin:10px 0;color:#d2d7e2}.mock{margin-top:24px;color:#aeb5c8;font-size:12px}</style><main class="pass"><div class="brand"><span class="g">G</span> Carteira do Google Ã‚Â· DemonstraÃƒÂ§ÃƒÂ£o</div><h1>${escapeHtml(ticket.eventName)}</h1>${details.map(detail => `<p>${detail}</p>`).join('')}<p class="mock">Passe de demonstraÃƒÂ§ÃƒÂ£o. Configure as credenciais do Google Wallet para habilitar a emissÃƒÂ£o real.</p></main></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

async function getTicketForSession(request, ticketId) {
  const session = readSessionToken(request);
  if (!session) return { error: { status: 401, message: 'SessÃƒÂ£o invÃƒÂ¡lida. Entre novamente para continuar.' } };
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
  if (!rows.length) return { error: { status: 404, message: 'Ingresso nÃƒÂ£o encontrado para esta conta.' } };
  const ticket = rows[0];
  if (!['ativo', 'valido'].includes(String(ticket.status).toLowerCase()) || !ticket.secret_key) {
    return { error: { status: 409, message: 'Este ingresso nÃƒÂ£o estÃƒÂ¡ ativo para acesso digital.' } };
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
    throw new Error('Data do evento invÃƒÂ¡lida. Use o formato AAAA-MM-DD HH:MM.');
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
let resaleSchemaPromise;

// Checkout currently applies a 14% administration fee (the simulator intentionally
// keeps its independent 15% example as requested).
const DEFAULT_ADMINISTRATION_FEE_PERCENT = 14;
let supplierSchemaPromise;
const eventCreationRequests = new Map();
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
        IF COL_LENGTH('dbo.evento_documentos', 'categoria') IS NULL
          ALTER TABLE dbo.evento_documentos ADD categoria varchar(120) NULL;
        IF COL_LENGTH('dbo.evento_tarefas', 'status') IS NULL
          ALTER TABLE dbo.evento_tarefas ADD status varchar(30) NOT NULL CONSTRAINT df_evento_tarefas_status DEFAULT 'pendente';
        IF COL_LENGTH('dbo.eventos', 'descricao') IS NULL
          ALTER TABLE dbo.eventos ADD descricao nvarchar(max) NULL;
        ELSE IF EXISTS (
          SELECT 1
          FROM sys.columns c
          INNER JOIN sys.types t ON t.user_type_id = c.user_type_id
          WHERE c.object_id = OBJECT_ID(N'dbo.eventos')
            AND c.name = N'descricao'
            AND t.name <> N'nvarchar'
        )
          ALTER TABLE dbo.eventos ALTER COLUMN descricao nvarchar(max) NULL;
        IF COL_LENGTH('dbo.eventos', 'mapa_evento') IS NULL
          ALTER TABLE dbo.eventos ADD mapa_evento varchar(max) NULL;
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
    if (!match) throw new Error('Arquivo invÃƒÂ¡lido.');
    const mimeType = match[1].toLowerCase();
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv', 'application/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(mimeType)) throw new Error('Formato nÃƒÂ£o permitido. Use imagem, PDF ou TXT.');
    const fileData = Buffer.from(match[2], 'base64');
    if (fileData.length > MAX_UPLOAD_BYTES) {
      const error = new Error('O arquivo deve ter no máximo 4,5 MB.');
      error.statusCode = 413;
      throw error;
    }
    const extension = mimeType.split('/')[1].replace('jpeg', 'jpg');
    const safeName = String(attachment.name || `anexo.${extension}`).replace(/[^a-z0-9._-]/gi, '_').slice(0, 120);
    const storedName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeName}`;
    const url = await salvarArquivo('chat-attachments', storedName, fileData, mimeType);
    return { url, name: safeName, type: mimeType };
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
  if (!ownerId) return 'em anÃƒÂ¡lise';
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
  if (!documents.length) return 'em anÃƒÂ¡lise';
  if (documents.some(document => String(document.status || '').toLowerCase() === 'recusado')) return 'recusado';
  return 'em anÃƒÂ¡lise';
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
      await db.query(`
        UPDATE i
        SET categoria_ingresso = CASE
          WHEN i.preco_original = lot.preco_meia THEN 'Meia-entrada'
          WHEN i.preco_original = lot.preco_inteira THEN 'Inteira'
          ELSE NULLIF(TRIM(lot.tipo_ingresso), '')
        END
        FROM dbo.ingressos_emitidos i
        OUTER APPLY (
          SELECT TOP (1) el.tipo_ingresso, el.preco_meia, el.preco_inteira
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (
              LEFT(LTRIM(RTRIM(el.nome)), 1) = LEFT(LTRIM(RTRIM(i.lote_nome)), 1)
              OR i.lote_nome IS NULL
            )
          ORDER BY CASE
            WHEN i.preco_original = el.preco_meia OR i.preco_original = el.preco_inteira THEN 0
            WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 1
            ELSE 2
          END, el.id
        ) lot
        WHERE NULLIF(TRIM(i.categoria_ingresso), '') IS NULL
      `);
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

function ensureResaleSchema() {
        if (!resaleSchemaPromise) {
          resaleSchemaPromise = (async () => {
            if (await db.query("SELECT OBJECT_ID('dbo.revendas', 'U') AS id").then(([rows]) => !rows[0]?.id)) {
              await db.query(`
                CREATE TABLE dbo.revendas (
                  id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_revendas PRIMARY KEY,
                  ingresso_id int NOT NULL,
                  vendedor_id int NOT NULL,
                  evento_id int NOT NULL,
                  preco_original decimal(10,2) NOT NULL,
                  taxa_percentual decimal(5,2) NOT NULL,
                  taxa_nome varchar(20) NOT NULL,
                  prioridade int NOT NULL,
                  taxa_administracao_percentual decimal(5,2) NOT NULL CONSTRAINT df_revendas_taxa_admin DEFAULT 14,
                  taxa_administracao_valor decimal(10,2) NOT NULL CONSTRAINT df_revendas_valor_taxa_admin DEFAULT 0,
                  status varchar(20) NOT NULL CONSTRAINT df_revendas_status DEFAULT 'disponivel',
                  anunciado_em datetime2(0) NOT NULL CONSTRAINT df_revendas_anunciado DEFAULT SYSUTCDATETIME(),
                  vendido_em datetime2(0) NULL,
                  CONSTRAINT uq_revendas_ingresso_ativo UNIQUE (ingresso_id, status)
                );
                CREATE INDEX idx_revendas_fila ON dbo.revendas(evento_id, status, prioridade DESC, preco_original ASC, anunciado_em ASC, id ASC);
                CREATE TABLE dbo.repasse_revendas (
                  id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_repasse_revendas PRIMARY KEY,
                  revenda_id int NOT NULL,
                  vendedor_id int NOT NULL,
                  comprador_id int NOT NULL,
                  ingresso_antigo_id int NOT NULL,
                  ingresso_novo_id int NOT NULL,
                  valor_bruto decimal(10,2) NOT NULL,
                  taxa_percentual decimal(5,2) NOT NULL,
                  valor_taxa decimal(10,2) NOT NULL,
                  valor_taxa_administracao decimal(10,2) NOT NULL CONSTRAINT df_repasse_taxa_admin DEFAULT 0,
                  valor_liquido decimal(10,2) NOT NULL,
                  valor_cobranca decimal(10,2) NULL,
                  lucro_empresa decimal(10,2) NULL,
                  criado_em datetime2(0) NOT NULL CONSTRAINT df_repasse_revendas_criado DEFAULT SYSUTCDATETIME()
                );
              `);
            }
            if (await db.query("SELECT OBJECT_ID('dbo.wallet_lancamentos', 'U') AS id").then(([rows]) => !rows[0]?.id)) {
              await db.query(`
                CREATE TABLE dbo.wallet_lancamentos (
                  id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_wallet_lancamentos PRIMARY KEY,
                  usuario_id int NOT NULL,
                  tipo varchar(20) NOT NULL,
                  status varchar(20) NOT NULL,
                  valor decimal(10,2) NOT NULL,
                  repasse_id int NULL,
                  referencia varchar(80) NULL,
                  criado_em datetime2(0) NOT NULL CONSTRAINT df_wallet_lancamentos_criado DEFAULT SYSUTCDATETIME(),
                  disponibilizado_em datetime2(0) NULL,
                  CONSTRAINT uq_wallet_lancamento_repasse UNIQUE (repasse_id, tipo)
                );
                CREATE INDEX idx_wallet_usuario_status ON dbo.wallet_lancamentos(usuario_id, status, criado_em DESC);
              `);
            }
            if (await db.query("SELECT OBJECT_ID('dbo.saques_pix', 'U') AS id").then(([rows]) => !rows[0]?.id)) {
              await db.query(`
                CREATE TABLE dbo.saques_pix (
                  id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_saques_pix PRIMARY KEY,
                  usuario_id int NOT NULL,
                  valor decimal(10,2) NOT NULL,
                  chave_cpf varchar(11) NOT NULL,
                  status varchar(20) NOT NULL CONSTRAINT df_saques_pix_status DEFAULT 'solicitado',
                  solicitado_em datetime2(0) NOT NULL CONSTRAINT df_saques_pix_solicitado DEFAULT SYSUTCDATETIME(),
                  processado_em datetime2(0) NULL
                );
              `);
            }
            const [repasseColumns] = await db.query(`
              SELECT COL_LENGTH('dbo.repasse_revendas', 'valor_cobranca') AS valor_cobranca,
                     COL_LENGTH('dbo.repasse_revendas', 'lucro_empresa') AS lucro_empresa
            `);
            const repasseExisting = repasseColumns[0] || {};
            if (repasseExisting.valor_cobranca == null) await db.query('ALTER TABLE dbo.repasse_revendas ADD valor_cobranca decimal(10,2) NULL');
            if (repasseExisting.lucro_empresa == null) await db.query('ALTER TABLE dbo.repasse_revendas ADD lucro_empresa decimal(10,2) NULL');
            const [resaleColumns] = await db.query(`
              SELECT COL_LENGTH('dbo.revendas', 'taxa_administracao_percentual') AS taxa_admin_percentual,
                     COL_LENGTH('dbo.revendas', 'taxa_administracao_valor') AS taxa_admin_valor,
                     COL_LENGTH('dbo.repasse_revendas', 'valor_taxa_administracao') AS valor_taxa_admin
            `);
            const resaleExisting = resaleColumns[0] || {};
            if (resaleExisting.taxa_admin_percentual == null) await db.query("ALTER TABLE dbo.revendas ADD taxa_administracao_percentual decimal(5,2) NOT NULL CONSTRAINT df_revendas_taxa_admin_migrated DEFAULT 14");
            if (resaleExisting.taxa_admin_valor == null) await db.query("ALTER TABLE dbo.revendas ADD taxa_administracao_valor decimal(10,2) NOT NULL CONSTRAINT df_revendas_valor_taxa_admin_migrated DEFAULT 0");
            if (resaleExisting.valor_taxa_admin == null) await db.query("ALTER TABLE dbo.repasse_revendas ADD valor_taxa_administracao decimal(10,2) NOT NULL CONSTRAINT df_repasse_taxa_admin_migrated DEFAULT 0");
            await db.query(`
              UPDATE r
              SET r.taxa_administracao_percentual = ?
              FROM dbo.revendas r
              JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
              WHERE i.bilheteria_origem IS NULL OR i.bilheteria_origem = 'Troca Ticket'
            `, [DEFAULT_ADMINISTRATION_FEE_PERCENT]);
            // Existing listings may have been created from the event average. Always restore
            // the price paid for the ticket's lot and modality before displaying or selling it.
            await db.query(`
              UPDATE r
              SET r.preco_original = lot.preco_lote,
                  r.taxa_administracao_valor = lot.preco_lote
                    * CASE WHEN i.bilheteria_origem IS NULL OR i.bilheteria_origem = 'Troca Ticket' THEN ? ELSE 0 END / 100
              FROM dbo.revendas r
              JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
              OUTER APPLY (
                SELECT TOP (1)
                  CASE
                    WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%' THEN COALESCE(el.preco_meia, el.preco / 2)
                    ELSE COALESCE(el.preco_inteira, el.preco)
                  END AS preco_lote
                FROM dbo.evento_lotes el
                WHERE el.evento_id = i.evento_id
                  AND (
                    LEFT(LTRIM(RTRIM(el.nome)), 1) = LEFT(LTRIM(RTRIM(i.lote_nome)), 1)
                    OR i.lote_nome IS NULL
                  )
                  AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
                    OR NULLIF(TRIM(i.setor_nome), '') IS NULL)
                ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
              ) lot
              WHERE lot.preco_lote IS NOT NULL
            `, [DEFAULT_ADMINISTRATION_FEE_PERCENT]);
            const [columns] = await db.query(`
              SELECT COL_LENGTH('dbo.ingressos_emitidos', 'preco_original') AS preco_original,
                     COL_LENGTH('dbo.ingressos_emitidos', 'revoked') AS revoked,
                     COL_LENGTH('dbo.ingressos_emitidos', 'revogado_em') AS revogado_em
            `);
            const existing = columns[0] || {};
            if (existing.preco_original === null) {
              await db.query('ALTER TABLE dbo.ingressos_emitidos ADD preco_original decimal(10,2) NULL');
              await db.query(`
                UPDATE i SET i.preco_original = COALESCE(e.ticket_calculado, 0)
                FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id
                WHERE i.preco_original IS NULL
              `);
            }
            if (existing.revoked === null) await db.query("ALTER TABLE dbo.ingressos_emitidos ADD revoked bit NOT NULL CONSTRAINT df_ingressos_revoked DEFAULT 0");
            if (existing.revogado_em === null) await db.query('ALTER TABLE dbo.ingressos_emitidos ADD revogado_em datetime2(0) NULL');
          })().catch(error => {
            resaleSchemaPromise = null;
            throw error;
          });
        }
  return resaleSchemaPromise;
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
    console.error('[auditoria] NÃƒÂ£o foi possÃƒÂ­vel registrar aÃƒÂ§ÃƒÂ£o:', error.message);
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
      itemType = 'usuario'; itemName = user?.nome || 'Usuário';
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

  const actionLabels = { GET: 'Consulta', POST: 'Cadastro', PUT: 'Atualização', PATCH: 'Atualização', DELETE: 'Exclusão' };
  const actionLabel = actionLabels[request.method] || 'Atividade';
  await audit(`${request.method.toLowerCase()}_${route.replaceAll(' ', '_')}`, `${actionLabel} realizada: ${itemName}.`, itemType, itemName, actor);
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}

function uploadErrorStatus(error) {
  return error?.statusCode === 413 ? 413 : 500;
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 75 * 1024 * 1024) reject(new Error('Payload muito grande (mÃƒÂ¡ximo 75 MB)'));
    });
    request.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        request._auditBody = parsed;
        resolve(parsed);
      } catch {
        reject(new Error('JSON invÃƒÂ¡lido'));
      }
    });
  });
}

function parseMultipart(request) {
  return new Promise((resolve, reject) => {
    const contentType = request.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) return reject(new Error('Boundary nÃƒÂ£o encontrado'));
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

async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  const originalEnd = response.end.bind(response);
  response.end = (chunk, encoding, callback) => {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const isApi = url.pathname.startsWith('/api/');
    if (isMutation && isApi && !shouldSkipGenericAudit(url.pathname) && !request._genericAuditQueued) {
      request._genericAuditQueued = true;
      const auditPromise = auditGenericRequest(request, url).catch(error => {
        console.error('[auditoria] Falha ao registrar auditoria:', error.message);
      });
      if (process.env.VERCEL) waitUntil(auditPromise);
    }
    return originalEnd(chunk, encoding, callback);
  };

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key'
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
      if (file.data.length > MAX_UPLOAD_BYTES) {
        return send(response, 413, { ok: false, message: 'A imagem deve ter no máximo 4,5 MB.' });
      }
      const avatarUrl = await salvarArquivo('avatars', uniqueName, file.data, file.mimetype || 'image/png');
      await db.query('UPDATE usuarios SET foto_perfil = ? WHERE email = ?', [avatarUrl, email]);

      return send(response, 200, { ok: true, avatarUrl, message: 'Foto atualizada com sucesso!' });
    } catch (error) {
      console.error('[usuario] Erro no upload:', error.message);
      return send(response, uploadErrorStatus(error), { ok: false, message: error.statusCode === 413 ? error.message : 'Falha ao salvar a imagem no servidor.' });
    }
  }

  // ===== AUTENTICAÃƒâ€¡ÃƒÆ’O =====
  if (request.method === 'POST' && (url.pathname === '/api/auth/login' || url.pathname === '/api/login')) {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [rows] = await db.query('SELECT id, nome, email, tipo, status, senha_hash, foto_perfil, email_verificado, codigo_verificacao FROM dbo.usuarios WHERE email = ?', [email]);
      
      if (!rows.length || !rows[0].senha_hash || !(await bcrypt.compare(String(body.senha || ''), rows[0].senha_hash))) {
        return send(response, 401, { ok: false, message: 'E-mail ou senha inválidos.' });
      }
      if (rows[0].email_verificado === false || rows[0].email_verificado === 0 || rows[0].codigo_verificacao) {
        return send(response, 403, { ok: false, message: 'E-mail ainda não verificado. Confira sua caixa de entrada.' });
      }
      if (['bloqueado', 'excluida'].includes(String(rows[0].status || '').toLowerCase())) {
        return send(response, 403, { ok: false, message: 'Usuário bloqueado pelo administrador.' });
      }

      return send(response, 200, { ok: true, user: formatUser(rows[0]), session_token: createSessionToken(rows[0]) });
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
      const telefone = normalizePhone(body.telefone);
      if (!body.nome || !/^\S+@\S+\.\S+$/.test(email) || cpf.length !== 11 || !hasValidPhoneLength(telefone) || !body.senha || body.senha.length < 6) {
        return send(response, 400, { ok: false, message: 'Informe nome, e-mail, CPF com 11 nÃƒÂºmeros, telefone com 10 a 15 nÃƒÂºmeros e senha com ao menos 6 caracteres.' });
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
      if (duplicate.length) return send(response, 409, { ok: false, message: 'E-mail ou CPF jÃƒÂ¡ cadastrado.' });
      const codigo = String(crypto.randomInt(100000, 1000000));
      const senhaHash = await bcrypt.hash(body.senha, 10);
      await db.query(
        `INSERT INTO usuarios (nome, email, senha_hash, tipo, cpf, telefone, data_nascimento, genero, status, codigo_verificacao, email_verificado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente_verificacao', ?, FALSE)`,
        [body.nome.trim(), email, senhaHash, 'comprador', cpf, telefone, body.nascimento || null, body.sexo || null, codigo]
      );
      await sendVerificationEmail({ to: email, name: body.nome.trim(), code: codigo });
      return send(response, 201, { ok: true, message: 'Cadastro criado com sucesso! Enviamos um cÃƒÂ³digo de verificaÃƒÂ§ÃƒÂ£o para o seu e-mail.' });
    } catch (error) {
      console.error('[auth] Erro no cadastro:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel concluir o cadastro.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/verificar-codigo') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const codigo = String(body.codigo || '').trim();

      if (!email || !/^\d{6}$/.test(codigo)) {
        return send(response, 400, { ok: false, message: 'Informe um e-mail vÃƒÂ¡lido e um cÃƒÂ³digo de 6 dÃƒÂ­gitos.' });
      }

      const [rows] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil, codigo_verificacao, email_verificado FROM usuarios WHERE email = ? LIMIT 1',
        [email]
      );

      if (!rows.length) {
        return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      }

      const user = rows[0];
      if (String(user.codigo_verificacao || '').trim() !== codigo) {
        return send(response, 400, { ok: false, message: 'CÃƒÂ³digo invÃƒÂ¡lido ou expirado.' });
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
      console.error('[auth] Erro ao verificar cÃƒÂ³digo:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel verificar o cÃƒÂ³digo.' });
    }
  }

  // ===== PERFIL DO USUÃƒÂRIO =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE email = ? LIMIT 1', [normalizeEmail(url.searchParams.get('email'))]);
      return rows.length ? send(response, 200, { ok: true, user: formatUser(rows[0]) }) : send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
    } catch (error) { return send(response, 500, { ok: false, message: 'Erro ao carregar perfil.' }); }
  }

  if (request.method === 'PUT' && url.pathname === '/api/usuario/meu-perfil') {
    try {
      const body = await parseBody(request);
      const emailAtual = normalizeEmail(body.emailAtual || body.currentEmail || body.email);
      const novoEmail = normalizeEmail(body.email || emailAtual);

      if (!emailAtual || !novoEmail) {
        return send(response, 400, { ok: false, message: 'E-mail ÃƒÂ© obrigatÃƒÂ³rio.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
        return send(response, 400, { ok: false, message: 'E-mail invÃƒÂ¡lido.' });
      }

      const [[existingUser]] = await db.query(
        'SELECT id, nome, email, cpf, telefone, genero, data_nascimento, senha_hash FROM dbo.usuarios WHERE email = ?',
        [emailAtual]
      );
      if (!existingUser) {
        return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      }

      if (novoEmail !== emailAtual) {
        const [[emailOwner]] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ?', [novoEmail]);
        if (emailOwner && emailOwner.id !== existingUser.id) {
          return send(response, 409, { ok: false, message: 'Este e-mail jÃƒÂ¡ estÃƒÂ¡ em uso.' });
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
        return send(response, 400, { ok: false, message: 'Nome ÃƒÂ© obrigatÃƒÂ³rio.' });
      }
      if (cpf && cpf.length !== 11) {
        return send(response, 400, { ok: false, message: 'CPF invÃƒÂ¡lido.' });
      }
      if (body.telefone !== undefined && telefone && !hasValidPhoneLength(telefone)) {
        return send(response, 400, { ok: false, message: 'Telefone invÃƒÂ¡lido. Informe de 10 a 15 nÃƒÂºmeros.' });
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

      if (!result.length) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      const [rows] = await db.query('SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status, foto_perfil FROM dbo.usuarios WHERE id = ?', [result[0].id]);
      await audit('atualizacao_perfil', `Perfil de ${nomeCompleto} atualizado.`, 'usuario', result[0].id, rows[0]);
      return send(response, 200, { ok: true, user: formatUser(rows[0]), message: 'Dados atualizados com sucesso.' });
    } catch (error) {
      console.error('[usuario] Erro ao atualizar perfil:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel atualizar o perfil.' });
    }
  }

  // ===== MEUS INGRESSOS =====
  if (request.method === 'GET' && /^\/api\/usuario\/meus-ingressos(?:\/\d+)?$/.test(url.pathname)) {
    try {
      const session = readSessionToken(request);
      const requestedEmail = normalizeEmail(url.searchParams.get('email'));
      if (!session || session.email !== requestedEmail) return send(response, 403, { ok: false, message: 'SessÃƒÂ£o invÃƒÂ¡lida. Entre novamente para acessar seus ingressos.' });
      await ensureTicketSecuritySchema();
      await ensureResaleSchema();
      const ticketId = url.pathname.match(/\/(\d+)$/)?.[1];
      const includeQr = url.searchParams.get('includeQr') === 'true';
      if (ticketId) {
        const [tickets] = await db.query(`
          SELECT TOP (1)
            i.id, i.numero_ingresso, i.qr_code_payload, i.setor_nome AS setor,
            i.codigo_original_bilheteria AS codigo_ingresso,
            i.bilheteria_origem, i.status, i.utilizado_em AS checkinAt,
            CAST(CASE WHEN EXISTS (
              SELECT 1 FROM dbo.repasse_revendas rep
              WHERE rep.ingresso_antigo_id = i.id AND rep.vendedor_id = u.id
            ) THEN 1 ELSE 0 END AS bit) AS repassado,
            COALESCE(i.versao_titularidade, 1) AS versao_titularidade,
            p.codigo_pedido, e.id AS eventId, e.nome AS evento, e.nome AS eventName, e.artista,
            e.[local] AS location, e.imagem, CONVERT(varchar(19), e.data_evento, 126) AS date,
            u.nome AS titular, u.cpf,
            COALESCE(NULLIF(TRIM(i.categoria_ingresso), ''),
              CASE WHEN i.preco_original = l.preco_meia THEN 'Meia-entrada'
                   WHEN i.preco_original = l.preco_inteira THEN 'Inteira' END,
              NULLIF(TRIM(l.tipo_ingresso), '')) AS ticketCategory,
            tp.id AS transferencia_pendente_id,
            COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome,
            CAST(CASE WHEN tr.id IS NULL THEN 0 ELSE 1 END AS bit) AS transferido,
            COALESCE(NULLIF(TRIM(u3.nome), ''), u3.email) AS destinatario_transferencia_nome
          FROM dbo.ingressos_emitidos i
          JOIN dbo.usuarios u ON u.id = i.comprador_id
          JOIN dbo.eventos e ON e.id = i.evento_id
          LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
          LEFT JOIN dbo.transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
          LEFT JOIN dbo.usuarios u2 ON u2.id = tp.destinatario_id
          OUTER APPLY (
            SELECT TOP (1) accepted.id, accepted.destinatario_id
            FROM dbo.transferencias_pendentes accepted
            WHERE accepted.ingresso_id = i.id AND accepted.status = 'aceita'
            ORDER BY accepted.id DESC
          ) tr
          LEFT JOIN dbo.usuarios u3 ON u3.id = tr.destinatario_id
          OUTER APPLY (
            SELECT TOP (1) el.tipo_ingresso, el.preco_meia, el.preco_inteira
            FROM dbo.evento_lotes el
            WHERE el.evento_id = i.evento_id
              AND (
                LEFT(LTRIM(RTRIM(el.nome)), 1) = LEFT(LTRIM(RTRIM(i.lote_nome)), 1)
                OR i.lote_nome IS NULL
              )
            ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
          ) l
          WHERE i.id = ? AND u.email = ? AND i.status NOT IN ('cancelado', 'bloqueado')
            AND (
              ISNULL(i.revoked, 0) = 0
              OR EXISTS (
                SELECT 1 FROM dbo.repasse_revendas rep
                WHERE rep.ingresso_antigo_id = i.id AND rep.vendedor_id = u.id
              )
            )
        `, [Number(ticketId), requestedEmail]);
        if (!tickets.length) return send(response, 404, { ok: false, message: 'Ingresso nÃƒÂ£o encontrado.' });
        const ticket = tickets[0];
        ticket.imagem = eventImageResponse(ticket.imagem, ticket.eventId, 'imagem', eventImageVersion(ticket.imagem));
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
          return send(response, 400, { ok: false, message: 'Cursor de paginaÃƒÂ§ÃƒÂ£o invÃƒÂ¡lido.' });
        }
      }
      const cursorClause = cursor ? 'AND (i.emitido_em < ? OR (i.emitido_em = ? AND i.id < ?))' : '';
      const queryParams = cursor
        ? [limit, requestedEmail, cursor.emittedAt, cursor.emittedAt, cursor.id]
        : [limit, requestedEmail];
      const [tickets] = await db.query(`
        SELECT 
          TOP (?)
          i.id, i.numero_ingresso, i.evento_id AS eventId,
          i.codigo_original_bilheteria AS codigo_ingresso,
          COALESCE(lot.preco_lote, i.preco_original, e.ticket_calculado) AS preco_original,
          i.lote_nome, i.setor_nome AS setor, i.bilheteria_origem,
          i.status, i.utilizado_em AS checkinAt,
          CAST(CASE WHEN EXISTS (
            SELECT 1 FROM dbo.repasse_revendas rep
            WHERE rep.ingresso_antigo_id = i.id AND rep.vendedor_id = u.id
          ) THEN 1 ELSE 0 END AS bit) AS repassado,
          COALESCE(i.versao_titularidade, 1) AS versao_titularidade,
          p.codigo_pedido, e.nome AS evento, e.nome AS eventName, e.artista,
          e.[local] AS location, e.imagem,
          CONVERT(varchar(19), e.data_evento, 126) AS date,
          CONVERT(varchar(19), i.emitido_em, 126) AS emittedAt,
          u.nome AS titular, u.cpf, tp.id AS transferencia_pendente_id,
          COALESCE(NULLIF(TRIM(i.categoria_ingresso), ''),
            CASE WHEN COALESCE(i.preco_original, e.ticket_calculado) = l.preco_meia THEN 'Meia-entrada'
                 WHEN COALESCE(i.preco_original, e.ticket_calculado) = l.preco_inteira THEN 'Inteira' END,
            NULLIF(TRIM(l.tipo_ingresso), '')) AS ticketCategory,
          COALESCE(NULLIF(TRIM(u2.nome), ''), u2.email) AS destinatario_pendente_nome
          ,CAST(CASE WHEN tr.id IS NULL THEN 0 ELSE 1 END AS bit) AS transferido,
          COALESCE(NULLIF(TRIM(u3.nome), ''), u3.email) AS destinatario_transferencia_nome
        FROM dbo.ingressos_emitidos i
        JOIN dbo.usuarios u ON u.id = i.comprador_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
        LEFT JOIN dbo.transferencias_pendentes tp ON tp.ingresso_id = i.id AND tp.status = 'pendente'
        LEFT JOIN dbo.usuarios u2 ON u2.id = tp.destinatario_id
        OUTER APPLY (
          SELECT TOP (1) accepted.id, accepted.destinatario_id
          FROM dbo.transferencias_pendentes accepted
          WHERE accepted.ingresso_id = i.id AND accepted.status = 'aceita'
          ORDER BY accepted.id DESC
        ) tr
        LEFT JOIN dbo.usuarios u3 ON u3.id = tr.destinatario_id
        OUTER APPLY (
          SELECT TOP (1) el.tipo_ingresso, el.preco_meia, el.preco_inteira
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (
              LEFT(LTRIM(RTRIM(el.nome)), 1) = LEFT(LTRIM(RTRIM(i.lote_nome)), 1)
              OR i.lote_nome IS NULL
            )
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
        ) l
        OUTER APPLY (
          SELECT TOP (1)
            CASE
              WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%' THEN COALESCE(el.preco_meia, el.preco / 2)
              ELSE COALESCE(el.preco_inteira, el.preco)
            END AS preco_lote
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') OR i.lote_nome IS NULL)
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR NULLIF(TRIM(i.setor_nome), '') IS NULL)
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
        ) lot
        WHERE u.email = ? AND i.status NOT IN ('cancelado', 'bloqueado')
          AND (
            ISNULL(i.revoked, 0) = 0
            OR EXISTS (
              SELECT 1 FROM dbo.repasse_revendas rep
              WHERE rep.ingresso_antigo_id = i.id AND rep.vendedor_id = u.id
            )
          ) ${cursorClause}
        ORDER BY i.emitido_em DESC, i.id DESC
      `, queryParams);
      const last = tickets[tickets.length - 1];
      tickets.forEach(ticket => {
        ticket.imagem = eventImageResponse(ticket.imagem, ticket.eventId, 'imagem', eventImageVersion(ticket.imagem));
      });
      const nextCursor = tickets.length === limit && last && last.emittedAt
        ? Buffer.from(JSON.stringify({ emittedAt: last.emittedAt, id: Number(last.id) })).toString('base64url')
        : null;
      return send(response, 200, { ok: true, tickets, nextCursor, hasMore: Boolean(nextCursor) });
    } catch (error) { 
      console.error('[usuario] Erro nos ingressos:', error.message); 
      return send(response, 500, { ok: false, message: 'Erro ao carregar ingressos.' }); 
    }
  }

  // ===== REVENDA P2P =====
  if (request.method === 'GET' && url.pathname === '/api/revenda/fila') {
    try {
      await ensureResaleSchema();
      const eventId = Number(url.searchParams.get('evento_id'));
      if (!Number.isInteger(eventId) || eventId <= 0) return send(response, 400, { ok: false, message: 'Evento inválido.' });
      const [listings] = await db.query(`
        SELECT r.id, r.ingresso_id, r.evento_id, r.preco_original, r.taxa_percentual,
          r.taxa_nome, r.anunciado_em, i.lote_nome, i.setor_nome,
          current_lot.nome AS lote_vigente,
          CASE WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
            THEN COALESCE(current_lot.preco_meia, current_lot.preco / 2)
            ELSE COALESCE(current_lot.preco_inteira, current_lot.preco)
          END AS preco_vigente,
          COALESCE(NULLIF(TRIM(i.categoria_ingresso), ''),
            CASE WHEN i.preco_original = l.preco_meia THEN 'Meia-entrada'
                 WHEN i.preco_original = l.preco_inteira THEN 'Inteira' END,
            NULLIF(TRIM(l.tipo_ingresso), '')) AS categoria_ingresso
        FROM dbo.revendas r
        JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
        OUTER APPLY (
          SELECT TOP (1) el.nome, el.preco, el.preco_inteira, el.preco_meia
          FROM dbo.evento_lotes el
          WHERE el.evento_id = r.evento_id
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR (NULLIF(TRIM(el.setor_nome), '') IS NULL AND NULLIF(TRIM(i.setor_nome), '') IS NULL))
            AND (el.data_inicio IS NULL OR el.data_inicio <= SYSUTCDATETIME())
            AND (el.data_fim IS NULL OR el.data_fim > SYSUTCDATETIME())
          ORDER BY
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL THEN 1 ELSE 0 END,
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL
              THEN TRY_CONVERT(int, LEFT(SUBSTRING(el.nome, PATINDEX('%[0-9]%', el.nome), 10), 1))
              ELSE 0 END ASC,
            COALESCE(el.data_inicio, el.criado_em) DESC, el.id DESC
        ) current_lot
        OUTER APPLY (
          SELECT TOP (1) el.tipo_ingresso, el.preco_meia, el.preco_inteira
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') OR i.lote_nome IS NULL)
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
        ) l
        WHERE r.evento_id = ? AND r.status = 'disponivel'
        ORDER BY i.setor_nome ASC, r.prioridade DESC, r.preco_original ASC, r.anunciado_em ASC, r.id ASC
      `, [eventId]);
      return send(response, 200, { ok: true, listings });
    } catch (error) {
      console.error('[revenda] Erro ao carregar fila:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar a fila de revenda.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/revenda/anunciar') {
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Entre na sua conta para anunciar um ingresso.' });
      const body = await parseBody(request);
      const feeKey = String(body.taxa || '').trim().toLowerCase();
      const fee = RESALE_FEES[feeKey];
      const ticketId = Number(body.ingresso_id);
      if (!fee || !Number.isInteger(ticketId) || ticketId <= 0) {
        return send(response, 400, { ok: false, message: 'Selecione um ingresso e uma taxa de repasse válida.' });
      }
      const [[ticket]] = await db.query(`
        SELECT i.id, i.comprador_id, i.evento_id, i.status, i.revoked, i.bilheteria_origem,
          COALESCE(lot.preco_lote, i.preco_original, e.ticket_calculado) AS preco_original,
          COALESCE(NULLIF(TRIM(i.categoria_ingresso), ''),
            CASE WHEN i.preco_original = l.preco_meia THEN 'Meia-entrada'
                 WHEN i.preco_original = l.preco_inteira THEN 'Inteira' END,
            NULLIF(TRIM(l.tipo_ingresso), '')) AS categoria_ingresso
        FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id
        OUTER APPLY (
          SELECT TOP (1) el.tipo_ingresso, el.preco_meia, el.preco_inteira
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') OR i.lote_nome IS NULL)
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
        ) l
        OUTER APPLY (
          SELECT TOP (1)
            CASE
              WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%' THEN COALESCE(el.preco_meia, el.preco / 2)
              ELSE COALESCE(el.preco_inteira, el.preco)
            END AS preco_lote
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') OR i.lote_nome IS NULL)
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR NULLIF(TRIM(i.setor_nome), '') IS NULL)
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
        ) lot
        WHERE i.id = ? AND i.comprador_id = ?
      `, [ticketId, session.sub]);
      if (!ticket || ticket.status !== 'ativo' || ticket.revoked) return send(response, 409, { ok: false, message: 'Este ingresso não está disponível para revenda.' });
      if (!ticket.categoria_ingresso) return send(response, 409, { ok: false, message: 'A categoria deste ingresso não foi identificada. Ele precisa ser validado antes da revenda.' });
      const [[existing]] = await db.query("SELECT id FROM dbo.revendas WHERE ingresso_id = ? AND status = 'disponivel'", [ticketId]);
      if (existing) return send(response, 409, { ok: false, message: 'Este ingresso já está anunciado na revenda.' });
      const administrationFeePercent = ticket.bilheteria_origem && ticket.bilheteria_origem !== 'Troca Ticket'
        ? 0
        : DEFAULT_ADMINISTRATION_FEE_PERCENT;
      const administrationFee = Number(ticket.preco_original || 0) * administrationFeePercent / 100;
      const [rows] = await db.query(`
        INSERT INTO dbo.revendas
          (ingresso_id, vendedor_id, evento_id, preco_original, taxa_percentual, taxa_nome, prioridade,
           taxa_administracao_percentual, taxa_administracao_valor)
        OUTPUT INSERTED.id
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [ticketId, session.sub, ticket.evento_id, Number(ticket.preco_original || 0), fee.percent, fee.label, fee.priority, administrationFeePercent, administrationFee]);
      return send(response, 201, {
        ok: true,
        revenda_id: rows[0].id,
        preco_original: Number(ticket.preco_original || 0),
        categoria_ingresso: ticket.categoria_ingresso,
        taxa: fee
      });
    } catch (error) {
      console.error('[revenda] Erro ao anunciar:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível anunciar o ingresso.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/revenda/meus-anuncios') {
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida.' });
      const [listings] = await db.query(`
        WITH fila AS (
          SELECT r.id,
            ROW_NUMBER() OVER (
              PARTITION BY r.evento_id, i.setor_nome, i.categoria_ingresso
              ORDER BY r.prioridade DESC, r.preco_original ASC, r.anunciado_em ASC, r.id ASC
              ) AS posicao,
              COUNT(*) OVER (PARTITION BY r.evento_id, i.setor_nome, i.categoria_ingresso) AS total_fila
          FROM dbo.revendas r
          JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
          WHERE r.status = 'disponivel'
        )
        SELECT r.id, r.ingresso_id, r.evento_id,
          COALESCE(paid_lot.preco_lote, r.preco_original) AS preco_original,
          r.taxa_percentual,
          r.taxa_nome, r.prioridade, r.status, r.anunciado_em, r.vendido_em,
          CAST(CASE WHEN i.bilheteria_id IS NULL OR i.bilheteria_origem = 'Troca Ticket'
            THEN 14 ELSE 0 END AS decimal(5,2)) AS taxa_administracao_percentual,
          CAST(CASE WHEN i.bilheteria_id IS NULL OR i.bilheteria_origem = 'Troca Ticket'
            THEN COALESCE(paid_lot.preco_lote, r.preco_original) * 14 / 100 ELSE 0 END AS decimal(10,2)) AS taxa_administracao_valor,
          CAST(COALESCE(f.posicao, 1) AS int) AS posicao,
          CAST(COALESCE(f.total_fila, 1) AS int) AS total_fila,
          e.nome AS evento, i.numero_ingresso, i.lote_nome, i.setor_nome,
          i.bilheteria_id, i.bilheteria_origem,
          current_lot.nome AS lote_vigente,
          CASE WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
            THEN COALESCE(current_lot.preco_meia, current_lot.preco / 2)
            ELSE COALESCE(current_lot.preco_inteira, current_lot.preco)
          END AS preco_vigente,
          i.categoria_ingresso AS categoria_ingresso,
          rr.valor_liquido, rr.valor_cobranca, rr.lucro_empresa, rr.criado_em AS repassado_em
        FROM dbo.revendas r
        JOIN dbo.eventos e ON e.id = r.evento_id
        JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
        LEFT JOIN fila f ON f.id = r.id
        OUTER APPLY (
          SELECT TOP (1)
            CASE
              WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
                THEN COALESCE(el.preco_meia, el.preco / 2)
              ELSE COALESCE(el.preco_inteira, el.preco)
            END AS preco_lote
          FROM dbo.evento_lotes el
          WHERE el.evento_id = i.evento_id
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR NULLIF(TRIM(i.setor_nome), '') IS NULL)
          ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END,
            COALESCE(el.data_inicio, el.criado_em), el.id
        ) paid_lot
        OUTER APPLY (
          SELECT TOP (1) el.nome, el.preco, el.preco_inteira, el.preco_meia
          FROM dbo.evento_lotes el
          WHERE el.evento_id = r.evento_id
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR (NULLIF(TRIM(el.setor_nome), '') IS NULL AND NULLIF(TRIM(i.setor_nome), '') IS NULL))
            AND (el.data_inicio IS NULL OR el.data_inicio <= SYSUTCDATETIME())
            AND (el.data_fim IS NULL OR el.data_fim > SYSUTCDATETIME())
          ORDER BY
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL THEN 1 ELSE 0 END,
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL
              THEN TRY_CONVERT(int, LEFT(SUBSTRING(el.nome, PATINDEX('%[0-9]%', el.nome), 10), 1))
              ELSE 0 END ASC,
            COALESCE(el.data_inicio, el.criado_em) DESC, el.id DESC
        ) current_lot
        OUTER APPLY (
          SELECT TOP (1) rep.valor_liquido, rep.valor_cobranca, rep.lucro_empresa, rep.criado_em
          FROM dbo.repasse_revendas rep
          WHERE rep.revenda_id = r.id
          ORDER BY rep.id DESC
        ) rr
        WHERE r.vendedor_id = ?
        ORDER BY CASE WHEN r.status = 'disponivel' THEN 0 ELSE 1 END,
          COALESCE(r.vendido_em, r.anunciado_em) DESC, r.id DESC
      `, [session.sub]);
      return send(response, 200, { ok: true, listings });
    } catch (error) {
      console.error('[revenda] Erro ao carregar anúncios do usuário:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar seus anúncios.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/revenda\/\d+$/.test(url.pathname)) {
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida.' });
      const resaleId = Number(url.pathname.split('/').pop());
      const [, result] = await db.query("UPDATE dbo.revendas SET status = 'cancelada' WHERE id = ? AND vendedor_id = ? AND status = 'disponivel'", [resaleId, session.sub]);
      if (!result.affectedRows) return send(response, 404, { ok: false, message: 'Anúncio não encontrado ou já processado.' });
      return send(response, 200, { ok: true, message: 'Anúncio retirado da fila.' });
    } catch (error) {
      console.error('[revenda] Erro ao cancelar anúncio:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível retirar o anúncio.' });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/revenda\/\d+\/prioridade$/.test(url.pathname)) {
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida.' });
      const resaleId = Number(url.pathname.split('/')[3]);
      const body = await parseBody(request);
      const requestedFee = body.taxa ?? body.prioridade ?? body.fee;
      const nextFee = RESALE_FEES[String(requestedFee || '').trim().toLowerCase()];
      if (!nextFee) return send(response, 400, { ok: false, message: 'Selecione uma prioridade válida.' });
      const [[listing]] = await db.query(
        'SELECT id, taxa_percentual, preco_original, status FROM dbo.revendas WHERE id = ? AND vendedor_id = ?',
        [resaleId, session.sub]
      );
      if (!listing || listing.status !== 'disponivel') return send(response, 404, { ok: false, message: 'Anúncio ativo não encontrado.' });
      const difference = Number(listing.preco_original) * (nextFee.percent - Number(listing.taxa_percentual)) / 100;
      const [, updateResult] = await db.query(`
        UPDATE dbo.revendas
        SET taxa_percentual = ?, taxa_nome = ?, prioridade = ?
        WHERE id = ? AND status = 'disponivel'
      `, [nextFee.percent, nextFee.label, nextFee.priority, resaleId]);
      if (!updateResult.affectedRows) return send(response, 404, { ok: false, message: 'Anúncio ativo não encontrado.' });
      return send(response, 200, {
        ok: true,
        message: `Prioridade alterada para ${nextFee.label} (${nextFee.percent}%). O novo posicionamento já foi aplicado à fila.`,
        diferenca_repasse: difference,
        taxa: nextFee
      });
    } catch (error) {
      console.error('[revenda] Erro ao alterar taxa:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível alterar a taxa.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/revenda/comprar') {
    const connection = await db.getConnection();
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Entre na sua conta para comprar.' });
      const body = await parseBody(request);
      const eventId = Number(body.evento_id);
      const requestedSector = String(body.setor_nome || '').trim();
      const requestedCategory = String(body.categoria_ingresso || '').trim();
      if (!Number.isInteger(eventId) || eventId <= 0) return send(response, 400, { ok: false, message: 'Evento inválido.' });
      await connection.beginTransaction();
      const [[buyer]] = await connection.query('SELECT id, nome, cpf FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
      const [[listing]] = await connection.query(`
        SELECT TOP (1) r.*, i.numero_ingresso, i.codigo_original_bilheteria, i.qr_code_payload,
          i.secret_key, i.setor_nome, i.lote_nome, i.categoria_ingresso,
          current_lot.nome AS lote_vigente,
          CASE WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
            THEN COALESCE(current_lot.preco_meia, current_lot.preco / 2)
            ELSE COALESCE(current_lot.preco_inteira, current_lot.preco)
          END AS valor_cobranca
        FROM dbo.revendas r WITH (UPDLOCK, ROWLOCK)
        JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
        OUTER APPLY (
          SELECT TOP (1) el.nome, el.preco, el.preco_inteira, el.preco_meia
          FROM dbo.evento_lotes el
          WHERE el.evento_id = r.evento_id
            AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
              OR (NULLIF(TRIM(el.setor_nome), '') IS NULL AND NULLIF(TRIM(i.setor_nome), '') IS NULL))
            AND (el.data_inicio IS NULL OR el.data_inicio <= SYSUTCDATETIME())
            AND (el.data_fim IS NULL OR el.data_fim > SYSUTCDATETIME())
          ORDER BY
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL THEN 1 ELSE 0 END,
            CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL
              THEN TRY_CONVERT(int, LEFT(SUBSTRING(el.nome, PATINDEX('%[0-9]%', el.nome), 10), 1))
              ELSE 0 END ASC,
            COALESCE(el.data_inicio, el.criado_em) DESC, el.id DESC
        ) current_lot
        WHERE r.evento_id = ? AND r.status = 'disponivel' AND i.status = 'ativo' AND ISNULL(i.revoked, 0) = 0
          AND (? = '' OR COALESCE(i.setor_nome, '') = ?)
          AND (? = '' OR COALESCE(i.categoria_ingresso, '') = ?)
        ORDER BY r.prioridade DESC, r.preco_original ASC, r.anunciado_em ASC, r.id ASC
      `, [eventId, requestedSector, requestedSector, requestedCategory, requestedCategory]);
      if (!buyer || !listing) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Não há ingressos disponíveis na fila de revenda para este evento.' });
      }
      if (Number(listing.vendedor_id) === Number(buyer.id)) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'O vendedor não pode comprar o próprio anúncio.' });
      }
      const codigoPedido = makeCode('PED');
      const [orderRows] = await connection.query(
        `INSERT INTO dbo.pedidos (codigo_pedido, comprador_id, valor_total, status) OUTPUT INSERTED.id VALUES (?, ?, ?, 'aprovado')`,
        [codigoPedido, buyer.id, Number(listing.valor_cobranca || listing.preco_original)]
      );
      const pedidoId = orderRows[0].id;
      const newNumber = makeCode('TKT');
      const newSecret = makeTicketSecret();
      const newQr = makeActiveTicketPayload(newNumber, newSecret);
      const [newTicketRows] = await connection.query(`
        INSERT INTO dbo.ingressos_emitidos
          (pedido_id, comprador_id, evento_id, bilheteria_id, bilheteria_origem, setor_nome, lote_nome, categoria_ingresso,
           numero_ingresso, codigo_original_bilheteria, qr_code_payload, secret_key, preco_original, versao_titularidade, status, revoked)
        OUTPUT INSERTED.id VALUES (?, ?, ?, NULL, 'Revenda P2P', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo', 0)
      `, [pedidoId, buyer.id, eventId, listing.setor_nome, listing.lote_vigente || listing.lote_nome, listing.categoria_ingresso, newNumber,
        listing.codigo_original_bilheteria, newQr, newSecret, Number(listing.valor_cobranca || listing.preco_original), Number(listing.versao_titularidade || 1) + 1]);
      const newTicketId = newTicketRows[0].id;
      await connection.query("UPDATE dbo.ingressos_emitidos SET status = 'revogado', revoked = 1, revogado_em = SYSUTCDATETIME() WHERE id = ? AND status = 'ativo'", [listing.ingresso_id]);
      const payout = calculateResalePayout({
        lotPrice: listing.preco_original,
        priorityPercent: listing.taxa_percentual,
        administrationFee: 0
      });
      await connection.query("UPDATE dbo.revendas SET status = 'vendida', vendido_em = SYSUTCDATETIME() WHERE id = ? AND status = 'disponivel'", [listing.id]);
      const [repasseRows] = await connection.query(`
        INSERT INTO dbo.repasse_revendas
          (revenda_id, vendedor_id, comprador_id, ingresso_antigo_id, ingresso_novo_id, valor_bruto, taxa_percentual, valor_taxa, valor_taxa_administracao, valor_liquido, valor_cobranca, lucro_empresa)
        OUTPUT INSERTED.id
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [listing.id, listing.vendedor_id, buyer.id, listing.ingresso_id, newTicketId, listing.preco_original, listing.taxa_percentual, payout.priorityFee, 0, payout.payout, Number(listing.valor_cobranca || listing.preco_original), Math.max(Number(listing.valor_cobranca || listing.preco_original) - Number(listing.preco_original) + payout.priorityFee, 0)]);
      await connection.query(`
        INSERT INTO dbo.wallet_lancamentos (usuario_id, tipo, status, valor, repasse_id, referencia)
        SELECT vendedor_id, 'credito', 'pendente', valor_liquido, id, 'revenda'
        FROM dbo.repasse_revendas WHERE id = ?
      `, [repasseRows[0].id]);
      await connection.commit();
      return send(response, 201, {
        ok: true, pedido_id: pedidoId, ingresso_id: newTicketId, valor: Number(listing.valor_cobranca || listing.preco_original), setor_nome: listing.setor_nome,
        repasse: { vendedor_id: listing.vendedor_id, taxa: Number(listing.taxa_percentual), valor_liquido: payout.payout, taxa_administracao_devolvida: payout.administrationFee }
      });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[revenda] Erro na compra:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível concluir a compra de revenda.' });
    } finally {
      connection.release();
    }
  }

  // ===== CARTEIRA E SAQUE PIX =====
  if (request.method === 'GET' && url.pathname === '/api/wallet') {
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida.' });

      // A liberação exige check-in confirmado e uma janela adicional de 24 horas.
      await db.query(`
        UPDATE w SET status = 'disponivel', disponibilizado_em = SYSUTCDATETIME()
        FROM dbo.wallet_lancamentos w
        JOIN dbo.repasse_revendas r ON r.id = w.repasse_id
        JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_novo_id
        JOIN dbo.eventos e ON e.id = i.evento_id
        WHERE w.usuario_id = ? AND w.tipo = 'credito' AND w.status = 'pendente'
          AND i.utilizado_em IS NOT NULL
          AND e.data_fim IS NOT NULL
          AND DATEADD(hour, 24, e.data_fim) <= SYSUTCDATETIME()
      `, [session.sub]);
      const [[summary]] = await db.query(`
        SELECT
          COALESCE(SUM(CASE WHEN tipo = 'credito' AND status = 'pendente' THEN valor ELSE 0 END), 0) AS pendente,
          COALESCE(SUM(CASE WHEN tipo = 'credito' AND status = 'disponivel' THEN valor ELSE 0 END), 0)
            - COALESCE(SUM(CASE WHEN tipo = 'debito' AND status IN ('solicitado', 'processado') THEN valor ELSE 0 END), 0) AS disponivel
        FROM dbo.wallet_lancamentos WHERE usuario_id = ?
      `, [session.sub]);
      const [entries] = await db.query(`
        SELECT TOP (50) id, tipo, status, valor, criado_em, disponibilizado_em
        FROM dbo.wallet_lancamentos WHERE usuario_id = ?
        ORDER BY criado_em DESC, id DESC
      `, [session.sub]);
      return send(response, 200, { ok: true, wallet: { pendente: Number(summary.pendente), disponivel: Number(summary.disponivel), entries } });
    } catch (error) {
      console.error('[wallet] Erro ao carregar carteira:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar a carteira.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/wallet/saques/pix') {
    const connection = await db.getConnection();
    try {
      await ensureResaleSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida.' });
      const body = await parseBody(request);
      const amount = Number(body.valor);
      const cpfPix = normalizeCpf(body.cpf);
      if (!Number.isFinite(amount) || amount <= 0 || !cpfPix) {
        return send(response, 400, { ok: false, message: 'Informe um valor e o CPF da chave PIX.' });
      }
      await connection.beginTransaction();
      const [[user]] = await connection.query('SELECT id, cpf FROM dbo.usuarios WHERE id = ?', [session.sub]);
      if (!user || normalizeCpf(user.cpf) !== cpfPix) {
        await connection.rollback();
        return send(response, 403, { ok: false, message: 'A chave PIX deve ser um CPF da mesma titularidade da conta.' });
      }
      const [[balance]] = await connection.query(`
        SELECT COALESCE(SUM(CASE WHEN tipo = 'credito' AND status = 'disponivel' THEN valor ELSE 0 END), 0)
          - COALESCE(SUM(CASE WHEN tipo = 'debito' AND status IN ('solicitado', 'processado') THEN valor ELSE 0 END), 0) AS disponivel
        FROM dbo.wallet_lancamentos WHERE usuario_id = ?
      `, [session.sub]);
      if (amount > Number(balance.disponivel)) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Saldo disponível insuficiente.' });
      }
      const [withdrawal] = await connection.query(`
        INSERT INTO dbo.saques_pix (usuario_id, valor, chave_cpf)
        OUTPUT INSERTED.id VALUES (?, ?, ?)
      `, [session.sub, amount, cpfPix]);
      await connection.query(`
        INSERT INTO dbo.wallet_lancamentos (usuario_id, tipo, status, valor, referencia)
        VALUES (?, 'debito', 'solicitado', ?, ?)
      `, [session.sub, amount, `saque_pix:${withdrawal[0].id}`]);
      await connection.commit();
      return send(response, 201, { ok: true, saque_id: withdrawal[0].id, status: 'solicitado', message: 'Saque PIX solicitado para processamento.' });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[wallet] Erro no saque PIX:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível solicitar o saque PIX.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingresso/download-offline') {
    try {
      const body = await parseBody(request);
      const ticketId = Number(body.ingresso_id);
      if (!Number.isInteger(ticketId) || ticketId <= 0) {
        return send(response, 400, { ok: false, message: 'ID de ingresso invÃƒÂ¡lido.' });
      }
      const result = await getTicketForSession(request, ticketId);
      if (result.error) return send(response, result.error.status, { ok: false, message: result.error.message });

      const { ticket } = result;
      const eventDate = new Date(ticket.eventDate);
      if (Number.isNaN(eventDate.getTime())) return send(response, 400, { ok: false, message: 'A data do evento nÃƒÂ£o estÃƒÂ¡ configurada.' });
      const expiresAt = new Date(ticket.eventEndDate);
      if (!ticket.eventEndDate || Number.isNaN(expiresAt.getTime())) {
        return send(response, 409, { ok: false, message: 'O horÃƒÂ¡rio oficial de encerramento do evento ainda nÃƒÂ£o foi configurado.' });
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
        console.error('[google wallet] NÃƒÂ£o foi possÃƒÂ­vel gerar o link para o e-mail:', error.message);
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
          text: `Olá ${ticket.holder || 'titular'},\n\nSeu ingresso para ${ticket.eventName} está pronto. Baixe o anexo antes do evento e abra-o no navegador do celular; o QR continuará atualizando a cada 60 segundos mesmo sem internet.\n\nValidade do Código QR Offline: ativo até ao término oficial do evento em ${formatEmailDateTime(expiresAt)}.${walletUrl ? `\n\nAdicionar à Carteira do Google: ${walletUrl}` : ''}\n\nDúvidas ou suporte: ${process.env.TROCATICKET_SUPPORT_URL || 'https://trocaticket.com/suporte'}\n\nNão responda a este e-mail. Este é um e-mail automático enviado pela plataforma Troca Ticket.`,
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
        message: transporter ? 'Pacote offline enviado por e-mail.' : 'Pacote offline preparado em modo de demonstração; SMTP não configurado.'
      });
    } catch (error) {
      console.error('[ingresso offline] Falha ao preparar pacote:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel preparar o pacote offline.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingresso/google-wallet-jwt') {
    try {
      const body = await parseBody(request);
      const ticketId = Number(body.ingresso_id);
      if (!Number.isInteger(ticketId) || ticketId <= 0) {
        return send(response, 400, { ok: false, message: 'ID de ingresso invÃƒÂ¡lido.' });
      }
      const result = await getTicketForSession(request, ticketId);
      if (result.error) return send(response, result.error.status, { ok: false, message: result.error.message });
      const { ticket } = result;
      if (Number.isNaN(new Date(ticket.eventDate).getTime())) {
        return send(response, 400, { ok: false, message: 'A data do evento nÃƒÂ£o estÃƒÂ¡ configurada.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel preparar o passe Google Wallet.' });
    }
  }

  // ===== COMPRA DE INGRESSO =====
  if (request.method === 'POST' && url.pathname === '/api/ingressos/comprar') {
    await ensureTicketSecuritySchema();
    await ensureResaleSchema();
    const connection = await db.getConnection();
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const eventoId = Number(body.evento_id);
      const quantidade = Math.max(1, Math.min(10, Number(body.quantidade) || 1));

      if (!email || !eventoId) {
        return send(response, 400, { ok: false, message: 'UsuÃƒÂ¡rio e evento sÃƒÂ£o obrigatÃƒÂ³rios.' });
      }

      await connection.beginTransaction();
      const [[user]] = await connection.query('SELECT id FROM dbo.usuarios WHERE email = ?', [email]);
      const [[event]] = await connection.query('SELECT id, nome, ticket_calculado FROM dbo.eventos WHERE id = ?', [eventoId]);

      if (!user) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      }
      if (!event) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Evento nÃƒÂ£o encontrado.' });
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
      let actualTotal = 0;
      for (const item of purchaseItems) for (let index = 0; index < item.quantity; index += 1) {
          const [[resale]] = await connection.query(`
            SELECT TOP (1) r.*, i.codigo_original_bilheteria, i.setor_nome, i.lote_nome, i.categoria_ingresso,
              current_lot.nome AS lote_vigente,
              CASE WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
                THEN COALESCE(current_lot.preco_meia, current_lot.preco / 2)
                ELSE COALESCE(current_lot.preco_inteira, current_lot.preco)
              END AS valor_cobranca
            FROM dbo.revendas r WITH (UPDLOCK, ROWLOCK)
            JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
            OUTER APPLY (
              SELECT TOP (1) el.nome, el.preco, el.preco_inteira, el.preco_meia
              FROM dbo.evento_lotes el
              WHERE el.evento_id = r.evento_id
                AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
                  OR (NULLIF(TRIM(el.setor_nome), '') IS NULL AND NULLIF(TRIM(i.setor_nome), '') IS NULL))
                AND (el.data_inicio IS NULL OR el.data_inicio <= SYSUTCDATETIME())
                AND (el.data_fim IS NULL OR el.data_fim > SYSUTCDATETIME())
              ORDER BY
                CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL THEN 1 ELSE 0 END,
                CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL
                  THEN TRY_CONVERT(int, LEFT(SUBSTRING(el.nome, PATINDEX('%[0-9]%', el.nome), 10), 1))
                  ELSE 0 END ASC,
                COALESCE(el.data_inicio, el.criado_em) DESC, el.id DESC
            ) current_lot
            WHERE r.evento_id = ? AND r.vendedor_id <> ? AND r.status = 'disponivel' AND i.status = 'ativo' AND ISNULL(i.revoked, 0) = 0
              AND (? IS NULL OR ? = '' OR COALESCE(i.setor_nome, '') = ?)
              AND (? IS NULL OR ? = '' OR COALESCE(i.categoria_ingresso, '') = ?)
            ORDER BY r.prioridade DESC, r.preco_original ASC, r.anunciado_em ASC, r.id ASC
          `, [eventoId, user.id, item.sector || '', item.sector || '', item.sector || '', item.category || '', item.category || '', item.category || '']);
          if (!resale && (item.sector || item.category)) {
            const [[blockedOwnListing]] = await connection.query(`
              SELECT TOP (1) r.id
              FROM dbo.revendas r
              JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
              WHERE r.evento_id = ? AND r.vendedor_id = ? AND r.status = 'disponivel'
                AND i.status = 'ativo' AND ISNULL(i.revoked, 0) = 0
                AND (? = '' OR COALESCE(i.setor_nome, '') = ?)
                AND (? = '' OR COALESCE(i.categoria_ingresso, '') = ?)
            `, [eventoId, user.id, item.sector || '', item.sector || '', item.category || '', item.category || '']);
            if (blockedOwnListing) {
              await connection.rollback();
              return send(response, 409, { ok: false, message: 'Você não pode comprar o próprio anúncio de revenda.' });
            }
          }
          const numero = makeCode('TKT');
          const secretKey = makeTicketSecret();
          const qrPayload = makeActiveTicketPayload(numero, secretKey);
          const chargedPrice = Number(resale?.valor_cobranca ?? item.price);
          actualTotal += chargedPrice;
          const [ticketRows] = await connection.query(
            `INSERT INTO dbo.ingressos_emitidos
             (pedido_id, comprador_id, evento_id, numero_ingresso, codigo_original_bilheteria, qr_code_payload, secret_key, setor_nome, lote_nome, categoria_ingresso, bilheteria_origem, preco_original, versao_titularidade, status, revoked)
             OUTPUT INSERTED.id
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Troca Ticket', ?, 1, 'ativo', 0)`,
            [pedidoId, user.id, eventoId, numero, numero, qrPayload, secretKey, resale?.setor_nome || item.sector, resale?.lote_vigente || resale?.lote_nome || item.lotName, resale?.categoria_ingresso || item.category, chargedPrice]
          );
          if (resale) {
            await connection.query("UPDATE dbo.ingressos_emitidos SET status = 'revogado', revoked = 1, revogado_em = SYSUTCDATETIME() WHERE id = ?", [resale.ingresso_id]);
            await connection.query("UPDATE dbo.revendas SET status = 'vendida', vendido_em = SYSUTCDATETIME() WHERE id = ? AND status = 'disponivel'", [resale.id]);
            const payout = calculateResalePayout({
              lotPrice: resale.preco_original,
              priorityPercent: resale.taxa_percentual,
              administrationFee: 0
            });
            const [repasseRows] = await connection.query(`
              INSERT INTO dbo.repasse_revendas
                (revenda_id, vendedor_id, comprador_id, ingresso_antigo_id, ingresso_novo_id, valor_bruto, taxa_percentual, valor_taxa, valor_taxa_administracao, valor_liquido, valor_cobranca, lucro_empresa)
              OUTPUT INSERTED.id
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [resale.id, resale.vendedor_id, user.id, resale.ingresso_id, ticketRows[0].id, resale.preco_original, resale.taxa_percentual, payout.priorityFee, 0, payout.payout, chargedPrice, Math.max(chargedPrice - Number(resale.preco_original) + payout.priorityFee, 0)]);
            await connection.query(`
              INSERT INTO dbo.wallet_lancamentos (usuario_id, tipo, status, valor, repasse_id, referencia)
              SELECT vendedor_id, 'credito', 'pendente', valor_liquido, id, 'revenda'
              FROM dbo.repasse_revendas WHERE id = ?
            `, [repasseRows[0].id]);
          }
          tickets.push({ id: ticketRows[0].id, numero_ingresso: numero, origem: resale ? 'revenda' : 'bilheteria' });
        }

      await connection.query('UPDATE dbo.pedidos SET valor_total = ? WHERE id = ?', [actualTotal, pedidoId]);
      await connection.commit();
      return send(response, 201, { ok: true, pedido_id: pedidoId, codigo_pedido: codigoPedido, tickets });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[ingressos] Erro na compra:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel concluir a compra.' });
    } finally {
      connection.release();
    }
  }

  // ===== TRANSFERÃƒÅ NCIA NOMINAL =====
  if (request.method === 'POST' && url.pathname === '/api/ingressos/solicitar-transferencia') {
    const connection = await db.getConnection();
    try {
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida. Entre novamente.' });
      const body = await parseBody(request);
      const { ingresso_id, destinatario_email } = body;
      const targetEmail = normalizeEmail(destinatario_email);

      await connection.beginTransaction();

      const [[ticket]] = await connection.query(
        `SELECT i.*, u.nome AS remetente_nome, u.email AS remetente_email,
          e.nome AS evento_nome, e.data_evento, p.codigo_pedido
         FROM ingressos_emitidos i
         JOIN usuarios u ON u.id = i.comprador_id
         JOIN eventos e ON e.id = i.evento_id
         LEFT JOIN pedidos p ON p.id = i.pedido_id
         WHERE i.id = ? FOR UPDATE`,
        [ingresso_id]
      );

      if (!ticket || !['ativo', 'valido'].includes(String(ticket.status).toLowerCase()) || Number(ticket.revoked) === 1) {
        await connection.rollback();
        return send(response, 400, { ok: false, message: 'Ingresso indisponível para transferência.' });
      }

      if (ticket.remetente_email !== session.email) {
        await connection.rollback();
        return send(response, 403, { ok: false, message: 'Você não pode transferir este ingresso.' });
      }

      if (Number(ticket.versao_titularidade || 1) > 1) {
        await connection.rollback();
        return send(response, 403, { ok: false, message: 'Este ingresso já foi transferido uma vez.' });
      }

      const [[hasPending]] = await connection.query(
        "SELECT TOP (1) id FROM dbo.transferencias_pendentes WHERE ingresso_id = ? AND status = 'pendente'",
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
      const acceptanceUrl = `${String(process.env.TROCATICKET_PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, '')}/transferencia/aceitar?token=${encodeURIComponent(token)}`;
      let emailResult;
      try {
        emailResult = await sendTransferEmail({
          to: destUser.email,
          recipientName: nomeDestinatarioFinal,
          senderName: ticket.remetente_nome,
          ticket: {
            ...ticket,
            codigo_pedido: ticket.codigo_pedido || ticket.pedido_id
          },
          acceptanceUrl
        });
      } catch (emailError) {
        console.error('[transferencia] Falha ao enviar email de aceite:', emailError.message);
        return send(response, 502, {
          ok: false,
          transferencia_id: insertResult.insertId,
          message: 'A solicitação foi criada, mas não foi possível enviar o email ao destinatário.'
        });
      }

      return send(response, 200, { 
        ok: true, 
        transferencia_id: insertResult.insertId,
        destinatario_nome: nomeDestinatarioFinal,
        email_sent: Boolean(emailResult?.sent),
        message: emailResult?.sent
          ? `Solicitação enviada por email para ${destUser.email}.`
          : `Solicitação criada. Configure o SMTP para enviar o email ao destinatário.`
      });
    } catch (error) {
      try { await connection.rollback(); } catch (rollbackError) {
        console.error('[transferencia] Falha ao desfazer transação:', rollbackError.message);
      }
      console.error('[transferencia] Falha ao solicitar transferência:', error.message);
      return send(response, 500, { ok: false, message: 'Falha ao solicitar transferência.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/ingressos/cancelar-transferencia') {
    try {
      const session = readSessionToken(request);
      if (!session) return send(response, 401, { ok: false, message: 'Sessão inválida. Entre novamente.' });
      const body = await parseBody(request);
      await db.query(`
        UPDATE tp
        SET status = 'cancelada'
        FROM transferencias_pendentes tp
        JOIN ingressos_emitidos i ON i.id = tp.ingresso_id
        JOIN usuarios u ON u.id = i.comprador_id
        WHERE tp.ingresso_id = ? AND tp.status = 'pendente' AND u.email = ?
      `, [body.ingresso_id, session.email]);
      return send(response, 200, { ok: true, message: 'Transferência cancelada.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao cancelar.' });
    }
  }

  if (request.method === 'GET' && ['/transferencia/aceitar', '/api/ingressos/confirmar-transferencia'].includes(url.pathname)) {
    await ensureTicketSecuritySchema();
    const token = url.searchParams.get('token');
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [[solicitacao]] = await connection.query(
        `SELECT tp.*, i.evento_id, i.bilheteria_id, i.bilheteria_origem, i.setor_nome,
          i.lote_nome, i.categoria_ingresso, i.preco_original, i.codigo_original_bilheteria,
          i.numero_ingresso, i.versao_titularidade, i.qr_code_payload, i.pedido_id,
          p.codigo_pedido, e.nome AS evento_nome, e.data_evento,
          sender.nome AS remetente_nome, sender.email AS remetente_email,
          recipient.nome AS destinatario_nome, recipient.email AS destinatario_email
         FROM transferencias_pendentes tp
         JOIN ingressos_emitidos i ON i.id = tp.ingresso_id
         LEFT JOIN pedidos p ON p.id = i.pedido_id
         JOIN eventos e ON e.id = i.evento_id
         JOIN usuarios sender ON sender.id = tp.remetente_id
         JOIN usuarios recipient ON recipient.id = tp.destinatario_id
         WHERE tp.token = ? FOR UPDATE`,
        [token]
      );

      if (!solicitacao || solicitacao.status !== 'pendente') {
        await connection.rollback();
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        return response.end(transferResultPage({
          success: false,
          title: 'Link indisponível',
          message: 'Este convite já foi utilizado, cancelado ou não existe.'
        }));
      }

      const revokedQr = `${solicitacao.qr_code_payload}_REVOGADO_${Date.now()}`;
      await connection.query("UPDATE ingressos_emitidos SET status = 'invalidado_por_revenda', qr_code_payload = ?, secret_key = NULL WHERE id = ?", [revokedQr, solicitacao.ingresso_id]);

      const novoNumero = makeCode('TKT');
      const novaSecretKey = makeTicketSecret();
      const novoQr = makeActiveTicketPayload(novoNumero, novaSecretKey);

      await connection.query(
        `INSERT INTO ingressos_emitidos
          (pedido_id, comprador_id, evento_id, bilheteria_id, bilheteria_origem, setor_nome,
           lote_nome, categoria_ingresso, preco_original, numero_ingresso,
           codigo_original_bilheteria, qr_code_payload, secret_key, versao_titularidade, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')`,
        [solicitacao.pedido_id, solicitacao.destinatario_id, solicitacao.evento_id,
          solicitacao.bilheteria_id || null, solicitacao.bilheteria_origem || 'Troca Ticket',
          solicitacao.setor_nome || null, solicitacao.lote_nome || null,
          solicitacao.categoria_ingresso || null, solicitacao.preco_original || null,
          novoNumero, solicitacao.codigo_original_bilheteria || novoNumero, novoQr,
          novaSecretKey, Number(solicitacao.versao_titularidade || 1) + 1]
      );

      await connection.query("UPDATE transferencias_pendentes SET status = 'aceita' WHERE id = ?", [solicitacao.id]);
      await connection.commit();

      const confirmationEmails = [
        { to: solicitacao.remetente_email, name: solicitacao.remetente_nome, role: 'sender' },
        { to: solicitacao.destinatario_email, name: solicitacao.destinatario_nome, role: 'recipient' }
      ];
      const emailResults = await Promise.allSettled(confirmationEmails.map(email =>
        sendTransferConfirmationEmail({
          ...email,
          ticket: solicitacao,
          newTicketNumber: novoNumero
        })
      ));
      emailResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`[transferencia] Falha ao enviar confirmação para ${confirmationEmails[index].to}:`, result.reason.message);
        }
      });

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end(transferResultPage({
        success: true,
        title: 'Transferência concluída!',
        message: 'O ingresso foi atualizado com um novo QR Code e já está disponível na conta do novo titular.',
        eventName: solicitacao.evento_nome,
        ticketNumber: novoNumero,
        orderCode: solicitacao.codigo_pedido || solicitacao.pedido_id
      }));
    } catch (error) {
      try { await connection.rollback(); } catch (rollbackError) {
        console.error('[transferencia] Falha ao desfazer aceite:', rollbackError.message);
      }
      response.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      return response.end(transferResultPage({
        success: false,
        title: 'Não foi possível concluir',
        message: 'Ocorreu um erro ao processar a transferência. Tente novamente ou solicite um novo convite.'
      }));
    } finally {
      connection.release();
    }
  }

  if (request.method === 'GET' && /^\/api\/events\/\d+\/imagem$/.test(url.pathname)) {
    try {
      const eventId = Number(url.pathname.split('/')[3]);
      const publicField = String(url.searchParams.get('campo') || '');
      const column = EVENT_IMAGE_FIELDS[publicField];
      if (!column) return send(response, 404, { ok: false, message: 'Campo de imagem inválido.' });
      const [rows] = await db.query(
        `SELECT [${column}] AS image, DATALENGTH([${column}]) AS version
         FROM dbo.eventos WHERE id = ?`,
        [eventId]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'Evento não encontrado.' });
      const decoded = decodeDataImage(rows[0].image);
      if (!decoded) return send(response, 404, { ok: false, message: 'Imagem não disponível como Data URL.' });
      if (decoded.data.length > MAX_UPLOAD_BYTES) {
        console.warn(`[events] imagem ${publicField} do evento ${eventId} excede 4,5 MB (${decoded.data.length} bytes).`);
      }
      response.writeHead(200, {
        'Content-Type': decoded.contentType,
        'Content-Length': decoded.data.length,
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400'
      });
      return response.end(decoded.data);
    } catch (error) {
      console.error('[events] erro ao servir imagem:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar a imagem.' });
    }
  }

  // ===== EVENTOS (ADMIN) =====
  if (request.method === 'GET' && url.pathname === '/api/events') {
    try {
      await ensureSupplierSchema();
      const [rows] = await db.query('SELECT * FROM eventos ORDER BY id DESC');
      const [sectorRows] = await db.query('SELECT id, evento_id, nome, capacidade FROM dbo.evento_setores ORDER BY id');
      const [lotRows] = await db.query('SELECT * FROM dbo.evento_lotes ORDER BY id');
      const events = rows.map(r => ({
        id: r.id,
        name: String(r.nome || '').replace(/edi\?\?o/gi, 'ediÃƒÂ§ÃƒÂ£o'),
        artista: r.artista || '',
        descricao: r.descricao || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        endDate: r.data_fim ? new Date(r.data_fim).toISOString() : null,
        classification: r.classificacao_etaria || 'Livre',
        price: Number(r.ticket_calculado || 0),
        capacity: Number(r.publico_maximo || 0),
        imagem: eventImageResponse(r.imagem, r.id, 'imagem', eventImageVersion(r.imagem)),
        imagem_horizontal: eventImageResponse(r.banner_desktop, r.id, 'banner_desktop', eventImageVersion(r.banner_desktop)),
        mapa_evento: eventImageResponse(r.mapa_evento, r.id, 'mapa_evento', eventImageVersion(r.mapa_evento)),
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
      if (!eventRows.length) return send(response, 404, { ok: false, message: 'Evento nÃƒÂ£o encontrado.' });

      const event = eventRows[0];
      const [lots] = await db.query('SELECT * FROM dbo.evento_lotes WHERE evento_id = ? ORDER BY id', [event.id]);
      const [sectorRows] = await db.query('SELECT * FROM dbo.evento_setores WHERE evento_id = ? ORDER BY id', [event.id]);
      const [costItems] = await db.query('SELECT * FROM dbo.evento_itens_custo WHERE evento_id = ? ORDER BY id', [event.id]);
      const [[salesMetrics]] = await db.query(`
        SELECT
          COUNT(i.id) AS sold_tickets,
          COALESCE(SUM(p.valor_total / NULLIF(order_counts.ticket_count, 0)), 0) AS gross_revenue
        FROM dbo.ingressos_emitidos i
        INNER JOIN dbo.pedidos p ON p.id = i.pedido_id
        INNER JOIN (
          SELECT pedido_id, evento_id, COUNT(*) AS ticket_count
          FROM dbo.ingressos_emitidos
          GROUP BY pedido_id, evento_id
        ) order_counts ON order_counts.pedido_id = i.pedido_id AND order_counts.evento_id = i.evento_id
        WHERE i.evento_id = ? AND p.status = 'aprovado'
          AND COALESCE(i.status, 'ativo') NOT IN ('invalidado', 'invalidado_por_revenda', 'cancelado')
      `, [event.id]);
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
            artist: event.artista || '',
            description: event.descricao || '',
            image: eventImageResponse(event.imagem, event.id, 'imagem', eventImageVersion(event.imagem)),
            horizontalImage: eventImageResponse(event.banner_desktop, event.id, 'banner_desktop', eventImageVersion(event.banner_desktop)),
            mapImage: eventImageResponse(event.mapa_evento, event.id, 'mapa_evento', eventImageVersion(event.mapa_evento)),
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
          salesMetrics: {
            soldTickets: Number(salesMetrics?.sold_tickets || 0),
            grossRevenue: Number(salesMetrics?.gross_revenue || 0)
          },
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar as conversas.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/organizador/eventos') {
    const requestKey = String(request.headers['idempotency-key'] || '').trim();
    if (requestKey && eventCreationRequests.has(requestKey)) {
      const previous = eventCreationRequests.get(requestKey);
      if (previous.status === 'processing') {
        return send(response, 409, { ok: false, message: 'Este salvamento já está em processamento. Aguarde a conclusão.' });
      }
      return send(response, previous.statusCode, previous.payload);
    }
    if (requestKey) eventCreationRequests.set(requestKey, { status: 'processing' });
    try {
      await ensureSupplierSchema();
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
        return send(response, 400, { ok: false, message: 'Nome, local, lotaÃƒÂ§ÃƒÂ£o e data do evento sÃƒÂ£o obrigatÃƒÂ³rios.' });
      }
      if (!dataFim || dataFim <= dataEvento) {
        return send(response, 400, { ok: false, message: 'Informe um horÃƒÂ¡rio de encerramento posterior ao inÃƒÂ­cio do evento.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.eventos (organizador_id, nome, artista, descricao, classificacao_etaria, [local], data_evento, data_fim, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem, banner_desktop)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 500, ?, 0.20, ?, ?, ?, ?)`,
        [body.organizador_id || 1, nome, body.artista || null, String(body.descricao || '').trim() || null, classificacaoEtaria, local, dataEvento, dataFim, ticketCalculado, lotacao, body.status || 'publicado', destaque, preserveEventImageInput(body.imagem), preserveEventImageInput(body.imagem_horizontal)]
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

      const payload = { ok: true, evento_id: eventoId, message: 'Evento criado com sucesso.' };
      if (requestKey) {
        eventCreationRequests.set(requestKey, { status: 'completed', statusCode: 201, payload });
      }
      return send(response, 201, payload);
    } catch (error) {
      if (requestKey) eventCreationRequests.delete(requestKey);
      console.error('[organizador] criar evento:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/eventos\/\d+\/imagem$/.test(url.pathname)) {
    try {
      const eventoId = Number(url.pathname.match(/\/(\d+)\/imagem$/)[1]);
      const body = await parseBody(request);
      const imageType = body.tipo === 'banner' ? 'banner_desktop' : body.tipo === 'mapa' ? 'mapa_evento' : 'imagem';
      const dataUrl = String(body.imagem || '');
      const match = dataUrl.match(/^data:image\/(?:jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/i);
      if (!eventoId || !match) {
        return send(response, 400, { ok: false, message: 'Imagem inválida ou evento não informado.' });
      }

      const imageBuffer = Buffer.from(match[1].replace(/\s/g, ''), 'base64');
      if (!imageBuffer.length || imageBuffer.length > 10 * 1024 * 1024) {
        return send(response, 413, { ok: false, message: 'A imagem deve ter no máximo 10 MB.' });
      }

      const [events] = await db.query('SELECT id FROM dbo.eventos WHERE id = ?', [eventoId]);
      if (!events.length) return send(response, 404, { ok: false, message: 'Evento não encontrado.' });

      const fileName = `evento-${eventoId}-${imageType}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.jpg`;
      if (imageBuffer.length > MAX_UPLOAD_BYTES) {
        return send(response, 413, { ok: false, message: 'A imagem deve ter no máximo 4,5 MB.' });
      }
      const imageUrl = await salvarArquivo('events', fileName, imageBuffer, 'image/jpeg');
      await db.query(`UPDATE dbo.eventos SET ${imageType} = ? WHERE id = ?`, [imageUrl, eventoId]);
      return send(response, 200, { ok: true, imageUrl, message: 'Imagem salva com sucesso.' });
    } catch (error) {
      console.error('[organizador] salvar imagem do evento:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível salvar a nova imagem do evento.' });
    }
  }

  if (request.method === 'PUT' && url.pathname === '/api/organizador/eventos') {
    try {
      await ensureSupplierSchema();
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
      const imagem = preserveEventImageInput(body.imagem);
      const imagemHorizontal = preserveEventImageInput(body.imagem_horizontal);

      if (!eventoId || !nome || !local || !dataEvento || !lotacao) {
        return send(response, 400, { ok: false, message: 'Evento, nome, local, lotaÃƒÂ§ÃƒÂ£o e data sÃƒÂ£o obrigatÃƒÂ³rios.' });
      }
      if (!dataFim || dataFim <= dataEvento) {
        return send(response, 400, { ok: false, message: 'Informe um horÃƒÂ¡rio de encerramento posterior ao inÃƒÂ­cio do evento.' });
      }
      if ((imagem && imagem.length > 12 * 1024 * 1024) || (imagemHorizontal && imagemHorizontal.length > 12 * 1024 * 1024)) {
        return send(response, 413, { ok: false, message: 'As imagens excedem o limite de 12 MB por arquivo. Selecione imagens menores.' });
      }

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        await connection.query(
          `UPDATE dbo.eventos
           SET nome = ?, artista = ?, descricao = ?, classificacao_etaria = ?, [local] = ?, data_evento = ?, data_fim = ?, ticket_calculado = ?, publico_maximo = ?, status = ?, destaque = ?, imagem = COALESCE(?, imagem), banner_desktop = COALESCE(?, banner_desktop)
           WHERE id = ?`,
          [nome, body.artista || null, String(body.descricao || '').trim() || null, classificacaoEtaria, local, dataEvento, dataFim, ticketCalculado, lotacao, body.status || 'publicado', destaque, imagem, imagemHorizontal, eventoId]
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
      const valorEstimado = Number(body.valor_estimado ?? body.value);

      if (!eventoId || !titulo || !escopo || !Number.isFinite(valorEstimado) || valorEstimado < 0) {
        return send(response, 400, { ok: false, message: 'Dados da cotaÃƒÂ§ÃƒÂ£o incompletos.' });
      }

      const [result] = await db.query(
        `INSERT INTO dbo.evento_demandas (evento_id, titulo, servico, escopo, prazo, valor_estimado, status)
         OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, 'em cotacao')`,
        [eventoId, titulo, servico || 'SolicitaÃƒÂ§ÃƒÂ£o', escopo, prazo, valorEstimado]
      );

      const demandaId = result[0]?.id || result.insertId;
      if (itemId) {
        await db.query(
          `UPDATE dbo.evento_itens_custo
           SET custo_estimado = ?, status = ?, demanda_id = ?
           WHERE id = ? AND evento_id = ?`,
          [valorEstimado, 'em cotacao', demandaId, itemId, eventoId]
        );
      }

      return send(response, 201, { ok: true, demanda_id: demandaId, message: 'CotaÃƒÂ§ÃƒÂ£o registrada com sucesso.' });
    } catch (error) {
      console.error('[organizador] criar cotaÃƒÂ§ÃƒÂ£o:', error.message);
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar o cadastro da empresa.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/perfil') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const existingCompany = await getSupplierCompanyForUser(user);
      if (existingCompany && existingCompany.owner_id !== user.id) {
        return send(response, 403, { ok: false, message: 'Somente o proprietÃƒÂ¡rio pode editar os dados da empresa.' });
      }
      const body = await parseBody(request);
      const values = [String(body.razao_social || '').trim(), String(body.cnpj || '').trim(), String(body.categoria || '').trim(), String(body.contato || '').trim(), String(body.email_comercial || '').trim(), String(body.telefone || '').trim(), String(body.descricao || '').trim()];
      if (values.some(value => !value)) return send(response, 400, { ok: false, message: 'Preencha todos os dados obrigatÃƒÂ³rios da empresa.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel salvar o cadastro da empresa.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar os colaboradores.' });
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
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return send(response, 400, { ok: false, message: 'Informe um e-mail vÃƒÂ¡lido.' });
      const [[member]] = await db.query(
        `SELECT id, nome, email, tipo, status FROM dbo.usuarios
         WHERE email = ? AND LOWER(tipo) IN ('admin', 'fornecedor')`,
        [email]
      );
      if (!member) return send(response, 404, { ok: false, message: 'O e-mail precisa pertencer a um usuÃƒÂ¡rio admin ou fornecedor cadastrado.' });
      if (member.id === user.id) return send(response, 400, { ok: false, message: 'O proprietÃƒÂ¡rio jÃƒÂ¡ faz parte da empresa.' });
      if (['bloqueado', 'suspensa', 'excluida'].includes(String(member.status || '').toLowerCase())) {
        return send(response, 400, { ok: false, message: 'Este usuÃƒÂ¡rio estÃƒÂ¡ bloqueado ou inativo.' });
      }
      const [[existing]] = await db.query('SELECT id FROM dbo.fornecedor_colaboradores WHERE empresa_id = ? AND usuario_id = ?', [company.id, member.id]);
      if (existing) return send(response, 409, { ok: false, message: 'Este usuÃƒÂ¡rio jÃƒÂ¡ ÃƒÂ© colaborador da empresa.' });
      await db.query('INSERT INTO dbo.fornecedor_colaboradores (empresa_id, usuario_id) VALUES (?, ?)', [company.id, member.id]);
      return send(response, 201, { ok: true, collaborator: member });
    } catch (error) {
      console.error('[fornecedor] adicionar colaborador:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel adicionar o colaborador.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/fornecedor\/colaboradores\/\d+$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const [[company]] = await db.query('SELECT id FROM dbo.fornecedor_empresas WHERE usuario_id = ?', [user.id]);
      const collaboratorId = Number(url.pathname.split('/').pop());
      if (!company || !collaboratorId) return send(response, 404, { ok: false, message: 'Colaborador nÃƒÂ£o encontrado.' });
      await db.query('DELETE FROM dbo.fornecedor_colaboradores WHERE id = ? AND empresa_id = ?', [collaboratorId, company.id]);
      return send(response, 200, { ok: true });
    } catch (error) {
      console.error('[fornecedor] remover colaborador:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel remover o colaborador.' });
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
        WHERE d.status IN ('em cotacao', 'em anÃƒÂ¡lise', 'em analise')
        ORDER BY d.criado_em DESC
      `, [user.id]);
      return send(response, 200, {
        ok: true,
        opportunities: rows,
        homologated: Boolean(company && homologated),
        message: company && homologated ? null : 'As demandas ficam disponÃƒÂ­veis para consulta, mas o envio de propostas serÃƒÂ¡ liberado apÃƒÂ³s a homologaÃƒÂ§ÃƒÂ£o.'
      });
    } catch (error) {
      console.error('[fornecedor] oportunidades:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar as oportunidades.' });
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
      const seenDemands = new Set();
      const seenProposalContent = new Set();
      const uniqueRows = rows.filter(row => {
        const demandKey = Number(row.demanda_id);
        const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
        const contentKey = `${normalize(row.evento_nome)}|${normalize(row.titulo)}`;
        if (Number.isFinite(demandKey) && seenDemands.has(demandKey)) return false;
        if (seenProposalContent.has(contentKey)) return false;
        if (Number.isFinite(demandKey)) seenDemands.add(demandKey);
        seenProposalContent.add(contentKey);
        return true;
      });
      return send(response, 200, { ok: true, proposals: uniqueRows });
    } catch (error) {
      console.error('[fornecedor] propostas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar suas propostas.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/propostas') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const homologated = await getSupplierHomologation(company?.owner_id || user.id);
      if (!company || !homologated) return send(response, 403, { ok: false, message: 'Aguarde a aprovaÃƒÂ§ÃƒÂ£o de todos os documentos para enviar propostas.' });
      const body = await parseBody(request);
      const demandaId = Number(body.demanda_id);
      const valor = Number(body.valor || 0);
      const escopo = String(body.escopo || '').trim();
      const prazo = String(body.prazo || '').trim();
      if (!demandaId || !valor || !escopo || !prazo) return send(response, 400, { ok: false, message: 'Informe valor, prazo e escopo da proposta.' });
      const [[demand]] = await db.query('SELECT id FROM dbo.evento_demandas WHERE id = ? AND status IN (?, ?, ?)', [demandaId, 'em cotacao', 'em anÃƒÂ¡lise', 'em analise']);
      if (!demand) return send(response, 404, { ok: false, message: 'Oportunidade indisponÃƒÂ­vel.' });
      const [[existing]] = await db.query('SELECT id FROM dbo.evento_propostas_fornecedor WHERE demanda_id = ? AND fornecedor_usuario_id = ?', [demandaId, user.id]);
      if (existing) return send(response, 409, { ok: false, message: 'VocÃƒÂª jÃƒÂ¡ enviou uma proposta para esta demanda.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_propostas_fornecedor (demanda_id, fornecedor_usuario_id, empresa, valor, escopo, prazo, status) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?, ?)',
        [demandaId, user.id, company.razao_social, valor, escopo, prazo, 'em analise']
      );
      return send(response, 201, { ok: true, proposta_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[fornecedor] criar proposta:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel enviar a proposta.' });
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
      if (!proposal) return send(response, 404, { ok: false, message: 'Proposta nÃƒÂ£o encontrada.' });
      const [documents] = await db.query('SELECT id, nome_arquivo, caminho AS url, criado_em FROM dbo.evento_proposta_documentos WHERE proposta_id = ? ORDER BY criado_em DESC', [proposalId]);
      return send(response, 200, { ok: true, documents });
    } catch (error) {
      console.error('[fornecedor] documentos da proposta:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar os anexos da proposta.' });
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
      if (!proposal || !attachment) return send(response, 400, { ok: false, message: 'Selecione um arquivo vÃƒÂ¡lido para anexar.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_proposta_documentos (proposta_id, nome_arquivo, caminho) OUTPUT INSERTED.id VALUES (?, ?, ?)',
        [proposalId, attachment.name, attachment.url]
      );
      return send(response, 201, { ok: true, documento_id: result[0]?.id || result.insertId });
    } catch (error) {
      console.error('[fornecedor] anexar documento ÃƒÂ  proposta:', error.message);
      return send(response, uploadErrorStatus(error), { ok: false, message: error.statusCode === 413 ? error.message : 'NÃƒÂ£o foi possÃƒÂ­vel anexar o documento ÃƒÂ  proposta.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar os documentos.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/fornecedor/documentos') {
    try {
      await ensureSupplierSchema();
      const user = await getSupplierUser(request);
      if (!user) return send(response, 403, { ok: false, message: 'Acesso restrito a fornecedores.' });
      const company = await getSupplierCompanyForUser(user);
      const ownerId = company?.owner_id || user.id;
      if (company && company.owner_id !== user.id) return send(response, 403, { ok: false, message: 'Somente o proprietÃƒÂ¡rio pode atualizar documentos.' });
      const body = await parseBody(request);
      const nome = String(body.nome || '').trim();
      const nomeArquivo = String(body.nome_arquivo || '').trim();
      const encodedFile = String(body.conteudo_base64 || '');
      const match = encodedFile.match(/^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,(.+)$/i);
      if (!nome || !nomeArquivo || !match) return send(response, 400, { ok: false, message: 'Arquivo de documento invÃƒÂ¡lido.' });
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(match[1].toLowerCase())) return send(response, 400, { ok: false, message: 'Envie um PDF, PNG ou JPG.' });
      const fileData = Buffer.from(match[2], 'base64');
      if (!fileData.length) return send(response, 400, { ok: false, message: 'O documento está vazio.' });
      if (fileData.length > MAX_UPLOAD_BYTES) return send(response, 413, { ok: false, message: 'O documento deve ter no máximo 4,5 MB.' });
      const safeName = nomeArquivo.replace(/[^a-z0-9._-]/gi, '_');
      const storedName = `${ownerId}-${crypto.randomUUID()}-${safeName}`;
      const documentUrl = await salvarArquivo('supplier-documents', storedName, fileData, match[1].toLowerCase());
      await db.query(`
        MERGE dbo.fornecedor_documentos AS target
        USING (SELECT ? AS fornecedor_usuario_id, ? AS nome) AS source
        ON target.fornecedor_usuario_id = source.fornecedor_usuario_id AND target.nome = source.nome
        WHEN MATCHED THEN UPDATE SET nome_arquivo = ?, caminho = ?, status = 'em analise', motivo_recusa = NULL, atualizado_em = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN INSERT (fornecedor_usuario_id, nome, nome_arquivo, caminho, status) VALUES (?, ?, ?, ?, 'em analise');
      `, [ownerId, nome, safeName, documentUrl, ownerId, nome, safeName, documentUrl]);
      return send(response, 201, { ok: true, message: 'Documento enviado para validaÃƒÂ§ÃƒÂ£o.' });
    } catch (error) {
      console.error('[fornecedor] upload documento:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel salvar o documento.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar os documentos dos fornecedores.' });
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
        const deliveryRuntime = proposals.map(proposal => {
          const createdAt = proposal.criado_em ? new Date(proposal.criado_em).getTime() : null;
          const deadline = proposal.prazo ? new Date(proposal.prazo).getTime() : null;
          if (!createdAt || !deadline) return { status: 'sem_historico', label: 'Sem histórico' };
          const halfWindow = (deadline - createdAt) / 2;
          const now = Date.now();
          if (now > deadline) return { status: 'atrasado', label: 'Atrasado' };
          if (now <= createdAt + halfWindow) return { status: 'antecipado', label: 'Antecipado' };
          return { status: 'no_prazo', label: 'No prazo' };
        });
        const deliverySummary = deliveryRuntime.filter(item => item.label !== 'Sem histórico').reduce((summary, item) => {
          summary[item.status] = (summary[item.status] || 0) + 1;
          return summary;
        }, {});
        const deliverySummaryText = Object.keys(deliverySummary).length
          ? Object.entries(deliverySummary).map(([key, value]) => `${value} ${key === 'no_prazo' ? 'no prazo' : key === 'antecipado' ? 'antecipado' : 'atrasado'}`).join(', ')
          : 'Sem histórico';
        return {
          company_id: company.id,
          company_name: company.razao_social || company.fornecedor_nome || 'Fornecedor nÃ£o identificado',
          logo_url: company.logo_url || null,
          email: company.email_comercial || company.email || '',
          category: company.categoria || 'Categoria nÃ£o informada',
          status: company.empresa_status || 'em anÃ¡lise',
          services: [...new Set(proposals.map(proposal => String(proposal.escopo || '').trim()).filter(Boolean))].slice(0, 5),
          metrics: {
            service_count: proposals.length,
            confirmed_count: proposals.filter(proposal => ['aprovado', 'aceito', 'contratado'].includes(String(proposal.status || '').toLowerCase())).length,
            average_delivery_days: deliveryDays.length ? Math.round((deliveryDays.reduce((sum, value) => sum + value, 0) / deliveryDays.length) * 10) / 10 : null,
            response_hours: responseIntervals.length ? Math.round((responseIntervals.reduce((sum, value) => sum + value, 0) / responseIntervals.length) * 10) / 10 : null,
            response_label: responseIntervals.length
              ? (() => {
                  const avg = responseIntervals.reduce((sum, value) => sum + value, 0) / responseIntervals.length;
                  if (avg < 1) return 'Em até 1 hora';
                  return avg < 24 ? `${Math.round(avg * 10) / 10} h` : `${Math.round((avg / 24) * 10) / 10} dias`;
                })()
              : 'Sem histórico',
            delivery_status: deliverySummaryText
          },
          compliance: {
            status: String(company.empresa_status || 'em anÃ¡lise').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === 'homologado' ? 'homologado' : String(company.empresa_status || '').toLowerCase() === 'recusado' ? 'recusado' : 'em anÃ¡lise',
            score: complianceScore,
            approved_documents: approvedDocuments,
            total_documents: totalDocuments
          }
        };
      }));
      return send(response, 200, { ok: true, suppliers });
    } catch (error) {
      console.error('[organizador] histÃ³rico de fornecedores:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel carregar o histÃ³rico operacional dos fornecedores.' });
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
      if (!['aprovado', 'recusado'].includes(status)) return send(response, 400, { ok: false, message: 'Status invÃƒÂ¡lido. Use aprovado ou recusado.' });
      if (status === 'recusado' && !motivoRecusa) return send(response, 400, { ok: false, message: 'Informe o motivo da recusa.' });
      const [, result] = await db.query(
        'UPDATE dbo.fornecedor_documentos SET status = ?, motivo_recusa = ?, atualizado_em = SYSUTCDATETIME() WHERE id = ?',
        [status, status === 'recusado' ? motivoRecusa : null, documentId]
      );
      if (!result.affectedRows) return send(response, 404, { ok: false, message: 'Documento nÃƒÂ£o encontrado.' });
      return send(response, 200, { ok: true, message: status === 'aprovado' ? 'Documento aprovado.' : 'Documento recusado.', status });
    } catch (error) {
      console.error('[organizador] revisar documento de fornecedor:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel atualizar o documento.' });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/organizador\/fornecedor-empresas\/\d+\/homologacao$/.test(url.pathname)) {
      try {
        await ensureSupplierSchema();
        const operator = await getTicketOperator(request);
        if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito a administradores e organizadores.' });
        const companyMatch = url.pathname.match(/^\/api\/organizador\/fornecedor-empresas\/(\d+)\/homologacao$/);
        const companyId = Number(companyMatch?.[1]);
        if (!companyId) return send(response, 400, { ok: false, message: 'Empresa invÃƒÂ¡lida.' });
        const body = await parseBody(request);
        const password = String(body.password || '');
        const [[approver]] = await db.query('SELECT senha_hash FROM dbo.usuarios WHERE id = ?', [operator.id]);
        if (!password || !approver || !(await bcrypt.compare(password, approver.senha_hash))) {
          return send(response, 403, { ok: false, message: 'Confirme sua senha de login para homologar a empresa.' });
        }
        const requestedStatus = String(body.status || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const status = requestedStatus === 'em analise' ? 'em anÃ¡lise' : requestedStatus;
        if (!['homologado', 'em anÃ¡lise', 'recusado'].includes(status)) return send(response, 400, { ok: false, message: 'Status de homologaÃƒÂ§ÃƒÂ£o invÃƒÂ¡lido.' });
        const [[company]] = await db.query('SELECT id FROM dbo.fornecedor_empresas WHERE id = ?', [companyId]);
        if (!company) return send(response, 404, { ok: false, message: 'Empresa nÃƒÂ£o encontrada.' });
        await db.query('UPDATE dbo.fornecedor_empresas SET status = ?, atualizado_em = SYSUTCDATETIME() WHERE id = ?', [status, companyId]);
        return send(response, 200, { ok: true, status });
      } catch (error) {
        console.error('[organizador] homologaÃƒÂ§ÃƒÂ£o de fornecedor:', error.message);
        return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel atualizar a homologaÃƒÂ§ÃƒÂ£o.' });
    }
  }

  if (request.method === 'GET' && ['/api/chat/nao-lidas', '/api/organizador/chat/nao-lidas', '/api/fornecedor/chat/nao-lidas'].includes(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 403, { ok: false, message: 'SessÃƒÂ£o invÃƒÂ¡lida.' });
      const [[user]] = await db.query('SELECT id, tipo FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
      if (!user) return send(response, 403, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
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
      console.error('[chat] mensagens nÃƒÂ£o lidas:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel consultar as mensagens pendentes.' });
    }
  }

  if (request.method === 'POST' && ['/api/chat/marcar-lidas', '/api/organizador/chat/marcar-lidas', '/api/fornecedor/chat/marcar-lidas'].includes(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const session = readSessionToken(request);
      if (!session) return send(response, 403, { ok: false, message: 'SessÃƒÂ£o invÃƒÂ¡lida.' });
      const [[user]] = await db.query('SELECT id, tipo FROM dbo.usuarios WHERE id = ? AND email = ?', [session.sub, session.email]);
      if (!user) return send(response, 403, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel marcar as mensagens como lidas.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar o chat.' });
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
      return send(response, uploadErrorStatus(error), { ok: false, message: error.statusCode === 413 ? error.message : 'NÃƒÂ£o foi possÃƒÂ­vel enviar a mensagem.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/propostas\/.+\/aprovar$/.test(url.pathname)) {
    let connection;
    try {
      const proposalId = Number(url.pathname.match(/^\/api\/organizador\/propostas\/(\d+)\/aprovar$/)?.[1]);
      if (!proposalId) return send(response, 400, { ok: false, message: 'Identificador de proposta invÃƒÂ¡lido.' });
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
        return send(response, 404, { ok: false, message: 'Proposta nÃƒÂ£o encontrada.' });
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
      if (!demandId) return send(response, 400, { ok: false, message: 'Demanda invÃƒÂ¡lida.' });
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
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar as mensagens.' });
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
      return send(response, uploadErrorStatus(error), { ok: false, message: error.message });
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
      await ensureSupplierSchema();
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id);
      const nome = String(body.nome || '').trim();
      const prazo = body.prazo ? new Date(body.prazo) : new Date(Date.now() + 7 * 86400000);
      if (!eventoId || !nome) return send(response, 400, { ok: false, message: 'Documento incompleto.' });
      const [result] = await db.query(
        'INSERT INTO dbo.evento_documentos (evento_id, nome, categoria, prazo, status) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?)',
        [eventoId, nome, String(body.categoria || 'Geral').trim(), prazo, body.status || 'pendente']
      );
      return send(response, 201, { ok: true, documento_id: result[0]?.id || result.insertId });
    } catch (error) {
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/documentos\/\d+\/anexo$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const body = await parseBody(request);
      const documentId = Number(url.pathname.split('/')[4]);
      const eventoId = Number(body.evento_id);
      const attachment = await saveChatAttachment(body.arquivo);
      if (!documentId || !eventoId || !attachment) return send(response, 400, { ok: false, message: 'Informe um arquivo vÃ¡lido.' });
      const [rows] = await db.query(
        'UPDATE dbo.evento_documentos SET anexo_url = ? WHERE id = ? AND evento_id = ? OUTPUT INSERTED.id',
        [attachment.url, documentId, eventoId]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'ExigÃªncia documental nÃ£o encontrada.' });
      return send(response, 200, { ok: true, url: attachment.url });
    } catch (error) {
      console.error('[organizador] anexo de documento:', error.message);
      return send(response, uploadErrorStatus(error), { ok: false, message: error.statusCode === 413 ? error.message : 'NÃ£o foi possÃ­vel anexar o documento.' });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/organizador\/documentos\/\d+$/.test(url.pathname)) {
      try {
        await ensureSupplierSchema();
        const documentId = Number(url.pathname.split('/').pop());
        const body = await parseBody(request);
        const nome = String(body.nome || '').trim();
        const categoria = String(body.categoria || 'Geral').trim();
        const prazo = String(body.prazo || '').trim();
        const status = String(body.status || 'pendente').trim().toLowerCase();
        if (!documentId || !nome || !prazo || !['pendente', 'analise', 'aprovado', 'rejeitado'].includes(status)) {
          return send(response, 400, { ok: false, message: 'Dados da exigÃªncia documental invÃ¡lidos.' });
        }
        const [rows] = await db.query(
          'UPDATE dbo.evento_documentos SET nome = ?, categoria = ?, prazo = ?, status = ? OUTPUT INSERTED.id WHERE id = ? AND evento_id = ?',
          [nome, categoria, prazo, status, documentId, Number(body.evento_id)]
        );
        if (!rows.length) return send(response, 404, { ok: false, message: 'ExigÃªncia documental nÃ£o encontrada.' });
        return send(response, 200, { ok: true, documento_id: documentId });
      } catch (error) {
        console.error('[organizador] editar documento:', error.message);
        return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel editar a exigÃªncia documental.' });
    }
  }

  if (request.method === 'GET' && /^\/api\/organizador\/demandas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      if (!readSessionToken(request)) return send(response, 403, { ok: false, message: 'SessÃƒÂ£o invÃƒÂ¡lida.' });
      const demandId = Number(url.pathname.match(/^\/api\/organizador\/demandas\/(\d+)\/documentos$/)?.[1]);
      const [documents] = await db.query('SELECT id, nome, nome_arquivo, caminho AS url, criado_em FROM dbo.evento_demanda_documentos WHERE demanda_id = ? ORDER BY criado_em DESC', [demandId]);
      return send(response, 200, { ok: true, documents });
    } catch (error) {
      console.error('[organizador] documentos da demanda:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar os documentos da cotaÃƒÂ§ÃƒÂ£o.' });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/demandas\/\d+\/documentos$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      if (!readSessionToken(request)) return send(response, 403, { ok: false, message: 'SessÃƒÂ£o invÃƒÂ¡lida.' });
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
      return send(response, uploadErrorStatus(error), { ok: false, message: error.statusCode === 413 ? error.message : 'NÃƒÂ£o foi possÃƒÂ­vel salvar o documento da cotaÃƒÂ§ÃƒÂ£o.' });
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
        return send(response, 400, { ok: false, message: 'Dados do item de custo invÃƒÂ¡lidos.' });
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
      await ensureSupplierSchema();
      const body = await parseBody(request);
      if (!body.evento_id || !body.atividade || !body.responsavel) {
        return send(response, 400, { ok: false, message: 'Dados da tarefa incompletos.' });
      }
      const [result] = await db.query(
        'INSERT INTO dbo.evento_tarefas (evento_id, horario, atividade, responsavel, status, concluida) OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?, ?)',
        [Number(body.evento_id), body.horario || '09:00', String(body.atividade).trim(), String(body.responsavel).trim(), body.status || 'pendente', body.concluida ? 1 : 0]
      );
      return send(response, 201, { ok: true, tarefa_id: result[0]?.id || result.insertId });
    } catch (error) {
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'POST' && /^\/api\/organizador\/tarefas\/\d+\/status$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const taskId = Number(url.pathname.split('/')[4]);
      const body = await parseBody(request);
      const eventoId = Number(body.evento_id);
      const status = String(body.status || (body.concluida ? 'concluida' : 'pendente')).trim().toLowerCase();
      if (!taskId || !eventoId || !['pendente', 'andamento', 'concluida'].includes(status)) {
        return send(response, 400, { ok: false, message: 'Status da tarefa invÃƒÂ¡lido.' });
      }

      const [rows] = await db.query(
        'UPDATE dbo.evento_tarefas SET status = ?, concluida = ? OUTPUT INSERTED.id WHERE id = ? AND evento_id = ?',
        [status, status === 'concluida' ? 1 : 0, taskId, eventoId]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'Tarefa nÃƒÂ£o encontrada.' });
      return send(response, 200, { ok: true, tarefa_id: taskId, status, concluida: status === 'concluida' });
    } catch (error) {
      console.error('[organizador] atualizar tarefa:', error.message);
      return send(response, 500, { ok: false, message: error.message });
    }
  }

  if (request.method === 'PATCH' && /^\/api\/organizador\/tarefas\/\d+$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const taskId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const horario = String(body.horario || '').trim();
      const atividade = String(body.atividade || '').trim();
      const responsavel = String(body.responsavel || '').trim();
      if (!taskId || !body.evento_id || !horario || !atividade || !responsavel) {
        return send(response, 400, { ok: false, message: 'Dados do marco incompletos.' });
      }
      const [rows] = await db.query(
        'UPDATE dbo.evento_tarefas SET horario = ?, atividade = ?, responsavel = ? OUTPUT INSERTED.id WHERE id = ? AND evento_id = ?',
        [horario, atividade, responsavel, taskId, Number(body.evento_id)]
      );
      if (!rows.length) return send(response, 404, { ok: false, message: 'Marco nÃ£o encontrado.' });
      return send(response, 200, { ok: true, tarefa_id: taskId });
    } catch (error) {
      console.error('[organizador] editar tarefa:', error.message);
      return send(response, 500, { ok: false, message: 'NÃ£o foi possÃ­vel editar o marco.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/events') {
    try {
      const body = await parseBody(request);
      const eventDate = parseEventDate(body.data_evento || body.date);
      const eventEndDate = body.data_fim ? parseEventDate(body.data_fim) : null;
      if (!eventDate) return send(response, 400, { ok: false, message: 'Informe a data do evento.' });
      if (!eventEndDate || eventEndDate <= eventDate) return send(response, 400, { ok: false, message: 'Informe um horÃƒÂ¡rio de encerramento posterior ao inÃƒÂ­cio do evento.' });
      const [result] = await db.query(
        `INSERT INTO eventos (organizador_id, nome, artista, \`local\`, data_evento, data_fim, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem) OUTPUT INSERTED.id VALUES (1, ?, ?, ?, ?, ?, ?, 500, 2000, 0.20, 'publicado', ?, ?)`,
        [body.nome.trim(), body.artista || null, body.local.trim(), eventDate, eventEndDate, parseFloat(body.preco) || 0, body.destaque ? 1 : 0, preserveEventImageInput(body.imagem)]
      );
      await audit('criacao_evento', `Evento criado: ${body.nome.trim()}.`, 'evento', body.nome.trim(), auditActor(body));
      return send(response, 201, { ok: true, eventId: result.insertId });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== EVENTOS (ADMIN - GET por ID, PUT e DELETE) =====
  if (request.method === 'GET' && /^\/api\/events\/\d+$/.test(url.pathname)) {
    try {
      await ensureSupplierSchema();
      const eventId = Number(url.pathname.split('/').pop());
      const [rows] = await db.query('SELECT * FROM eventos WHERE id = ? LIMIT 1', [eventId]);
      if (!rows.length) return send(response, 404, { ok: false, message: 'Evento nÃƒÂ£o encontrado.' });
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
        descricao: r.descricao || '',
        location: r.local || '',
        date: r.data_evento ? new Date(r.data_evento).toISOString() : '',
        endDate: r.data_fim ? new Date(r.data_fim).toISOString() : null,
        classification: r.classificacao_etaria || 'Livre',
        price: Number(r.ticket_calculado || 0),
        imagem: eventImageResponse(r.imagem, r.id, 'imagem', eventImageVersion(r.imagem)),
        imagem_horizontal: eventImageResponse(r.banner_desktop, r.id, 'banner_desktop', eventImageVersion(r.banner_desktop)),
        mapa_evento: eventImageResponse(r.mapa_evento, r.id, 'mapa_evento', eventImageVersion(r.mapa_evento)),
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
      if (!eventEndDate || eventEndDate <= eventDate) return send(response, 400, { ok: false, message: 'Informe um horÃƒÂ¡rio de encerramento posterior ao inÃƒÂ­cio do evento.' });
      
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
          preserveEventImageInput(body.imagem),
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
      await audit('exclusao_evento', `Evento ${eventName} excluÃƒÂ­do pelo painel.`, 'evento', eventName, auditActor(body));
      return send(response, 200, { ok: true, message: 'Evento excluÃƒÂ­do com sucesso!' });
    } catch (error) { 
      return send(response, 500, { ok: false, message: error.message }); 
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/revenda-filas') {
    try {
      await ensureResaleSchema();
      const [rows] = await db.query(`
        WITH filas AS (
          SELECT
            r.id, r.preco_original, r.taxa_percentual, r.taxa_nome,
            r.anunciado_em, r.evento_id, r.ingresso_id,
            i.numero_ingresso, i.setor_nome, i.categoria_ingresso,
            e.nome AS evento, u.nome AS vendedor_nome,
            p.codigo_pedido,
            i.lote_nome AS lote_original,
            current_lot.nome AS lote_vigente,
            CAST(COALESCE(current_lot.preco_lote, r.preco_original) AS decimal(10,2)) AS preco_vigente,
            CAST(r.preco_original * (1 - r.taxa_percentual / 100.0) AS decimal(10,2)) AS valor_liquido_estimado,
            CAST(COALESCE(current_lot.preco_lote, r.preco_original) - r.preco_original AS decimal(10,2)) AS diferenca_lote,
            ROW_NUMBER() OVER (
              PARTITION BY r.evento_id, i.setor_nome, i.categoria_ingresso
              ORDER BY r.prioridade DESC, r.preco_original ASC, r.anunciado_em ASC, r.id ASC
            ) AS posicao,
            COUNT(*) OVER (
              PARTITION BY r.evento_id, i.setor_nome, i.categoria_ingresso
            ) AS total_fila
          FROM dbo.revendas r
          JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
          JOIN dbo.eventos e ON e.id = r.evento_id
          LEFT JOIN dbo.usuarios u ON u.id = r.vendedor_id
          LEFT JOIN dbo.pedidos p ON p.id = i.pedido_id
          OUTER APPLY (
            SELECT TOP (1)
              el.nome,
              CASE WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%'
                THEN COALESCE(el.preco_meia, el.preco / 2)
                ELSE COALESCE(el.preco_inteira, el.preco)
              END AS preco_lote
            FROM dbo.evento_lotes el
            WHERE el.evento_id = r.evento_id
              AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
                OR (NULLIF(TRIM(el.setor_nome), '') IS NULL AND NULLIF(TRIM(i.setor_nome), '') IS NULL))
              AND (el.data_inicio IS NULL OR el.data_inicio <= SYSUTCDATETIME())
              AND (el.data_fim IS NULL OR el.data_fim > SYSUTCDATETIME())
            ORDER BY
              CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL THEN 1 ELSE 0 END,
              CASE WHEN el.data_inicio IS NULL AND el.data_fim IS NULL AND el.data_virada IS NULL
                THEN TRY_CONVERT(int, LEFT(SUBSTRING(el.nome, PATINDEX('%[0-9]%', el.nome), 10), 1))
                ELSE 0 END ASC,
              COALESCE(el.data_inicio, el.criado_em) DESC, el.id DESC
          ) current_lot
          WHERE r.status = 'disponivel'
        )
        SELECT * FROM filas
        ORDER BY evento, setor_nome, categoria_ingresso, posicao
      `);
      const queues = [];
      const queueMap = new Map();
      rows.forEach(row => {
        const key = `${row.evento_id}|${row.setor_nome || ''}|${row.categoria_ingresso || ''}`;
        if (!queueMap.has(key)) {
          const queue = {
            evento: row.evento,
            setor_nome: row.setor_nome,
            categoria_ingresso: row.categoria_ingresso,
            total_fila: Number(row.total_fila),
            items: []
          };
          queueMap.set(key, queue);
          queues.push(queue);
        }
        queueMap.get(key).items.push(row);
      });
      return send(response, 200, { ok: true, queues });
    } catch (error) {
      console.error('[admin] Erro ao carregar filas de revenda:', error.message);
      return send(response, 500, { ok: false, message: 'Não foi possível carregar as filas de revenda.' });
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
      const [objects] = await db.query("SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') AND name IN ('ingressos_emitidos', 'pedidos', 'repasse_revendas')");
      const tableNames = new Set(objects.map(object => object.name));
      let totalTickets = 0;
      let totalRevenue = 0;
      let pendingCancellations = 0;
      let gmvSeries = [];
      let trendSeries = [];
      const revenueType = ['general', 'tickets', 'administration', 'priority'].includes(url.searchParams.get('revenue_type'))
        ? url.searchParams.get('revenue_type')
        : 'general';
      const revenuePeriod = ['daily', 'weekly', 'monthly', 'yearly'].includes(url.searchParams.get('revenue_period'))
        ? url.searchParams.get('revenue_period')
        : 'daily';

      if (tableNames.has('ingressos_emitidos')) {
        const [ticketRows] = await db.query('SELECT COUNT(*) AS totalTickets FROM dbo.ingressos_emitidos');
        totalTickets = Number(ticketRows[0]?.totalTickets || 0);
      }
      if (tableNames.has('pedidos')) {
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

        const revenueSince = revenuePeriod === 'yearly'
          ? 'DATEADD(year, -4, CAST(SYSUTCDATETIME() AS date))'
          : revenuePeriod === 'monthly'
            ? 'DATEADD(month, -11, CAST(SYSUTCDATETIME() AS date))'
            : revenuePeriod === 'weekly'
              ? 'DATEADD(week, -7, CAST(SYSUTCDATETIME() AS date))'
              : 'DATEADD(day, -6, CAST(SYSUTCDATETIME() AS date))';
        const revenueBucket = revenuePeriod === 'yearly'
          ? "DATEFROMPARTS(YEAR(source.created_at), 1, 1)"
          : revenuePeriod === 'monthly'
            ? "DATEFROMPARTS(YEAR(source.created_at), MONTH(source.created_at), 1)"
            : revenuePeriod === 'weekly'
              ? "DATEADD(week, DATEDIFF(week, 0, source.created_at), 0)"
              : "CAST(source.created_at AS date)";
        if (revenueType === 'general') {
          const eventClause = eventId ? 'AND source.evento_id = ?' : '';
          const params = eventId ? [eventId] : [];
          const [revenueRows] = await db.query(`
            SELECT COALESCE(SUM(source.amount), 0) AS totalRevenue
            FROM (
              SELECT DISTINCT p.id, p.valor_total AS amount, p.criado_em AS created_at, i.evento_id
              FROM dbo.pedidos p
              JOIN dbo.ingressos_emitidos i ON i.pedido_id = p.id
              WHERE p.status = 'aprovado'
              UNION ALL
              SELECT rep.id, COALESCE(rep.valor_taxa, 0) + COALESCE(rep.valor_taxa_administracao, 0),
                rep.criado_em, r.evento_id
              FROM dbo.repasse_revendas rep
              JOIN dbo.revendas r ON r.id = rep.revenda_id
            ) source
            WHERE source.created_at >= ${revenueSince} ${eventClause}
          `, params);
          totalRevenue = Number(revenueRows[0]?.totalRevenue || 0);
          const [revenueSeriesRows] = await db.query(`
            SELECT CONVERT(varchar(10), bucket, 103) AS label, SUM(amount) AS value
            FROM (
              SELECT ${revenueBucket} AS bucket, source.amount
              FROM (
                SELECT DISTINCT p.id, p.valor_total AS amount, p.criado_em AS created_at, i.evento_id
                FROM dbo.pedidos p
                JOIN dbo.ingressos_emitidos i ON i.pedido_id = p.id
                WHERE p.status = 'aprovado'
                UNION ALL
                SELECT rep.id, COALESCE(rep.valor_taxa, 0) + COALESCE(rep.valor_taxa_administracao, 0),
                  rep.criado_em, r.evento_id
                FROM dbo.repasse_revendas rep
                JOIN dbo.revendas r ON r.id = rep.revenda_id
              ) source
              WHERE source.created_at >= ${revenueSince} ${eventClause}
            ) values_by_period
            GROUP BY bucket ORDER BY bucket
          `, params);
          trendSeries = revenueSeriesRows.map(row => ({ label: row.label, value: Number(row.value || 0) }));
        } else if (revenueType === 'tickets') {
          const eventClause = eventId ? 'AND i.evento_id = ?' : '';
          const params = eventId ? [eventId] : [];
          const [revenueRows] = await db.query(`
            SELECT COALESCE(SUM(source.amount), 0) AS totalRevenue
            FROM (
              SELECT DISTINCT p.id, p.valor_total AS amount
              FROM dbo.pedidos p
              JOIN dbo.ingressos_emitidos i ON i.pedido_id = p.id
              WHERE p.status = 'aprovado' AND p.criado_em >= ${revenueSince} ${eventClause}
            ) source
          `, params);
          totalRevenue = Number(revenueRows[0]?.totalRevenue || 0);
          const [revenueSeriesRows] = await db.query(`
            SELECT CONVERT(varchar(10), bucket, 103) AS label, SUM(amount) AS value
            FROM (
              SELECT ${revenueBucket} AS bucket, source.amount
              FROM (
                SELECT DISTINCT p.id, p.valor_total AS amount, p.criado_em AS created_at, i.evento_id
                FROM dbo.pedidos p
                JOIN dbo.ingressos_emitidos i ON i.pedido_id = p.id
                WHERE p.status = 'aprovado' AND p.criado_em >= ${revenueSince} ${eventClause}
              ) source
            ) values_by_period
            GROUP BY bucket ORDER BY bucket
          `, params);
          trendSeries = revenueSeriesRows.map(row => ({ label: row.label, value: Number(row.value || 0) }));
        } else if (tableNames.has('repasse_revendas')) {
          const column = revenueType === 'priority' ? 'valor_taxa' : 'valor_taxa_administracao';
          const revenueRepasseBucket = revenuePeriod === 'yearly'
            ? "DATEFROMPARTS(YEAR(rep.criado_em), 1, 1)"
            : revenuePeriod === 'monthly'
              ? "DATEFROMPARTS(YEAR(rep.criado_em), MONTH(rep.criado_em), 1)"
              : revenuePeriod === 'weekly'
                ? "DATEADD(week, DATEDIFF(week, 0, rep.criado_em), 0)"
                : "CAST(rep.criado_em AS date)";
          const eventClause = eventId ? 'AND r.evento_id = ?' : '';
          const params = eventId ? [eventId] : [];
          const [revenueRows] = await db.query(`
            SELECT COALESCE(SUM(rep.${column}), 0) AS totalRevenue
            FROM dbo.repasse_revendas rep
            JOIN dbo.revendas r ON r.id = rep.revenda_id
            WHERE rep.criado_em >= ${revenueSince} ${eventClause}
          `, params);
          totalRevenue = Number(revenueRows[0]?.totalRevenue || 0);
          const [revenueSeriesRows] = await db.query(`
            SELECT CONVERT(varchar(10), bucket, 103) AS label, SUM(amount) AS value
            FROM (
              SELECT ${revenueRepasseBucket} AS bucket, rep.${column} AS amount
              FROM dbo.repasse_revendas rep
              JOIN dbo.revendas r ON r.id = rep.revenda_id
              WHERE rep.criado_em >= ${revenueSince} ${eventClause}
            ) values_by_period
            GROUP BY bucket ORDER BY bucket
          `, params);
          trendSeries = revenueSeriesRows.map(row => ({ label: row.label, value: Number(row.value || 0) }));
        }
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
        return send(response, 400, { ok: false, message: 'Tipo ou status de usuÃƒÂ¡rio invÃƒÂ¡lido.' });
      }

      const [[admin]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [adminEmail]);
      if (!admin || admin.tipo !== 'admin' || !(await bcrypt.compare(adminPassword, admin.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Senha do administrador invÃƒÂ¡lida.' });
      }
      if (admin.id === userId && tipo !== 'admin') {
        return send(response, 400, { ok: false, message: 'A conta do administrador nÃƒÂ£o pode perder o tipo admin.' });
      }

      const [[affectedUser]] = await db.query('SELECT nome FROM dbo.usuarios WHERE id = ?', [userId]);
      const [updated] = await db.query(
        `UPDATE dbo.usuarios
         SET tipo = ?, status = ?
         OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.tipo, INSERTED.status
         WHERE id = ?`,
        [tipo, requestedStatus === 'suspensa' ? 'suspensa' : 'aprovado', userId]
      );
      if (!updated.length) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      await audit('alteracao_acesso', `Tipo alterado para ${tipo} e status para ${requestedStatus}.`, 'usuario', `Conta de ${affectedUser?.nome || 'usuÃƒÂ¡rio'}`, { id: admin.id, nome: admin.nome, tipo: 'admin' });
      return send(response, 200, { ok: true, user: { ...updated[0], status: requestedStatus } });
    } catch (error) {
      console.error('[admin] Erro ao atualizar usuÃƒÂ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel atualizar o usuÃƒÂ¡rio.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/admin\/users\/\d+$/.test(url.pathname)) {
    try {
      const userId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const adminEmail = normalizeEmail(body.admin_email);
      const adminPassword = String(body.admin_password || '');
      if (!adminEmail || !adminPassword) {
        return send(response, 400, { ok: false, message: 'E-mail e senha do administrador sÃƒÂ£o obrigatÃƒÂ³rios.' });
      }

      const [[admin]] = await db.query('SELECT id, nome, tipo, senha_hash FROM dbo.usuarios WHERE email = ?', [adminEmail]);
      if (!admin || String(admin.tipo).toLowerCase() !== 'admin' || !(await bcrypt.compare(adminPassword, admin.senha_hash))) {
        return send(response, 403, { ok: false, message: 'Senha do administrador invÃƒÂ¡lida.' });
      }
      if (admin.id === userId) {
        return send(response, 400, { ok: false, message: 'A conta do administrador logado nÃƒÂ£o pode ser excluÃƒÂ­da por este painel.' });
      }

      const [[affectedUser]] = await db.query('SELECT id, nome, email, tipo, status FROM dbo.usuarios WHERE id = ?', [userId]);
      if (!affectedUser) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      if (String(affectedUser.tipo).toLowerCase() === 'admin') {
        return send(response, 403, { ok: false, message: 'Contas de administrador nÃƒÂ£o podem ser excluÃƒÂ­das por este fluxo.' });
      }

      const releasedEmail = `excluida-${userId}-${Date.now()}@invalid.trocaticket.local`;
      await db.query(
        `UPDATE dbo.usuarios
         SET status = 'excluida', email = ?, cpf = NULL, telefone = NULL,
             email_verificado = 0, codigo_verificacao = NULL
         WHERE id = ?`,
        [releasedEmail, userId]
      );
      await audit('exclusao_usuario', `Conta de ${affectedUser.nome || affectedUser.email} excluÃƒÂ­da pelo painel administrativo; dados de acesso liberados para novo cadastro.`, 'usuario', userId, { id: admin.id, nome: admin.nome, tipo: 'admin' });
      return send(response, 200, { ok: true, message: 'Conta excluÃƒÂ­da. O e-mail, CPF e telefone jÃƒÂ¡ podem ser usados em um novo cadastro.', user_id: userId });
    } catch (error) {
      console.error('[admin] Erro ao excluir usuÃƒÂ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel excluir a conta.' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/admin/tickets') {
    try {
      const operator = await getTicketOperator(request);
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito ÃƒÂ  equipe de operaÃƒÂ§ÃƒÂ£o.' });
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
          'nÃƒÂ£o identificado' AS lotCategory,
          p.criado_em AS purchaseDate,
          CASE WHEN i.bilheteria_id IS NULL THEN 'EmissÃƒÂ£o prÃƒÂ³pria' ELSE 'EmissÃƒÂ£o por bilheteria parceira' END AS emissionMethod,
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
      if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito ÃƒÂ  equipe de operaÃƒÂ§ÃƒÂ£o.' });
      await ensureTicketSecuritySchema();
      const ticketId = Number(url.pathname.split('/')[4]);
      const [rows] = await db.query('SELECT id, numero_ingresso, status FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      if (!rows.length) return send(response, 404, { ok: false, message: 'Ingresso nÃƒÂ£o encontrado.' });
      if (!['ativo', 'valido'].includes(String(rows[0].status).toLowerCase())) {
        return send(response, 409, { ok: false, message: 'Este ingresso nÃƒÂ£o possui um hash ativo.' });
      }
      const ticketSecret = await getTicketSecret(ticketId);
      const timeStep = Math.floor(Date.now() / 1000 / 60);
      const payload = makeActiveTicketPayload(rows[0].numero_ingresso, ticketSecret.secret_key, timeStep);
      const qrImage = await QRCode.toDataURL(payload, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
      return send(response, 200, { ok: true, ticketId, timeStep, hash: payload.split(':')[2], payload, qrImage, expiresAt: (timeStep + 1) * 60000 });
    } catch (error) {
      console.error('[bilheteria] Erro ao gerar QR ativo:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel gerar o QR ativo.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/bilheteria/validar-acesso') {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito ÃƒÂ  equipe de operaÃƒÂ§ÃƒÂ£o.' });
    const connection = await db.getConnection();
    try {
      await ensureTicketSecuritySchema();
      const body = await parseBody(request);
      const parts = String(body.qr_code_payload || '').trim().split(':');
      if (parts.length !== 3 || !parts[0] || !/^\d+$/.test(parts[1]) || !/^[a-f\d]{64}$/i.test(parts[2])) {
        return send(response, 400, { ok: false, kind: 'error', message: 'Ingresso InvÃƒÂ¡lido ou NÃƒÂ£o Encontrado.' });
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
        return send(response, 404, { ok: false, kind: 'error', message: 'Ingresso InvÃƒÂ¡lido ou NÃƒÂ£o Encontrado.' });
      }
      const status = String(ticket.status || '').toLowerCase();
      if (['utilizado', 'usado', 'checked_in'].includes(status)) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso jÃƒÂ¡ utilizado.', checkinAt: ticket.utilizado_em });
      }
      if (!['ativo', 'valido'].includes(status)) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso revogado, cancelado ou expirado.' });
      }
      if (body.setor_catraca && body.setor_catraca !== '*' && ticket.setor_nome !== body.setor_catraca) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'warning', message: `SETOR INCORRETO: Ingresso emitido para ${ticket.setor_nome || 'setor nÃƒÂ£o informado'}. Direcione o cliente para o portÃƒÂ£o correto.`, sector: ticket.setor_nome || null });
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
        return send(response, 401, { ok: false, kind: 'error', message: 'Hash invÃƒÂ¡lido ou chave revogada.' });
      }
      const [updated] = await connection.query(`
        UPDATE dbo.ingressos_emitidos
        SET status = 'utilizado', utilizado_em = SYSUTCDATETIME(), motivo_checkin = 'Leitura por QR Code', checkin_operador = ?
        OUTPUT INSERTED.utilizado_em
        WHERE id = ? AND status IN ('ativo', 'valido')
      `, [operator.nome || operator.email, ticket.id]);
      if (!updated.length) {
        await connection.rollback();
        return send(response, 409, { ok: false, kind: 'error', message: 'Ingresso jÃƒÂ¡ utilizado por outra catraca.' });
      }
      await connection.commit();
      await audit('checkin_ingresso', `Check-in validado no evento ${ticket.evento}.`, 'ingresso', ticket.numero_ingresso, operator);
      return send(response, 200, { ok: true, kind: 'success', message: 'ACESSO LIBERADO', ticket: { id: ticket.id, numero_ingresso: ticket.numero_ingresso, titular: ticket.titular, setor: ticket.setor_nome, evento: ticket.evento, bilheteria: ticket.bilheteria_origem || 'Troca Ticket' }, checkinAt: updated[0].utilizado_em });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro ao validar ingresso:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel validar o ingresso.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && /^\/api\/bilheteria\/tickets\/\d+\/checkin-manual$/.test(url.pathname)) {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito ÃƒÂ  equipe de operaÃƒÂ§ÃƒÂ£o.' });
    const ticketId = Number(url.pathname.split('/')[4]);
    const connection = await db.getConnection();
    try {
      await ensureTicketSecuritySchema();
      const body = await parseBody(request);
      const reason = String(body.motivo || '').trim();
      if (!reason) return send(response, 400, { ok: false, message: 'Informe o motivo da liberaÃƒÂ§ÃƒÂ£o manual.' });
      await connection.beginTransaction();
      const [rows] = await connection.query('SELECT id, numero_ingresso, status FROM dbo.ingressos_emitidos WITH (UPDLOCK, ROWLOCK) WHERE id = ?', [ticketId]);
      if (!rows.length) {
        await connection.rollback();
        return send(response, 404, { ok: false, message: 'Ingresso nÃƒÂ£o encontrado.' });
      }
      if (!['ativo', 'valido'].includes(String(rows[0].status).toLowerCase())) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Ingresso nÃƒÂ£o estÃƒÂ¡ disponÃƒÂ­vel para check-in.' });
      }
      const [updated] = await connection.query(`
        UPDATE dbo.ingressos_emitidos
        SET status = 'utilizado', utilizado_em = SYSUTCDATETIME(), motivo_checkin = ?, checkin_operador = ?
        OUTPUT INSERTED.utilizado_em
        WHERE id = ? AND status IN ('ativo', 'valido')
      `, [reason.slice(0, 240), operator.nome || operator.email, ticketId]);
      if (!updated.length) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Ingresso jÃƒÂ¡ utilizado por outra catraca.' });
      }
      await connection.commit();
      await audit('checkin_manual_ingresso', `Check-in manual: ${reason}.`, 'ingresso', rows[0].numero_ingresso, operator);
      return send(response, 200, { ok: true, message: 'Check-in manual aprovado.', checkinAt: updated[0].utilizado_em });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro no check-in manual:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel concluir o check-in manual.' });
    } finally {
      connection.release();
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/bilheteria/transferencias') {
    const operator = await getTicketOperator(request);
    if (!operator) return send(response, 403, { ok: false, message: 'Acesso restrito ÃƒÂ  equipe de operaÃƒÂ§ÃƒÂ£o.' });
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
        return send(response, 404, { ok: false, message: 'Ingresso nÃƒÂ£o encontrado.' });
      }
      if (!['ativo', 'valido'].includes(String(ticket.status).toLowerCase())) {
        await connection.rollback();
        return send(response, 409, { ok: false, message: 'Somente ingressos disponÃƒÂ­veis podem ser transferidos.' });
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
        return send(response, 400, { ok: false, message: 'O novo titular jÃƒÂ¡ ÃƒÂ© o titular deste ingresso.' });
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
      await audit('transferencia_ingresso_painel', `${body.motivo || 'TransferÃƒÂªncia'}: titular anterior ${ticket.titular_anterior}; novo titular ${recipient.nome}; hash anterior invalidado e novo hash criado.`, 'ingresso', newNumber, operator);
      return send(response, 200, { ok: true, message: 'TransferÃƒÂªncia concluÃƒÂ­da. Hash antigo revogado e nova chave criada.', matrixSync, ticket: { id: newTicketRows[0].id, numero_ingresso: newNumber, titular: recipient.nome, cpf: recipient.cpf, setor: ticket.setor_nome, evento_id: ticket.evento_id, bilheteria_origem: ticket.bilheteria_origem || 'Troca Ticket' } });
    } catch (error) {
      try { await connection.rollback(); } catch {}
      console.error('[bilheteria] Erro na transferÃƒÂªncia:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel concluir a transferÃƒÂªncia.' });
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
        return send(response, 400, { ok: false, message: 'O painel sÃƒÂ³ pode definir os status cancelado ou bloqueado.' });
      }

      const [result] = await db.query(
        `UPDATE dbo.ingressos_emitidos
         SET status = ?
         OUTPUT INSERTED.id, INSERTED.status
         WHERE id = ?`,
        [status, ticketId]
      );
      if (!result.length) return send(response, 404, { ok: false, message: 'Ingresso nÃƒÂ£o encontrado.' });
      const [[ticket]] = await db.query(`SELECT e.nome AS evento FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id WHERE i.id = ?`, [ticketId]);
      const actor = auditActor(body);
      const [[ticketCode]] = await db.query('SELECT numero_ingresso FROM dbo.ingressos_emitidos WHERE id = ?', [ticketId]);
      await audit('alteracao_status_ingresso', `Status do ingresso do evento ${ticket?.evento || 'evento'} alterado para ${status}.`, 'ingresso', ticketCode?.numero_ingresso || 'Ingresso nÃƒÂ£o identificado', actor);
      return send(response, 200, { ok: true, ticket: result[0] });
    } catch (error) {
      console.error('[admin] Erro ao alterar status do ingresso:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel alterar o status.' });
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
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
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
      console.error('[admin] Erro no histÃƒÂ³rico do usuÃƒÂ¡rio:', error.message);
      return send(response, 500, { ok: false, message: 'NÃƒÂ£o foi possÃƒÂ­vel carregar o histÃƒÂ³rico.' });
    }
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/admin/featured-events')) {
    try {
      const [events] = await db.query(`SELECT id, nome AS name, artista, [local] AS location, data_evento AS date,
        ticket_calculado AS price, imagem, destaque, status FROM dbo.eventos
        WHERE destaque = 1 AND status = 'publicado' ORDER BY id DESC`);
      events.forEach(event => {
        event.imagem = eventImageResponse(event.imagem, event.id, 'imagem', eventImageVersion(event.imagem));
      });
      return send(response, 200, { ok: true, events });
    } catch (error) { return send(response, 500, { ok: false, message: error.message }); }
  }

  // ===== CARTÃƒâ€¢ES DO USUÃƒÂRIO (ROBUSTO E SEGURO) =====
  if (request.method === 'GET' && url.pathname === '/api/usuario/cartoes') {
    try {
      const email = normalizeEmail(url.searchParams.get('email'));
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });
      
      const [cards] = await db.query('SELECT id, nome_titular, ultimos_digitos, bandeira, validade_mes, validade_ano, criado_em FROM dbo.cartoes_usuario WHERE usuario_id = ? ORDER BY id DESC', [users[0].id]);
      return send(response, 200, { ok: true, cards });
    } catch (error) {
      console.error('[cartoes GET]', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao carregar cartÃƒÂµes.' });
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/usuario/cartoes') {
    try {
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'Comprador nÃƒÂ£o encontrado.' });

      const cpf = normalizeCpf(body.cpf);
      if (cpf.length !== 11) return send(response, 400, { ok: false, message: 'Informe um CPF com 11 nÃƒÂºmeros. A pontuaÃƒÂ§ÃƒÂ£o ÃƒÂ© opcional.' });

      const numCartao = String(body.numero_cartao || body.numero || '').trim();
      const numLimpo = numCartao.replace(/\D/g, '');
      if (numLimpo.length < 13 || numLimpo.length > 19) {
        return send(response, 400, { ok: false, message: 'NÃƒÂºmero de cartÃƒÂ£o invÃƒÂ¡lido.' });
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

      return send(response, 201, { ok: true, message: 'CartÃƒÂ£o salvo com seguranÃƒÂ§a!' });
    } catch (error) {
      console.error('[cartoes POST] Erro:', error.message);
      return send(response, 500, { ok: false, message: 'Erro ao salvar o cartÃƒÂ£o no banco de dados.' });
    }
  }

  if (request.method === 'DELETE' && /^\/api\/usuario\/cartoes\/\d+$/.test(url.pathname)) {
    try {
      const cardId = Number(url.pathname.split('/').pop());
      const body = await parseBody(request);
      const email = normalizeEmail(body.email);
      const [users] = await db.query('SELECT id FROM dbo.usuarios WHERE email = ? LIMIT 1', [email]);
      if (!users.length) return send(response, 404, { ok: false, message: 'UsuÃƒÂ¡rio nÃƒÂ£o encontrado.' });

      await db.query('DELETE FROM dbo.cartoes_usuario WHERE id = ? AND usuario_id = ?', [cardId, users[0].id]);
      return send(response, 200, { ok: true, message: 'CartÃƒÂ£o excluÃƒÂ­do com sucesso.' });
    } catch (error) {
      return send(response, 500, { ok: false, message: 'Erro ao excluir o cartÃƒÂ£o.' });
    }
  }

  // ===== ARQUIVOS ESTÃƒÂTICOS =====
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
    '/revenda/anunciar': '/account/revenda.html',
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
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Caminho inválido');
  }

  const filePath = requestedPath.startsWith('/app/')
    ? path.join(root, 'public', requestedPath.replace(/^\/+/, ''))
    : requestedPath.startsWith('/uploads/')
      ? path.join(root, 'public', requestedPath.replace(/^\/+/, ''))
      : path.join(root, requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, ''));
  const normalizedRoot = path.resolve(root) + path.sep;
  const normalizedFilePath = path.resolve(filePath);
  const relativePath = path.relative(root, normalizedFilePath).split(path.sep).join('/');
  const hiddenPath = relativePath.split('/').some(segment => segment.startsWith('.'));
  const extension = path.extname(normalizedFilePath).toLowerCase();
  if (
    !normalizedFilePath.startsWith(normalizedRoot)
    || !fs.existsSync(normalizedFilePath)
    || fs.statSync(normalizedFilePath).isDirectory()
    || !mimeTypes[extension]
    || serverFiles.test(relativePath)
    || testFiles.test(relativePath)
    || serverDirectories.test(relativePath)
    || hiddenPath
  ) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Não encontrado');
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(normalizedFilePath).toLowerCase()] || 'application/octet-system' });
  fs.createReadStream(normalizedFilePath).pipe(response);
}

module.exports = handler;

if (require.main === module) {
  const server = http.createServer(handler);
  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      console.error(`A porta ${port} já está em uso. Feche o servidor existente ou use outra porta com PORT=3010.`);
      process.exitCode = 1;
      return;
    }
    throw error;
  });
  server.listen(port, () => console.log(`TrocaTicket rodando em http://localhost:${port}`));
}
