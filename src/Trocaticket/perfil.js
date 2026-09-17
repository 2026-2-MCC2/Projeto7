const current = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
const editForm = document.getElementById('profile-form');
const message = document.getElementById('profile-message');
const profileAvatar = document.getElementById('profile-avatar');
const avatarInput = document.getElementById('avatar-input');

function logout() {
  if (confirm('Deseja realmente sair da sua conta?')) {
    localStorage.removeItem('trocaticket-authenticated');
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('trocaticket-avatar');
    localStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
    window.location.href = 'index.html';
  }
}

// Auxiliar para aplicar imagem normalizando URL
function applyAvatar(url) {
  if (!profileAvatar) return;
  if (!url || !String(url).trim()) {
    profileAvatar.src = 'imagens/logo troca ticket.png';
    return;
  }
  const cleanUrl = String(url).trim();
  profileAvatar.src = cleanUrl.startsWith('http') || cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
}

if (!current || !current.email) {
  window.location.href = 'login.html';
} else {
  // Carrega dados e foto gravada no MySQL
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(current.email)}`)
    .then(response => response.json())
    .then(data => {
      if (!data.ok || !data.user) throw new Error(data.message || 'Não foi possível carregar o perfil.');
      const user = data.user;
      document.getElementById('profile-name').textContent = user.nome || user.name || 'Usuário';
      document.getElementById('profile-email').textContent = user.email || current.email;
      document.getElementById('nome').value = user.nome || user.name || '';
      document.getElementById('cpf').value = user.cpf || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('telefone').value = user.telefone || '';

      if (user.foto_perfil) {
        applyAvatar(user.foto_perfil);
        current.foto_perfil = user.foto_perfil;
        localStorage.setItem('trocaticket-user', JSON.stringify(current));
        localStorage.setItem('trocaticket-avatar', user.foto_perfil);
      }
    })
    .catch(error => {
      console.error('[perfil] Erro ao carregar:', error);
      if (message) message.textContent = error.message;
    });
}

// Upload direto de foto com atualização instantânea
if (avatarInput) {
  avatarInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file || !current || !current.email) return;

    // Pré-visualização instantânea local
    const previewUrl = URL.createObjectURL(file);
    profileAvatar.src = previewUrl;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', current.email);

    try {
      const response = await fetch('/api/usuario/avatar', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Falha no envio do arquivo.');
      }

      applyAvatar(result.avatarUrl);
      current.foto_perfil = result.avatarUrl;
      localStorage.setItem('trocaticket-user', JSON.stringify(current));
      localStorage.setItem('trocaticket-avatar', result.avatarUrl);
    } catch (err) {
      console.error('[perfil] Erro no upload:', err);
      alert(err.message || 'Não foi possível salvar a imagem.');
    }
  });
}

document.querySelectorAll('[data-edit]').forEach(button => {
  button.addEventListener('click', () => {
    editForm.hidden = false;
    const target = button.dataset.edit === 'phone' ? document.getElementById('telefone') : document.getElementById('email');
    target.focus();
    editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

if (editForm) {
  editForm.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const body = {
        emailAtual: current.email,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        senha: document.getElementById('senha').value
      };
      const response = await fetch('/api/usuario/meu-perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

      current.email = body.email;
      localStorage.setItem('trocaticket-user', JSON.stringify(current));
      document.getElementById('profile-email').textContent = body.email;
      message.textContent = 'Perfil atualizado com sucesso.';
    } catch (error) {
      console.error('[perfil] Erro ao atualizar:', error);
      message.textContent = error.message;
    }
  });
}

const deleteAccountBtn = document.getElementById('delete-account');
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener('click', () => {
    alert('A exclusão de conta precisa ser confirmada pelo suporte.');
  });
}

const profileLogoutBtn = document.getElementById('profile-logout');
if (profileLogoutBtn) {
  profileLogoutBtn.addEventListener('click', logout);
}