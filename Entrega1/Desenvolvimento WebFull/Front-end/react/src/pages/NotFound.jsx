import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="state-box">
      <h2>Página não encontrada</h2>
      <p>A rota solicitada não existe.</p>
      <Link to="/">Voltar para o início</Link>
    </section>
  );
}