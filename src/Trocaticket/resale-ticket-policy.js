function isTicketInResale(ticket) {
  return Boolean(ticket && (ticket.emRevenda || ticket.revendaId));
}

function resaleRestriction(ticket, action) {
  if (!isTicketInResale(ticket)) return null;
  const messages = {
    qr: 'Ingresso em revenda. Cancele o anúncio para usar o QR Code.',
    transfer: 'Ingresso em revenda. Cancele o anúncio antes de transferir.',
    checkin: 'Ingresso em revenda, entrada não permitida.'
  };
  return messages[action] || null;
}

function isEligibleResaleTicket(ticket) {
  return String(ticket?.status || '').toLowerCase() === 'ativo' && !Boolean(ticket?.revoked);
}

function getTicketDisplayState(ticket) {
  if (ticket?.transferido) return 'transferido';
  if (ticket?.repassado) return 'repassado';
  if (isTicketInResale(ticket)) return 'emRevenda';
  return 'normal';
}

module.exports = {
  isTicketInResale,
  resaleRestriction,
  isEligibleResaleTicket,
  getTicketDisplayState
};
