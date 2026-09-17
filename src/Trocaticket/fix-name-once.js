const db = require('./db');
(async () => {
  try {
    const [rows] = await db.query(
      `UPDATE dbo.usuarios SET nome = ? OUTPUT INSERTED.nome WHERE email = ?`,
      ['João Gabriel Ramalho Croti', 'jgabrielramalhocroti@gmail.com']
    );
    console.log(JSON.stringify(rows));
    process.exit(rows.length ? 0 : 1);
  } catch (error) {
    console.error(error.code || error.name, error.message);
    process.exit(1);
  }
})();
