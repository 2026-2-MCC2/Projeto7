document.addEventListener('DOMContentLoaded', () => {
  const rawUser = localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario');
  let user = null;

  try {
    user = JSON.parse(rawUser);
  } catch (e) {
    console.error('Erro ao ler credenciais locais:', e);
  }

  const container = document.getElementById('tickets');
  const message = document.getElementById('ticket-message');

  if (!user || !user.email) {
    window.location.href = 'login.html';
    return;
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

  fetch(`/api/usuario/meus-ingressos?email=${encodeURIComponent(user.email)}`)
    .then(async res => {
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || `Erro HTTP ${res.status}`);
      }
      return data;
    })
    .then(data => {
      if (!data.tickets || !Array.isArray(data.tickets) || data.tickets.length === 0) {
        if (message) message.textContent = '';
        container.innerHTML = `
          <div class="empty-state">
            <p>Nenhum ingresso encontrado para a sua conta.</p>
          </div>
        `;
        return;
      }

      if (message) message.textContent = '';
      container.innerHTML = '';

      const grouped = {};
      data.tickets.forEach(ticket => {
        const key = ticket.eventName || ticket.evento || 'Evento sem título';
        if (!grouped[key]) {
          grouped[key] = {
            name: key,
            location: ticket.location || 'Local a confirmar',
            date: ticket.date,
            image: resolveEventImage(ticket),
            tickets: []
          };
        }
        grouped[key].tickets.push(ticket);
      });

      Object.values(grouped).forEach(group => {
        const total = group.tickets.length;
        const countLabel = `${total} INGRESSO${total > 1 ? 'S' : ''}`;

        const card = document.createElement('article');
        card.className = 'ticket-order-card';
        card.innerHTML = `
          <div class="ticket-card-thumb">
            <img src="${group.image}" alt="${group.name}" onerror="this.src='imagens/logo troca ticket.png'">
          </div>
          <div class="ticket-card-info">
            <h2 class="ticket-card-title">${group.name}</h2>
            <p class="ticket-card-place">${group.location}</p>
            <span class="ticket-card-badge">${countLabel}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          window.location.href = `ingresso.html?evento=${encodeURIComponent(group.name)}`;
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('[meus-ingressos] Erro:', err);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <p style="color: #ff4757; margin-bottom: 8px;">Erro ao carregar ingressos: ${err.message}</p>
          </div>
        `;
      }
    });
});