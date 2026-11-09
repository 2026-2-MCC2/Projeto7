import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import './resale.css';

const fees = [
  { value: 'comum', label: 'Comum', percent: 2, description: 'Posição base' },
  { value: 'basica', label: 'Básica', percent: 5, description: 'Prioridade intermediária' },
  { value: 'premium', label: 'Premium', percent: 8, description: 'Topo da fila' }
];
const formatMoney = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Resale() {
  const [tickets, setTickets] = useState([]);
  const [fee, setFee] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [upgradingId, setUpgradingId] = useState(null);
  const [rateModal, setRateModal] = useState(null);
  const [rateChoice, setRateChoice] = useState('');
  const [rateFeedback, setRateFeedback] = useState({});
  const [eventId, setEventId] = useState('');
  const [sectorName, setSectorName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);
  const [withdrawal, setWithdrawal] = useState({ value: '', cpf: '' });
  const user = api.user();
  const requestedTicketId = new URLSearchParams(window.location.search).get('ingresso_id');
  const requestedTicketCode = new URLSearchParams(window.location.search).get('ingresso_codigo');

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([api.allOrders(), api.myResaleListings(), api.wallet()])
      .then(([allTickets, resaleData, walletData]) => {
        setTickets(allTickets || []);
        const requestedTicket = (allTickets || []).find(ticket =>
          (requestedTicketId && String(ticket.id) === String(requestedTicketId))
          || (requestedTicketCode && [ticket.codigo_ingresso, ticket.numero_ingresso, ticket.codigo_original_bilheteria].some(code =>
            String(code || '').trim().toLowerCase() === String(requestedTicketCode).trim().toLowerCase()
          ))
        );
        if (requestedTicket) {
          setSelectedTicket(String(requestedTicket.id));
          setEventId(requestedTicket.eventId || '');
          setSectorName(requestedTicket.sector || requestedTicket.setor || '');
          setCategoryName(requestedTicket.ticketCategory || requestedTicket.categoria_ingresso || '');
        }
        setMyListings(resaleData.listings || []);
        setWallet(walletData.wallet);
      })
      .catch(err => setError(err.message));
    const refreshListings = () => api.myResaleListings()
      .then(data => setMyListings(data.listings || []))
      .catch(() => {});
    const intervalId = window.setInterval(refreshListings, 15000);
    return () => window.clearInterval(intervalId);
  }, [user?.email]);

  async function requestWithdrawal(event) {
    event.preventDefault();
    try {
      await api.requestPixWithdrawal(withdrawal.value, withdrawal.cpf);
      setMessage('Saque PIX solicitado. Ele será processado após a validação da titularidade.');
      setWithdrawal({ value: '', cpf: '' });
      const data = await api.wallet();
      setWallet(data.wallet);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    if (!eventId) {
      setListings([]);
      return;
    }
    api.resaleQueue(eventId).then(data => setListings(data.listings || [])).catch(err => setError(err.message));
  }, [eventId]);

  async function announce(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!selectedTicket || !fee) {
      setError('Selecione um ingresso e uma taxa de repasse.');
      return;
    }
    try {
      await api.announceResale(selectedTicket, fee);
      setMessage('Ingresso anunciado na fila de revenda.');
      setSelectedTicket('');
      setFee('');
      const data = await api.myResaleListings();
      setMyListings(data.listings || []);
      const allTickets = await api.allOrders();
      setTickets(allTickets || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function cancelListing(listingId) {
    setCancellingId(listingId);
    setError('');
    try {
      await api.cancelResale(listingId);
      setMessage('Anúncio cancelado. O ingresso voltou para sua carteira.');
      const [allTickets, resaleData] = await Promise.all([api.allOrders(), api.myResaleListings()]);
      setTickets(allTickets || []);
      setMyListings(resaleData.listings || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCancellingId(null);
    }

  }

  async function changeRate(listingId, feeKey) {
    setUpgradingId(listingId);
    setError('');
    setRateFeedback(current => ({ ...current, [listingId]: '' }));
    try {
      const data = await api.upgradeResalePriority(listingId, feeKey);
      setRateFeedback(current => ({ ...current, [listingId]: { text: `${data.message} Diferença no repasse: ${formatMoney(data.diferenca_repasse)}.`, error: false } }));
      const resaleData = await api.myResaleListings();
      setMyListings(resaleData.listings || []);
    } catch (requestError) {
      setRateFeedback(current => ({ ...current, [listingId]: { text: requestError.message, error: true } }));
    } finally {
      setUpgradingId(null);
      setRateModal(null);
      setRateChoice('');
    }
  }

  const activeListingIds = new Set(myListings.filter(item => item.status === 'disponivel').map(item => String(item.ingresso_id)));
  const availableTickets = tickets.filter(ticket =>
    ['ativo', 'valido'].includes(String(ticket.status).toLowerCase())
    && !activeListingIds.has(String(ticket.id))
  );

  return (
    <section className="page-section resale-page">
      <p className="eyebrow">Revenda oficial</p>
      <h1>Revenda P2P de ingressos</h1>
      <div className="resale-notice" role="note">
        <strong>Fora do prazo de reembolso?</strong>
        <p>Se já passaram 7 dias previstos no Código de Defesa do Consumidor ou você teve dificuldade com o estorno, use a revenda oficial como alternativa segura para recuperar o valor investido.</p>
      </div>
      {!user && <p className="error">Faça login para anunciar ou comprar ingressos.</p>}
      {user && (
        <form className="resale-form" onSubmit={announce}>
          <label>Ingresso válido
            <select value={selectedTicket} onChange={event => {
              const value = event.target.value;
              const ticket = tickets.find(item => String(item.id) === String(value));
              setSelectedTicket(value);
              setEventId(ticket?.eventId || '');
              setSectorName(ticket?.sector || ticket?.setor || '');
              setCategoryName(ticket?.ticketCategory || ticket?.categoria_ingresso || '');
            }}>
              <option value="">Selecione um ingresso</option>
              {availableTickets.map(ticket => (
                <option key={ticket.id} value={ticket.id}>{ticket.eventName || ticket.evento} - #{ticket.codigo_ingresso || ticket.numero_ingresso} · Setor: {ticket.sector || ticket.setor || 'Setor geral'} · {ticket.ticketCategory || 'Categoria não identificada'}</option>
              ))}
            </select>
            {!availableTickets.length && <small className="resale-field-hint">Todos os seus ingressos válidos já estão anunciados ou não estão disponíveis.</small>}
          </label>
          {selectedTicket && <small className="resale-field-hint">A fila e a compra serão processadas somente para o setor pago: {sectorName || 'Setor geral'}.</small>}
          <fieldset>
            <legend>Taxa de repasse obrigatória</legend>
            <div className="fee-grid">
              {fees.map(item => (
                <label className={`fee-option${fee === item.value ? ' selected' : ''}`} key={item.value}>
                  <input type="radio" name="fee" value={item.value} checked={fee === item.value} onChange={event => setFee(event.target.value)} />
                  <strong>{item.label} · {item.percent}%</strong>
                  <span>{item.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="resale-price">O preço é travado no valor original pago. Não é permitido ágio ou sobrepreço. A modalidade também é preservada: meia-entrada retorna como meia-entrada, inteira retorna como inteira e assim por diante.</p>
          <button type="submit" className="primary-button">Anunciar na revenda</button>
        </form>
      )}
      {user && (
        <section className="resale-listings" aria-labelledby="my-resale-title">
          <div className="resale-section-heading">
            <div><p className="eyebrow">Acompanhamento</p><h2 id="my-resale-title">Tickets em revenda</h2></div>
            <span>{myListings.length} anúncio{myListings.length === 1 ? '' : 's'}</span>
          </div>
          {!myListings.length ? <p className="resale-empty">Você ainda não colocou ingressos na revenda.</p> : (
            <div className="resale-listing-grid">
              {myListings.map(listing => {
                const active = listing.status === 'disponivel';
                const queuePosition = Number(listing.posicao || listing.position || 1);
                const queueTotal = Number(listing.total_fila || listing.totalFila || 1);
                const partnerBoxOffice = listing.bilheteria_id != null && listing.bilheteria_origem !== 'Troca Ticket';
                const administrationFee = Number(listing.taxa_administracao_valor || (partnerBoxOffice ? 0 : listing.preco_original * 14 / 100));
                return <article className={`resale-listing ${active ? 'is-pending' : 'is-sold'}`} key={listing.id}>
                  <div className="listing-topline"><strong>{listing.evento}</strong><span>{active ? 'Aguardando repasse / Na fila' : listing.status === 'vendida' ? 'Vendido / Repassado' : 'Anúncio cancelado'}</span></div>
                  <p>Ingresso #{listing.numero_ingresso} · {listing.categoria_ingresso || 'Modalidade preservada'}</p>
                  <div className="listing-details"><span>{listing.setor_nome || 'Setor geral'} · {listing.lote_nome || 'Lote pago'} · {listing.categoria_ingresso || 'Modalidade preservada'} · {listing.taxa_nome} · {listing.taxa_percentual}%</span><strong>{formatMoney(Number(listing.preco_original))}</strong></div>
                  {active ? <><small>Repasse estimado se vendido: {formatMoney(Number(listing.preco_original) - Number(listing.preco_original) * Number(listing.taxa_percentual) / 100 + administrationFee)}. Taxa de administração devolvida: {formatMoney(administrationFee)}. Só a taxa de prioridade é descontada.</small><small>Posição: {queuePosition}º entre {queueTotal} anúncios em {listing.setor_nome || 'Setor geral'} ({listing.categoria_ingresso || 'modalidade não identificada'})</small><small className="queue-notice">Novos anúncios com prioridade maior podem passar à frente do seu.</small><div className="listing-actions"><button type="button" className="secondary-button" disabled={upgradingId === listing.id} onClick={() => { setRateModal(listing); setRateChoice(String(listing.taxa_percentual) === '2' ? 'comum' : String(listing.taxa_percentual) === '5' ? 'basica' : 'premium'); }}>Alterar taxa</button><button type="button" className="secondary-button listing-cancel" disabled={cancellingId === listing.id} onClick={() => cancelListing(listing.id)}>{cancellingId === listing.id ? 'Cancelando...' : 'Cancelar anúncio'}</button></div>{rateFeedback[listing.id]?.text && <small className={rateFeedback[listing.id].error ? 'error' : 'success'}>{rateFeedback[listing.id].text}</small>}</> : listing.status === 'vendida' && <small>Ingresso antigo revogado. Saldo líquido em custódia para liberação pós-evento: {formatMoney(Number(listing.valor_liquido || 0))}.</small>}
                </article>;
              })}
            </div>
          )}
          {rateModal && <div className="rate-modal-backdrop" role="presentation" onClick={() => setRateModal(null)}>
            <section className="rate-modal-card" role="dialog" aria-modal="true" aria-labelledby="rate-modal-title" onClick={event => event.stopPropagation()}>
              <button type="button" className="rate-modal-close" onClick={() => setRateModal(null)} aria-label="Fechar">×</button>
              <p className="eyebrow">Prioridade na fila</p>
              <h2 id="rate-modal-title">Alterar taxa</h2>
              <p>Escolha a prioridade desejada para este anúncio.</p>
              <div className="rate-modal-options">
                {fees.map(item => <label className={`fee-card${rateChoice === item.value ? ' selected' : ''}`} key={item.value}>
                  <input type="radio" name="rate-modal-fee" value={item.value} checked={rateChoice === item.value} onChange={() => setRateChoice(item.value)} />
                  <strong>{item.label} · {item.percent}%</strong><small>{item.description}</small>
                </label>)}
              </div>
              <div className="rate-modal-actions">
                <button type="button" className="secondary-button" onClick={() => setRateModal(null)}>Cancelar</button>
                <button type="button" className="primary-button" disabled={!rateChoice || upgradingId === rateModal.id} onClick={() => changeRate(rateModal.id, rateChoice)}>Confirmar alteração</button>
              </div>
            </section>
          </div>}
        </section>
      )}
      {eventId && (
        <div className="resale-queue">
          <h2>Fila prioritária do evento</h2>
          {!listings.length ? <p>Nenhum ingresso disponível na fila.</p> : listings.map((listing, index) => (
            <div className="queue-row" key={listing.id}><strong>#{index + 1}</strong><span>{listing.setor_nome || 'Setor geral'} · {listing.taxa_nome} · {listing.taxa_percentual}% · {listing.categoria_ingresso || 'Categoria não identificada'}</span><span>R$ {Number(listing.preco_original).toFixed(2)}</span></div>
          ))}
          <button type="button" className="secondary-button" onClick={async () => {
            try {
              await api.buyResale(eventId, sectorName, categoryName);
              setMessage('Compra concluída. O novo ingresso já está vinculado à sua conta.');
              const [ordersData, resaleData, queueData] = await Promise.all([
                api.orders(),
                api.myResaleListings(),
                api.resaleQueue(eventId)
              ]);
              setTickets(ordersData.tickets || []);
              setMyListings(resaleData.listings || []);
              setListings(queueData.listings || []);
            } catch (requestError) { setError(requestError.message); }
          }}>Comprar ingresso do topo da fila</button>
        </div>
      )}
      {user && wallet && (
        <section className="wallet-card">
          <h2>Carteira Troca Ticket</h2>
          <div className="wallet-balances">
            <span>A liberar<strong>R$ {wallet.pendente.toFixed(2)}</strong></span>
            <span>Disponível<strong>R$ {wallet.disponivel.toFixed(2)}</strong></span>
          </div>
          <p>O saldo só fica disponível 24 horas após o fim do evento e com check-in confirmado. Saques PIX exigem CPF da mesma titularidade.</p>
          <form onSubmit={requestWithdrawal} className="withdrawal-form">
            <input type="number" min="0.01" step="0.01" placeholder="Valor do saque" value={withdrawal.value} onChange={event => setWithdrawal({ ...withdrawal, value: event.target.value })} required />
            <input inputMode="numeric" placeholder="CPF da chave PIX" value={withdrawal.cpf} onChange={event => setWithdrawal({ ...withdrawal, cpf: event.target.value })} required />
            <button type="submit" className="secondary-button">Transferir</button>
          </form>
        </section>
      )}
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="resale-steps">
        <h2>Como funciona</h2>
        <ol><li>A taxa define sua prioridade: Premium, Básica ou Comum.</li><li>Empates são resolvidos pelo menor preço e depois pelo horário do anúncio.</li><li>Na compra, o titular anterior perde o acesso e um novo ingresso exclusivo é gerado para o comprador, mantendo a modalidade original do ingresso.</li></ol>
      </div>
    </section>
  );
}
