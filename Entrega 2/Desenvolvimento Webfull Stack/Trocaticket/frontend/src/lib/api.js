const cache = new Map();

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const user = readUser();
  const headers = new Headers(options.headers || {});
  if (user?.session_token) headers.set('Authorization', ['Bearer', user.session_token].join(' '));
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || `Erro HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  user: readUser,
  logout() {
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
  },
  async events() {
    if (!cache.has('events')) cache.set('events', request('/api/events'));
    return cache.get('events');
  },
  async orders({ cursor = '', signal } = {}) {
    const user = readUser();
    if (!user?.email) throw Object.assign(new Error('Faça login para ver seus pedidos.'), { status: 401 });
    const params = new URLSearchParams({ email: user.email, limit: '20' });
    if (cursor) params.set('cursor', cursor);
    return request(`/api/usuario/meus-ingressos?${params}`, { signal });
  },
  async allOrders({ signal } = {}) {
    if (!cache.has('all-orders')) {
      const requestPromise = (async () => {
        const tickets = [];
        let cursor = '';
        do {
          const data = await api.orders({ cursor, signal });
          tickets.push(...(data.tickets || []));
          cursor = data.nextCursor || '';
        } while (cursor);
        return tickets;
      })();
      cache.set('all-orders', requestPromise);
      requestPromise.catch(() => cache.delete('all-orders'));
    }
    return cache.get('all-orders');
  },
  async ticket(id, signal) {
    const user = readUser();
    if (!user?.email) throw Object.assign(new Error('Faça login para ver seu ingresso.'), { status: 401 });
    const params = new URLSearchParams({ email: user.email, includeQr: 'true' });
    return request(`/api/usuario/meus-ingressos/${encodeURIComponent(id)}?${params}`, { signal });
  },
  async resaleQueue(eventId, signal) {
    return request(`/api/revenda/fila?evento_id=${encodeURIComponent(eventId)}`, { signal });
  },
  async announceResale(ticketId, fee) {
    return request('/api/revenda/anunciar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingresso_id: ticketId, taxa: fee })
    });
  },
  async cancelResale(resaleId) {
    return request(`/api/revenda/${encodeURIComponent(resaleId)}`, { method: 'DELETE' });
  },
  async upgradeResalePriority(resaleId, fee) {
    return request(`/api/revenda/${encodeURIComponent(resaleId)}/prioridade`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taxa: fee })
    });
  },
  async myResaleListings() {
    return request('/api/revenda/meus-anuncios');
  },
  async buyResale(eventId, setorNome = '', categoria = '') {
    return request('/api/revenda/comprar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento_id: eventId, setor_nome: setorNome, categoria_ingresso: categoria })
    });
  },
  async wallet() {
    return request('/api/wallet');
  },
  async requestPixWithdrawal(value, cpf) {
    return request('/api/wallet/saques/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: value, cpf })
    });
  },
  async login(email, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });
    if (data.user) {
      const sessionUser = { ...data.user, session_token: data.session_token };
      localStorage.setItem('trocaticket-user', JSON.stringify(sessionUser));
      localStorage.setItem('usuario', JSON.stringify(sessionUser));
    }
    return data;
  }
};
