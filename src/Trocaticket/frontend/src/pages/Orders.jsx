import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

function openTicket(id) {
  window.history.pushState({}, '', `/ticket/${id}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function preloadOrders() {
      let cursor = '';
      try {
        do {
          const data = await api.orders({ cursor, signal: controller.signal });
          if (!active) return;
          setOrders(current => [...current, ...(data.tickets || [])]);
          cursor = data.nextCursor || '';
        } while (cursor && !controller.signal.aborted);
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (active) setHydrated(true);
      }
    }

    preloadOrders();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const events = useMemo(() => {
    const groups = new Map();
    orders.forEach(ticket => {
      const name = ticket.eventName || ticket.evento || 'Evento sem título';
      if (!groups.has(name)) {
        groups.set(name, {
          name,
          location: ticket.location || 'Local a confirmar',
          tickets: []
        });
      }
      groups.get(name).tickets.push(ticket);
    });
    return [...groups.values()];
  }, [orders]);

  return (
    <section className="page-section">
      <h1>Meus pedidos</h1>
      {error && <p className="error">{error}</p>}
      {!error && hydrated && !events.length && (
        <p className="orders-empty" aria-live="polite">
          Não há pedidos disponíveis para esta conta.
        </p>
      )}
      <div className="order-list">
        {events.map(event => {
          const isExpanded = expandedEvent === event.name;
          return (
            <article className={`event-order-group${isExpanded ? ' is-expanded' : ''}`} key={event.name}>
              <button
                type="button"
                className="order-card"
                aria-expanded={isExpanded}
                onClick={() => setExpandedEvent(isExpanded ? null : event.name)}
              >
                <strong>{event.name}</strong>
                <span>{event.location}</span>
                <small>{event.tickets.length} ingresso{event.tickets.length === 1 ? '' : 's'}</small>
              </button>
              {isExpanded && (
                <div className="ticket-sublist">
                  {event.tickets.map(ticket => (
                    <button type="button" className="ticket-subcard" key={ticket.id} onClick={() => openTicket(ticket.id)}>
                      <strong>Ingresso #{ticket.numero_ingresso || ticket.id}</strong>
                      <span>{ticket.status}</span>
                    </button>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
