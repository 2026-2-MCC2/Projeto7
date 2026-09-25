import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">TT</span>
        <div>
          <strong>TrocaTicket</strong>
          <p>Eventos, ingressos e experiência digital</p>
        </div>
      </div>
      <nav className="nav-links" aria-label="Navegação principal">
        <NavLink to="/">Início</NavLink>
        <NavLink to="/eventos">Eventos</NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </nav>
    </header>
  );
}