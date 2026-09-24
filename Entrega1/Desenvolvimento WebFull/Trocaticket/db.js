const path = require('path');
const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config({ path: path.join(__dirname, '.env') });

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
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT || 10),
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config).connect();
    poolPromise.catch(error => {
      poolPromise = undefined;
      console.error('[db] Falha ao conectar ao Azure SQL:', error.message);
    });
  }
  return poolPromise;
}

function convertQuery(query, params) {
  let converted = query
    .replace(/`([^`]+)`/g, '[$1]')
    .replace(/\s+FOR\s+UPDATE\b/gi, '')
    .replace(/\s+LIMIT\s+1\b/gi, '')
    .replace(/\bTRUE\b/gi, '1')
    .replace(/\bFALSE\b/gi, '0')
    .replace(/DATE_FORMAT\(e\.data_evento,\s*'%Y-%m-%dT%H:%i:%s'\)/gi, 'CONVERT(varchar(19), e.data_evento, 126)');

  params.forEach((_, index) => {
    converted = converted.replace('?', `@p${index + 1}`);
  });
  return converted;
}

async function execute(requestTarget, query, params = []) {
  const request = requestTarget.request();
  const converted = convertQuery(query, params);
  params.forEach((value, index) => request.input(`p${index + 1}`, value === undefined ? null : value));
  const result = await request.query(converted);
  const rows = result.recordset || [];
  return [rows, {
    insertId: rows[0] && rows[0].id,
    affectedRows: result.rowsAffected ? result.rowsAffected[0] || 0 : 0
  }];
}

const pool = {
  query: async (query, params = []) => execute(await getPool(), query, params),
  getConnection: async () => {
    const connection = await getPool();
    const transaction = new sql.Transaction(connection);
    return {
      query: (query, params = []) => execute(transaction, query, params),
      beginTransaction: () => transaction.begin(),
      commit: () => transaction.commit(),
      rollback: () => transaction.rollback(),
      release: () => undefined
    };
  }
};

module.exports = pool;
