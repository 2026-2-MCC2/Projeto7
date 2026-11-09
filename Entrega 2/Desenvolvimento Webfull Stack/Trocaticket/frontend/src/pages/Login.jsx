import { useState } from 'react';
import { api } from '../lib/api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(event) { event.preventDefault(); setError(''); try { await api.login(email, password); window.history.pushState({}, '', '/orders'); window.dispatchEvent(new PopStateEvent('popstate')); } catch (err) { setError(err.message); } }
  return <section className="page-section narrow"><h1>Entrar</h1><form className="login-form" onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Senha<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>{error && <p className="error">{error}</p>}<button className="primary-button">Entrar</button></form></section>;
}
