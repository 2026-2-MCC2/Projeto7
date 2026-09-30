const state = {
    events: [],
    tickets: [],
    provider: 'Troca Ticket',
    selectedTicketId: null,
    selectedDemoTicketId: null,
    demoOptionsOpen: false,
    supportStatusFilter: '*',
    operator: null,
    scanner: null,
    scannerRunning: false,
    scannerStarting: false,
    cameraSwitching: false,
    activeCameraId: null,
    torchEnabled: false,
    scanBusy: false,
    overlayTimer: null,
    toastTimer: null,
    sessionCount: 0,
    audit: []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const byId = id => document.getElementById(id);
const OPERATOR_TYPES = new Set(['admin', 'bilheteria', 'organizador']);

function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function readOperator() {
    try { return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null'); }
    catch { return null; }
}
function canOperate() { return Boolean(state.operator?.email && state.operator?.session_token && OPERATOR_TYPES.has(String(state.operator.tipo || '').toLowerCase())); }

async function apiRequest(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body) headers.set('Content-Type', 'application/json');
    if (state.operator?.session_token) headers.set('Authorization', `Bearer ${state.operator.session_token}`);
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
        const error = new Error(data.message || `Falha HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }
    return data;
}

function getEvent(eventId) { return state.events.find(event => String(event.id) === String(eventId)); }
function getTicket(ticketId) {
    return state.tickets.find(ticket => String(ticket.id) === String(ticketId) || String(ticket.numero_ingresso).toLowerCase() === String(ticketId).toLowerCase());
}
function makeOption(value, label) { return `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`; }
function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(date);
}
function formatCpf(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 11 ? `${digits.slice(0, 3)}.***.**${digits.slice(7, 9)}-${digits.slice(9)}` : value || 'Não informado';
}
function statusClass(status) {
    if (status === 'disponível') return 'available';
    if (status === 'utilizado') return 'used';
    return 'revoked';
}
function statusLabel(status) {
    if (status === 'disponível') return 'Disponível';
    if (status === 'utilizado') return 'Utilizado';
    return status === 'expirado' ? 'Expirado' : 'Revogado / transferido';
}
function normalizeProvider(ticket) {
    const savedProvider = String(ticket.provider || '').trim();
    if (['Troca Ticket', 'BlackTag', 'Ticketmaster', 'Ticket360'].includes(savedProvider)) return savedProvider;
    const codes = `${ticket.externalCode || ''} ${ticket.numero_ingresso || ''}`.toUpperCase();
    if (/\b(BT|BLACKTAG)[-_]/.test(codes)) return 'BlackTag';
    if (/\b(TM|TICKETMASTER)[-_]/.test(codes)) return 'Ticketmaster';
    if (/\b(T360|TICKET360)[-_]/.test(codes)) return 'Ticket360';
    return ticket.integratorId ? `Parceira #${ticket.integratorId}` : 'Troca Ticket';
}
function normalizeTicket(ticket) {
    const rawStatus = String(ticket.status || '').toLowerCase();
    const status = ['ativo', 'valido', 'disponível', 'disponivel'].includes(rawStatus) ? 'disponível'
        : ['utilizado', 'usado', 'checked_in'].includes(rawStatus) ? 'utilizado'
            : rawStatus === 'expirado' ? 'expirado' : 'revogado/transferido';
    return {
        ...ticket,
        id: String(ticket.id),
        numero_ingresso: ticket.numero_ingresso || String(ticket.id),
        externalCode: ticket.externalCode || ticket.codigo_original_bilheteria || ticket.numero_ingresso,
        holder: ticket.ownerName || ticket.titular || 'Titular não informado',
        cpf: ticket.ownerCpf || ticket.cpf || '',
        eventId: ticket.eventId ?? ticket.evento_id,
        eventName: ticket.eventName || ticket.evento || 'Evento não informado',
        sector: ticket.sector || ticket.setor || 'Setor não informado',
        provider: normalizeProvider(ticket),
        status,
        checkinAt: ticket.checkinAt || ticket.utilizado_em || null
    };
}

function findDemoTicketMatches(value) {
    const query = String(value || '').trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    const candidates = query ? state.tickets : state.tickets.filter(ticket =>
        String(ticket.eventId) === String(byId('gate-event').value) && ticket.status === 'disponível'
    );
    return candidates.filter(ticket => !query
        || String(ticket.holder).toLowerCase().includes(query)
        || String(ticket.numero_ingresso).toLowerCase().includes(query)
        || String(ticket.id).toLowerCase().includes(query)
        || (digits.length >= 2 && String(ticket.cpf || '').replace(/\D/g, '').includes(digits))
    ).slice(0, 30);
}

function renderEvents() {
    byId('gate-event').innerHTML = state.events.length ? state.events.map(event => makeOption(event.id, event.name)).join('') : makeOption('', 'Nenhum evento cadastrado');
    byId('provider-event').innerHTML = [makeOption('*', 'Todos os eventos'), ...state.events.map(event => makeOption(event.id, event.name))].join('');
    byId('gate-event').disabled = !state.events.length;
    byId('gate-sector').disabled = !state.events.length;
    updateScannerAvailability();
    renderGateSectors();
}
function updateScannerAvailability() {
    byId('toggle-scanner').disabled = !byId('gate-event').value || state.scannerStarting;
}
function renderGateSectors() {
    const event = getEvent(byId('gate-event').value);
    const sectors = Array.isArray(event?.sectors) ? event.sectors : [];
    byId('gate-sector').innerHTML = [makeOption('*', 'Todas as Áreas / Portaria Geral'), ...sectors.map(sector => makeOption(sector.name || sector.nome || sector, sector.name || sector.nome || sector))].join('');
    renderGateSummary();
}
function renderGateSummary() {
    const event = getEvent(byId('gate-event').value);
    const sector = byId('gate-sector').selectedOptions[0]?.textContent || 'Portaria Geral';
    byId('gate-summary').textContent = event ? `${event.name} · ${sector}` : 'Nenhum evento cadastrado';
}
function renderDemoTicketOptions() {
    const input = byId('demo-ticket-search');
    const options = byId('demo-ticket-options');
    const selectedTicket = state.tickets.find(ticket => ticket.id === state.selectedDemoTicketId);
    if (selectedTicket && !state.demoOptionsOpen) {
        options.hidden = true;
        options.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        return;
    }
    const matches = findDemoTicketMatches(input.value);
    const emptyMessage = !canOperate()
        ? 'Entre com uma conta da equipe para pesquisar ingressos.'
        : input.value.trim()
            ? 'Nenhum ingresso corresponde ao titular, CPF ou código informado.'
            : 'Nenhum ingresso disponível para o evento selecionado.';
    options.innerHTML = matches.length ? matches.map(ticket => `<button class="combobox-option" type="button" role="option" aria-selected="false" data-demo-ticket-id="${escapeHTML(ticket.id)}"><strong>${escapeHTML(ticket.holder)}</strong><small>CPF ${escapeHTML(formatCpf(ticket.cpf))} · ${escapeHTML(ticket.numero_ingresso)} · ${escapeHTML(ticket.eventName)} · ${escapeHTML(statusLabel(ticket.status))}</small></button>`).join('') : `<p class="combobox-empty">${emptyMessage}</p>`;
    options.hidden = !state.demoOptionsOpen;
    input.setAttribute('aria-expanded', String(state.demoOptionsOpen && matches.length > 0));
}
async function loadPlatformData({ preserveSelection = true } = {}) {
    const previousEventId = byId('gate-event').value;
    const previousProviderEvent = byId('provider-event').value;
    const eventData = await apiRequest('/api/events');
    let ticketData = { tickets: [] };
    if (canOperate()) ticketData = await apiRequest('/api/admin/tickets');
    state.events = (eventData.events || []).map(event => ({ ...event, id: String(event.id), sectors: event.sectors || [] }));
    state.tickets = (ticketData.tickets || []).map(normalizeTicket);
    renderEvents();
    if (preserveSelection && getEvent(previousEventId)) byId('gate-event').value = previousEventId;
    renderGateSectors();
    byId('provider-event').value = previousProviderEvent === '*' || getEvent(previousProviderEvent) ? previousProviderEvent : '*';
    renderDemoTicketOptions();
    renderProviderTable();
}
function updateClock() {
    byId('current-time').textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date());
}
function showToast(message) {
    const toast = byId('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

async function loadAudit() {
    try {
        const data = await apiRequest('/api/admin/activity-log?limit=100');
        state.audit = (data.logs || data.activities || []).filter(entry => /ingresso|checkin/i.test(`${entry.action || ''} ${entry.description || ''}`));
    } catch (error) {
        console.warn('[bilheteria] Não foi possível carregar auditoria:', error.message);
        state.audit = [];
    }
    renderAudit();
}

async function requestActivePayload(ticket) {
    if (!canOperate()) throw new Error('Entre com uma conta da equipe de operação para visualizar hashes ativos.');
    return apiRequest(`/api/admin/tickets/${encodeURIComponent(ticket.id)}/qr`);
}
async function validatePayload(payload) {
    if (!canOperate()) return { kind: 'error', title: 'Acesso da equipe necessário', detail: 'Entre na plataforma com uma conta da equipe de operação.' };
    if (!byId('gate-event').value) return { kind: 'error', title: 'Nenhum evento selecionado', detail: 'Selecione um evento real antes de validar.' };
    try {
        const result = await apiRequest('/api/bilheteria/validar-acesso', {
            method: 'POST',
            body: JSON.stringify({ qr_code_payload: String(payload || '').trim(), evento_id: Number(byId('gate-event').value), setor_catraca: byId('gate-sector').value })
        });
        const ticket = result.ticket || {};
        return { kind: 'success', title: 'ACESSO LIBERADO', detail: `<strong>${escapeHTML(ticket.titular || '')}</strong><br>${escapeHTML(ticket.setor || 'Setor não informado')} · ${escapeHTML(ticket.numero_ingresso || '')}<br>Origem: ${escapeHTML(ticket.bilheteria || 'Troca Ticket')}` };
    } catch (error) {
        const result = error.data || {};
        const kind = result.kind === 'warning' ? 'warning' : 'error';
        const previousCheckin = result.checkinAt ? ` Check-in anterior: ${formatDate(result.checkinAt)}.` : '';
        return { kind, title: kind === 'warning' ? 'SETOR INCORRETO' : result.message || error.message, detail: `${escapeHTML(result.message || error.message)}${escapeHTML(previousCheckin)}` };
    }
}
function playFeedback(kind) {
    try {
        const audio = new AudioContext();
        const beep = (frequency, duration, delay = 0, type = 'sine') => {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.08, audio.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration);
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.start(audio.currentTime + delay);
            oscillator.stop(audio.currentTime + delay + duration);
        };
        if (kind === 'success') beep(880, 0.15);
        else if (kind === 'warning') { beep(587, 0.1); beep(587, 0.1, 0.16); }
        else beep(220, 0.35, 0, 'triangle');
        window.setTimeout(() => audio.close(), 700);
    } catch (error) { console.warn('[bilheteria] Áudio indisponível:', error); }
}
function showFeedback(result) {
    const overlay = byId('feedback-overlay');
    clearTimeout(state.overlayTimer);
    overlay.dataset.kind = result.kind;
    byId('feedback-symbol').textContent = result.kind === 'success' ? '✓' : result.kind === 'warning' ? '!' : '×';
    byId('feedback-kicker').textContent = result.kind === 'success' ? 'VALIDAÇÃO APROVADA' : result.kind === 'warning' ? 'ATENÇÃO · PORTÃO' : 'ACESSO RECUSADO';
    byId('feedback-title').textContent = result.title;
    byId('feedback-detail').innerHTML = result.detail;
    overlay.hidden = false;
    playFeedback(result.kind);
    state.overlayTimer = window.setTimeout(() => {
        overlay.hidden = true;
        state.scanBusy = false;
        if (result.kind === 'success') byId('token-input').focus({ preventScroll: true });
    }, 2000);
}
async function processPayload(payload) {
    if (state.scanBusy) return;
    state.scanBusy = true;
    state.sessionCount += 1;
    byId('session-count').textContent = String(state.sessionCount);
    byId('last-scan').textContent = new Date().toLocaleTimeString('pt-BR');
    const result = await validatePayload(payload);
    showFeedback(result);
    if (result.kind === 'success') {
        byId('token-input').value = '';
        byId('manual-token-details').open = true;
        loadPlatformData().catch(error => console.error('[bilheteria] Atualização após check-in falhou:', error));
        loadAudit();
    }
}

function renderCameraOptions(cameras, preferredId = null) {
    const select = byId('camera-select');
    const previousId = select.value;
    const availableIds = new Set(cameras.map(camera => camera.id));
    select.innerHTML = makeOption('', 'Automática · priorizar traseira') + cameras.map((camera, index) => makeOption(camera.id, camera.label || `Câmera ${index + 1}`)).join('');
    if (preferredId && availableIds.has(preferredId)) select.value = preferredId;
    else if (previousId && availableIds.has(previousId)) select.value = previousId;
    else select.value = cameras.find(camera => /back|rear|environment|traseira|principal/i.test(camera.label))?.id || '';
}
async function refreshCameraOptions(preferredId = state.activeCameraId) {
    if (!window.Html5Qrcode) return [];
    try {
        const cameras = await Html5Qrcode.getCameras();
        renderCameraOptions(cameras, preferredId);
        return cameras;
    } catch (error) {
        console.warn('[bilheteria] Não foi possível listar câmeras:', error);
        return [];
    }
}
async function startScanner(cameraId = byId('camera-select').value || null) {
    if (state.scannerRunning || state.scannerStarting) return;
    if (!byId('gate-event').value) return showToast('Selecione um evento cadastrado antes de iniciar o leitor.');
    if (!window.Html5Qrcode) {
        byId('camera-hint').textContent = 'Biblioteca de câmera indisponível. Confira sua conexão ou use a entrada manual.';
        return showToast('Leitor indisponível. Use a validação manual.');
    }
    state.scannerStarting = true;
    byId('toggle-scanner').disabled = true;
    byId('toggle-scanner').textContent = 'Abrindo câmera…';
    byId('scanner-status').textContent = 'Abrindo câmera…';
    byId('scanner-status').className = 'status-chip status-neutral';
    try {
        state.scanner = new Html5Qrcode('reader', { verbose: false });
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 };
        try {
            await state.scanner.start(cameraId || { facingMode: 'environment' }, config, decodedText => processPayload(decodedText), () => {});
            state.scannerRunning = true;
        } catch (firstError) {
            if (cameraId) throw firstError;
            const cameras = await Html5Qrcode.getCameras();
            const rearCamera = cameras.find(camera => /back|rear|environment|traseira|principal/i.test(camera.label)) || cameras[0];
            if (!rearCamera) throw firstError;
            renderCameraOptions(cameras, rearCamera.id);
            await state.scanner.start(rearCamera.id, config, decodedText => processPayload(decodedText), () => {});
            state.scannerRunning = true;
        }
        byId('scanner-placeholder').hidden = true;
        byId('scanner-status').textContent = 'Câmera ativa';
        byId('scanner-status').className = 'status-chip status-success';
        byId('toggle-scanner').textContent = 'Pausar validação';
        byId('toggle-scanner').classList.add('is-running');
        const video = $('#reader video');
        state.activeCameraId = video?.srcObject?.getVideoTracks?.()[0]?.getSettings?.().deviceId || cameraId;
        await refreshCameraOptions(state.activeCameraId);
        configureTorchButton();
    } catch (error) {
        await stopScanner();
        byId('camera-hint').textContent = 'Permita acesso à câmera e use localhost/HTTPS. Também é possível escolher outra câmera.';
        showToast(`Câmera indisponível: ${error.message || 'permissão negada'}`);
    } finally {
        state.scannerStarting = false;
        updateScannerAvailability();
    }
}
async function switchScannerCamera(cameraId) {
    if (!state.scannerRunning || state.cameraSwitching || cameraId === state.activeCameraId) return;
    state.cameraSwitching = true;
    await stopScanner();
    await startScanner(cameraId || null);
    state.cameraSwitching = false;
}
function configureTorchButton() {
    const track = $('#reader video')?.srcObject?.getVideoTracks?.()[0];
    const button = byId('torch-toggle');
    button.hidden = !track?.getCapabilities?.().torch;
    state.torchEnabled = false;
    button.classList.remove('is-on');
    button.textContent = 'Lanterna';
}
async function toggleTorch() {
    const track = $('#reader video')?.srcObject?.getVideoTracks?.()[0];
    if (!track) return;
    try {
        state.torchEnabled = !state.torchEnabled;
        await track.applyConstraints({ advanced: [{ torch: state.torchEnabled }] });
        byId('torch-toggle').classList.toggle('is-on', state.torchEnabled);
        byId('torch-toggle').textContent = state.torchEnabled ? 'Desligar lanterna' : 'Lanterna';
        byId('torch-toggle').setAttribute('aria-label', state.torchEnabled ? 'Desligar lanterna' : 'Ligar lanterna');
    } catch { state.torchEnabled = false; showToast('Este dispositivo não permitiu alterar a lanterna.'); }
}
async function stopScanner() {
    if (state.scanner) {
        if (state.scannerRunning) {
            try { await state.scanner.stop(); } catch (error) { console.warn('[bilheteria] Falha ao parar câmera:', error); }
        }
        try { state.scanner.clear(); } catch (error) { console.warn('[bilheteria] Falha ao limpar leitor:', error); }
    }
    state.scanner = null;
    state.scannerRunning = false;
    state.activeCameraId = null;
    state.scanBusy = false;
    byId('scanner-placeholder').hidden = false;
    byId('torch-toggle').hidden = true;
    byId('scanner-status').textContent = 'Câmera pausada';
    byId('scanner-status').className = 'status-chip status-neutral';
    byId('toggle-scanner').textContent = 'Iniciar validação contínua';
    byId('toggle-scanner').classList.remove('is-running');
}

function renderSearchResults(query = '') {
    const normalized = query.replace(/\D/g, '');
    const raw = query.trim().toLowerCase();
    const shouldShowResults = Boolean(raw || state.supportStatusFilter !== '*');
    const results = shouldShowResults ? state.tickets.filter(ticket => {
        const statusMatches = state.supportStatusFilter === '*' || ticket.status === state.supportStatusFilter;
        const queryMatches = !raw || ticket.numero_ingresso.toLowerCase().includes(raw) || ticket.id.toLowerCase().includes(raw)
            || String(ticket.holder).toLowerCase().includes(raw)
            || (normalized.length >= 2 && String(ticket.cpf).replace(/\D/g, '').includes(normalized));
        return statusMatches && queryMatches;
    }).slice(0, 50) : [];
    byId('search-results').innerHTML = results.length ? results.map(ticket => `<button class="search-result ${ticket.id === state.selectedTicketId ? 'is-selected' : ''}" type="button" data-ticket-id="${escapeHTML(ticket.id)}"><span><strong>${escapeHTML(ticket.numero_ingresso)} · ${escapeHTML(ticket.holder)}</strong><small>${escapeHTML(ticket.sector)} · ${escapeHTML(ticket.eventName)}</small></span><span class="table-status ${statusClass(ticket.status)}">${escapeHTML(statusLabel(ticket.status))}</span></button>`).join('') : shouldShowResults ? '<p class="field-hint">Nenhum ingresso encontrado para esta busca e filtro.</p>' : '';
    if (results.length === 1 && !state.selectedTicketId) selectSupportTicket(results[0].id);
}
function selectSupportTicket(ticketId) {
    state.selectedTicketId = String(ticketId);
    const ticket = getTicket(ticketId);
    if (!ticket) return;
    byId('ticket-detail').innerHTML = `<h3>Dados do ingresso</h3><dl class="ticket-data"><div><dt>Titular</dt><dd>${escapeHTML(ticket.holder)}</dd></div><div><dt>CPF</dt><dd>${escapeHTML(formatCpf(ticket.cpf))}</dd></div><div><dt>Código</dt><dd>${escapeHTML(ticket.numero_ingresso)}</dd></div><div><dt>Setor</dt><dd>${escapeHTML(ticket.sector)}</dd></div><div><dt>Evento</dt><dd>${escapeHTML(ticket.eventName)}</dd></div><div><dt>Bilheteria de origem</dt><dd>${escapeHTML(ticket.provider)}</dd></div><div><dt>Status atual</dt><dd><span class="table-status ${statusClass(ticket.status)}">${escapeHTML(statusLabel(ticket.status))}</span></dd></div><div><dt>Check-in anterior</dt><dd>${escapeHTML(formatDate(ticket.checkinAt))}</dd></div></dl>${ticket.status === 'disponível' ? `<form class="manual-approval" id="manual-approval"><label for="manual-reason">Motivo da liberação</label><select id="manual-reason" required><option value="Tela do aparelho danificada">Tela do aparelho danificada</option><option value="Celular descarregado - documento físico conferido">Celular descarregado - documento físico conferido</option><option value="Brilho insuficiente / erro de leitura">Brilho insuficiente / erro de leitura</option></select><button class="button button-primary" type="submit">Aprovar check-in manual</button><p class="manual-approval-note">A liberação será gravada no banco e na auditoria da plataforma.</p></form>` : `<p class="security-note">${ticket.status === 'utilizado' ? `Ingresso consumido em ${escapeHTML(formatDate(ticket.checkinAt))}.` : 'Este ingresso não está disponível para check-in.'}</p>`}`;
}
async function approveManualCheckin(event) {
    if (event.target.id !== 'manual-approval') return;
    event.preventDefault();
    const ticket = getTicket(state.selectedTicketId);
    if (!ticket || ticket.status !== 'disponível') return;
    try {
        const result = await apiRequest(`/api/bilheteria/tickets/${encodeURIComponent(ticket.id)}/checkin-manual`, { method: 'POST', body: JSON.stringify({ motivo: byId('manual-reason').value }) });
        await loadPlatformData();
        await loadAudit();
        selectSupportTicket(ticket.id);
        showToast(result.message);
    } catch (error) { showToast(error.message); }
}

function renderProviderTable() {
    const selectedEvent = byId('provider-event').value || '*';
    const selectedStatus = byId('provider-status-filter').value || '*';
    const selectedOrigin = byId('provider-origin-filter').value || '*';
    const providerTickets = state.tickets.filter(ticket => ticket.provider === state.provider);
    const visibleTickets = providerTickets.filter(ticket => (selectedEvent === '*' || String(ticket.eventId) === selectedEvent)
        && (selectedStatus === '*' || ticket.status === selectedStatus)
        && (selectedOrigin === '*' || (selectedOrigin === 'own' ? ticket.provider === 'Troca Ticket' : ticket.provider !== 'Troca Ticket')));
    byId('provider-caption').textContent = `${visibleTickets.length} de ${providerTickets.length} · ${state.provider} · ${selectedEvent === '*' ? 'todos os eventos' : getEvent(selectedEvent)?.name || ''}`;
    byId('metric-ingested').textContent = String(providerTickets.length);
    byId('metric-checkins').textContent = String(providerTickets.filter(ticket => ticket.status === 'utilizado').length);
    byId('metric-transferred').textContent = String(providerTickets.filter(ticket => Number(ticket.versao_titularidade || 1) > 1).length);
    byId('provider-ticket-rows').innerHTML = visibleTickets.length ? visibleTickets.map(ticket => `<tr><td>${escapeHTML(ticket.eventName)}</td><td>${escapeHTML(ticket.externalCode)}</td><td>${escapeHTML(ticket.numero_ingresso)}</td><td>${escapeHTML(ticket.holder)}</td><td>${escapeHTML(formatCpf(ticket.cpf))}</td><td>${escapeHTML(ticket.sector)}</td><td>${escapeHTML(ticket.provider)}</td><td><span class="table-status ${statusClass(ticket.status)}">${escapeHTML(statusLabel(ticket.status))}</span></td><td><button class="button button-small button-secondary" type="button" data-show-payload="${escapeHTML(ticket.id)}" ${ticket.status !== 'disponível' || !canOperate() ? 'disabled' : ''}>Ver hash ativo / payload QR</button><output class="active-payload" data-payload-for="${escapeHTML(ticket.id)}" aria-live="polite"></output></td></tr>`).join('') : `<tr><td class="table-empty" colspan="9">${canOperate() ? 'Nenhum ingresso real corresponde aos filtros selecionados.' : 'Entre com uma conta da equipe para acessar ingressos e dados pessoais.'}</td></tr>`;
    const batchStatus = byId('batch-status');
    if (batchStatus) {
        batchStatus.textContent = `Banco atualizado · ${new Date().toLocaleTimeString('pt-BR')}`;
        batchStatus.className = 'status-chip status-success';
    }
}
async function refreshProviderData() {
    try {
        await loadPlatformData();
        await loadAudit();
        showToast('Ingressos atualizados a partir do banco Troca Ticket.');
    } catch (error) { showToast(error.message); }
}
function renderAudit() {
    const query = byId('audit-search').value.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    const relatedTicketIds = new Set(state.tickets.filter(ticket => digits.length >= 3 && String(ticket.cpf || '').replace(/\D/g, '').includes(digits))
        .flatMap(ticket => [ticket.id, ticket.numero_ingresso, ticket.externalCode].filter(Boolean).map(value => String(value).toLowerCase())));
    const logs = state.audit.filter(entry => {
        if (!query) return true;
        const text = `${entry.itemId || ''} ${entry.description || ''} ${entry.action || ''} ${entry.itemType || ''} ${entry.actorName || ''}`.toLowerCase();
        return text.includes(query) || [...relatedTicketIds].some(ticketId => text.includes(ticketId));
    });
    byId('audit-rows').innerHTML = logs.length ? logs.map(entry => {
        const transfer = /transferencia_ingresso_painel/i.test(entry.action || '');
        return `<tr><td><span class="cell-main">${escapeHTML(entry.itemId || 'Ingresso')}</span><span class="cell-sub">${escapeHTML(entry.description || entry.action || '')}</span></td><td>Consultar ingresso</td><td>${escapeHTML(formatDate(entry.timestamp))}</td><td>${transfer ? '<span class="table-status revoked">Hash anterior revogado</span>' : '—'}</td><td>${transfer ? '<span class="table-status used">Matriz não configurada</span>' : 'Não aplicável'}</td></tr>`;
    }).join('') : `<tr><td class="table-empty" colspan="5">${query ? 'Nenhum log corresponde ao ID ou CPF pesquisado.' : 'Nenhuma movimentação de bilheteria encontrada na auditoria.'}</td></tr>`;
}
async function transferTicket(event) {
    event.preventDefault();
    const message = byId('transfer-message');
    message.textContent = '';
    try {
        const result = await apiRequest('/api/bilheteria/transferencias', {
            method: 'POST',
            body: JSON.stringify({ ticket_id: byId('transfer-ticket-id').value.trim(), motivo: byId('transfer-reason').value, novo_titular_nome: byId('new-holder-name').value.trim(), novo_titular_contato: byId('new-holder-contact').value.trim() })
        });
        await loadPlatformData();
        await loadAudit();
        const matrixMessage = result.matrixSync === 'not_configured' ? ' A API da bilheteria matriz ainda não está configurada.' : '';
        message.textContent = `${result.message} Novo código: ${result.ticket.numero_ingresso}.${matrixMessage}`;
        message.style.color = 'var(--green)';
        showToast('Transferência gravada e hash anterior revogado.');
    } catch (error) {
        message.textContent = error.message;
        message.style.color = 'var(--red)';
    }
}
async function showActivePayload(event) {
    const button = event.target.closest('[data-show-payload]');
    if (!button) return;
    const output = $(`[data-payload-for="${CSS.escape(button.dataset.showPayload)}"]`);
    button.disabled = true;
    try {
        const result = await requestActivePayload(getTicket(button.dataset.showPayload));
        output.textContent = `${result.payload} · válido até ${new Date(result.expiresAt).toLocaleTimeString('pt-BR')}`;
    } catch (error) { output.textContent = error.message; }
    finally { button.disabled = false; }
}

function bindEvents() {
    $$('.tab-button').forEach(button => button.addEventListener('click', () => {
        $$('.tab-button').forEach(tab => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
        $$('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.tab; panel.classList.toggle('is-active', !panel.hidden); });
    }));
    byId('gate-event').addEventListener('change', () => { state.selectedDemoTicketId = null; state.demoOptionsOpen = false; byId('demo-ticket-search').value = ''; renderGateSectors(); renderDemoTicketOptions(); updateScannerAvailability(); });
    byId('gate-sector').addEventListener('change', renderGateSummary);
    byId('toggle-scanner').addEventListener('click', () => state.scannerRunning ? stopScanner() : startScanner());
    byId('camera-select').addEventListener('change', event => switchScannerCamera(event.target.value));
    byId('refresh-cameras').addEventListener('click', async () => {
        const cameras = await refreshCameraOptions();
        showToast(cameras.length ? `${cameras.length} câmera(s) encontrada(s).` : 'Nenhuma câmera encontrada. Confira as permissões do navegador.');
    });
    byId('torch-toggle').addEventListener('click', toggleTorch);
    byId('token-form').addEventListener('submit', event => { event.preventDefault(); processPayload(byId('token-input').value); });
    byId('demo-ticket-search').addEventListener('focus', () => {
        if (state.selectedDemoTicketId) return;
        state.demoOptionsOpen = true;
        renderDemoTicketOptions();
    });
    byId('demo-ticket-search').addEventListener('input', event => {
        state.selectedDemoTicketId = null;
        state.demoOptionsOpen = true;
        renderDemoTicketOptions();
    });
    byId('demo-ticket-search').addEventListener('keydown', event => {
        if (event.key === 'Escape') { state.demoOptionsOpen = false; renderDemoTicketOptions(); }
        if (event.key === 'Enter') {
            const firstOption = byId('demo-ticket-options').querySelector('[data-demo-ticket-id]');
            if (firstOption) { event.preventDefault(); firstOption.click(); }
        }
    });
    byId('demo-ticket-options').addEventListener('click', event => {
        const option = event.target.closest('[data-demo-ticket-id]');
        if (!option) return;
        const ticket = getTicket(option.dataset.demoTicketId);
        if (!ticket) return;
        state.selectedDemoTicketId = ticket.id;
        state.demoOptionsOpen = false;
        if (ticket.eventId && String(ticket.eventId) !== String(byId('gate-event').value)) {
            byId('gate-event').value = String(ticket.eventId);
            renderGateSectors();
            updateScannerAvailability();
        }
        byId('demo-ticket-search').value = `${ticket.holder} · CPF ${formatCpf(ticket.cpf)} · ${ticket.numero_ingresso}`;
        renderDemoTicketOptions();
        byId('generate-token').disabled = !canOperate() || ticket.status !== 'disponível';
        if (ticket.status === 'disponível') byId('generate-token').focus();
    });
    byId('generate-token').addEventListener('click', async () => {
        const ticket = getTicket(state.selectedDemoTicketId);
        if (!ticket || ticket.status !== 'disponível') return showToast('Selecione um ingresso disponível para gerar o payload atual.');
        try { byId('token-input').value = (await requestActivePayload(ticket)).payload; }
        catch (error) { showToast(error.message); }
    });
    byId('ticket-search').addEventListener('input', event => {
        state.selectedTicketId = null;
        renderSearchResults(event.target.value);
        if (!event.target.value.trim()) byId('ticket-detail').innerHTML = '<div class="empty-state"><span aria-hidden="true">▤</span><strong>Nenhum ingresso selecionado</strong><p>Busque por documento ou código para consultar os dados.</p></div>';
    });
    byId('search-results').addEventListener('click', event => { const button = event.target.closest('[data-ticket-id]'); if (button) selectSupportTicket(button.dataset.ticketId); });
    byId('ticket-detail').addEventListener('submit', approveManualCheckin);
    $$('.filter-chip[data-support-status]').forEach(button => button.addEventListener('click', () => {
        state.supportStatusFilter = button.dataset.supportStatus;
        $$('.filter-chip[data-support-status]').forEach(filter => {
            const active = filter === button;
            filter.classList.toggle('is-active', active);
            filter.setAttribute('aria-pressed', String(active));
        });
        renderSearchResults(byId('ticket-search').value);
    }));
    $$('.integrator-pill').forEach(button => button.addEventListener('click', () => {
        state.provider = button.dataset.provider;
        $$('.integrator-pill').forEach(pill => pill.classList.toggle('is-active', pill === button));
        renderProviderTable();
    }));
    byId('provider-event').addEventListener('change', renderProviderTable);
    byId('provider-status-filter').addEventListener('change', renderProviderTable);
    byId('provider-origin-filter').addEventListener('change', renderProviderTable);
    byId('sync-provider').addEventListener('click', refreshProviderData);
    byId('sync-provider-table').addEventListener('click', refreshProviderData);
    byId('provider-ticket-rows').addEventListener('click', showActivePayload);
    byId('audit-search').addEventListener('input', renderAudit);
    byId('transfer-form').addEventListener('submit', transferTicket);
}

async function initialize() {
    state.operator = readOperator();
    const hasOperatorAccess = canOperate();
    byId('operator-name').textContent = hasOperatorAccess ? (state.operator.nome || state.operator.name || 'Equipe de Portaria') : 'Acesso restrito';
    byId('operator-status').textContent = hasOperatorAccess ? `Perfil ${state.operator.tipo}` : 'Entre com uma conta da equipe';
    byId('toggle-scanner').disabled = !byId('gate-event').value;
    byId('token-input').disabled = !hasOperatorAccess;
    byId('token-form').querySelector('button[type="submit"]').disabled = !hasOperatorAccess;
    byId('generate-token').disabled = !hasOperatorAccess;
    byId('transfer-form').querySelector('button[type="submit"]').disabled = !hasOperatorAccess;
    updateClock();
    window.setInterval(updateClock, 1000);
    bindEvents();
    try {
        await loadPlatformData({ preserveSelection: false });
        await loadAudit();
    } catch (error) {
        console.error('[bilheteria] Erro ao carregar dados da plataforma:', error);
        byId('gate-event').innerHTML = makeOption('', 'Não foi possível carregar eventos');
        byId('gate-sector').innerHTML = makeOption('*', 'Todas as Áreas / Portaria Geral');
        byId('provider-ticket-rows').innerHTML = `<tr><td class="table-empty" colspan="9">${escapeHTML(error.message)}</td></tr>`;
        showToast('Falha ao conectar com o banco Troca Ticket.');
    }
}

initialize();
