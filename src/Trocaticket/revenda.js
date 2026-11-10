(function () {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null'); } catch { return null; }
  })();
  const authHeaders = user?.session_token ? { Authorization: `Bearer ${user.session_token}` } : {};
  const ticketSelect = document.querySelector('#ticket-select');
  const price = document.querySelector('#locked-price');
  const ticketCategory = document.querySelector('#locked-ticket-category');
  const requestedTicketId = new URLSearchParams(window.location.search).get('ingresso_id');
  const requestedTicketCode = new URLSearchParams(window.location.search).get('ingresso_codigo');
  const announceFeedback = document.querySelector('#announce-feedback');
  const withdrawalFeedback = document.querySelector('#withdrawal-feedback');
  const listingsContainer = document.querySelector('#resale-listings');
  const money = value => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const message = (node, text, error) => { node.textContent = text; node.classList.toggle('error', Boolean(error)); };
  let redirectingToLogin = false;
  function redirectToLogin() {
    if (redirectingToLogin) return;
    redirectingToLogin = true;
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
    const redirect = `${window.location.pathname}${window.location.search}`;
    window.location.href = `../auth/login.html?redirect=${encodeURIComponent(redirect)}`;
  }
  async function request(path, options) {
    const response = await fetch(path, { ...options, headers: { ...authHeaders, ...(options?.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      redirectToLogin();
      throw new Error('Sua sessão expirou. Redirecionando para o login.');
    }
    if (!response.ok || data.ok === false) throw new Error(data.message || `Erro HTTP ${response.status}`);
    return data;
  }
  async function loadWallet() {
    if (!user) return;
    try {
      const data = await request('/api/wallet');
      document.querySelector('#wallet-pending').textContent = money(data.wallet.pendente);
      document.querySelector('#wallet-available').textContent = money(data.wallet.disponivel);
    } catch (error) { message(withdrawalFeedback, error.message, true); }
  }
  async function loadTickets() {
    if (!user) { ticketSelect.innerHTML = '<option value="">Entre na sua conta para anunciar</option>'; return; }
    try {
      const allTickets = [];
      let cursor = '';
      do {
        const params = new URLSearchParams({
          email: user.email,
          limit: '50'
        });
        if (cursor) params.set('cursor', cursor);
        const data = await request(`/api/usuario/meus-ingressos?${params.toString()}`);
        allTickets.push(...(data.tickets || []));
        cursor = data.nextCursor || '';
      } while (cursor);
      const requestedTicket = allTickets.find(ticket =>
        (requestedTicketId && String(ticket.id) === String(requestedTicketId))
        || (requestedTicketCode && [ticket.codigo_ingresso, ticket.numero_ingresso, ticket.codigo_original_bilheteria].some(code =>
          String(code || '').trim().toLowerCase() === String(requestedTicketCode).trim().toLowerCase()
        ))
      );
      const tickets = allTickets.filter(ticket =>
        ['ativo', 'valido'].includes(String(ticket.status).toLowerCase())
        && (!activeListingIds.has(String(ticket.id)) || ticket === requestedTicket)
      );
      ticketSelect.innerHTML = '<option value="">Selecione um ingresso</option>' + tickets.map(ticket => `<option value="${ticket.id}" data-event="${ticket.eventId || ''}" data-price="${ticket.preco_original || ''}" data-category="${ticket.ticketCategory || ''}">${ticket.eventName || ticket.evento} · #${ticket.codigo_ingresso || ticket.numero_ingresso} · Setor: ${ticket.sector || ticket.setor || 'Setor geral'} · ${ticket.ticketCategory || 'Categoria não identificada'}</option>`).join('');
      if (!tickets.length) ticketSelect.innerHTML = '<option value="">Nenhum ingresso disponível</option>';
      if (requestedTicket) {
        ticketSelect.value = String(requestedTicket.id);
        ticketSelect.dispatchEvent(new Event('change'));
      }
    } catch (error) { ticketSelect.innerHTML = '<option value="">Não foi possível carregar os ingressos</option>'; message(announceFeedback, error.message, true); }
  }
  let activeListingIds = new Set();
  function openRateModal(listingId, currentFee) {
    const backdrop = document.createElement('div');
    backdrop.className = 'rate-modal-backdrop';
    backdrop.innerHTML = `<section class="rate-modal-card" role="dialog" aria-modal="true" aria-labelledby="rate-modal-title">
      <button type="button" class="rate-modal-close" aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button>
      <p class="eyebrow">Prioridade na fila</p><h2 id="rate-modal-title">Alterar taxa</h2>
      <p>Escolha a prioridade desejada para este anúncio.</p>
      <div class="rate-modal-options">${[['comum', 2, 'Posição base'], ['basica', 5, 'Prioridade intermediária'], ['premium', 8, 'Topo da fila']].map(([key, percent, description]) =>
        `<label class="fee-card${Number(currentFee) === percent ? ' selected' : ''}"><input type="radio" name="rate-modal-fee" value="${key}"${Number(currentFee) === percent ? ' checked' : ''}><strong>${key[0].toUpperCase() + key.slice(1)} · ${percent}%</strong><small>${description}</small></label>`).join('')}</div>
      <div class="rate-modal-actions"><button type="button" class="button button-outline rate-modal-cancel">Cancelar</button><button type="button" class="button button-primary rate-modal-confirm">Confirmar alteração</button></div>
    </section>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener('click', event => { if (event.target === backdrop || event.target.closest('.rate-modal-close, .rate-modal-cancel')) close(); });
    backdrop.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      backdrop.querySelectorAll('.fee-card').forEach(card => card.classList.toggle('selected', card.querySelector('input').checked));
    }));
    backdrop.querySelector('.rate-modal-confirm').addEventListener('click', async () => {
      const selected = backdrop.querySelector('input:checked')?.value;
      if (!selected) return;
      const button = backdrop.querySelector('.rate-modal-confirm');
      button.disabled = true;
      try {
        const result = await request(`/api/revenda/${listingId}/prioridade`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taxa: selected }) });
        const feedback = document.querySelector(`[data-listing-feedback="${String(listingId)}"]`);
        message(feedback || announceFeedback, `${result.message} Diferença no repasse: ${money(result.diferenca_repasse)}.`);
        close();
        await loadListings();
      } catch (error) {
        button.disabled = false;
        const feedback = document.querySelector(`[data-listing-feedback="${String(listingId)}"]`);
        message(feedback || announceFeedback, error.message, true);
      }
    });
  }
  async function loadListings() {
    if (!user) {
      listingsContainer.innerHTML = '<p class="empty-state">Entre na sua conta para acompanhar seus anúncios.</p>';
      return;
    }
    try {
      const data = await request('/api/revenda/meus-anuncios');
      const listings = data.listings || [];
      activeListingIds = new Set(listings.filter(item => item.status === 'disponivel').map(item => String(item.ingresso_id)));
      listingsContainer.innerHTML = listings.length ? listings.map(listing => {
        const active = listing.status === 'disponivel';
        const queuePosition = Number(listing.posicao || listing.position || 1);
        const queueTotal = Number(listing.total_fila || listing.totalFila || 1);
        const partnerBoxOffice = listing.bilheteria_id != null && listing.bilheteria_origem !== 'Troca Ticket';
        const administrationFee = Number(listing.taxa_administracao_valor || (partnerBoxOffice ? 0 : Number(listing.preco_original || 0) * 14 / 100));
        const status = active ? 'Aguardando repasse / Na fila' : listing.status === 'vendida' ? 'Vendido / Repassado' : 'Anúncio cancelado';
        const detail = active
          ? `Posição: ${queuePosition}º entre ${queueTotal} anúncios em ${listing.setor_nome || 'Setor geral'} (${listing.categoria_ingresso || 'modalidade não identificada'})`
          : listing.status === 'vendida'
            ? `Ingresso antigo revogado. Saldo líquido em custódia: ${money(listing.valor_liquido)}.`
            : 'O anúncio foi retirado da fila.';
        return `<article class="legacy-listing ${active ? 'is-pending' : 'is-sold'}" data-listing-card="${escapeHtml(listing.id)}">
          <div class="listing-topline"><strong>${escapeHtml(listing.evento)}</strong><span>${status}</span></div>
          <p>Ingresso #${escapeHtml(listing.numero_ingresso)} · Setor: ${escapeHtml(listing.setor_nome || 'Setor geral')} · ${escapeHtml(listing.lote_nome || 'Lote pago')} · ${escapeHtml(listing.categoria_ingresso || 'Modalidade preservada')}</p>
          <div class="listing-details"><span>${escapeHtml(listing.taxa_nome)} · ${escapeHtml(listing.taxa_percentual)}%</span><strong>${money(listing.preco_original)}</strong></div>
          ${active ? `<small>Repasse estimado se vendido: ${money(Number(listing.preco_original) - Number(listing.preco_original) * Number(listing.taxa_percentual) / 100 + administrationFee)}. Taxa de administração devolvida: ${money(administrationFee)}. Só a taxa de prioridade é descontada.</small><small class="queue-notice">Novos anúncios com prioridade maior podem passar à frente do seu.</small><div class="listing-actions">${[['basica', 5], ['premium', 8]].filter(([, percent]) => percent > Number(listing.taxa_percentual)).map(([key, percent]) => `<button type="button" class="button button-outline listing-upgrade" data-listing-id="${escapeHtml(listing.id)}" data-fee="${key}">Aumentar prioridade para ${key === 'basica' ? 'Básica' : 'Premium'} (${money(Number(listing.preco_original) * (percent - Number(listing.taxa_percentual)) / 100)} no repasse)</button>`).join('')}</div>` : ''}
          <small>${detail}</small>
          ${active ? `<div class="listing-actions"><button type="button" class="button button-outline listing-rate" data-listing-id="${escapeHtml(listing.id)}" data-current-fee="${escapeHtml(listing.taxa_percentual)}">Alterar taxa</button><button type="button" class="button button-outline listing-cancel" data-listing-id="${escapeHtml(listing.id)}">Cancelar anúncio</button></div><small class="listing-rate-feedback" data-listing-feedback="${escapeHtml(listing.id)}" role="status"></small>` : ''}
        </article>`;
      }).join('') : '<p class="empty-state">Você ainda não colocou ingressos na revenda.</p>';
    } catch (error) {
      listingsContainer.innerHTML = '<p class="empty-state">Não foi possível carregar seus anúncios.</p>';
      message(announceFeedback, error.message, true);
    }
  }
  listingsContainer.addEventListener('click', async event => {
    const cancelButton = event.target.closest('.listing-cancel');
    if (cancelButton) {
      cancelButton.disabled = true;
      try {
        await request(`/api/revenda/${encodeURIComponent(cancelButton.dataset.listingId)}`, { method: 'DELETE' });
        message(announceFeedback, 'Anúncio cancelado. O ingresso voltou para sua carteira.');
        await Promise.all([loadListings(), loadTickets()]);
      } catch (error) {
        cancelButton.disabled = false;
        message(announceFeedback, error.message, true);
      }
      return;
    }
    const rateButton = event.target.closest('.listing-rate');
    if (rateButton) {
      openRateModal(rateButton.dataset.listingId, rateButton.dataset.currentFee);
      return;
    }
    const upgrade = event.target.closest('.listing-upgrade');
    if (upgrade) {
      upgrade.disabled = true;
      try {
        const result = await request(`/api/revenda/${upgrade.dataset.listingId}/prioridade`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taxa: upgrade.dataset.fee }) });
        message(announceFeedback, `${result.message} Diferença no repasse: ${money(result.diferenca_repasse)}.`);
        await loadListings();
      } catch (error) {
        upgrade.disabled = false;
        message(announceFeedback, error.message, true);
      }
      return;
    }
  });
  ticketSelect.addEventListener('change', () => {
    const option = ticketSelect.selectedOptions[0];
    price.textContent = option?.dataset.price ? `Preço travado: ${money(option.dataset.price)} · valor original do lote` : 'O valor original aparecerá após a seleção.';
    ticketCategory.textContent = option?.dataset.category
      ? `Categoria preservada: ${option.dataset.category}. A revenda mantém a mesma modalidade do ingresso original.`
      : 'A categoria original do ingresso será preservada na revenda.';
  });
  document.querySelector('#resale-form').addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const fee = document.querySelector('input[name="fee"]:checked')?.value;
      await request('/api/revenda/anunciar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingresso_id: ticketSelect.value, taxa: fee }) });
      message(announceFeedback, 'Ingresso anunciado com sucesso na fila.');
      await loadListings(); await loadTickets(); loadWallet();
    } catch (error) { message(announceFeedback, error.message, true); }
  });
  document.querySelector('#withdrawal-form').addEventListener('submit', async event => {
    event.preventDefault();
    try {
      await request('/api/wallet/saques/pix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ valor: document.querySelector('#withdrawal-value').value, cpf: document.querySelector('#withdrawal-cpf').value }) });
      message(withdrawalFeedback, 'Saque PIX solicitado para validação.');
      event.target.reset(); loadWallet();
    } catch (error) { message(withdrawalFeedback, error.message, true); }
  });
  loadListings().then(loadTickets);
  loadWallet();
})();
