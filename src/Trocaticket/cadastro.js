const form = document.getElementById('register-page-form');
const message = document.getElementById('page-message');
const verificationMessage = document.getElementById('verification-message');
const verificationStep = document.getElementById('verification-step');
const verificationForm = document.getElementById('verification-form');
let verificationEmail = '';

function showMessage(text) {
  const target = verificationStep.hidden ? message : verificationMessage;
  target.textContent = text;
}

async function post(url, body) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
  return data;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (data.senha !== data.confirmarSenha) return showMessage('As senhas precisam ser iguais.');
  try {
    showMessage('Enviando cadastro...');
    await post('/api/auth/register-pf', { nome: `${data.nome} ${data.sobrenome}`, cpf: data.cpf, telefone: data.celular, nascimento: data.nascimento, sexo: data.sexo, email: data.email, senha: data.senha });
    verificationEmail = data.email;
    document.querySelector('.page-form-content').hidden = true;
    verificationStep.hidden = false;
    showMessage('Cadastro criado. Verifique sua caixa de entrada e informe o código recebido.');
  } catch (error) {
    console.error('[cadastro] Erro:', error);
    showMessage(error.message);
  }
});

verificationForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const result = await post('/api/auth/verificar-codigo', { email: verificationEmail, codigo: verificationForm.codigo.value.trim() });
    localStorage.setItem('trocaticket-authenticated', 'true');
    localStorage.setItem('trocaticket-user', JSON.stringify(result.user));
    window.location.href = 'index.html';
  } catch (error) {
    console.error('[cadastro] Erro ao verificar código:', error);
    showMessage(error.message);
  }
});
