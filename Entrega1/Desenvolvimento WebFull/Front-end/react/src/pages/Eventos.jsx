import { useEffect, useState } from 'react';
import { fetchEventos } from '../services/mockApi';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchEventos()
      .then((data) => {
        if (active) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError('Não foi possível carregar os eventos agora.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="state-box error">{error}</div>;

  return (
    <section>
      <div className="section-header">
        <span className="eyebrow">Dados simulados em JSON</span>
        <h2>Eventos em destaque</h2>
      </div>
      <div className="grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}