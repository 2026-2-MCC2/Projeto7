/**
 * Sistema de Acesso Restrito e Dashboard Administrativo
 * - Validação por permissão de perfil (tipo = 'admin')
 * - Gestão de Eventos (com suporte ao Artista), Usuários, Ingressos e Auditoria
 */

class AdminAccessControl {
  constructor() {
    this.sessionKey = 'adminToken';
    this.init();
  }

  async init() {
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    
    if (!user || !user.email) {
      console.warn('[admin] Nenhum usuário autenticado detectado. Redirecionando para login.');
      window.location.href = 'login.html';
      return;
    }

    try {
      const res = await fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();

      if (!res.ok || !data.ok || !data.user || data.user.tipo !== 'admin') {
        console.error('[admin] Acesso negado: usuário não possui privilégios de administrador.');
        this.showAccessDenied();
        return;
      }

      console.log('[admin] Usuário administrador autenticado com sucesso.');
      this.showAdminPanel();

      if (window.adminPanel) {
        window.adminPanel.loadDashboardData();
      }
    } catch (err) {
      console.error('[admin] Erro ao validar permissão no servidor:', err);
      this.showAccessDenied();
    }
  }

  showAdminPanel() {
    const accessCheck = document.getElementById('access-check');
    const adminPanel = document.getElementById('admin-panel');
    const adminContent = document.getElementById('admin-content');

    if (accessCheck) {
      accessCheck.style.display = 'none';
      accessCheck.remove();
    }
    if (adminPanel) adminPanel.style.display = 'block';
    if (adminContent) adminContent.style.display = 'block';
  }

  showAccessDenied() {
    const accessCheck = document.getElementById('access-check');
    const adminPanel = document.getElementById('admin-panel');
    const adminContent = document.getElementById('admin-content');

    if (accessCheck) accessCheck.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
    if (adminContent) adminContent.style.display = 'none';
    
    sessionStorage.removeItem(this.sessionKey);
  }
}

