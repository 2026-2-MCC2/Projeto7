document.addEventListener('DOMContentLoaded', async () => {
  const eventId = new URLSearchParams(window.location.search).get('id');
  const elements = {
    cover: document.getElementById('checkout-cover'), kicker: document.getElementById('checkout-kicker'), name: document.getElementById('checkout-event-name'), lineup: document.getElementById('checkout-lineup'), classification: document.getElementById('classification'), location: document.getElementById('stay-location'), sectors: document.getElementById('sector-list'), summaryItems: document.getElementById('summary-items'), subtotal: document.getElementById('summary-total'), fees: document.getElementById('summary-fees'), buy: document.getElementById('buy-button'), countdownLabel: document.getElementById('countdown-label'), countdownValue: document.getElementById('countdown-value'), promoForm: document.getElementById('promo-form'), promoCode: document.getElementById('promo-code'), promoFeedback: document.getElementById('promo-feedback'), map: document.getElementById('map-modal'), mapButton: document.getElementById('map-button'), stayButton: document.getElementById('stay-button')
  };
  let currentEvent = null;
  let ticketOptions = [];
  const quantities = new Map();
  let discountRate = 0;
  let countdownTimer = null;

  function resolveImage(event) {
    if (event.imagem && String(event.imagem).trim()) return event.imagem;
    const name = String(event.name || '').toLowerCase();
    if (name.includes('sea') || name.includes('club')) return 'imagens/sea club.jpeg';
    if (name.includes('arena')) return 'imagens/arena+.jpeg';
    if (name.includes('trap') || name.includes('sanca')) return 'imagens/trap in sanca.jpeg';
    return 'imagens/logo troca ticket.png';
  }

  function money(value) { return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`; }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }
  function eventDate(value) { const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? 'Data a confirmar' : parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }

  function lotOrder(lot, index) {
    const number = String(lot.name || '').match(/\d+/)?.[0];
    return number ? Number(number) : index + 1;
  }

  function getVisibleLots(event) {
    const allLots = Array.isArray(event.lots) ? event.lots : [];
    if (!allLots.length) return allLots;
    const now = Date.now();
    const lotsBySector = allLots.reduce((groups, lot, index) => {
      const sector = lot.sector || 'Setor geral';
      (groups[sector] ||= []).push({ lot, index });
      return groups;
    }, {});
    return Object.values(lotsBySector).flatMap(sectorLots => {
      const orderedLots = sectorLots.sort((first, second) => lotOrder(first.lot, first.index) - lotOrder(second.lot, second.index));
      const hasDateRule = orderedLots.some(({ lot }) => /data|date|virada/i.test(String(lot.rule || '')));
      if (hasDateRule) {
        const activeLot = orderedLots
          .filter(({ lot }) => {
            const gate = lot.startDate || lot.switchDate;
            return !gate || new Date(gate).getTime() <= now;
          })
          .at(-1);
        return activeLot ? [activeLot.lot] : [];
      }
      const availableLot = orderedLots.find(({ lot }) => Number(lot.available || 0) > 0);
      return availableLot ? [availableLot.lot] : [];
    });
  }

  function normalizedOptions(event) {
    const configuredSectors = Array.isArray(event.sectors) ? event.sectors : [];
    const lots = Array.isArray(event.lots) && event.lots.length
      ? getVisibleLots(event)
      : configuredSectors.map((sector, sectorIndex) => ({ id: `sector-${sector.id || sectorIndex}`, sector: sector.name || sector.nome, name: 'Lote atual', ticketType: 'Inteira', price: Number(event.price || 0), available: Number(sector.capacity || 999) }))
        .concat(configuredSectors.length ? [] : [{ id: 'default', sector: 'Setor geral', name: 'Lote atual', ticketType: 'Inteira', price: Number(event.price || 0), available: 999 }]);
    const options = [];
    lots.forEach((lot, lotIndex) => {
      const fallbackSector = configuredSectors[lotIndex]?.name || configuredSectors[lotIndex]?.nome || 'Setor geral';
      const sector = lot.sector && lot.sector !== 'Setor geral' ? lot.sector : fallbackSector;
      const configuredLotNumber = String(lot.name || '').match(/\d+/)?.[0];
      const lotNumber = configuredLotNumber || String(lotIndex + 1);
      const base = { lot, lotIndex, sector, lotName: lot.name || `${lotNumber}º lote`, lotNumber, price: Number(lot.price || event.price || 0), available: Number(lot.fullAvailable ?? lot.available ?? 999), startDate: lot.startDate, endDate: lot.endDate, switchDate: lot.switchDate };
      options.push({ ...base, id: `${lot.id || lotIndex}-full`, type: lot.ticketType || 'Inteira', price: base.price, available: Number(lot.available || 0) });
      if (Number(lot.halfPrice) > 0 && Number(lot.halfAvailable || 0) > 0) options.push({ ...base, id: `${lot.id || lotIndex}-half`, type: 'Meia Entrada', price: Number(lot.halfPrice), available: Number(lot.halfAvailable) });
      (Array.isArray(lot.modalities) ? lot.modalities : []).forEach((modality, modalityIndex) => {
        const modalityName = modality.nome || modality.name || 'Modalidade';
        const modalityPrice = Number(modality.preco || modality.price || 0);
        const modalityQuantity = Number(modality.quantidade || modality.quantity || 0);
        if (modalityName && modalityPrice > 0 && modalityQuantity > 0) options.push({ ...base, id: `${lot.id || lotIndex}-custom-${modalityIndex}`, type: modalityName, price: modalityPrice, available: modalityQuantity });
      });
    });
    return options.filter(option => option.available > 0).sort((first, second) => first.price - second.price);
  }

  function groupedOptions() { return ticketOptions.reduce((groups, option) => { (groups[option.sector] ||= []).push(option); return groups; }, {}); }

  function renderTicketOptions() {
    const groups = groupedOptions();
    if (!Object.keys(groups).length) { elements.sectors.innerHTML = '<p class="loading-state">Ingressos esgotados.</p>'; return; }
    elements.sectors.innerHTML = Object.entries(groups).map(([sector, options], index) => `
      <article class="sector-accordion">
        <button class="sector-trigger" type="button" aria-expanded="false"><strong>${escapeHtml(sector)}</strong><span class="sector-chevron">⌄</span></button>
        <div class="sector-options">${options.map(option => `<div class="ticket-option" data-ticket="${escapeHtml(option.id)}"><div><h3>${escapeHtml(option.type)}</h3><p>${option.lotNumber}º lote</p><div class="quantity-control"><button type="button" data-minus aria-label="Diminuir quantidade">−</button><input type="number" min="0" max="${option.available}" value="0" readonly inputmode="none" aria-label="Quantidade de ${escapeHtml(option.type)}"><button type="button" data-plus aria-label="Aumentar quantidade">+</button></div></div><div class="ticket-option-price"><strong>${money(option.price)}</strong><small>por ingresso</small></div></div>`).join('')}</div>
      </article>`).join('');
    elements.sectors.querySelectorAll('.sector-trigger').forEach(trigger => trigger.addEventListener('click', () => { const accordion = trigger.closest('.sector-accordion'); const isOpen = accordion.classList.toggle('is-open'); trigger.setAttribute('aria-expanded', String(isOpen)); }));
    elements.sectors.querySelectorAll('.ticket-option').forEach(row => {
      const option = ticketOptions.find(item => item.id === row.dataset.ticket);
      const input = row.querySelector('input');
      const update = value => { const quantity = Math.max(0, Math.min(option.available, Number(value) || 0)); input.value = quantity; if (quantity) quantities.set(option.id, quantity); else quantities.delete(option.id); updateSummary(); };
      row.querySelector('[data-minus]').addEventListener('click', () => update(Number(input.value) - 1));
      row.querySelector('[data-plus]').addEventListener('click', () => update(Number(input.value) + 1));
      input.addEventListener('change', () => update(input.value));
    });
  }

  function updateSummary() {
    let itemCount = 0; let baseTotal = 0;
    quantities.forEach((quantity, id) => { const option = ticketOptions.find(item => item.id === id); if (option) { itemCount += quantity; baseTotal += option.price * quantity; } });
    const discount = baseTotal * discountRate; const taxable = baseTotal - discount; const fee = taxable * 0.14; const total = taxable + fee;
    elements.summaryItems.textContent = `${itemCount} ${itemCount === 1 ? 'ingresso' : 'ingressos'}`; elements.subtotal.textContent = money(total); elements.fees.textContent = `Taxa de serviço: ${money(fee)}${discount ? ` · Desconto: -${money(discount)}` : ''}`; elements.buy.disabled = false; elements.buy.dataset.total = String(total); elements.buy.dataset.quantity = String(itemCount);
  }

  function updateCountdown() {
    const now = Date.now(); const target = new Date(currentEvent.endDate || currentEvent.date).getTime();
    const label = 'Término das vendas online em:'; const remaining = Math.max(0, target - now); const seconds = Math.floor(remaining / 1000); const days = Math.floor(seconds / 86400); const hours = Math.floor((seconds % 86400) / 3600); const minutes = Math.floor((seconds % 3600) / 60); const restSeconds = seconds % 60;
    elements.countdownLabel.textContent = label; elements.countdownValue.textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(restSeconds).padStart(2, '0')}s`;
  }

  async function completePurchase() {
    let user; try { user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null'); } catch { user = null; }
    if (!user || !user.email) { window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`; return; }
    const quantity = Number(elements.buy.dataset.quantity || 0); const total = Number(elements.buy.dataset.total || 0); if (!quantity) { alert('Selecione pelo menos 1 ingresso para continuar.'); return; }
    const items = [...quantities.entries()].map(([id, selectedQuantity]) => { const option = ticketOptions.find(item => item.id === id); return option ? { quantity: selectedQuantity, price: option.price, sector: option.sector, lotName: `${option.lotNumber}º lote`, category: option.type } : null; }).filter(Boolean);
    elements.buy.disabled = true; elements.buy.textContent = 'PROCESSANDO...';
    try {
      const response = await fetch('/api/ingressos/comprar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, evento_id: currentEvent.id, quantidade: quantity, preco: total / quantity, valor_total: total, items }) });
      const data = await response.json(); if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível concluir a compra.');
      alert('Compra realizada com sucesso!'); window.location.href = `ingresso.html?evento=${encodeURIComponent(currentEvent.name)}`;
      } catch (error) { alert(error.message); elements.buy.disabled = false; elements.buy.textContent = 'COMPRAR INGRESSOS'; }
  }

  elements.promoForm.addEventListener('submit', event => { event.preventDefault(); const code = elements.promoCode.value.trim().toUpperCase(); const coupons = { TROCA10: .10, EVENTO5: .05 }; if (coupons[code]) { discountRate = coupons[code]; elements.promoFeedback.className = 'promo-feedback'; elements.promoFeedback.textContent = `Cupom aplicado: ${coupons[code] * 100}% de desconto.`; } else { discountRate = 0; elements.promoFeedback.className = 'promo-feedback is-error'; elements.promoFeedback.textContent = code ? 'Cupom inválido ou expirado.' : 'Digite um cupom para aplicar.'; } updateSummary(); });
  elements.buy.addEventListener('click', completePurchase);
  elements.mapButton.addEventListener('click', () => { elements.map.hidden = false; });
  elements.map.querySelectorAll('[data-close-map]').forEach(element => element.addEventListener('click', () => { elements.map.hidden = true; }));
  elements.stayButton.addEventListener('click', () => { const query = encodeURIComponent(`${currentEvent.name} hospedagem ${currentEvent.location || ''}`); window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer'); });

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    const title = trigger.firstElementChild;
    const content = trigger.nextElementSibling;
    const titleText = title.textContent.replace(/^[+-]\s*/, '');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;
      trigger.setAttribute('aria-expanded', String(nextState));
      content.classList.toggle('is-collapsed', !nextState);
      title.textContent = `${nextState ? '-' : '+'} ${titleText}`;
    });
  });

  const ticketSection = document.querySelector('.ticket-section');
  const orderSummary = document.querySelector('.order-summary');
  const updateSummaryPlacement = () => {
    if (!ticketSection || !orderSummary) return;
    orderSummary.classList.toggle('is-inline', ticketSection.getBoundingClientRect().bottom <= window.innerHeight);
  };
  window.addEventListener('scroll', updateSummaryPlacement, { passive: true });
  updateSummaryPlacement();

  try {
    const response = await fetch(`/api/events/${encodeURIComponent(eventId)}`); const data = await response.json(); currentEvent = data.event; if (!response.ok || !currentEvent) throw new Error('Evento não encontrado.');
    elements.cover.src = resolveImage(currentEvent); elements.cover.alt = `Capa de ${currentEvent.name}`; elements.kicker.textContent = `${eventDate(currentEvent.date)} · ${currentEvent.location || 'Local a confirmar'}`; elements.name.textContent = currentEvent.artista ? `${currentEvent.name || 'Evento'} - ${currentEvent.artista}` : (currentEvent.name || 'Evento'); elements.lineup.textContent = ''; elements.classification.textContent = currentEvent.classification || 'Livre'; elements.location.textContent = currentEvent.location || 'a região do evento';
    const eventStart = new Date(currentEvent.date); const eventEnd = new Date(currentEvent.endDate || currentEvent.date); const formatTime = value => Number.isNaN(value.getTime()) ? 'A confirmar' : value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const eventLocation = currentEvent.location || 'A confirmar';
    document.getElementById('official-event-name').textContent = currentEvent.artista ? `${currentEvent.name || 'Evento'} - ${currentEvent.artista}` : (currentEvent.name || 'Evento'); document.getElementById('official-event-date').textContent = eventDate(currentEvent.date); document.getElementById('official-event-time').textContent = `${formatTime(eventStart)} às ${formatTime(eventEnd)}`; document.getElementById('official-event-venue').textContent = eventLocation; document.getElementById('official-event-address').textContent = currentEvent.address || eventLocation; document.getElementById('official-event-city').textContent = currentEvent.city || eventLocation; document.getElementById('official-event-style').textContent = currentEvent.genre || currentEvent.estilo || 'A confirmar'; document.getElementById('official-event-opening').textContent = formatTime(eventStart); document.title = `Checkout | ${currentEvent.name}`;
    ticketOptions = normalizedOptions(currentEvent); renderTicketOptions(); updateSummary(); updateCountdown(); countdownTimer = window.setInterval(updateCountdown, 1000);
  } catch (error) { elements.name.textContent = 'Não foi possível carregar o checkout'; elements.sectors.innerHTML = `<p class="loading-state">${escapeHtml(error.message)}</p>`; elements.buy.disabled = false; }
});
