import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

export default function Home() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.events().then(data => setEvents(data.events || [])).catch(err => setError(err.message)); }, []);
  return <section className="page-section">
    <div className="hero-copy">
      <p className="eyebrow">A troca segura começa aqui</p>
      <h1>Seu ingresso ainda tem <em>história</em> para contar.</h1>
      <p>Compre, acompanhe e acesse seus ingressos sem recarregar a página.</p>
    </div>
    <h2>Eventos em destaque</h2>
    {error ? <p className="error">{error}</p> : events && <div className="event-grid">{events.slice(0, 6).map(event => <article className="event-card" key={event.id}><AssetImage src={event.imagem} alt={event.name || 'Evento'} loading="lazy" /><h3>{event.name}</h3><p>{event.location || 'Local a confirmar'}</p></article>)}</div>}
  </section>;
}
