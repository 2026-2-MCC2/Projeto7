import { useState } from 'react';

export default function FormContato() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      setError('Preencha nome, e-mail e mensagem antes de enviar.');
      setSent(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Informe um e-mail válido.');
      setSent(false);
      return;
    }

    setError('');
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label>
        Nome
        <input name="nome" value={form.nome} onChange={handleChange} />
      </label>
      <label>
        E-mail
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>
        Mensagem
        <textarea name="mensagem" rows="5" value={form.mensagem} onChange={handleChange} />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      {sent ? <p className="form-success">Mensagem validada com sucesso.</p> : null}
      <button type="submit">Enviar</button>
    </form>
  );
}