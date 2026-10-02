document.addEventListener('DOMContentLoaded', async () => {
  const eventId = new URLSearchParams(window.location.search).get('id');
  const elements = {
    cover: document.getElementById('event-cover'),
    kicker: document.getElementById('event-kicker'),
    name: document.getElementById('event-name'),
    lineup: document.getElementById('event-lineup'),
    date: document.getElementById('event-date'),
    time: document.getElementById('event-time'),
    venue: document.getElementById('event-venue'),
    address: document.getElementById('event-address'),
    description: document.getElementById('event-description'),
    purchase: document.getElementById('btn-confirm-purchase'),
    share: document.getElementById('event-share'),
    favorite: document.getElementById('event-favorite'),
    calendar: document.getElementById('event-calendar')
  };
  let currentEvent = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function resolveEventImage(event) {
    if (event.imagem && String(event.imagem).trim()) return String(event.imagem).trim();
    const eventName = String(event.name || '').toLowerCase();
    if (eventName.includes('arena')) return 'imagens/arena+.jpeg';
    if (eventName.includes('sea') || eventName.includes('club')) return 'imagens/sea club.jpeg';
    if (eventName.includes('esperia') || eventName.includes('mirante')) return 'imagens/mirante esperia.jpeg';
    if (eventName.includes('sanca') || eventName.includes('trap')) return 'imagens/trap in sanca.jpeg';
    if (eventName.includes('terra')) return 'imagens/terra sp.jpeg';
    if (eventName.includes('chefe')) return 'imagens/festa do chefe.jpeg';
    return 'imagens/logo troca ticket.png';
  }

  function getDateTime(value) {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return { date: 'Data a confirmar', time: 'Horário a confirmar' };
    return {
      date: parsedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }),
      time: parsedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  }

  function getShortDate(value) {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? 'DATA A DEFINIR' : parsedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  }

  function getDescription(event) {
    const description = String(event.descricao || event.description || '').trim() || `Uma experiência especial no ${event.name || 'evento'}. Ingressos digitais, acesso seguro e titularidade protegida pela TrocaTicket.`;
    return escapeHtml(description).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\r?\n/g, '<br>');
  }

  function setFavoriteState() {
    const isFavorite = localStorage.getItem(`trocaticket-favorite-${currentEvent.id}`) === 'true';
    elements.favorite.classList.toggle('is-favorite', isFavorite);
    elements.favorite.setAttribute('aria-pressed', String(isFavorite));
    elements.favorite.setAttribute('aria-label', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
  }

  function renderEvent(event) {
    const dateTime = getDateTime(event.date);
    const location = event.location || 'Local a confirmar';
    currentEvent = event;
    elements.cover.src = resolveEventImage(event);
    elements.cover.alt = `Capa do evento ${event.name || 'Evento'}`;
    elements.kicker.textContent = `${getShortDate(event.date)} · ${location}`;
    elements.name.textContent = event.artista ? `${event.name || 'Evento'} - ${event.artista}` : (event.name || 'Evento');
    elements.lineup.textContent = '';
    elements.date.textContent = dateTime.date;
    elements.time.textContent = `Abertura da casa às ${dateTime.time}`;
    elements.venue.textContent = location;
    elements.address.textContent = location;
    elements.description.innerHTML = getDescription(event);

    elements.purchase.disabled = false;
    setFavoriteState();
    document.title = `${event.name || 'Evento'} | TrocaTicket`;
  }

  async function handlePurchase() {
    if (!currentEvent) return;
    window.location.href = `checkout.html?id=${encodeURIComponent(currentEvent.id)}`;
  }

  elements.favorite.addEventListener('click', () => {
    const nextState = elements.favorite.getAttribute('aria-pressed') !== 'true';
    localStorage.setItem(`trocaticket-favorite-${currentEvent.id}`, String(nextState));
    setFavoriteState();
  });

  elements.share.addEventListener('click', async () => {
    const shareData = { title: currentEvent.name, text: `${currentEvent.name} · ${currentEvent.location || 'Local a confirmar'}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); alert('Link do evento copiado.'); }
    } catch (error) {
      if (error.name !== 'AbortError') alert('Não foi possível compartilhar este evento.');
    }
  });

  elements.calendar.addEventListener('click', () => {
    const startDate = new Date(currentEvent.date);
    if (Number.isNaN(startDate.getTime())) { alert('A data deste evento ainda não está configurada.'); return; }
    const endDate = new Date(currentEvent.endDate || startDate.getTime() + 3 * 60 * 60 * 1000);
    const toCalendarDate = value => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const description = currentEvent.descricao || currentEvent.description || `Evento ${currentEvent.name || 'TrocaTicket'} com ingresso digital e acesso seguro.`;
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.search = new URLSearchParams({
      action: 'TEMPLATE',
      text: currentEvent.name || 'Evento TrocaTicket',
      dates: `${toCalendarDate(startDate)}/${toCalendarDate(endDate)}`,
      location: currentEvent.location || 'Local a confirmar',
      details: description
    }).toString();
    const calendarWindow = window.open(googleCalendarUrl.toString(), '_blank', 'noopener,noreferrer');
    if (!calendarWindow) window.location.assign(googleCalendarUrl.toString());
  });

  elements.purchase.addEventListener('click', handlePurchase);

  try {
    const response = await fetch('/api/events');
    const data = await response.json();
    const event = (data.events || []).find(item => String(item.id) === String(eventId));
    if (!response.ok || !event) throw new Error('Evento não encontrado.');
    renderEvent(event);
  } catch (error) {
    elements.name.textContent = 'Evento não encontrado';
    elements.description.textContent = error.message;
    elements.purchase.disabled = true;
  }
});
