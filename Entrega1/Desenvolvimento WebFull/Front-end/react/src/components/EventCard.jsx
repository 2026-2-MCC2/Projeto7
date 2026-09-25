export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <img src={event.imagem} alt={event.nome} className="event-image" />
      <div className="event-content">
        <span className="event-tag">{event.categoria}</span>
        <h3>{event.nome}</h3>
        <p>{event.cidade}</p>
        <strong>{new Date(event.data).toLocaleDateString('pt-BR')}</strong>
      </div>
    </article>
  );
}