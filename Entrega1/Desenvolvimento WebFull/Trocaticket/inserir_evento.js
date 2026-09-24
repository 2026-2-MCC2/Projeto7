const pool = require('./db');

async function inserir() {
  try {
    // 1. Localiza um organizador ou admin existente para vincular
    const [users] = await pool.query(
      "SELECT id FROM usuarios WHERE tipo IN ('organizador', 'admin') LIMIT 1"
    );

    if (!users.length) {
      console.error('Nenhum usuário do tipo organizador ou admin encontrado no banco.');
      process.exit();
    }

    const organizadorId = users[0].id;

    // 2. Insere o evento associado ao organizador
    const [result] = await pool.query(
      `INSERT INTO eventos (organizador_id, nome, local, data_evento, ticket_calculado, status, destaque) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        organizadorId,
        'A Festa do Chefe',
        'Espaço Barra Funda - SP',
        '2026-12-10 22:00:00',
        80.00,
        'publicado',
        1
      ]
    );

    console.log('\n>>> A FESTA DO CHEFE INSERIDA COM SUCESSO! ID:', result.insertId);
  } catch (error) {
    console.error('Erro ao inserir:', error.message);
  } finally {
    process.exit();
  }
}

inserir();