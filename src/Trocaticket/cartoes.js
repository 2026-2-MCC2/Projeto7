const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
const list = document.getElementById('cards-list');
const form = document.getElementById('card-form');
const message = document.getElementById('card-message');

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = 'index.html';
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const menuHeaderSair = document.getElementById('menu-header-sair');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (menuHeaderSair) {
  menuHeaderSair.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });
}

if (!user) window.location.href = 'login.html';

function showTab(name) {
  document.querySelectorAll('.cards-tab').forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.getElementById('saved-tab').hidden = name !== 'saved';
  document.getElementById('new-tab').hidden = name !== 'new';
}

document.querySelectorAll('.cards-tab').forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

function renderCards(cards) {
  if (!cards.length) {
    list.innerHTML = '<p class="cards-status">Nenhum cartão cadastrado. Clique na aba ao lado para adicionar.</p>';
    return;
  }
  list.innerHTML = cards.map(card => `
    <article class="saved-card">
      <div class="saved-card-top">
        <strong class="card-brand">${card.bandeira || 'Cartão'}</strong>
        <button class="card-delete" type="button" data-delete="${card.id}">Excluir Cartão</button>
      </div>
      <div class="card-digits">•••• •••• •••• ${card.ultimos_digitos}</div>
      <div class="saved-card-bottom">
        <span class="card-holder">${card.nome_titular}</span>
        <span class="card-expiry">Validade ${card.validade_mes}/${String(card.validade_ano).slice(-2)}</span>
      </div>
    </article>
  `).join('');
}

async function loadCards() {
  try {
    const response = await fetch(`/api/usuario/cartoes?email=${encodeURIComponent(user.email)}`);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    renderCards(data.cards || []);
  } catch (error) {
    console.error('[cartoes] Erro ao carregar:', error);
    list.innerHTML = `<p class="cards-status">${error.message || 'Não foi possível carregar os cartões.'}</p>`;
  }
}

if (form.numero_cartao) {
  form.numero_cartao.addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  });
}

if (form.validade) {
  form.validade.addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');
  });
}

if (form.cpf) {
  form.cpf.addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const [month, year] = values.validade.split('/');
  try {
    const response = await fetch('/api/usuario/cartoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, email: user.email, validade_mes: month, validade_ano: year })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    form.reset();
    message.style.color = '#4ade80';
    message.textContent = 'Cartão salvo com segurança.';
    await loadCards();
    showTab('saved');
  } catch (error) {
    console.error('[cartoes] Erro ao salvar:', error);
    message.style.color = '#f87171';
    message.textContent = error.message || 'Não foi possível salvar o cartão.';
  }
});

list.addEventListener('click', async event => {
  const button = event.target.closest('[data-delete]');
  if (!button || !confirm('Excluir este cartão?')) return;
  try {
    const response = await fetch(`/api/usuario/cartoes/${button.dataset.delete}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    await loadCards();
  } catch (error) {
    console.error('[cartoes] Erro ao excluir:', error);
    message.style.color = '#f87171';
    message.textContent = error.message;
  }
});

loadCards();