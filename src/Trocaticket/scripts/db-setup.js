const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sql = require('mssql');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const root = path.join(__dirname, '..');
const config = {
  server: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'TrocaTicket',
  options: {
    encrypt: String(process.env.DB_ENCRYPT || 'true').toLowerCase() !== 'false',
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERTIFICATE || 'false').toLowerCase() === 'true'
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

function readBatches(filename) {
  const contents = fs.readFileSync(path.join(root, 'sql', filename), 'utf8');
  return contents
    .split(/^\s*GO\s*$/gim)
    .map(batch => batch.trim())
    .filter(Boolean);
}

function askForConfirmation() {
  return new Promise(resolve => {
    const input = readline.createInterface({ input: process.stdin, output: process.stdout });
    input.question(`Isso executará schema.sql e seed.sql em ${config.server}/${config.database}. Digite SIM para continuar: `, answer => {
      input.close();
      resolve(answer.trim().toUpperCase() === 'SIM');
    });
  });
}

async function main() {
  console.log(`Banco configurado: ${config.server}/${config.database}`);
  if (!await askForConfirmation()) {
    console.log('Operação cancelada.');
    return;
  }

  const pool = await sql.connect(config);
  try {
    for (const batch of [...readBatches('schema.sql'), ...readBatches('seed.sql')]) {
      await pool.request().batch(batch);
    }
    console.log('Schema e seed executados com sucesso.');
  } finally {
    await pool.close();
  }
}

main().catch(error => {
  console.error(`[db:setup] Falha: ${error.message}`);
  process.exitCode = 1;
});
