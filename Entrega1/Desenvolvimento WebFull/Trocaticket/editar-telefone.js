document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  const form = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-number');
  const countryCode = document.getElementById('country-code');
  const countryDisplay = document.getElementById('country-display');
  const countryOptions = document.getElementById('country-options');
  const message = document.getElementById('phone-message');
  const codeStep = document.getElementById('code-step');
  let selectedChannel = '';

  if (!user || !user.email) {
    window.location.href = 'login.html';
    return;
  }

  // Dropdown de seleção de código de país
  if (countryDisplay && countryOptions) {
    countryDisplay.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !countryOptions.hidden;
      countryOptions.hidden = isOpen;
      countryDisplay.setAttribute('aria-expanded', String(!isOpen));
    });

    countryOptions.querySelectorAll('[data-code]').forEach(option => {
      option.addEventListener('click', () => {
        countryCode.value = option.dataset.code;
        countryDisplay.textContent = option.dataset.code;
        countryOptions.hidden = true;
        countryDisplay.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.country-selector')) {
        countryOptions.hidden = true;
        countryDisplay.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Máscara dinâmica de telefone
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let clean = e.target.value.replace(/\D/g, '');
      if (clean.length > 11) clean = clean.slice(0, 11);
      if (clean.length > 6) {
        e.target.value = clean.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (clean.length > 2) {
        e.target.value = clean.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (clean.length > 0) {
        e.target.value = clean.replace(/^(\d*)/, '($1');
      } else {
        e.target.value = '';
      }
    });
  }

  // Preenche com o telefone salvo se houver
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok && data.user && data.user.telefone) {
        let raw = String(data.user.telefone).replace(/\D/g, '');
        if (raw.length === 11) {
          phoneInput.value = raw.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (raw.length === 10) {
          phoneInput.value = raw.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
          phoneInput.value = data.user.telefone;
        }
      }
    })
    .catch(err => console.error('[editar-telefone]', err));

  // Solicitar envio do código
  document.querySelectorAll('[data-channel]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      selectedChannel = button.dataset.channel;
      const cleanNumber = phoneInput.value.replace(/\D/g, '');
      
      try {
        message.style.color = '#38bdf8';
        message.textContent = `Enviando código por ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}...`;
        
        const response = await fetch('/api/usuario/telefone/solicitar-verificacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            telefone: `${countryCode.value}${cleanNumber}`,
            canal: selectedChannel
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

        message.style.color = '#4ade80';
        message.textContent = `${data.message || 'Código enviado com sucesso.'} Digite o código recebido.`;
        codeStep.hidden = false;
        document.getElementById('verification-code').focus();
      } catch (error) {
        console.error('[editar-telefone] Erro ao enviar código:', error);
        message.style.color = '#f87171';
        message.textContent = error.message;
      }
    });
  });

  // Confirmar verificação do código
  const confirmBtn = document.getElementById('confirm-phone');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const cleanNumber = phoneInput.value.replace(/\D/g, '');
      const code = document.getElementById('verification-code').value.trim();

      if (!code) {
        message.style.color = '#f87171';
        message.textContent = 'Por favor, digite o código de verificação.';
        return;
      }

      try {
        const response = await fetch('/api/usuario/telefone/confirmar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            telefone: cleanNumber,
            codigo: code
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

        user.telefone = cleanNumber;
        localStorage.setItem('trocaticket-user', JSON.stringify(user));

        message.style.color = '#4ade80';
        message.textContent = data.message || 'Telefone confirmado com sucesso!';
        
        setTimeout(() => {
          window.location.href = 'perfil.html';
        }, 700);
      } catch (error) {
        console.error('[editar-telefone] Erro ao confirmar código:', error);
        message.style.color = '#f87171';
        message.textContent = error.message;
      }
    });
  }
});