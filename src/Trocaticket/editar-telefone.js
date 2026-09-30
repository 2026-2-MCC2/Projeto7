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

  function getInternationalPhone() {
    const rawValue = String(phoneInput.value || '').trim();
    const countryDigits = String(countryCode.value || '').replace(/\D/g, '');
    let phoneDigits = rawValue.replace(/\D/g, '');
    const hasInternationalPrefix = /^\s*(?:\+|00)/.test(rawValue);
    if (hasInternationalPrefix) {
      if (/^\s*00/.test(rawValue)) phoneDigits = phoneDigits.slice(2);
    } else {
      const maxNationalDigits = { '1': 10, '33': 9, '34': 9, '39': 11, '44': 10, '49': 11, '55': 11, '81': 10, '351': 9 }[countryDigits] || 12;
      if (phoneDigits.startsWith(countryDigits) && phoneDigits.length > maxNationalDigits) {
        phoneDigits = phoneDigits.slice(countryDigits.length);
      }
      phoneDigits = `${countryDigits}${phoneDigits}`;
    }
    return phoneDigits.length >= 10 && phoneDigits.length <= 15 ? `+${phoneDigits}` : null;
  }

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

  // Preenche com o telefone salvo se houver
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok && data.user && data.user.telefone) {
        phoneInput.value = data.user.telefone;
      }
    })
    .catch(err => console.error('[editar-telefone]', err));

  // Solicitar envio do código
  document.querySelectorAll('[data-channel]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      selectedChannel = button.dataset.channel;
      const phone = getInternationalPhone();
      if (!phone) {
        message.style.color = '#f87171';
        message.textContent = 'Informe um telefone válido com 10 a 15 números, incluindo o código do país.';
        return;
      }
      
      try {
        message.style.color = '#38bdf8';
        message.textContent = `Enviando código por ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}...`;
        
        const response = await fetch('/api/usuario/telefone/solicitar-verificacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            telefone: phone,
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
      const phone = getInternationalPhone();
      const code = document.getElementById('verification-code').value.trim();

      if (!phone) {
        message.style.color = '#f87171';
        message.textContent = 'Informe um telefone válido com 10 a 15 números, incluindo o código do país.';
        return;
      }

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
            telefone: phone,
            codigo: code
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

        user.telefone = phone.replace(/\D/g, '');
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