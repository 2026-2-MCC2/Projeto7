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
        const section = btn.dataset.section;
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

    const activeBtn = document.querySelector(`.nav-btn[data-section="${section}"]`);
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

    const ticketFilter = document.getElementById('ticket-filter');
    if (ticketFilter) {
      ticketFilter.addEventListener('change', (e) => this.filterTickets(e.target.value));
    }
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
    this.fetchStats()
      .then(stats => this.updateStats(stats))
      .catch(error => console.error('Erro ao carregar stats:', error));

    this.fetchActivityLog()
      .then(activities => this.updateActivityList(activities))
      .catch(error => console.error('Erro ao carregar atividades:', error));

    this.fetchFeaturedEvents()
      .then(events => this.updateFeaturedEvents(events))
      .catch(error => console.error('Erro ao carregar eventos:', error));
  }

  async fetchStats() {
    try {
      const response = await fetch('/api/admin/stats');
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
        <strong>${activity.type}</strong> - ${activity.description}
        <br>
        <small>${this.formatDate(activity.createdAt)}</small>
      </div>
    `).join('');
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
        <div class="event-item-title">${event.name || 'Evento sem nome'}</div>
        ${event.artista ? `<div style="font-size: 0.8rem; color: #00d2ff; font-weight: 700;">${event.artista}</div>` : ''}
        <div class="event-item-date">${this.formatDate(event.date)}</div>
        <div class="event-item-location">${event.location || 'Local não informado'}</div>
      </div>
    `).join('');
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
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6" class="empty-state">Nenhum usuário cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.name || user.nome || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.telefone || user.phone || 'N/A'}</td>
        <td>${this.formatDate(user.createdAt || user.criado_em)}</td>
        <td><span class="status-badge status-${user.status || 'ativo'}">${user.status || 'Ativo'}</span></td>
        <td class="action-buttons">
          <button class="action-btn action-btn-view" onclick="adminPanel.viewUserDetails('${user.id}')">Visualizar</button>
          <button class="action-btn action-btn-delete" onclick="adminPanel.deleteUser('${user.id}')">Deletar</button>
        </td>
      </tr>
    `).join('');
  }

  filterUsers(query) {
    const rows = document.querySelectorAll('#usuarios-table-body tr');
    const lowerQuery = query.toLowerCase();

    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(lowerQuery) ? '' : 'none';
    });
  }

  viewUserDetails(userId) {
    alert(`Visualizando usuário: ${userId}`);
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
      modal.style.display = 'flex'; // Força o display flex para sobrescrever o style inline do HTML
      modal.classList.add('open');
    }
  }

  closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      modal.style.display = 'none'; // Retorna para none
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

        // Preview da foto salva
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
      const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
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

    if (tickets.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">Nenhum ingresso registrado</td></tr>';
      return;
    }

    tbody.innerHTML = tickets.map(ticket => `
      <tr>
        <td>${ticket.id || 'N/A'}</td>
        <td>${ticket.eventName || 'N/A'}</td>
        <td>${ticket.ownerName || 'N/A'}</td>
        <td>${this.formatCurrency(ticket.price)}</td>
        <td><span class="status-badge status-${ticket.status}">${this.translateStatus(ticket.status)}</span></td>
        <td>${this.formatDate(ticket.createdAt)}</td>
        <td class="action-buttons">
          <button class="action-btn action-btn-view" onclick="adminPanel.viewTicket('${ticket.id}')">Ver</button>
        </td>
      </tr>
    `).join('');
  }

  filterTickets(status) {
    const rows = document.querySelectorAll('#ingressos-table-body tr');
    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      if (status === '') {
        row.style.display = '';
      } else {
        const statusCell = row.querySelector('.status-badge');
        row.style.display = statusCell && statusCell.textContent.toLowerCase().includes(status) ? '' : 'none';
      }
    });
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
      'inactive': 'Inativo'
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