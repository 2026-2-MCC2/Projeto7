import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api.js';
import './styles.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Ticket = lazy(() => import('./pages/Ticket.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

function routeFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/events') return { page: 'events' };
  if (path === '/orders') return { page: 'orders' };
  if (path === '/login') return { page: 'login' };
  if (path.startsWith('/ticket/')) return { page: 'ticket', id: path.split('/').pop() };
  return { page: 'home' };
}

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Shell({ children }) {
  const user = api.user();
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>
          Troca<span>Ticket</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="/events" onClick={(event) => { event.preventDefault(); navigate('/events'); }}>Eventos</a>
          <a href="/orders" onClick={(event) => { event.preventDefault(); navigate('/orders'); }}>Meus pedidos</a>
          {user ? (
            <button type="button" className="link-button" onClick={() => { api.logout(); navigate('/'); }}>Sair</button>
          ) : (
            <a href="/login" onClick={(event) => { event.preventDefault(); navigate('/login'); }}>Entrar</a>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(routeFor(window.location.pathname));
  useEffect(() => {
    const onPopState = () => setRoute(routeFor(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const page = route.page === 'events' ? <Events /> :
    route.page === 'orders' ? <Orders /> :
    route.page === 'ticket' ? <Ticket id={route.id} /> :
    route.page === 'login' ? <Login /> : <Home />;
  return <Shell><Suspense fallback={null}>{page}</Suspense></Shell>;
}

createRoot(document.getElementById('root')).render(<App />);
