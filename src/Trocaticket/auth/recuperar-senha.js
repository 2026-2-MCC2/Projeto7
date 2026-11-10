document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recovery-form');
  const emailInput = document.getElementById('recovery-email');
  const message = document.getElementById('recovery-message');
  const submit = document.getElementById('recovery-submit');
  const title = document.getElementById('recovery-title');
  const description = document.getElementById('recovery-description');
  const step = document.getElementById('recovery-step');
  const codePanel = document.querySelector('[data-panel="code"]');
  const passwordPanel = document.querySelector('[data-panel="password"]');
  const otpInputs = [...document.querySelectorAll('.otp-input')];
  const resend = document.getElementById('resend-code');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  let phase = 'email';
  let resetToken = '';
  let resendTimer;

  function showMessage(text, isError = true) {
    message.textContent = text;
    message.classList.toggle('is-success', !isError);
    message.style.display = text ? 'block' : 'none';
  }

  function setPhase(nextPhase) {
    phase = nextPhase;
    document.querySelector('[data-panel="email"]').hidden = nextPhase !== 'email';
    codePanel.hidden = nextPhase !== 'code';
    passwordPanel.hidden = nextPhase !== 'password';
    title.textContent = nextPhase === 'email' ? 'Esqueceu sua senha?' : nextPhase === 'code' ? 'Confira seu e-mail' : 'Crie uma nova senha';
    description.textContent = nextPhase === 'email'
      ? 'Informe seu e-mail para receber um código de 6 dígitos.'
      : nextPhase === 'code'
        ? `Digite o código enviado para ${emailInput.value.trim()}.`
        : 'Escolha uma senha segura para sua conta.';
    step.textContent = nextPhase === 'email' ? 'RECUPERAÇÃO DE SENHA' : nextPhase === 'code' ? 'VALIDAÇÃO' : 'NOVA SENHA';
    submit.textContent = nextPhase === 'email' ? 'ENVIAR CÓDIGO' : nextPhase === 'code' ? 'VALIDAR CÓDIGO' : 'REDEFINIR SENHA';
    showMessage('');
  }

  function startResendTimer(duration = 60) {
    let remaining = Math.max(1, Number(duration) || 60);
    resend.disabled = true;
    clearInterval(resendTimer);
    resend.textContent = `Reenviar código (${remaining}s)`;
    resendTimer = setInterval(() => {
      remaining -= 1;
      resend.textContent = remaining ? `Reenviar código (${remaining}s)` : 'Reenviar código';
      resend.disabled = remaining > 0;
      if (!remaining) clearInterval(resendTimer);
    }, 1000);
  }

  async function post(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      const error = new Error(data.message || 'Não foi possível concluir a operação.');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const inputs = [newPassword, confirmPassword];
      const visible = inputs.some(input => input.type === 'password');
      inputs.forEach(input => { input.type = visible ? 'text' : 'password'; });
      document.querySelectorAll('[data-toggle-password]').forEach(toggle => {
        toggle.classList.toggle('is-visible', visible);
        toggle.setAttribute('aria-label', visible ? 'Ocultar senhas' : 'Mostrar senhas');
      });
    });
  });
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && otpInputs[index + 1]) otpInputs[index + 1].focus();
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Backspace' && !input.value && otpInputs[index - 1]) otpInputs[index - 1].focus();
    });
    input.addEventListener('paste', event => {
      const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasted) return;
      event.preventDefault();
      pasted.split('').forEach((digit, digitIndex) => { if (otpInputs[digitIndex]) otpInputs[digitIndex].value = digit; });
      otpInputs[Math.min(pasted.length, 6) - 1].focus();
    });
  });

  resend.addEventListener('click', async () => {
    try {
      await post('/api/auth/recuperar-senha', { email: emailInput.value.trim() });
      showMessage('Um novo código foi enviado.', false);
      startResendTimer();
    } catch (error) {
      if (error.status === 429 && error.data?.retry_after) {
        setPhase('code');
        startResendTimer(error.data.retry_after);
        otpInputs[0].focus();
        showMessage('O código anterior ainda é válido. Confira seu e-mail.', false);
        return;
      }
      showMessage(error.message);
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    showMessage('');
    submit.disabled = true;
    try {
      if (phase === 'email') {
        await post('/api/auth/recuperar-senha', { email: emailInput.value.trim() });
        setPhase('code');
        startResendTimer();
        otpInputs[0].focus();
      } else if (phase === 'code') {
        const code = otpInputs.map(input => input.value).join('');
        const data = await post('/api/auth/validar-codigo-reset', { email: emailInput.value.trim(), codigo: code });
        resetToken = data.reset_token;
        setPhase('password');
        newPassword.focus();
      } else {
        if (!newPassword.value || !confirmPassword.value) throw new Error('Informe e confirme a nova senha.');
        if (newPassword.value !== confirmPassword.value) throw new Error('As senhas não conferem.');
        await post('/api/auth/redefinir-senha', {
          email: emailInput.value.trim(),
          reset_token: resetToken,
          nova_senha: newPassword.value
        });
        setPhase('email');
        form.reset();
        showMessage('Senha redefinida com sucesso. Redirecionando para o login...', false);
        setTimeout(() => { window.location.href = 'login.html'; }, 1800);
      }
    } catch (error) {
      if (phase === 'email' && error.status === 429 && error.data?.retry_after) {
        setPhase('code');
        startResendTimer(error.data.retry_after);
        otpInputs[0].focus();
        showMessage('O código anterior ainda é válido. Confira seu e-mail.', false);
        return;
      }
      showMessage(error.message);
    } finally {
      submit.disabled = false;
    }
  });
});
