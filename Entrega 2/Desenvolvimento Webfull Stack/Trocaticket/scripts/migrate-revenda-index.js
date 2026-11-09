const readline = require('node:readline/promises');
const path = require('node:path');
const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const expectedDatabase = process.env.DB_NAME || 'TrocaTicket';
const host = process.env.DB_HOST || 'localhost';
const isAzure = host.toLowerCase().includes('.database.windows.net');
const dryRun = process.argv.includes('--dry-run');

function printPlan() {
  console.log(`DB_HOST: ${host}`);
  console.log(`DB_NAME: ${expectedDatabase}`);
  console.log(`Modo: ${dryRun ? 'dry-run (sem conexão)' : 'execução'}`);
  console.log('A migração aborta se houver mais de um anúncio disponivel para o mesmo ingresso.');
  console.log('Ela remove uq_revendas_ingresso_ativo e cria ux_revendas_ingresso_disponivel.');
}

async function confirmAzureDatabase() {
  if (!isAzure) return;
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const typedDatabase = await prompt.question(`Digite exatamente o DB_NAME (${expectedDatabase}) para continuar: `);
    if (typedDatabase !== expectedDatabase) {
      throw new Error('DB_NAME não confirmado; nenhuma alteração foi executada.');
    }
  } finally {
    prompt.close();
  }
}

async function migrate() {
  printPlan();
  if (dryRun) return;
  await confirmAzureDatabase();

  const pool = await new sql.ConnectionPool({
    server: host,
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: expectedDatabase,
    options: {
      encrypt: String(process.env.DB_ENCRYPT || 'true').toLowerCase() !== 'false',
      trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERTIFICATE || 'false').toLowerCase() === 'true',
      enableArithAbort: true
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
  }).connect();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const session = new sql.Request(transaction);
    await session.batch(`
      SET XACT_ABORT ON;
      SET QUOTED_IDENTIFIER ON;
      SET ANSI_NULLS ON;
      SET ANSI_PADDING ON;
      SET ANSI_WARNINGS ON;
      SET CONCAT_NULL_YIELDS_NULL ON;
      SET ARITHABORT ON;
      SET NUMERIC_ROUNDABORT OFF;
    `);

    const duplicateResult = await new sql.Request(transaction).query(`
      SELECT ingresso_id
      FROM dbo.revendas
      WHERE status = 'disponivel'
      GROUP BY ingresso_id
      HAVING COUNT(*) > 1
    `);
    if (duplicateResult.recordset.length) {
      throw new Error(`Migração abortada: ${duplicateResult.recordset.length} ingresso(s) têm anúncios disponivel duplicados.`);
    }

    const constraintResult = await new sql.Request(transaction).query(`
      SELECT name
      FROM sys.key_constraints
      WHERE parent_object_id = OBJECT_ID('dbo.revendas')
        AND name = 'uq_revendas_ingresso_ativo'
    `);
    if (constraintResult.recordset.length) {
      await new sql.Request(transaction).query('ALTER TABLE dbo.revendas DROP CONSTRAINT uq_revendas_ingresso_ativo');
    }

    await new sql.Request(transaction).query(`
      IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE object_id = OBJECT_ID('dbo.revendas')
          AND name = 'ux_revendas_ingresso_disponivel'
      )
        CREATE UNIQUE INDEX ux_revendas_ingresso_disponivel
          ON dbo.revendas (ingresso_id)
          WHERE status = 'disponivel';
    `);

    const indexResult = await new sql.Request(transaction).query(`
      SELECT name, is_unique, filter_definition
      FROM sys.indexes
      WHERE object_id = OBJECT_ID('dbo.revendas')
        AND name = 'ux_revendas_ingresso_disponivel'
    `);
    const index = indexResult.recordset[0];
    if (!index || !index.is_unique || !String(index.filter_definition || '').toLowerCase().includes('disponivel')) {
      throw new Error('Validação falhou: o índice filtrado não foi criado como esperado.');
    }

    await transaction.commit();
    console.log('Migração concluída e índice validado.');
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error(`Falha ao desfazer a transação: ${rollbackError.message}`);
    }
    throw error;
  } finally {
    await pool.close();
  }
}

migrate().catch(error => {
  console.error(`[db:migrate-revenda] ${error.message}`);
  process.exitCode = 1;
});
