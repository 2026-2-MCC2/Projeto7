const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateResalePayout,
  canUpgradePriority,
  sortResaleListings
} = require('./resale-calculations');

test('calculates the administration refund and priority fee on the lot price', () => {
  assert.equal(calculateResalePayout({ lotPrice: 150, priorityPercent: 2, administrationFee: 21 }).payout, 168);
  assert.equal(calculateResalePayout({ lotPrice: 150, priorityPercent: 2, administrationFee: 22.5 }).payout, 169.5);
  assert.equal(calculateResalePayout({ lotPrice: 150, priorityPercent: 5, administrationFee: 22.5 }).payout, 165);
  assert.equal(calculateResalePayout({ lotPrice: 150, priorityPercent: 8, administrationFee: 22.5 }).payout, 160.5);
});

test('allows changing priority in either direction', () => {
  assert.equal(calculateResalePayout({
    lotPrice: 150,
    priorityPercent: 8,
    previousPriorityPercent: 2,
    administrationFee: 22.5
  }).priorityUpgradeFee, 9);
  assert.equal(canUpgradePriority(2, 8), true);
  assert.equal(canUpgradePriority(8, 5), true);
});

test('orders listings by priority, lot price and announcement time', () => {
  const sorted = sortResaleListings([
    { id: 3, priority: 5, lotPrice: 120, announcedAt: '2026-01-01T10:00:00Z' },
    { id: 2, priority: 8, lotPrice: 180, announcedAt: '2026-01-01T12:00:00Z' },
    { id: 1, priority: 8, lotPrice: 150, announcedAt: '2026-01-01T13:00:00Z' }
  ]);
  assert.deepEqual(sorted.map(item => item.id), [1, 2, 3]);
});
