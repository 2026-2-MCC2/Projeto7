const test = require('node:test');
const assert = require('node:assert/strict');

const { salvarArquivo } = require('./armazenamento');

test('produção sem Blob recusa upload sem tentar usar o disco local', async () => {
  const previousVercel = process.env.VERCEL;
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;
  process.env.VERCEL = '1';
  delete process.env.BLOB_READ_WRITE_TOKEN;

  try {
    await assert.rejects(
      salvarArquivo('avatars', 'avatar.png', Buffer.from('mock'), 'image/png'),
      error => error.statusCode === 503
        && error.message === 'Armazenamento de arquivos não configurado para produção.'
    );
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
    if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousToken;
  }
});
