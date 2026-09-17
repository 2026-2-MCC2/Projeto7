const form = document.getElementById('pj-form');
const message = document.getElementById('pj-message');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch('/api/auth/cadastro-pj', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    localStorage.setItem('trocaticket-authenticated', 'true');
    localStorage.setItem('trocaticket-user', JSON.stringify(data.user));
    window.location.href = data.redirect;
  } catch (error) { console.error('[cadastro-pj] Erro:', error); message.textContent = error.message; }
});
