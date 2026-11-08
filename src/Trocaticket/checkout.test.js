const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('./checkout.js'), 'utf8');
const helperSource = source.match(/function restoreCheckoutButton\([\s\S]*?\n\}/)?.[0];
if (!helperSource) throw new Error('restoreCheckoutButton não encontrado em checkout.js');
const restoreCheckoutButton = vm.runInNewContext(`(${helperSource})`);

test('reabilita o botão e restaura o texto após falha de compra', () => {
  const button = { disabled: true, textContent: 'PROCESSANDO...' };

  restoreCheckoutButton(button);

  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'COMPRAR INGRESSOS');
});

test('restaura o texto original informado pelo checkout', () => {
  const button = { disabled: true, textContent: 'PROCESSANDO...' };

  restoreCheckoutButton(button, 'Finalizar pedido');

  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'Finalizar pedido');
});
