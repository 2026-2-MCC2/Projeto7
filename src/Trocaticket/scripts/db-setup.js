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

function tableNameFromBatch(batch) {
  const match = batch.match(/CREATE\s+TABLE\s+(?:\[dbo\]\.)?\[?([A-Za-z0-9_]+)\]?/i);
  return match ? `dbo.${match[1]}` : 'seed.sql';
}

function readSetupBatches() {
  return [
    ...readBatches('schema.sql').map((sqlText, index) => ({
      source: 'schema.sql',
      number: index + 1,
      table: tableNameFromBatch(sqlText),
      sql: sqlText
    })),
    ...readBatches('seed.sql').map((sqlText, index) => ({
      source: 'seed.sql',
      number: index + 1,
      table: tableNameFromBatch(sqlText),
      sql: sqlText
    }))
  ];
}

function schemaTableNames(batches) {
  return batches
    .filter(batch => batch.source === 'schema.sql')
    .map(batch => batch.table.replace(/^dbo\./i, ''));
}

function isAzureHost() {
  return config.server.toLowerCase().endsWith('database.windows.net');
}

function askForConfirmation() {
  return new Promise(resolve => {
    const input = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompt = isAzureHost()
      ? `Banco Azure detectado. Digite o DB_NAME exato (${config.database}) para continuar: `
      : 'Digite SIM para continuar: ';
    input.question(prompt, answer => {
      input.close();
      const value = answer.trim();
      resolve(isAzureHost() ? value.toLowerCase() === config.database.toLowerCase() : value.toUpperCase() === 'SIM');
    });
  });
}

async function existingSchemaTables(pool, tableNames) {
  const values = tableNames.map(name => `'${name.replace(/'/g, "''")}'`).join(', ');
  const result = await pool.request().query(`
    SELECT name
    FROM sys.tables
    WHERE schema_id = SCHEMA_ID('dbo')
      AND name IN (${values})
  `);
  return result.recordset.map(row => row.name);
}

function printDryRun(batches) {
  const schemaBatches = batches.filter(batch => batch.source === 'schema.sql');
  const seedBatches = batches.filter(batch => batch.source === 'seed.sql');
  console.log(`[db:setup] dry-run: ${schemaBatches.length} batches de schema.sql e ${seedBatches.length} batches de seed.sql.`);
  console.log(`[db:setup] Tabelas que seriam criadas: ${schemaBatches.map(batch => batch.table).join(', ')}`);
  console.log('[db:setup] Nenhuma conexao foi aberta.');
}

async function main() {
  const batches = readSetupBatches();
  if (process.argv.includes('--dry-run')) {
    printDryRun(batches);
    return;
  }

  console.log(`DB_HOST: ${config.server}`);
  console.log(`DB_NAME: ${config.database}`);
  const pool = await sql.connect(config);
  try {
    const existing = await existingSchemaTables(pool, schemaTableNames(batches));
    if (existing.length) {
      console.error(`[db:setup] Abortado: as tabelas a seguir já existem: ${existing.map(name => `dbo.${name}`).join(', ')}.`);
      return;
    }

    if (!await askForConfirmation()) {
      console.log('Operação cancelada.');
      return;
    }

    for (const batch of batches) {
      try {
        await pool.request().batch(batch.sql);
      } catch (error) {
        console.error(`[db:setup] Falha no batch ${batch.number} de ${batch.source} (${batch.table}): ${error.message}`);
        console.error('[db:setup] O banco ficou parcialmente criado. Nenhum batch adicional será executado.');
        process.exitCode = 1;
        return;
      }
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
