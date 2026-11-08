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

module.exports = { isTicketInResale, resaleRestriction };
