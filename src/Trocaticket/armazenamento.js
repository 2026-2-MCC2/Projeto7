const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const root = __dirname;
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

function assertUploadSize(data) {
  if (!data || data.length <= MAX_UPLOAD_BYTES) return;
  const error = new Error('O arquivo deve ter no máximo 4,5 MB.');
  error.statusCode = 413;
  throw error;
}

async function salvarArquivo(pasta, nome, dados, tipo) {
  assertUploadSize(dados);
  const safeFolder = String(pasta).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const safeName = path.basename(String(nome));
  if (!safeFolder || !safeName) throw new Error('Caminho de arquivo inválido.');

  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    const error = new Error('Armazenamento de arquivos não configurado para produção.');
    error.statusCode = 503;
    console.error('[armazenamento] BLOB_READ_WRITE_TOKEN é obrigatório na Vercel.');
    throw error;
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${safeFolder}/${safeName}`, dados, {
      access: 'public',
      contentType: tipo || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false
    });
    return blob.url;
  }

  const directory = path.join(root, 'public', 'uploads', safeFolder);
  try {
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, safeName), dados);
  } catch (error) {
    throw new Error(`Não foi possível salvar o arquivo localmente: ${error.message}`);
  }
  return `/uploads/${safeFolder}/${safeName}`;
}

module.exports = { MAX_UPLOAD_BYTES, salvarArquivo };
