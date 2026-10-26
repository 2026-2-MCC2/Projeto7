document.addEventListener('DOMContentLoaded', () => {
  const rawUser = localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario');
  let user = null;
  try { user = JSON.parse(rawUser); } catch (error) { console.error('[meus-ingressos] Sessão inválida:', error); }

  const container = document.getElementById('tickets');
  const message = document.getElementById('ticket-message');
  if (!user || !user.email) {
    window.location.replace('../auth/login.html?redirect=../account/meus-ingressos.html');
    return;
  }

  const headers = user.session_token ? { Authorization: `Bearer ${user.session_token}` } : {};
  const grouped = new Map();
  let cursor = '';
  let hasMore = true;
  let loading = false;

  function renewSession() {
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
    window.location.replace('../auth/login.html?redirect=../account/meus-ingressos.html');
  }

  function resolveEventImage(ticket) {
    if (ticket.imagem && String(ticket.imagem).trim()) { const image = String(ticket.imagem).trim(); if (/^(data:|blob:|https?:\/\/|\/)/i.test(image)) return image; return `../${image.replace(/^\.?\//, '')}`; }
    const name = String(ticket.eventName || ticket.evento || '').toLowerCase();
    if (name.includes('arena')) return '../imagens/arena+.jpeg';
    if (name.includes('sea') || name.includes('club')) return '../imagens/sea club.jpeg';
    if (name.includes('esperia') || name.includes('mirante')) return '../imagens/mirante esperia.jpeg';
    if (name.includes('sanca') || name.includes('trap')) return '../imagens/trap in sanca.jpeg';
    if (name.includes('terra')) return '../imagens/terra sp.jpeg';
    if (name.includes('chefe')) return '../imagens/festa do chefe.jpeg';
    return '../imagens/logo troca ticket.png';
  }

  function render() {
    if (!grouped.size) {
      container.innerHTML = '<div class="empty-state"><p>Nenhum ingresso encontrado para a sua conta.</p></div>';
      return;
    }
    const fragment = document.createDocumentFragment();
    grouped.forEach(group => {
      const card = document.createElement('article');
      card.className = 'ticket-order-card';
      card.innerHTML = `
        <div class="ticket-card-thumb"><img src="${group.image}" alt="${group.name}" loading="lazy"></div>
        <div class="ticket-card-info">
          <h2 class="ticket-card-title">${group.name}</h2>
          <p class="ticket-card-place">${group.location}</p>
          <span class="ticket-card-badge">${group.count} INGRESSO${group.count > 1 ? 'S' : ''}</span>
        </div>`;
      card.addEventListener('click', () => {
        window.location.href = `ingresso.html?id=${encodeURIComponent(group.firstTicketId)}&evento=${encodeURIComponent(group.name)}`;
      });
      fragment.appendChild(card);
    });
    container.replaceChildren(fragment);
  }

  async function loadPage() {
    if (loading || !hasMore) return;
    loading = true;
    const params = new URLSearchParams({ email: user.email, limit: '20' });
    if (cursor) params.set('cursor', cursor);
    try {
      const response = await fetch(`/api/usuario/meus-ingressos?${params}`, { headers });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (response.status === 401 || response.status === 403) { renewSession(); return; }
        throw new Error(data.message || `Erro HTTP ${response.status}`);
      }
      (data.tickets || []).forEach(ticket => {
        const key = ticket.eventName || ticket.evento || 'Evento sem título';
        if (!grouped.has(key)) {
          grouped.set(key, {
            name: key,
            location: ticket.location || 'Local a confirmar',
            image: resolveEventImage(ticket),
            count: 0,
            firstTicketId: ticket.id
          });
        }
        grouped.get(key).count += 1;
      });
      cursor = data.nextCursor || '';
      hasMore = Boolean(data.hasMore);
      if (message) message.textContent = '';
      render();
      if (hasMore) window.setTimeout(loadPage, 0);
    } catch (error) {
      console.error('[meus-ingressos] Erro:', error);
      container.innerHTML = `<div class="empty-state"><p style="color:#ff4757">Erro ao carregar ingressos: ${error.message}</p></div>`;
    } finally {
      loading = false;
    }
  }

  loadPage();
});
