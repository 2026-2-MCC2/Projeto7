const RESALE_FEES = Object.freeze({
  comum: { label: 'Comum', percent: 2, priority: 2 },
  basica: { label: 'Básica', percent: 5, priority: 5 },
  premium: { label: 'Premium', percent: 8, priority: 8 }
});

function calculateResalePayout({
  lotPrice,
  priorityPercent,
  administrationFee = 0,
  previousPriorityPercent = priorityPercent
}) {
  const price = Number(lotPrice);
  const finalPriority = Number(priorityPercent);
  const previousPriority = Number(previousPriorityPercent);
  const adminFee = Number(administrationFee);
  if (![price, finalPriority, previousPriority, adminFee].every(Number.isFinite)
    || price < 0 || finalPriority < 0 || previousPriority < 0 || adminFee < 0) {
    throw new TypeError('Valores inválidos para cálculo do repasse.');
  }

  const priorityFee = price * finalPriority / 100;
  const priorityUpgradeFee = Math.max(0, price * (finalPriority - previousPriority) / 100);
  return {
    lotPrice: price,
    priorityFee,
    priorityUpgradeFee,
    administrationFee: adminFee,
    payout: price - priorityFee + adminFee
  };
}

function sortResaleListings(listings) {
  return [...listings].sort((a, b) =>
    Number(b.priority ?? b.taxa_percentual) - Number(a.priority ?? a.taxa_percentual)
    || Number(a.lotPrice ?? a.preco_original) - Number(b.lotPrice ?? b.preco_original)
    || new Date(a.announcedAt ?? a.anunciado_em).getTime() - new Date(b.announcedAt ?? b.anunciado_em).getTime()
    || Number(a.id) - Number(b.id)
  );
}

function canUpgradePriority(currentPercent, nextPercent) {
  return [currentPercent, nextPercent].every(value => Number.isFinite(Number(value)));
}

module.exports = { RESALE_FEES, calculateResalePayout, sortResaleListings, canUpgradePriority };
