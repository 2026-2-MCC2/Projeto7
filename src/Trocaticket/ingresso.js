document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  if (!user || !user.email) {
    window.location.href = 'login.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetEventName = urlParams.get('evento') || '';

  let groupTickets = [];
  let currentIndex = 0;

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
      return ticket.imagem.trim();
    }
    const name = String(ticket.eventName || ticket.evento || '').toLowerCase();
    if (name.includes('arena')) return 'imagens/arena+.jpeg';
    if (name.includes('sea') || name.includes('club')) return 'imagens/sea club.jpeg';
    if (name.includes('esperia') || name.includes('mirante')) return 'imagens/mirante esperia.jpeg';
    if (name.includes('sanca') || name.includes('trap')) return 'imagens/trap in sanca.jpeg';
    if (name.includes('terra')) return 'imagens/terra sp.jpeg';
    if (name.includes('chefe')) return 'imagens/festa do chefe.jpeg';
    return 'imagens/logo troca ticket.png';
  }

  async function renderTicket() {
    const ticket = groupTickets[currentIndex];
    if (!ticket) return;

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
    document.getElementById('ticket-serial-label').textContent = `INGRESSO: #${ticket.numero_ingresso}`;
    document.getElementById('ticket-order-label').textContent = `PEDIDO: #${ticket.codigo_pedido || 'N/A'}`;
    document.getElementById('ticket-cover-img').src = resolveEventImage(ticket);

    // Controles do Carrossel Manual
    const carouselNav = document.getElementById('carousel-nav-container');
    if (groupTickets.length > 1) {
      carouselNav.style.display = 'flex';
      document.getElementById('carousel-counter-label').textContent = `INGRESSO(S) ${currentIndex + 1} / ${groupTickets.length}`;
    } else {
      carouselNav.style.display = 'none';
    }

    // Botões de Ação
    const btnTransfer = document.getElementById('btn-transfer-ticket');
    const btnResell = document.getElementById('btn-resell-ticket');
    const alertMsg = document.getElementById('transfer-alert-msg');
    const isPendente = Boolean(ticket.transferencia_pendente_id);
    const jaTransferido = Number(ticket.versao_titularidade || 1) > 1;

    if (isPendente) {
      btnTransfer.disabled = false;
      btnTransfer.textContent = 'CANCELAR TRANSFERÊNCIA';
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

      alertMsg.textContent = 'Ingresso transferido anteriormente. Permitida apenas a revenda.';
      alertMsg.style.color = '#ff6b6b';
    } else {
      btnTransfer.disabled = false;
      btnTransfer.textContent = 'TRANSFERIR';
      btnTransfer.classList.remove('btn-cancel-state', 'btn-disabled-state');

      btnResell.disabled = false;
      btnResell.classList.remove('btn-disabled-state');

      alertMsg.textContent = '';
    }

    // QR Code
    const canvas = document.getElementById('qr-code-canvas');
    if (window.QRCode && canvas) {
      try {
        await QRCode.toCanvas(canvas, ticket.qr_code_payload || `TROCATICKET:${ticket.numero_ingresso}`, {
          width: 175,
          margin: 1
        });
      } catch (err) {
        console.error('Erro no QR Code:', err);
      }
    }
  }

  // Carrossel
  document.getElementById('btn-prev-ticket').addEventListener('click', () => {
    if (groupTickets.length <= 1) return;
    currentIndex = (currentIndex - 1 + groupTickets.length) % groupTickets.length;
    renderTicket();
  });

  document.getElementById('btn-next-ticket').addEventListener('click', () => {
    if (groupTickets.length <= 1) return;
    currentIndex = (currentIndex + 1) % groupTickets.length;
    renderTicket();
  });

  // Ação Transferir / Cancelar
  const dialog = document.getElementById('transfer-dialog-backdrop');
  document.getElementById('btn-transfer-ticket').addEventListener('click', async () => {
    const ticket = groupTickets[currentIndex];
    if (!ticket) return;

    if (ticket.transferencia_pendente_id) {
      if (!confirm('Deseja realmente cancelar o repasse deste ingresso? O convite por e-mail será invalidado.')) {
        return;
      }

      try {
        const res = await fetch('/api/ingressos/cancelar-transferencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

  // Ação Revender
  document.getElementById('btn-resell-ticket').addEventListener('click', () => {
    const ticket = groupTickets[currentIndex];
    if (!ticket || ticket.transferencia_pendente_id) return;
    const valor = prompt('Digite o valor (R$) para revender este ingresso:', '50.00');
    if (valor) {
      alert(`Ingresso #${ticket.numero_ingresso} anunciado para revenda por R$ ${valor}!`);
    }
  });

  // Carga inicial
  fetch(`/api/usuario/meus-ingressos?email=${encodeURIComponent(user.email)}`)
    .then(r => r.json())
    .then(data => {
      if (!data.ok || !data.tickets || !data.tickets.length) {
        window.location.href = 'meus-ingressos.html';
        return;
      }

      const filtered = targetEventName
        ? data.tickets.filter(t => (t.eventName || t.evento || '').toLowerCase() === targetEventName.toLowerCase())
        : data.tickets;

      groupTickets = filtered.length ? filtered : data.tickets;
      currentIndex = 0;
      renderTicket();
    })
    .catch(err => {
      console.error(err);
      alert('Não foi possível carregar o ingresso.');
    });
});