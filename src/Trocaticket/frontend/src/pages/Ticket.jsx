import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

function goToTicket(id) {
  window.history.pushState({}, '', `/ticket/${id}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Ticket({ id }) {
  const [ticket, setTicket] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setTicket(null);
    setError('');
    Promise.all([api.ticket(id, controller.signal), api.allOrders({ signal: controller.signal })])
      .then(([detail, orders]) => {
        const selected = detail.ticket;
        const eventName = selected.eventName || selected.evento;
        setTicket(selected);
        setSiblings(orders.filter(item => (item.eventName || item.evento) === eventName));
      })
      .catch(requestError => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      });
    return () => controller.abort();
  }, [id]);

  const currentIndex = useMemo(() => siblings.findIndex(item => String(item.id) === String(id)), [siblings, id]);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  if (error) return <section className="page-section"><p className="error">{error}</p></section>;
  if (!ticket) return <section className="page-section" aria-busy="true" />;

  return (
    <section className="page-section ticket-detail">
      <div className="ticket-carousel">
        <button type="button" className="ticket-carousel-arrow ticket-carousel-prev" disabled={!previous} onClick={() => previous && goToTicket(previous.id)} aria-label="Ingresso anterior">‹</button>
        <div className="ticket-carousel-card">
          <h1>{ticket.eventName || ticket.evento}</h1>
          <p>{ticket.location || 'Local a confirmar'}</p>
          {ticket.qr_code_image
            ? <AssetImage className="ticket-qr" src={ticket.qr_code_image} alt="QR Code do ingresso" />
            : <p>QR Code indisponível para este ingresso.</p>}
          <p>Status: <strong>{ticket.status}</strong></p>
          <div className="ticket-actions">
            <button type="button" className="primary-button">Baixar para Acesso Offline</button>
            <button type="button" className="secondary-button">Adicionar à Carteira do Google</button>
            <button type="button" className="secondary-button">Transferir</button>
            <button type="button" className="secondary-button">Revender no Marketplace</button>
          </div>
          <p className="ticket-counter" aria-live="polite">Ingresso {Math.max(currentIndex + 1, 1)} de {Math.max(siblings.length, 1)}</p>
        </div>
        <button type="button" className="ticket-carousel-arrow ticket-carousel-next" disabled={!next} onClick={() => next && goToTicket(next.id)} aria-label="Próximo ingresso">›</button>
      </div>
      <a className="secondary-button" href="/orders" onClick={event => { event.preventDefault(); window.history.pushState({}, '', '/orders'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Voltar aos pedidos</a>
    </section>
  );
}
