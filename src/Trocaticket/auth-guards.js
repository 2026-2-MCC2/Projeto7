const INACTIVE_USER_STATUSES = new Set(['bloqueado', 'suspensa', 'excluida']);

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function createAuthGuards({ db, readSessionToken, send }) {
  if (!db || typeof db.query !== 'function') throw new TypeError('db.query is required');
  if (typeof readSessionToken !== 'function') throw new TypeError('readSessionToken is required');
  if (typeof send !== 'function') throw new TypeError('send is required');

  async function requireSession(request, response) {
    const session = readSessionToken(request);
    if (!session) {
      send(response, 401, { ok: false, message: 'Sessão inválida ou expirada.' });
      return null;
    }

    const [rows] = await db.query(
      `SELECT id, nome, email, cpf, telefone, genero, data_nascimento, tipo, status,
        foto_perfil, senha_hash, email_verificado, codigo_verificacao
       FROM dbo.usuarios WHERE id = ?`,
      [session.sub]
    );
    const user = rows[0];
    if (!user || INACTIVE_USER_STATUSES.has(String(user.status || '').trim().toLowerCase())) {
      send(response, 401, { ok: false, message: 'Sessão inválida ou expirada.' });
      return null;
    }

    return user;
  }

  async function requireSameUser(request, response, email) {
    const user = await requireSession(request, response);
    if (!user) return null;
    if (normalizeEmail(email) !== normalizeEmail(user.email)) {
      send(response, 403, { ok: false, message: 'Acesso negado.' });
      return null;
    }
    return user;
  }

  async function requireRole(request, response, roles) {
    const user = await requireSession(request, response);
    if (!user) return null;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const normalizedRoles = new Set(allowedRoles.map(role => String(role || '').trim().toLowerCase()));
    if (!normalizedRoles.has(String(user.tipo || '').trim().toLowerCase())) {
      send(response, 403, { ok: false, message: 'Acesso negado.' });
      return null;
    }
    return user;
  }

  return { requireSession, requireSameUser, requireRole };
}

module.exports = {
  INACTIVE_USER_STATUSES,
  createAuthGuards
};
