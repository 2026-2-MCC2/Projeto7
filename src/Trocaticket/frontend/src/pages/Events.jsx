import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

export default function Events() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.events().then(data => setEvents(data.events || [])).catch(err => setError(err.message)); }, []);
  return <section className="page-section"><p className="eyebrow">Catálogo TrocaTicket</p><h1>Eventos disponíveis</h1>{error ? <p className="error">{error}</p> : events && <div className="event-grid">{events.map(event => <article className="event-card" key={event.id}><AssetImage src={event.imagem} alt={event.name || 'Evento'} loading="lazy" /><h2>{event.name}</h2><p>{event.location || 'Local a confirmar'}</p></article>)}</div>}</section>;
}
