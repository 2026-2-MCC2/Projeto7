document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  const returnPath = `../account/ingresso.html${window.location.search}`;
  const sessionHeaders = {};
  if (user?.session_token) sessionHeaders.Authorization = ['Bearer', user.session_token].join(' ');
  function redirectToLogin() {
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
    window.location.replace(`../auth/login.html?redirect=${encodeURIComponent(returnPath)}`);
  }
  if (!user || !user.email) {
    redirectToLogin();
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetEventName = urlParams.get('evento') || '';
  const targetTicketId = urlParams.get('id');
  if (!targetTicketId || !/^\d+$/.test(targetTicketId)) {
    window.location.replace('../account/meus-ingressos.html');
    return;
  }

  let groupTickets = [];
  let currentIndex = 0;
  const ticketDetails = new Map();
  let navigationRequest = 0;
  let qrRefreshTimer = null;
  let toastTimer = null;

  function showActionToast(message, isError = false) {
    const toast = document.getElementById('ticket-action-toast');
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 7000);
  }

  async function postTicketAction(path, ticket) {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...sessionHeaders
      },
      body: JSON.stringify({ ingresso_id: ticket.id })
    });
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
      redirectToLogin();
      throw new Error('Sua sessão expirou. Entre novamente.');
    }
    if (!response.ok || !data.ok) throw new Error(data.message || `Erro HTTP ${response.status}`);
    return data;
  }

  function setDigitalActionLoading(button, loading, loadingText, defaultText) {
    button.disabled = loading;
    button.classList.toggle('is-loading', loading);
    button.setAttribute('aria-busy', String(loading));
    button.querySelector('.digital-action-label').textContent = loading ? loadingText : defaultText;
  }

  function isTicketUsed(ticket) {
    const status = String(ticket?.status || '').trim().toLowerCase();
    return ['utilizado', 'usado', 'checked_in', 'checked-in', 'checkedin', 'used'].includes(status);
  }

  function isTicketResold(ticket) {
    return Boolean(ticket?.repassado);
  }

  function isTicketTransferred(ticket) {
    return Boolean(ticket?.transferido);
  }

  function checkinDateTime(value) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'horário não disponível' : parsed.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  function openExternalUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }

  function openOfflinePackage(content, deliveryMessage) {
    if (typeof content !== 'string' || !content.trim()) return false;
    const notice = `<div style="position:fixed;z-index:9999;top:12px;right:12px;left:12px;padding:12px 14px;border:1px solid #467b5a;border-radius:8px;background:#173322;color:#d7ffe3;font:600 13px/1.4 system-ui,sans-serif;text-align:center;box-shadow:0 8px 24px #0006;">${deliveryMessage}</div>`;
    const standaloneHtml = content.replace(/<body([^>]*)>/i, `<body$1>${notice}`);
    const blobUrl = URL.createObjectURL(new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' }));
    openExternalUrl(blobUrl);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    return true;
  }

  function dateFormatted(value) { 
    const parsed = new Date(value); 
    if (Number.isNaN(parsed.getTime())) return 'Data a confirmar';
    return parsed.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  }

  function dateTimePill(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'A definir';
    const day = parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${day} às ${time}`;
  }

  function getFirstName(fullName) {
    if (!fullName) return 'destinatário';
    const cleaned = String(fullName).trim();
    if (cleaned.includes('@')) {
      return cleaned.split('@')[0];
    }
    return cleaned.split(/\s+/)[0];
  }

  function resolveEventImage(ticket) {
    if (ticket.imagem && typeof ticket.imagem === 'string' && ticket.imagem.trim()) {
      const image = ticket.imagem.trim(); if (/^(data:|blob:|https?:\/\/|\/)/i.test(image)) return image; return `../${image.replace(/^\.?\//, '')}`;
    }
    const name = String(ticket.eventName || ticket.evento || '').toLowerCase();
    if (name.includes('arena')) return '/imagens/arena+.jpeg';
    if (name.includes('sea') || name.includes('club')) return '/imagens/sea club.jpeg';
    if (name.includes('esperia') || name.includes('mirante')) return '/imagens/mirante esperia.jpeg';
    if (name.includes('sanca') || name.includes('trap')) return '/imagens/trap in sanca.jpeg';
    if (name.includes('terra')) return '/imagens/terra sp.jpeg';
    if (name.includes('chefe')) return '/imagens/festa do chefe.jpeg';
    return '/imagens/logo troca ticket.png';
  }

  async function drawTicketQr(ticket) {
    const image = document.getElementById('qr-code-image');
    const status = document.getElementById('qr-refresh-status');
    if (!image) return;
    image.alt = 'QR dinâmico do ingresso';
    image.hidden = false;
    image.style.display = '';
    if (status) status.hidden = false;
    if (isTicketTransferred(ticket)) {
      image.removeAttribute('src');
      image.hidden = true;
      image.alt = '';
      return;
    }
    if (isTicketResold(ticket) || ticket.emRevenda) {
      image.removeAttribute('src');
      image.hidden = true;
      image.alt = '';
      return;
    }
    if (isTicketUsed(ticket)) {
      image.removeAttribute('src');
      image.hidden = true;
      image.alt = '';
      if (status) {
        status.textContent = '';
        status.hidden = true;
      }
      return;
    }
    if (!ticket.qr_code_payload) {
      image.removeAttribute('src');
      image.hidden = true;
      if (status) status.textContent = 'Este ingresso não possui um QR ativo.';
      return;
    }
    if (!ticket.qr_code_image) {
      image.removeAttribute('src');
      image.hidden = true;
      if (status) status.textContent = 'Não foi possível carregar o QR. Atualize o ingresso.';
      return;
    }
    image.src = ticket.qr_code_image;
    if (status) status.textContent = 'QR atualizado automaticamente.';
  }

  function scheduleQrRefresh() {
    window.clearTimeout(qrRefreshTimer);
    if (groupTickets[currentIndex]?.emRevenda) {
      qrRefreshTimer = null;
      return;
    }
    const millisecondsToNextStep = 60000 - (Date.now() % 60000) + 150;
    qrRefreshTimer = window.setTimeout(async () => {
      try { await refreshActiveQr(); }
      catch (error) { console.warn('[ingresso] Falha ao atualizar QR:', error.message); }
      if (!groupTickets[currentIndex]?.emRevenda) scheduleQrRefresh();
    }, millisecondsToNextStep);
  }

  async function refreshActiveQr() {
    const currentTicket = groupTickets[currentIndex];
    if (!currentTicket || document.hidden) return;
    const response = await fetch(`/api/usuario/meus-ingressos/${encodeURIComponent(currentTicket.id)}?email=${encodeURIComponent(user.email)}&includeQr=true`, {
      headers: sessionHeaders
    });
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
      currentTicket.qr_code_payload = null;
      await drawTicketQr(currentTicket);
      redirectToLogin();
      return;
    }

    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    const latestTicket = data.ticket;
    if (!latestTicket) {
      currentTicket.qr_code_payload = null;
      currentTicket.qr_code_image = null;
      await drawTicketQr(currentTicket);
      return;
    }
    const statusChanged = latestTicket.status !== currentTicket.status;
    const checkinChanged = latestTicket.checkinAt !== currentTicket.checkinAt;
    const transferChanged = latestTicket.transferido !== currentTicket.transferido
      || latestTicket.destinatario_transferencia_nome !== currentTicket.destinatario_transferencia_nome;
    if (!statusChanged && !checkinChanged && !transferChanged
      && latestTicket.qr_code_payload === currentTicket.qr_code_payload
      && latestTicket.qr_code_image === currentTicket.qr_code_image) return;
    currentTicket.status = latestTicket.status;
    currentTicket.checkinAt = latestTicket.checkinAt;
    currentTicket.qr_code_payload = latestTicket.qr_code_payload;
    currentTicket.qr_code_image = latestTicket.qr_code_image;
    currentTicket.emRevenda = latestTicket.emRevenda;
    currentTicket.revendaId = latestTicket.revendaId;
    currentTicket.transferido = latestTicket.transferido;
    currentTicket.destinatario_transferencia_nome = latestTicket.destinatario_transferencia_nome;
    await renderTicket();
  }

  async function loadTicketDetail(ticket) {
    if (!ticket || ticket.qr_code_image || isTicketUsed(ticket)) return ticket;
    if (!ticketDetails.has(ticket.id)) {
      ticketDetails.set(ticket.id, fetch(`/api/usuario/meus-ingressos/${encodeURIComponent(ticket.id)}?email=${encodeURIComponent(user.email)}&includeQr=true`, {
        headers: sessionHeaders
      }).then(async response => {
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
          redirectToLogin();
          throw new Error('Sua sessão expirou. Entre novamente.');
        }
        if (!response.ok || !data.ok || !data.ticket) throw new Error(data.message || 'Não foi possível carregar o QR Code.');
        Object.assign(ticket, data.ticket);
        return ticket;
      }).catch(error => {
        ticketDetails.delete(ticket.id);
        throw error;
      }));
    }
    return ticketDetails.get(ticket.id);
  }

  async function renderTicket() {
    const ticket = groupTickets[currentIndex];
    if (!ticket) return;
    const used = isTicketUsed(ticket);
    const transferred = isTicketTransferred(ticket);
    const resold = isTicketResold(ticket);
    const emRevenda = Boolean(ticket.emRevenda);

    document.getElementById('ticket-event-name').textContent = ticket.eventName || ticket.evento || 'EVENTO';
    
    // Regra estrita: exibe SOMENTE se tiver sido cadastrado no painel
    const artistElement = document.getElementById('ticket-artist-name');
    const artistName = (ticket.artista && typeof ticket.artista === 'string') ? ticket.artista.trim() : '';

    if (artistName) {
      artistElement.textContent = artistName;
      artistElement.style.display = 'block';
    } else {
      artistElement.textContent = '';
      artistElement.style.display = 'none';
    }

    document.getElementById('ticket-date-text').textContent = dateFormatted(ticket.date);
    document.getElementById('ticket-time-text').textContent = dateTimePill(ticket.date);
    document.getElementById('ticket-serial-label').textContent = `INGRESSO: #${ticket.codigo_ingresso || ticket.numero_ingresso}`;
    document.getElementById('ticket-order-label').textContent = `PEDIDO: #${ticket.codigo_pedido || 'N/A'}`;
    document.getElementById('ticket-cover-img').src = resolveEventImage(ticket);
    const qrBox = document.querySelector('.ticket-qr-box');
    qrBox.classList.toggle('is-used', used);
    qrBox.classList.toggle('is-transferred', transferred);
    qrBox.classList.toggle('is-resale', emRevenda);
    document.getElementById('ticket-used-overlay').hidden = !used && !resold && !transferred && !emRevenda;
    document.querySelector('#ticket-used-overlay strong').textContent = transferred
      ? 'INGRESSO TRANSFERIDO'
      : resold ? 'INGRESSO REPASSADO'
        : emRevenda ? 'INGRESSO EM REVENDA'
          : 'INGRESSO UTILIZADO';
    document.querySelector('#ticket-used-overlay span').textContent = transferred
      ? ''
      : resold ? 'Confira em Revenda.'
        : emRevenda ? 'Cancele o anúncio para voltar a usar o QR Code.'
          : 'Este acesso já foi consumido.';
    const usedNotice = document.getElementById('ticket-used-notice');
    usedNotice.hidden = !used;
    usedNotice.textContent = used
      ? `Este ingresso já foi validado na portaria do evento em ${checkinDateTime(ticket.checkinAt)}.`
      : '';

    // Controles do Carrossel Manual
    const carouselNav = document.getElementById('carousel-nav-container');
    if (groupTickets.length > 1) {
      carouselNav.style.display = 'flex';
      document.getElementById('carousel-counter-label').textContent = `INGRESSO(S) ${currentIndex + 1} / ${groupTickets.length}`;
    } else {
      carouselNav.style.display = 'none';
    }

    // BotÃµes de AÃ§Ã£o
    const btnTransfer = document.getElementById('btn-transfer-ticket');
    const btnResell = document.getElementById('btn-resell-ticket');
    const alertMsg = document.getElementById('transfer-alert-msg');
    const isPendente = Boolean(ticket.transferencia_pendente_id);
    const jaTransferido = Number(ticket.versao_titularidade || 1) > 1 || transferred;

    if (isPendente) {
      btnTransfer.disabled = false;
      btnTransfer.textContent = 'CANCELAR TRANSFERÃŠNCIA';
      btnTransfer.classList.add('btn-cancel-state');
      btnTransfer.classList.remove('btn-disabled-state');

      btnResell.disabled = true;
      btnResell.classList.add('btn-disabled-state');

      const primeiroNome = getFirstName(ticket.destinatario_pendente_nome);
      alertMsg.textContent = `Aguardando confirmação de ${primeiroNome}`;
      alertMsg.style.color = '#ff9f43';
    } else if (jaTransferido) {
      btnTransfer.disabled = true;
      btnTransfer.textContent = 'TRANSFERIR';
      btnTransfer.classList.add('btn-disabled-state');
      btnTransfer.classList.remove('btn-cancel-state');

      btnResell.disabled = false;
      btnResell.classList.remove('btn-disabled-state');

      alertMsg.textContent = transferred
        ? `Transferido para ${ticket.destinatario_transferencia_nome || 'novo titular'}.`
        : 'Ingresso transferido anteriormente. Permitida apenas a revenda.';
      alertMsg.style.color = '#ff6b6b';
    } else {
      btnTransfer.disabled = false;
      btnTransfer.textContent = 'TRANSFERIR';
      btnTransfer.classList.remove('btn-cancel-state', 'btn-disabled-state');

      btnResell.disabled = false;
      btnResell.classList.remove('btn-disabled-state');

      alertMsg.textContent = '';
    }

    document.getElementById('ticket-digital-actions').hidden = used || resold || transferred || emRevenda;
    document.querySelector('.ticket-actions-group').hidden = used || resold || transferred;
    btnTransfer.hidden = emRevenda || resold;
    btnResell.hidden = used || transferred || resold;
    btnTransfer.disabled = btnTransfer.disabled || emRevenda;
    btnResell.disabled = used || resold;
    btnResell.textContent = emRevenda ? 'VER ANÚNCIO NA REVENDA' : '🏷️ ANUNCIAR EM REVENDA';
    if (used || resold || transferred || emRevenda) {
      btnTransfer.disabled = true;
      btnResell.disabled = used || resold;
      btnTransfer.classList.remove('btn-cancel-state');
      btnTransfer.classList.add('btn-disabled-state');
      btnResell.classList.toggle('btn-disabled-state', used || resold);
      alertMsg.textContent = emRevenda
        ? 'Ingresso em revenda. Cancele o anúncio para voltar a usar o QR Code.'
        : transferred
        ? `Transferido para ${ticket.destinatario_transferencia_nome || 'novo titular'}.`
        : resold ? 'Repassado, conferir em Revenda.' : '';
    }

    // QR Code
    try { await drawTicketQr(ticket); }
    catch (err) { console.error('Erro no QR Code:', err); }
  }

  // Carrossel
  async function navigateTicket(step) {
    if (groupTickets.length <= 1) return;
    const requestId = ++navigationRequest;
    const nextIndex = (currentIndex + step + groupTickets.length) % groupTickets.length;
    const nextTicket = groupTickets[nextIndex];
    try {
      await loadTicketDetail(nextTicket);
      if (requestId !== navigationRequest) return;
      currentIndex = nextIndex;
      await renderTicket();
    } catch (error) {
      showActionToast(error.message || 'Não foi possível carregar o QR Code.', true);
    }
  }

  document.getElementById('btn-prev-ticket').addEventListener('click', () => navigateTicket(-1));
  document.getElementById('btn-next-ticket').addEventListener('click', () => navigateTicket(1));

  document.getElementById('btn-offline-ticket').addEventListener('click', async event => {
    const button = event.currentTarget;
    const ticket = groupTickets[currentIndex];
    if (!ticket || isTicketUsed(ticket)) return;
    setDigitalActionLoading(button, true, 'Preparando pacote offline...', 'Baixar para Acesso Offline (Enviar por E-mail)');
    try {
      const data = await postTicketAction('/api/ingresso/download-offline', ticket);
      const deliveryMessage = data.mock
        ? 'Ingresso offline aberto. O envio por e-mail está em modo de demonstração.'
        : `E-mail enviado para ${data.email}. O ingresso offline foi aberto em uma nova aba.`;
      const packageOpened = openOfflinePackage(data.offlineHtml, deliveryMessage);
      showActionToast(packageOpened
        ? deliveryMessage
        : data.mock
          ? 'Pacote offline preparado em modo de demonstração.'
          : `E-mail enviado para ${data.email}. O ingresso offline foi anexado ao e-mail.`);
    } catch (error) {
      showActionToast(error.message || 'Não foi possível preparar o pacote offline.', true);
    } finally {
      setDigitalActionLoading(button, false, '', 'Baixar para Acesso Offline (Enviar por E-mail)');
    }
  });

  document.getElementById('btn-google-wallet').addEventListener('click', async event => {
    const button = event.currentTarget;
    const ticket = groupTickets[currentIndex];
    if (!ticket || isTicketUsed(ticket)) return;
    setDigitalActionLoading(button, true, 'Preparando carteira...', 'Adicionar à Carteira do Google');
    try {
      const data = await postTicketAction('/api/ingresso/google-wallet-jwt', ticket);
      const destination = data.mock ? data.mockUrl : data.walletUrl;
      openExternalUrl(destination);
      if (data.mock) showActionToast('Prévia da Carteira do Google aberta em modo de demonstração. Configure as credenciais do emissor para ativar a emissão real.');
    } catch (error) {
      showActionToast(error.message || 'Não foi possível preparar o passe da carteira.', true);
    } finally {
      setDigitalActionLoading(button, false, '', 'Adicionar à Carteira do Google');
    }
  });

  // AÃ§Ã£o Transferir / Cancelar
  const dialog = document.getElementById('transfer-dialog-backdrop');
  document.getElementById('btn-transfer-ticket').addEventListener('click', async () => {
    const ticket = groupTickets[currentIndex];
    if (!ticket || isTicketUsed(ticket)) return;

    if (ticket.transferencia_pendente_id) {
      if (!confirm('Deseja realmente cancelar o repasse deste ingresso? O convite por e-mail será invalidado.')) {
        return;
      }

      try {
        const res = await fetch('/api/ingressos/cancelar-transferencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...sessionHeaders },
          body: JSON.stringify({ ingresso_id: ticket.id })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message);

        alert(data.message);
        ticket.transferencia_pendente_id = null;
        ticket.destinatario_pendente_nome = null;
        renderTicket();
      } catch (err) {
        alert(err.message);
      }
      return;
    }

    if (Number(ticket.versao_titularidade || 1) > 1) return;
    document.getElementById('input-destinatario-email').value = '';
    dialog.classList.add('open');
  });

  document.getElementById('btn-close-transfer-dialog').addEventListener('click', () => dialog.classList.remove('open'));
  document.getElementById('btn-abort-transfer').addEventListener('click', () => dialog.classList.remove('open'));

  // Confirmar Envio
  document.getElementById('btn-execute-transfer').addEventListener('click', async () => {
    const ticket = groupTickets[currentIndex];
    const emailDest = document.getElementById('input-destinatario-email').value.trim();

    if (!emailDest || !/^\S+@\S+\.\S+$/.test(emailDest)) {
      alert('Informe um e-mail válido.');
      return;
    }

    const btn = document.getElementById('btn-execute-transfer');
    try {
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      const res = await fetch('/api/ingressos/solicitar-transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...sessionHeaders },
        body: JSON.stringify({
          ingresso_id: ticket.id,
          destinatario_email: emailDest
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Falha ao solicitar transferência.');

      alert(data.message);
      dialog.classList.remove('open');

      ticket.transferencia_pendente_id = data.transferencia_id;
      ticket.destinatario_pendente_nome = data.destinatario_nome;
      renderTicket();
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Confirmar Envio';
    }
  });

  // AÃ§Ã£o Revender
  document.getElementById('btn-resell-ticket').addEventListener('click', () => {
    const ticket = groupTickets[currentIndex];
    if (!ticket || isTicketUsed(ticket) || ticket.transferencia_pendente_id) return;
    const ticketReference = ticket.codigo_ingresso || ticket.numero_ingresso || ticket.id;
    window.location.href = `../account/revenda.html?ingresso_id=${encodeURIComponent(ticket.id)}&ingresso_codigo=${encodeURIComponent(ticketReference)}`;
  });

  async function loadAllTickets() {
    const tickets = [];
    let cursor = '';
    do {
      const params = new URLSearchParams({
        email: user.email,
        limit: '50'
      });
      if (cursor) params.set('cursor', cursor);
      const response = await fetch(`/api/usuario/meus-ingressos?${params}`, {
        headers: sessionHeaders
      });
      if (!response.ok) return { response, tickets };
      const data = await response.json();
      if (!data.ok) return { response, tickets };
      tickets.push(...(data.tickets || []));
      cursor = data.nextCursor || '';
    } while (cursor);
    return { response: { status: 200 }, tickets };
  }

  function showTicketLoadError(error) {
    console.error('[ingresso] Falha ao carregar o ingresso:', error);
    const title = document.getElementById('ticket-event-name');
    const date = document.getElementById('ticket-date-text');
    const status = document.getElementById('qr-refresh-status');
    if (title) title.textContent = 'Não foi possível carregar o ingresso';
    if (date) date.textContent = 'Verifique se o servidor está ativo e tente novamente.';
    if (status) {
      status.textContent = 'Servidor indisponível. Inicie o TrocaTicket em http://localhost:3000 e atualize esta página.';
      status.hidden = false;
      status.classList.add('is-error');
    }
  }

  // Carrega o ingresso selecionado com QR e todos os ingressos do mesmo evento
  // sem gerar QR para os demais itens do grupo.
  Promise.all([
    fetch(`/api/usuario/meus-ingressos/${encodeURIComponent(targetTicketId)}?email=${encodeURIComponent(user.email)}&includeQr=true`, {
      headers: sessionHeaders
    }),
    loadAllTickets()
  ])
    .then(async ([detailResponse, listResponse]) => {
      const detailData = await detailResponse.json();
      const listData = listResponse.tickets ? { ok: true, tickets: listResponse.tickets } : await listResponse.json();
      if ([detailResponse, listResponse].some(response => response.status === 401 || response.status === 403)) {
        redirectToLogin();
        return null;
      }
      if (!detailResponse.ok || !detailData.ok || !detailData.ticket) {
        window.location.href = '../account/meus-ingressos.html';
        return null;
      }
      return { detail: detailData.ticket, list: listData.ok ? (listData.tickets || []) : [] };
    })
    .then(data => {
      if (!data) return;
      const eventName = data.detail.eventName || data.detail.evento || '';
      const relatedTickets = data.list.filter(ticket =>
        String(ticket.eventName || ticket.evento || '').toLowerCase() === String(eventName).toLowerCase()
      );
      const selectedIndex = relatedTickets.findIndex(ticket => String(ticket.id) === String(data.detail.id));
      groupTickets = relatedTickets.length ? relatedTickets : [data.detail];
      if (selectedIndex >= 0) groupTickets[selectedIndex] = data.detail;
      else groupTickets[0] = data.detail;
      ticketDetails.set(data.detail.id, Promise.resolve(data.detail));
      currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
      renderTicket();
      groupTickets.forEach(ticket => {
        if (String(ticket.id) !== String(data.detail.id)) loadTicketDetail(ticket).catch(() => undefined);
      });
      if (!groupTickets[currentIndex]?.emRevenda) scheduleQrRefresh();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) refreshActiveQr().catch(error => console.warn('[ingresso] Falha ao atualizar QR:', error.message));
      });
    })
    .catch(err => {
      showTicketLoadError(err);
    });
});
