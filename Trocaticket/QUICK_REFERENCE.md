# 🚀 REFERÊNCIA RÁPIDA - TrocaTicket Admin

## ⚡ Comandos Essenciais

### Iniciar Servidor
```bash
node server.js
```
✅ Resultado: `TrocaTicket em http://localhost:3000`

### Gerar Token de Admin
```bash
node generate-admin-token.js
```
✅ Resultado: Link como `http://localhost:3000/admin.html?token=...`

### Gerar com Email Customizado
```bash
node generate-admin-token.js --email admin@empresa.com
```

### Alterar Senha Admin
```bash
$env:ADMIN_PASSWORD = "nova-senha"
node server.js
```

---

## 📋 Arquivos Principais

| Arquivo | O que faz |
|---------|-----------|
| `admin.html` | Painel administrativo |
| `admin.js` | Valida token + gerencia painel |
| `server.js` | Servidor + rotas de API |
| `generate-admin-token.js` | Script para gerar tokens |
| `START_HERE.txt` | Guia visual |
| `ADMIN_GUIDE.md` | Documentação completa |

---

## 🔐 Segurança

✅ Sem botão público  
✅ Acesso apenas por token  
✅ Token válido 7 dias  
✅ Sessão expira 24h  
✅ URL segura (token removido)  
✅ Hash SHA-256 para tokens  

---

## 📊 Painel Inclui

- 📈 Dashboard (estatísticas)
- 📅 Eventos (CRUD)
- 👥 Usuários (listar, deletar)
- 🎫 Ingressos (filtrar)
- 📊 Relatórios

---

## 🔗 API Endpoints

```
POST   /api/admin/generate-token    → Gera token
POST   /api/admin/verify-token      → Valida token
GET    /api/admin/stats             → Estatísticas
GET    /api/admin/activity-log      → Atividades
GET    /api/admin/featured-events   → Eventos
GET    /api/admin/users             → Usuários
GET    /api/admin/tickets           → Ingressos
```

---

## 📁 Estrutura

```
admin.html ✅ (Painel)
admin.css ✅ (Estilos)
admin.js ✅ (Autenticação)
server.js ✅ (Backend + rotas)
generate-admin-token.js ✅ (Script)
data/admin_tokens.json ✅ (Tokens)
```

---

## 💡 Fluxo Rápido

1. `node server.js` → Servidor rodando
2. `node generate-admin-token.js` → Token gerado
3. Copiar link → `http://localhost:3000/admin.html?token=...`
4. Enviar link → WhatsApp/Email
5. Clicar link → Painel carrega
6. Pronto! ✅

---

## ⚙️ Configuração

**Senha admin:** `admin123` (padrão)  
**Token válido:** 7 dias  
**Sessão válida:** 24 horas  
**Porta:** 3000

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "Node não reconhecido" | Instale Node.js de nodejs.org |
| "Acesso Negado" | Token expirou, gere novo |
| "Conexão recusada" | Rode `node server.js` |
| "Token não funciona" | Gere novo token |

---

## 📚 Documentação

- 📖 START_HERE.txt (Comece aqui!)
- 📖 ADMIN_GUIDE.md (Tudo)
- 📖 SETUP_GUIDE.md (Instalação)
- 📖 HTTP_EXAMPLES.md (APIs)
- 📖 SECURITY_CHECKLIST.md (Segurança)

---

## ✅ Checklist de Uso

- [ ] Node.js instalado
- [ ] Servidor rodando
- [ ] Token gerado
- [ ] Link compartilhado
- [ ] Admin acessou
- [ ] Painel funcionando
- [ ] Testes completos

---

## 🔒 Não Esqueça

- ✅ Altere ADMIN_PASSWORD em produção
- ✅ Use HTTPS em produção
- ✅ Compartilhe links via canais seguros
- ✅ Faça backup de admin_tokens.json
- ✅ Revise logs periodicamente
- ✅ Regenere tokens regularmente

---

**Tudo pronto! Comece agora com:**

```bash
node server.js
```

🎉 **Sucesso!**
