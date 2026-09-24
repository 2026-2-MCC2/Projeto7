/**
 * TrocaTicket - Script Principal
 * Controle de Carrossel (67%), Listagem de Eventos, Compra e Sessão
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== SESSÃO E LOGOUT =====
  function getSessionUser() {
    try {
      return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    } catch {
      return null;
    }
  }

  function executeLogout(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('trocaticket-user');
      localStorage.removeItem('usuario');
      sessionStorage.removeItem('adminToken');
      window.location.href = 'index.html';
    }
  }

  // Listener de Logout do Menu Suspenso
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', executeLogout);
  }

  // Listener de Logout dentro de modais
  const modalLogoutBtn = document.getElementById('logout-button');
  if (modalLogoutBtn) {
    modalLogoutBtn.addEventListener('click', executeLogout);
  }

  // Navegação do item "Minha Conta / Entrar" para a página completa de perfil
  const currentUser = getSessionUser();
  const accountLink = document.getElementById('account-link');
  if (accountLink) {
    if (currentUser && currentUser.email) {
      accountLink.href = 'perfil.html';
      const accountSpan = accountLink.querySelector('span');
      if (accountSpan) accountSpan.textContent = 'Minha Conta';
      if (logoutLink) logoutLink.style.display = 'flex';
    } else {
      accountLink.href = 'login.html';
      const accountSpan = accountLink.querySelector('span');
      if (accountSpan) accountSpan.textContent = 'Entrar / Cadastrar';
      if (logoutLink) logoutLink.style.display = 'none';
    }
  }

  // ===== MENU MOBILE / DROPDOWN =====
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-menu');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
      }
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (link.id !== 'logout-link') {
          menuToggle.setAttribute('aria-expanded', 'false');
          mainNav.classList.remove('open');
        }
      });
    });
  }

  // ===== CARROSSEL DE EVENTOS COM AUTOPLAY (3S) =====
  const carouselContainer = document.getElementById('event-carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let carouselEvents = [];
  let currentSlide = 0;
  let carouselTrack = null;
  let autoPlayTimer = null;

  function resolveEventImage(ev) {
    if (ev.imagem && typeof ev.imagem === 'string' && ev.imagem.trim()) {
      return ev.imagem.trim();
    }
    const name = String(ev.name || ev.nome || '').toLowerCase();
    if (name.includes('arena')) return 'imagens/arena+.jpeg';
    if (name.includes('sea') || name.includes('club')) return 'imagens/sea club.jpeg';
    if (name.includes('esperia') || name.includes('mirante')) return 'imagens/mirante esperia.jpeg';
    if (name.includes('sanca') || name.includes('trap')) return 'imagens/trap in sanca.jpeg';
    if (name.includes('terra')) return 'imagens/terra sp.jpeg';
    if (name.includes('chefe')) return 'imagens/festa do chefe.jpeg';
    return 'imagens/logo troca ticket.png';
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return 'DATA A DEFINIR';
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return 'DATA A DEFINIR';
    return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  }

  function renderCarousel() {
    if (!carouselContainer || !carouselEvents.length) return;

    carouselContainer.innerHTML = `
      <div class="carousel-track" id="carousel-track">
        ${carouselEvents.map(ev => `
          <div class="carousel-slide" data-id="${ev.id}">
            <img src="${resolveEventImage(ev)}" alt="${ev.name || 'Evento'}">
            <div class="carousel-slide-content">
              <div style="margin-top: 24px;">
                <h3>${ev.name || 'Evento'}</h3>
                ${ev.artista ? `<p style="color: var(--lime); font-weight: 700; margin-bottom: 2px;">${ev.artista}</p>` : ''}
                <span style="display: block; color: #69d9ff; font-weight: 700; font-size: 9px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); margin-top: 4px; text-transform: uppercase;">${formatShortDate(ev.date)} · ${(ev.location || 'SÃO PAULO')}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    carouselTrack = document.getElementById('carousel-track');

    if (dotsContainer) {
      dotsContainer.innerHTML = carouselEvents.map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir para o slide ${i + 1}"></button>
      `).join('');

      dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          goToSlide(Number(dot.dataset.index));
          resetAutoPlay();
        });
      });
    }

    carouselContainer.querySelectorAll('.carousel-slide').forEach(slide => {
      slide.addEventListener('click', () => {
        const evId = slide.dataset.id;
        const target = carouselEvents.find(e => String(e.id) === String(evId));
        if (target) openEventModal(target);
      });
    });

    goToSlide(0);
    startAutoPlay();
  }

  function goToSlide(index) {
    if (!carouselTrack || !carouselEvents.length) return;
    currentSlide = (index + carouselEvents.length) % carouselEvents.length;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 3000);
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  // ===== GRADE DE EVENTOS =====
  const eventGrid = document.getElementById('event-grid');
  const regionFilter = document.getElementById('region-filter');
  let allEvents = [];

  function renderGrid(events) {
    if (!eventGrid) return;

    if (!events.length) {
      eventGrid.innerHTML = '<p class="empty-state" style="grid-column: 1 / -1; text-align: center; color: var(--muted);">Nenhum evento encontrado.</p>';
      return;
    }

    eventGrid.innerHTML = events.map(ev => `
      <article class="event-card" data-id="${ev.id}">
        <img src="${resolveEventImage(ev)}" alt="${ev.name || 'Evento'}">
        <div class="event-card-body">
          <div style="margin-top: 12px;">
            <p class="eyebrow" style="margin-bottom: 6px;">${formatShortDate(ev.date)} · ${ev.location || 'Local a definir'}</p>
            <h3>${ev.name || 'Evento'}</h3>
            ${ev.artista ? `<p style="color: #00d2ff; font-weight: 700; font-size: 0.85rem; margin: -4px 0 8px 0;">${ev.artista}</p>` : ''}
            <p class="event-meta">Ingressos nominais e verificados</p>
          </div>
          <div class="event-card-foot" style="justify-content: flex-end;">
            <button type="button" class="card-button" data-buy="${ev.id}">Garantir ↗</button>
          </div>
        </div>
      </article>
    `).join('');

    eventGrid.querySelectorAll('[data-buy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const evId = btn.dataset.buy;
        const target = allEvents.find(item => String(item.id) === String(evId));
        if (target) openEventModal(target);
      });
    });

    eventGrid.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', () => {
        const evId = card.dataset.id;
        const target = allEvents.find(item => String(item.id) === String(evId));
        if (target) openEventModal(target);
      });
    });
  }

  function filterEvents() {
    if (!regionFilter) return;
    const selected = regionFilter.value;
    if (selected === 'Todos') {
      renderGrid(allEvents);
    } else {
      const filtered = allEvents.filter(ev => String(ev.location || '').toLowerCase().includes(selected.toLowerCase()));
      renderGrid(filtered);
    }
  }

  if (regionFilter) {
    regionFilter.addEventListener('change', filterEvents);
  }

  fetch('/api/events')
    .then(r => r.json())
    .then(data => {
      if (data.ok && data.events) {
        allEvents = data.events;
        carouselEvents = data.events.filter(e => Boolean(e.destaque));
        if (!carouselEvents.length) carouselEvents = data.events.slice(0, 5);

        renderCarousel();
        renderGrid(allEvents);
      }
    })
    .catch(err => {
      console.error('[index] Erro ao buscar eventos:', err);
    });

  // ===== MODAL DE DETALHES E COMPRA =====
  const eventModal = document.getElementById('event-modal');
  const eventDetail = document.getElementById('event-detail');

  function openEventModal(ev) {
    if (!eventModal || !eventDetail) return;

    eventDetail.innerHTML = `
      <div style="padding: 28px; text-align: left;">
        <img src="${resolveEventImage(ev)}" alt="${ev.name}" style="width: 100%; max-height: 260px; object-fit: cover; border-radius: 10px; margin-bottom: 16px;">
        <p class="eyebrow" style="margin-bottom: 6px;">${formatShortDate(ev.date)} · ${ev.location || 'Local a definir'}</p>
        <h2 style="font-size: 26px; margin: 0 0 6px 0; color: #141a2c;">${ev.name}</h2>
        ${ev.artista ? `<h4 style="margin: 0 0 12px 0; color: #5956e9;">Atração: ${ev.artista}</h4>` : ''}
        <p style="color: #6c7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          Ingresso 100% digital com reemissão nominal única e garantia antifraude TrocaTicket.
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #6c7280;">Valor unitário</span>
          <strong style="font-size: 24px; color: #141a2c;">R$ ${Number(ev.price || 0).toFixed(2).replace('.', ',')}</strong>
        </div>
        <button type="button" class="button button-primary button-full" id="btn-confirm-purchase" style="height: 50px; font-size: 14px;">
          Comprar Ingresso ↗
        </button>
      </div>
    `;

    eventModal.classList.add('open');

    const purchaseBtn = document.getElementById('btn-confirm-purchase');
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', () => handlePurchase(ev));
    }
  }

  async function handlePurchase(ev) {
    const user = getSessionUser();
    if (!user || !user.email) {
      alert('You need to be logged in to make a purchase.');
      window.location.href = 'login.html';
      return;
    }

    if (!confirm(`Confirmar a compra de 1 ingresso para ${ev.name} por R$ ${Number(ev.price || 0).toFixed(2).replace('.', ',')}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/ingressos/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          evento_id: ev.id,
          quantidade: 1,
          preco: ev.price
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Falha ao processar a compra.');

      alert('Compra realizada com sucesso!');
      window.location.href = `ingresso.html?evento=${encodeURIComponent(ev.name)}`;
    } catch (err) {
      alert(err.message);
    }
  }

  // Fechamento genérico de modais
  document.querySelectorAll('.modal-close, [data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(modal => modal.classList.remove('open'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // Rolagem suave de âncoras
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== SIMULADOR DE REVENDA =====
  const sellerLot = document.getElementById('seller-lot');
  const priority = document.getElementById('priority');
  const netValue = document.getElementById('net-value');
  const priorityLabel = document.getElementById('priority-label');

  function calculateNetValue() {
    if (!sellerLot || !priority || !netValue) return;
    const val = parseFloat(sellerLot.value) || 0;
    const rate = parseFloat(priority.value) || 0;
    const total = val * (1 - rate / 100);

    netValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (priorityLabel) {
      const texts = { '2': 'Prioridade comum', '5': 'Prioridade básica', '8': 'Prioridade premium' };
      priorityLabel.textContent = texts[String(rate)] || 'Prioridade personalizada';
    }
  }

  if (sellerLot && priority) {
    sellerLot.addEventListener('change', calculateNetValue);
    priority.addEventListener('change', calculateNetValue);
    calculateNetValue();
  }
});
/**
 * Função responsável por controlar a exibição das rotas
 */
function navigateRoute() {
    const hash = window.location.hash || '';
    const targetSectionId = routes[hash];

    // Seleciona todas as seções diretas dentro do main
    const sections = document.querySelectorAll('main > section');
    const notFoundSection = document.getElementById('not-found');

    if (targetSectionId) {
        // --- ROTA VÁLIDA ---
        // Se a rota for válida, oculta o 404 e exibe todas as seções da Landing Page
        // (Permitindo a rolagem suave normal entre as seções)
        if (notFoundSection) {
            notFoundSection.style.display = 'none';
        }

        sections.forEach(section => {
            if (section.id !== 'not-found') {
                section.style.display = ''; // Restaura a exibição padrão (CSS)
            }
        });

        // Se houver um hash específico (#eventos, #anunciar, etc.), faz o scroll suave até a seção
        if (hash && hash !== '#inicio') {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } else {
        // --- ROTA INEXISTENTE (404) ---
        // Se a hash não existir no mapeamento de rotas, oculta o conteúdo principal e mostra apenas o 404
        sections.forEach(section => {
            if (section.id !== 'not-found') {
                section.style.display = 'none';
            }
        });

        if (notFoundSection) {
            notFoundSection.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }
}