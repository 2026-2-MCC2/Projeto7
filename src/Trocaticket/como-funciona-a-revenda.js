(function () {
  document.querySelector('.guide-back').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = 'account/revenda.html';
  });

  const prices = { 1: 120, 2: 150, 3: 180 };
  const feeNames = { 2: 'Comum', 5: 'Básica', 8: 'Premium' };
  const examples = [
    { name: 'Anúncio 01', lot: 3, fee: 8, time: 1 },
    { name: 'Anúncio 02', lot: 2, fee: 8, time: 2 },
    { name: 'Anúncio 03', lot: 1, fee: 5, time: 3 },
    { name: 'Anúncio 04', lot: 3, fee: 5, time: 4 },
    { name: 'Anúncio 05', lot: 1, fee: 2, time: 5 },
    { name: 'Anúncio 06', lot: 2, fee: 2, time: 6 },
    { name: 'Anúncio 07', lot: 3, fee: 8, time: 7 },
    { name: 'Anúncio 08', lot: 1, fee: 5, time: 8 },
    { name: 'Anúncio 09', lot: 2, fee: 2, time: 9 }
  ];
  let selectedLot = 2;
  let selectedFee = 5;
  const formatMoney = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const queue = document.querySelector('#sim-queue');
  const sortListings = listings => listings.sort((a, b) => b.fee - a.fee || prices[a.lot] - prices[b.lot] || a.time - b.time);
  function render() {
    const user = { name: 'Seu anúncio', lot: selectedLot, fee: selectedFee, time: 10, user: true };
    const listings = sortListings([...examples, user]);
    const position = listings.indexOf(user) + 1;
    const price = prices[selectedLot];
    const feeValue = price * selectedFee / 100;
    const administrationFee = price * 15 / 100;
    document.querySelector('#sim-net').textContent = formatMoney(price - feeValue + administrationFee);
    document.querySelector('#sim-price').textContent = formatMoney(price);
    document.querySelector('#sim-fee').textContent = formatMoney(feeValue);
    document.querySelector('#sim-admin-fee').textContent = formatMoney(administrationFee);
    document.querySelector('#sim-position').textContent = `${position}º entre 10 anúncios em Pista Premium (modalidade inteira)`;
    queue.innerHTML = listings.map((item, index) => `<div class="sim-queue-row${item.user ? ' user' : ''}"><b>${String(index + 1).padStart(2, '0')}</b><strong>${item.name} · ${item.lot}º lote · ${feeNames[item.fee]}</strong><em>${item.user ? 'agora' : `há ${10 - item.time}h`}</em></div>`).join('');
  }
  document.querySelectorAll('.segmented').forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
      if (group.dataset.group === 'lot') selectedLot = Number(button.dataset.value);
      if (group.dataset.group === 'fee') selectedFee = Number(button.dataset.value);
      render();
    });
  });
  render();
})();
