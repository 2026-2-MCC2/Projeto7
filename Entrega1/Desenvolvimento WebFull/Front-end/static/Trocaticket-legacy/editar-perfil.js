const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
const form = document.getElementById('edit-profile-form');
const message = document.getElementById('edit-profile-message');
const avatarEl = document.getElementById('edit-profile-avatar');
const avatarInput = document.getElementById('avatar-input');

// Função auxiliar para normalizar e aplicar a URL da foto
function applyAvatar(url) {
  if (!avatarEl) return;
  if (!url || !String(url).trim()) {
    avatarEl.src = 'imagens/logo troca ticket.png';
    return;
  }
  const cleanUrl = String(url).trim();
  avatarEl.src = cleanUrl.startsWith('http') || cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
}

// Validação de autenticação e busca de dados
if (!user || !user.email) {
  window.location.href = 'login.html';
} else {
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`)
    .then(response => response.json())
    .then(data => {
      if (!data.ok || !data.user) throw new Error(data.message || 'Não foi possível carregar os dados.');
      const profile = data.user;

      // Renderiza foto de perfil vinda do banco
      applyAvatar(profile.foto_perfil);

      // Preenche os campos do formulário
      const fullName = (profile.nome || profile.name || '').trim().split(/\s+/);
      document.getElementById('nome').value = fullName.shift() || '';
      document.getElementById('sobrenome').value = fullName.join(' ');
      document.getElementById('email').value = profile.email || '';
      document.getElementById('cpf').value = profile.cpf || '';
      document.getElementById('telefone').value = profile.telefone || '';
      document.getElementById('data_nascimento').value = profile.data_nascimento ? String(profile.data_nascimento).slice(0, 10) : '';
      document.getElementById('genero').value = profile.genero || '';
    })
    .catch(error => {
      console.error('[editar-perfil] Erro ao carregar:', error);
      if (message) message.textContent = error.message;
    });
}

// Upload direto ao selecionar imagem
if (avatarInput) {
  avatarInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file || !user || !user.email) return;

    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('file', file);

    try {
      if (message) {
        message.className = '';
        message.textContent = 'Enviando foto...';
      }

      const response = await fetch('/api/usuario/avatar', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao enviar foto.');

      applyAvatar(data.avatarUrl);
      user.foto_perfil = data.avatarUrl;
      localStorage.setItem('trocaticket-user', JSON.stringify(user));
      localStorage.setItem('trocaticket-avatar', data.avatarUrl);

      if (message) {
        message.className = 'success';
        message.textContent = 'Foto atualizada com sucesso!';
      }
    } catch (err) {
      console.error('[avatar-upload] Erro:', err);
      if (message) {
        message.className = '';
        message.textContent = err.message || 'Falha ao atualizar foto.';
      }
    }
  });
}

// Envio das alterações de dados
form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const response = await fetch('/api/usuario/meu-perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        nome: document.getElementById('nome').value.trim(),
        sobrenome: document.getElementById('sobrenome').value.trim(),
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value.trim(),
        genero: document.getElementById('genero').value,
        data_nascimento: document.getElementById('data_nascimento').value
      })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    
    // Atualiza cache local
    Object.assign(user, data.user);
    localStorage.setItem('trocaticket-user', JSON.stringify(user));

    message.className = 'success';
    message.textContent = 'Dados atualizados com sucesso.';
    setTimeout(() => {
      window.location.href = 'perfil.html';
    }, 700);
  } catch (error) {
    console.error('[editar-perfil] Erro ao salvar:', error);
    message.className = '';
    message.textContent = error.message;
  }
});