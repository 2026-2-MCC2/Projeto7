const form = document.getElementById('validate-form');
const result = document.getElementById('validation-result');
form.addEventListener('submit', async event => {
  event.preventDefault();
  result.textContent = 'Validando...';
  try {
    const response = await fetch('/api/bilheteria/validar-acesso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qr_code_payload: form.qr_code_payload.value.trim() }) });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    result.textContent = `${data.message} Titular: ${data.titular} | CPF: ${data.cpf}`;
    result.className = 'success';
  } catch (error) { console.error('[bilheteria] Falha na validação:', error); result.textContent = error.message; result.className = 'error'; }
});