class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.editingEventId = null;
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.setupLogout();
    this.setupDraggableModal();
    const authorizeForm = document.getElementById('authorize-pj-form');
    if (authorizeForm) {
      authorizeForm.addEventListener('submit', event => this.authorizePj(event));
    }
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Compatibilidade com os links href do HTML (ex: #section-dashboard ou #dashboard)
        const href = btn.getAttribute('href');
        let section = btn.dataset.section;

        if (!section && href) {
          section = href.replace('#', '');
          if (section.startsWith('section-')) {
            section = section.replace('section-', '');
          }
        }

        if (section) this.switchSection(section);
      });
    });
  }

  switchSection(section) {
    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.remove('active');
      sec.style.display = 'none';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const sectionElement = document.getElementById(`section-${section}`) || document.getElementById(section);
    if (sectionElement) {
      sectionElement.classList.add('active');
      sectionElement.style.display = 'block';
    }

    const activeBtn = document.querySelector(`.nav-btn[data-section="${section}"]`) || 
                      document.querySelector(`.nav-btn[href="#section-${section}"]`) || 
                      document.querySelector(`.nav-btn[href="#${section}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    this.currentSection = section;
    this.loadSectionData(section);
  }

  loadSectionData(section) {
    switch (section) {
      case 'usuarios':
        this.loadUsersData();
        break;
      case 'eventos':
        this.loadEventsData();
        break;
      case 'ingressos':
        this.loadTicketsData();
        break;
      case 'relatorios':
        this.loadReportsData();
        break;
      case 'bilheteria':
        this.loadBilheteriaData();
        break;
      case 'auditoria':
        this.loadAuditData();
        break;
      default:
        this.loadDashboardData();
        break;
    }
  }

  setupEventListeners() {
    const newEventBtn = document.getElementById('new-event-btn');
    if (newEventBtn) {
      newEventBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openEventModal(false);
      });
    }

    // Botões de fechar e cancelar do modal
    const modalCloseElements = document.querySelectorAll('.modal-close, #modal-cancel');
    modalCloseElements.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeEventModal();
      });
    });

    const eventForm = document.getElementById('event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', (e) => this.saveEvent(e));
    }

    // Leitura da imagem como Base64
    const filePicker = document.getElementById('event-file-picker');
    if (filePicker) {
      filePicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewBox = document.getElementById('event-img-preview-box');
        const previewImg = document.getElementById('event-img-preview');
        const statusTxt = document.getElementById('event-img-status');
        const hiddenInput = document.getElementById('event-imagem');

        if (statusTxt) statusTxt.textContent = 'Carregando imagem...';
        if (previewBox) previewBox.style.display = 'flex';

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result;
          if (hiddenInput) hiddenInput.value = base64String;
          if (previewImg) previewImg.src = base64String;
          if (statusTxt) statusTxt.textContent = `Pronto: ${file.name}`;
        };
        reader.onerror = () => {
          if (statusTxt) statusTxt.textContent = 'Erro ao ler arquivo.';
        };
        reader.readAsDataURL(file);
      });
    }

    const userSearch = document.getElementById('user-search');
    if (userSearch) {
      userSearch.addEventListener('input', (e) => this.filterUsers(e.target.value));
    }

    const userFilterTrigger = document.getElementById('user-filter-trigger');
    const userFilterPanel = document.getElementById('user-filter-panel');
    if (userFilterTrigger && userFilterPanel) {
      userFilterTrigger.addEventListener('click', () => {
        const isOpen = !userFilterPanel.hidden;
        userFilterPanel.hidden = isOpen;
        userFilterTrigger.setAttribute('aria-expanded', String(!isOpen));
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.user-filter-menu')) {
          userFilterPanel.hidden = true;
          userFilterTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    document.getElementById('user-filter-apply')?.addEventListener('click', () => {
      this.applyUserFilters();
      userFilterPanel.hidden = true;
      userFilterTrigger.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('user-filter-clear')?.addEventListener('click', () => {
      document.querySelectorAll('#user-filter-panel input, #user-filter-panel select').forEach(field => { field.value = ''; });
      this.applyUserFilters();
    });

    document.getElementById('audit-actor')?.addEventListener('input', () => this.loadAuditData());
    document.getElementById('audit-type')?.addEventListener('change', () => this.loadAuditData());
    document.getElementById('user-history-search')?.addEventListener('click', () => this.searchUserHistory());

    const filterTrigger = document.getElementById('ticket-filter-trigger');
    const filterPanel = document.getElementById('ticket-filter-panel');
    if (filterTrigger && filterPanel) {
      filterTrigger.addEventListener('click', () => {
        const isOpen = !filterPanel.hidden;
        filterPanel.hidden = isOpen;
        filterTrigger.setAttribute('aria-expanded', String(!isOpen));
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.ticket-filter-menu')) {
          filterPanel.hidden = true;
          filterTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    document.getElementById('filter-apply')?.addEventListener('click', () => {
      this.applyTicketFilters();
      if (filterPanel) filterPanel.hidden = true;
      if (filterTrigger) filterTrigger.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('filter-clear')?.addEventListener('click', () => {
      document.querySelectorAll('#ticket-filter-panel input, #ticket-filter-panel select').forEach(field => { field.value = ''; });
      this.applyTicketFilters();
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn') || document.querySelector('.admin-header button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      sessionStorage.removeItem('adminToken');
      window.location.href = 'index.html';
    }
  }

  // ===== DASHBOARD =====

  loadDashboardData() {
    this.loadChartEvents();

    this.fetchActivityLog()
      .then(activities => this.updateActivityList(activities))
      .catch(error => console.error('Erro ao carregar atividades:', error));

    this.fetchFeaturedEvents()
      .then(events => this.updateFeaturedEvents(events))
      .catch(error => console.error('Erro ao carregar eventos:', error));
  }

  async loadChartEvents() {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      const select = document.getElementById('gmv-event');
      if (!select) return;
      select.innerHTML = '<option value="">Selecione um evento</option>' + (data.events || [])
        .filter(event => event.status === 'publicado' || event.status === 'encerrado')
        .map(event => `<option value="${event.id}">${event.name || event.nome}</option>`).join('');
      select.addEventListener('change', () => this.refreshCharts());
      document.getElementById('gmv-period')?.addEventListener('change', () => this.refreshCharts());
      document.getElementById('trend-period')?.addEventListener('change', () => this.refreshCharts());
      this.refreshCharts();
    } catch (error) {
      console.error('Erro ao carregar eventos dos gráficos:', error);
    }
  }

  refreshCharts() {
    const eventId = document.getElementById('gmv-event')?.value || '';
    const gmvPeriod = document.getElementById('gmv-period')?.value || 'daily';
    const trendPeriod = document.getElementById('trend-period')?.value || 'daily';
    this.fetchStats(eventId, gmvPeriod, trendPeriod).then(stats => {
      this.updateStats(stats);
      this.renderBarChart(stats.gmvSeries || [], eventId);
      this.renderLineChart(stats.trendSeries || []);
    });
  }

  async fetchStats(eventId = '', gmvPeriod = 'daily', trendPeriod = 'daily') {
    try {
      const query = new URLSearchParams({ gmv_period: gmvPeriod, trend_period: trendPeriod });
      if (eventId) query.set('event_id', eventId);
      const response = await fetch(`/api/admin/stats?${query}`);
      const data = await response.json();
      if (!response.ok || data.ok !== true) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data.stats || { totalUsers: 0, totalTickets: 0, totalEvents: 0, totalRevenue: 0 };
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
      return { totalUsers: 0, totalTickets: 0, totalEvents: 0, totalRevenue: 0 };
    }
  }

  updateStats(stats) {
    const elUsers = document.getElementById('total-users');
    const elTickets = document.getElementById('total-tickets');
    const elEvents = document.getElementById('total-events');
    const elRevenue = document.getElementById('total-revenue');

    if (elUsers) elUsers.textContent = stats.totalUsers ?? '0';
    if (elTickets) elTickets.textContent = stats.totalTickets ?? '0';
    if (elEvents) elEvents.textContent = stats.totalEvents ?? '0';
    if (elRevenue) elRevenue.textContent = this.formatCurrency(stats.totalRevenue || 0);
    const cancellations = document.getElementById('pending-cancellations');
    if (cancellations) cancellations.textContent = stats.pendingCancellations ?? 0;
  }

  renderBarChart(series, eventId) {
    const chart = document.getElementById('gmv-chart');
    if (!chart || !eventId) { if (chart) chart.innerHTML = '<span>Selecione um evento para visualizar o GMV.</span>'; return; }
    const max = Math.max(...series.map(point => Number(point.value)), 1);
    chart.innerHTML = series.length ? series.map(point => `<div class="bar-column" title="${point.label}: ${this.formatCurrency(point.value)}"><strong>${this.formatCurrency(point.value)}</strong><i style="height:${Math.max(4, (point.value / max) * 100)}%"></i><small>${point.label}</small></div>`).join('') : '<span>Nenhuma venda no período.</span>';
  }

  renderLineChart(series) {
    const chart = document.getElementById('trend-chart');
    if (!chart || !series.length) { if (chart) chart.innerHTML = '<span>Sem dados suficientes.</span>'; return; }
    const width = 700;
    const height = 210;
    const max = Math.max(...series.map(point => Number(point.value)), 1);
    const points = series.map((point, index) => `${(index / Math.max(series.length - 1, 1)) * width},${height - (Number(point.value) / max) * 170 - 20}`).join(' ');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Tendência geral de vendas"><polyline points="${points}" fill="none" stroke="var(--accent-cyan)" stroke-width="3" />${series.map((point, index) => `<text x="${(index / Math.max(series.length - 1, 1)) * width}" y="205" text-anchor="middle">${point.label}</text>`).join('')}</svg>`;
  }

  async fetchActivityLog() {
    try {
      const response = await fetch('/api/admin/activity-log?limit=5');
      const data = await response.json();
      return data.activities || [];
    } catch (error) {
      return [];
    }
  }

  updateActivityList(activities) {
    const listContainer = document.getElementById('activity-list');
    if (!listContainer) return;

    if (activities.length === 0) {
      listContainer.innerHTML = '<p class="empty-state">Nenhuma atividade registrada</p>';
      return;
    }

    listContainer.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <strong>${activity.actorName || 'Sistema'} (${this.translateUserType(activity.actorType || 'sistema')})</strong><br>
        <span>${activity.description || this.formatAuditAction(activity.action)}</span><br>
        <small>Item: ${this.translateAuditItem(activity.itemType, activity.itemId)} · ${this.formatDateTime(activity.timestamp || activity.createdAt)}</small>
      </div>
    `).join('');
  }

  formatAuditAction(action) {
    return String(action || '').replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  translateAuditItem(type, id) {
    if (type === 'ingresso') return `Ingresso: ${id || 'Código não identificado'}`;
    const labels = { evento: 'Evento', ingresso: 'Ingresso', usuario: 'Usuário', pedido: 'Pedido' };
    return id ? `${labels[type] || type || 'Item'}: ${id}` : (labels[type] || type || 'Item');
  }

  async fetchFeaturedEvents() {
    try {
      const response = await fetch('/api/admin/featured-events?limit=5');
      const data = await response.json();
      if (!response.ok || data.ok !== true) throw new Error();
      return data.events || [];
    } catch (error) {
      return [];
    }
  }

  updateFeaturedEvents(events) {
    const container = document.getElementById('featured-events');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = '<p class="empty-state">Nenhum evento cadastrado</p>';
      return;
    }

    container.innerHTML = events.map(event => `
      <div class="event-item">
        <div class="event-item-title">${event.name || event.nome || 'Evento sem nome'}</div>
        ${event.artista ? `<div style="font-size: 0.8rem; color: #00d2ff; font-weight: 700;">${event.artista}</div>` : ''}
        <div class="event-item-date">${this.formatDate(event.date || event.data_evento)}</div>
        <div class="event-item-location">${event.location || event.local || 'Local não informado'}</div>
      </div>
    `).join('');
  }

  async loadAuditData() {
    const actor = document.getElementById('audit-actor')?.value || '';
    const type = document.getElementById('audit-type')?.value || '';
    try {
      const response = await fetch(`/api/admin/activity-log?limit=200&actor=${encodeURIComponent(actor)}&type=${encodeURIComponent(type)}`);
      const data = await response.json();
      const body = document.getElementById('audit-table-body');
      if (!body) return;
      body.innerHTML = data.logs?.length ? data.logs.map(log => `<tr><td>${log.actorName || 'Sistema'}</td><td>${this.translateUserType(log.actorType || 'sistema')}</td><td>${this.formatAuditAction(log.action)}</td><td>${log.description}</td><td>${this.translateAuditItem(log.itemType, log.itemId)}</td><td>${this.formatDateTime(log.timestamp)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">Nenhuma atividade registrada</td></tr>';
    } catch { }
  }

  // ===== USUÁRIOS =====

  async loadUsersData() {
    try {
      const response = await fetch('/api/admin/usuarios');
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
      this.renderUsersTable(data.users || []);
    } catch (error) {
      this.renderUsersTable([]);
    }
  }

  renderUsersTable(users) {
    const tbody = document.getElementById('usuarios-table-body');
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">Nenhum usuário cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.name || user.nome || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.telefone || user.phone || 'N/A'}</td>
        <td>${this.formatDate(user.createdAt || user.criado_em)}</td>
        <td><span class="status-badge status-${user.status || 'ativa'}" data-status="${user.status || 'ativa'}">${this.translateUserStatus(user.status)}</span></td>
        <td>${this.translateUserType(user.tipo)}</td>
        <td class="action-buttons">
          <button class="action-btn action-btn-delete user-access-action" data-user-id="${user.id}" data-user-type="${user.tipo || 'comum'}" data-user-status="${user.status || 'ativa'}">Alterar acesso</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.user-access-action').forEach(button => {
      button.addEventListener('click', () => this.editUserAccess(
        button.dataset.userId,
        button.dataset.userType,
        button.dataset.userStatus
      ));
    });
  }

  applyUserFilters() {
    const rows = document.querySelectorAll('#usuarios-table-body tr');
    const value = id => document.getElementById(id)?.value.trim().toLowerCase() || '';
    const name = value('filter-user-name');
    const email = value('filter-user-email');
    const phone = value('filter-user-phone');
    const status = value('filter-user-status');
    const type = value('filter-user-type');
    const date = document.getElementById('filter-user-date')?.value || '';

    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      const cells = row.querySelectorAll('td');
      const cell = index => (cells[index]?.textContent || '').trim().toLowerCase();
      const rowDate = cell(3).split('/').reverse().join('-');
      const rowStatus = row.querySelector('.status-badge')?.dataset.status || '';
      row.style.display = (!name || cell(0).includes(name)) && (!email || cell(1).includes(email)) &&
        (!phone || cell(2).includes(phone)) && (!status || rowStatus === status) &&
        (!type || cell(5) === this.translateUserType(type).toLowerCase()) && (!date || rowDate === date) ? '' : 'none';
    });
  }

  filterUsers(query) {
    const field = document.getElementById('filter-user-name');
    if (field) field.value = query || '';
    this.applyUserFilters();
  }

  async searchUserHistory() {
    const query = document.getElementById('user-history-query')?.value.trim();
    const result = document.getElementById('user-history-result');
    if (!query || !result) return;
    try {
      const response = await fetch(`/api/admin/user-history?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Usuário não encontrado.');
      result.className = 'user-history-result';
      result.innerHTML = `<strong>${data.user.nome}</strong> · ${data.user.email}<br><small>${this.translateUserType(data.user.tipo)} · ${this.translateUserStatus(data.user.status)}</small><hr><b>Compras:</b> ${data.purchases.length} · <b>Ingressos:</b> ${data.tickets.length}<br>${data.purchases.map(p => `<div>Pedido ${p.codigo_pedido} · ${this.formatCurrency(p.valor_total)} ·${this.formatDate(p.criado_em)}</div>`).join('') || '<div>Nenhuma compra registrada.</div>'}`;
    } catch (error) { result.className = 'user-history-result error'; result.textContent = error.message; }
  }

  async editUserAccess(userId, currentType, currentStatus) {
    const type = prompt('Tipo (admin, comum, organizador, fornecedor ou bilheteria):', currentType);
    if (!type) return;
    const status = prompt('Status (ativa ou suspensa):', currentStatus);
    if (!status) return;
    const adminPassword = prompt('Digite sua senha de administrador para confirmar:');
    if (!adminPassword) return;
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: type, status, admin_email: user?.email, admin_password: adminPassword }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível alterar o acesso.');
      this.loadUsersData();
    } catch (error) { alert(error.message); }
  }

  translateUserStatus(status) {
    return { pendente_verificacao: 'Pendente de verificação', ativa: 'Ativa', suspensa: 'Suspensa', excluida: 'Excluída' }[status] || 'Ativa';
  }

  translateUserType(type) {
    return { admin: 'Admin', comum: 'Comum', comprador: 'Comum', organizador: 'Organizador', fornecedor: 'Fornecedor', bilheteria: 'Bilheteria', sistema: 'Sistema', cliente: 'Cliente' }[type] || 'Comum';
  }

  deleteUser(userId) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      console.log(`Deletando usuário: ${userId}`);
    }
  }

  // ===== EVENTOS (COM ARTISTA) =====

  async loadEventsData() {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      this.renderEventsTable(data.events || []);
    } catch (error) {
      this.renderEventsTable([]);
    }
  }

  renderEventsTable(events) {
    const tbody = document.getElementById('eventos-table-body');
    if (!tbody) return;

    if (events.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8" class="empty-state">Nenhum evento cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = events.map(event => `
      <tr>
        <td><strong>${event.name || event.titulo || 'N/A'}</strong></td>
        <td style="color: #00d2ff; font-weight: 700;">${event.artista || '-'}</td>
        <td>${this.formatDate(event.date || event.data_evento)}</td>
        <td>${event.location || event.local || 'N/A'}</td>
        <td>${this.formatCurrency(event.price)}</td>
        <td><span class="status-badge ${event.destaque ? 'status-active' : 'status-inactive'}">${event.destaque ? 'Sim' : 'Não'}</span></td>
        <td><span class="status-badge status-active">${event.status || 'Ativo'}</span></td>
        <td class="action-buttons">
          <button class="action-btn action-btn-edit" onclick="adminPanel.editEvent('${event.id}')">Editar</button>
          <button class="action-btn action-btn-delete" onclick="adminPanel.deleteEvent('${event.id}')">Deletar</button>
        </td>
      </tr>
    `).join('');
  }

  openEventModal(isEdit = false) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('event-form');
    const previewBox = document.getElementById('event-img-preview-box');
    const filePicker = document.getElementById('event-file-picker');

    if (filePicker) filePicker.value = '';
    if (previewBox) previewBox.style.display = 'none';

    if (!isEdit) {
      this.editingEventId = null;
      if (form) form.reset();
      if (title) title.textContent = 'Novo Evento';
    } else {
      if (title) title.textContent = 'Editar Evento';
    }

    if (modal) {
      modal.classList.remove('closing');
      modal.style.display = 'flex';
      modal.classList.add('open');
    }
  }

  closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      modal.style.display = 'none';
      this.editingEventId = null;
      
      const content = modal.querySelector('.modal-content');
      if (content) {
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.transform = 'translate(-50%, -50%)';
      }
    }, 150);
  }

  async editEvent(eventId) {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      
      if (!response.ok || !data.ok || !data.event) {
        throw new Error(data.message || 'Erro ao carregar dados do evento.');
      }

      const ev = data.event;
      this.editingEventId = eventId;
      this.openEventModal(true);

      const form = document.getElementById('event-form');
      if (form) {
        if (form.elements['nome']) form.elements['nome'].value = ev.name || ev.nome || '';
        if (form.elements['artista']) form.elements['artista'].value = ev.artista || '';
        if (form.elements['local']) form.elements['local'].value = ev.location || ev.local || '';
        if (form.elements['preco']) form.elements['preco'].value = ev.price || ev.ticket_calculado || 0;
        if (form.elements['imagem']) form.elements['imagem'].value = ev.imagem || '';
        if (form.elements['status']) form.elements['status'].value = ev.status || 'publicado';
        if (form.elements['destaque']) form.elements['destaque'].checked = Boolean(ev.destaque);

        if (form.elements['data_evento'] && ev.date) {
          form.elements['data_evento'].value = ev.date.replace(' ', 'T').slice(0, 16);
        } else if (form.elements['data_evento'] && ev.data_evento) {
          form.elements['data_evento'].value = ev.data_evento.replace(' ', 'T').slice(0, 16);
        }

        if (ev.imagem) {
          const previewBox = document.getElementById('event-img-preview-box');
          const previewImg = document.getElementById('event-img-preview');
          const statusTxt = document.getElementById('event-img-status');
          if (previewBox && previewImg && statusTxt) {
            previewImg.src = ev.imagem;
            statusTxt.textContent = 'Imagem salva configurada';
            previewBox.style.display = 'flex';
          }
        }
      }
    } catch (error) {
      console.error('[admin] Erro ao carregar evento para edição:', error);
      alert(error.message);
    }
  }

  async saveEvent(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    payload.actor_id = actor?.id;
    payload.actor_name = actor?.nome || actor?.name;
    payload.actor_type = actor?.tipo;

    payload.destaque = form.elements['destaque']?.checked ? 1 : 0;

    const isEdit = Boolean(this.editingEventId);
    const endpoint = isEdit ? `/api/events/${this.editingEventId}` : '/api/events';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao salvar evento.');

      alert(data.message || 'Evento salvo com sucesso!');
      this.closeEventModal();
      this.loadEventsData();
    } catch (error) {
      console.error('[admin] Erro ao salvar evento:', error);
      alert(error.message);
    }
  }

  async deleteEvent(eventId) {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;
    try {
      const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor_id: actor?.id, actor_name: actor?.nome || actor?.name, actor_type: actor?.tipo })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao deletar evento.');
      alert('Evento deletado com sucesso!');
      this.loadEventsData();
    } catch (error) {
      console.error('[admin] Erro ao deletar evento:', error);
      alert(error.message);
    }
  }

  // ===== CONFIGURAR ARRASTAR O MODAL (DRAGGABLE) =====
  setupDraggableModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    const title = content ? content.querySelector('h2') : null;

    if (!content || !title) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    title.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = content.getBoundingClientRect();
      content.style.transform = 'none';
      content.style.top = `${rect.top}px`;
      content.style.left = `${rect.left}px`;

      initialLeft = rect.left;
      initialTop = rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      content.style.left = `${initialLeft + dx}px`;
      content.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  // ===== INGRESSOS =====

  async loadTicketsData() {
    try {
      const response = await fetch('/api/admin/tickets');
      const data = await response.json();
      this.renderTicketsTable(data.tickets || []);
    } catch (error) {
      this.renderTicketsTable([]);
    }
  }

  renderTicketsTable(tickets) {
    const tbody = document.getElementById('ingressos-table-body');
    if (!tbody) return;

    this.populateTicketFilterOptions(tickets);

    if (tickets.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8" class="empty-state">Nenhum ingresso registrado</td></tr>';
      return;
    }

    tbody.innerHTML = tickets.map(ticket => `
      <tr>
        <td>${ticket.numero_ingresso || 'N/A'}</td>
        <td>${ticket.codigo_pedido || 'N/A'}</td>
        <td>${ticket.eventName || 'N/A'}</td>
        <td>${ticket.ownerName || 'N/A'}</td>
        <td>${this.formatCurrency(ticket.price)}</td>
        <td><span class="status-badge status-${ticket.status}" data-status="${ticket.status}">${this.translateStatus(ticket.status)}</span></td>
        <td>${this.formatDate(ticket.createdAt)}</td>
        <td class="action-buttons">
          <button class="action-btn action-btn-view" onclick="adminPanel.viewTicket('${ticket.id}')">Ver</button>
          <select class="ticket-status-action" data-ticket-id="${ticket.id}" aria-label="Alterar status do ingresso">
            <option value="">Alterar status</option>
            <option value="cancelado">Cancelado</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.ticket-status-action').forEach(select => {
      select.addEventListener('change', event => {
        this.changeTicketStatus(event.currentTarget.dataset.ticketId, event.currentTarget.value);
      });
    });
  }

  populateTicketFilterOptions(tickets) {
    const options = (id, values, emptyLabel) => {
      const select = document.getElementById(id);
      if (!select) return;
      const selected = select.value;
      const unique = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      select.innerHTML = `<option value="">${emptyLabel}</option>` + unique
        .map(value => `<option value="${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}">${value}</option>`)
        .join('');
      if (unique.includes(selected)) select.value = selected;
    };

    options('filter-event', tickets.map(ticket => ticket.eventName), 'Todos os eventos');
    options('filter-owner', tickets.map(ticket => ticket.ownerName), 'Todos os proprietários');
  }

  applyTicketFilters() {
    const rows = document.querySelectorAll('#ingressos-table-body tr');
    const get = id => document.getElementById(id)?.value.trim().toLowerCase() || '';
    const code = get('filter-ticket-code');
    const order = get('filter-order-code');
    const event = get('filter-event');
    const owner = get('filter-owner');
    const status = get('filter-status');
    const priceValue = document.getElementById('filter-price')?.value;
    const price = priceValue === '' ? null : Number(priceValue);
    const date = document.getElementById('filter-date')?.value || '';

    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      const cells = row.querySelectorAll('td');
      const cell = index => (cells[index]?.textContent || '').trim().toLowerCase();
      const rowPrice = Number(cell(4).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
      const rowDate = cell(6).split('/').reverse().join('-');
      const statusValue = row.querySelector('.status-badge')?.dataset.status || '';
      row.style.display = (!code || cell(0).includes(code)) &&
        (!order || cell(1).includes(order)) &&
        (!event || cell(2).includes(event)) &&
        (!owner || cell(3).includes(owner)) &&
        (!status || statusValue === status) &&
        (price === null || rowPrice === price) &&
        (!date || rowDate === date) ? '' : 'none';
    });
  }

  filterTickets(status) {
    const field = document.getElementById('filter-status');
    if (field) field.value = status || '';
    this.applyTicketFilters();
  }

  async changeTicketStatus(ticketId, status) {
    if (!status) return;
    if (!confirm(`Alterar o ingresso para ${this.translateStatus(status)}?`)) return;
    try {
      const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actor_id: actor?.id, actor_email: actor?.email, actor_name: actor?.nome || actor?.name, actor_type: actor?.tipo })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao alterar status.');
      this.loadTicketsData();
    } catch (error) {
      console.error('[admin] Erro ao alterar status:', error);
      alert(error.message);
    }
  }

  viewTicket(ticketId) {
    alert(`Visualizando ingresso: ${ticketId}`);
  }

  // ===== RELATÓRIOS & BILHETERIA =====

  loadReportsData() {
    console.log('[admin] Seção de relatórios pronta.');
  }

  async loadBilheteriaData() {
    try {
      const response = await fetch('/api/admin/bilheteria');
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error();
      const body = document.getElementById('bilheteria-audit-body');
      if (body) {
        body.innerHTML = data.audit && data.audit.length ? data.audit.map(item => `
          <tr>
            <td>${item.numero_ingresso}</td>
            <td>${item.evento}</td>
            <td>${item.titular}</td>
            <td>${item.status}</td>
            <td>${this.formatDate(item.atualizado_em)}</td>
          </tr>
        `).join('') : '<tr><td colspan="5">Nenhuma auditoria registrada.</td></tr>';
      }
    } catch (error) {
      console.error('[admin] Erro ao carregar bilheteria:', error);
    }
  }

  async authorizePj(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = document.getElementById('authorize-pj-message');
    try {
      const response = await fetch('/api/admin/autorizar-pj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
      if (message) message.textContent = 'Empresa pré-autorizada com sucesso.';
      form.reset();
    } catch (error) {
      console.error('[admin] Erro na pré-autorização:', error);
      if (message) message.textContent = error.message;
    }
  }

  // ===== UTILITÁRIOS =====

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = dateString instanceof Date
      ? dateString
      : new Date(String(dateString).includes('T') ? dateString : `${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = dateString instanceof Date ? dateString : new Date(String(dateString).includes('T') ? dateString : `${dateString.replace(' ', 'T')}Z`);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  translateStatus(status) {
    const statusMap = {
      'active': 'Ativo',
      'sold': 'Vendido',
      'cancelled': 'Cancelado',
      'pending': 'Pendente',
      'inactive': 'Inativo',
      'valido': 'Ativo',
      'ativo': 'Ativo',
      'resgatado': 'Resgatado',
      'expirado': 'Expirado',
      'anunciado': 'Anunciado',
      'reservado': 'Reservado',
      'cancelamento_solicitado': 'Cancelamento solicitado',
      'cancelado': 'Cancelado',
      'bloqueado': 'Bloqueado'
    };
    return statusMap[status] || status;
  }
}

let adminPanel;
let accessControl;

document.addEventListener('DOMContentLoaded', () => {
  adminPanel = new AdminPanel();
  adminPanel.init();
  window.adminPanel = adminPanel;
  accessControl = new AdminAccessControl();
});