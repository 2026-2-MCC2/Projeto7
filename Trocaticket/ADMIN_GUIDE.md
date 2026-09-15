# Sistema de Administrador TrocaTicket

## 📋 Descrição

Página de administração segura do TrocaTicket com **acesso restrito por token**. Não há botão ou link público para acessar. O acesso é concedido **apenas através de um link seguro enviado diretamente ao administrador**.

## 🔒 Características de Segurança

✅ **Sem acesso público** - Não existe botão ou menu no site principal  
✅ **Autenticação por token** - Acesso apenas com link único e seguro  
✅ **Token com expiração** - Válido por 7 dias após geração  
✅ **Armazenamento seguro** - Tokens são armazenados em hash SHA-256  
✅ **Sessão de 24 horas** - Sessão do admin expira após 24h de inatividade  
✅ **Token único por uso** - Pode ser marcado como usado após acesso  

## 🚀 Como Usar

### 1️⃣ Gerar Token de Acesso para Administrador

A geração de tokens deve ser feita pelo desenvolvedor/proprietário via requisição POST:

```bash
curl -X POST http://localhost:3000/api/admin/generate-token \
  -H "Content-Type: application/json" \
  -d '{"adminPassword": "admin123", "email": "seu-email@exemplo.com"}'
```

**Resposta (sucesso):**
```json
{
  "ok": true,
  "message": "Token gerado com sucesso. Este token só será exibido uma vez.",
  "token": "a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1",
  "link": "http://localhost:3000/admin.html?token=a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1"
}
```

### 2️⃣ Enviar Link ao Administrador

Copie o link gerado e envie **de forma segura** (WhatsApp, email criptografado, etc.):

```
http://localhost:3000/admin.html?token=a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1
```

### 3️⃣ Acessar o Painel Administrativo

O administrador clica no link recebido e é automaticamente autenticado. A página valida o token e:

- ✅ Se válido → Acessa o painel administrativo
- ❌ Se inválido/expirado → Exibe "Acesso Negado"

## 📄 Estrutura dos Arquivos

### Novos Arquivos Criados:

| Arquivo | Descrição |
|---------|-----------|
| `admin.html` | Página principal do painel administrativo |
| `admin.css` | Estilos do painel administrativo |
| `admin.js` | Lógica de validação e gerenciamento do painel |
| `data/admin_tokens.json` | Armazena tokens gerados (criado automaticamente) |

### Arquivos Modificados:

| Arquivo | Mudanças |
|---------|----------|
| `server.js` | Adicionadas rotas de API para gerenciamento de admin |

## 🔧 Configurações

### Alterar Senha de Geração de Token

A senha padrão é `admin123`. Para alterar, defina a variável de ambiente:

```bash
# No Windows (PowerShell):
$env:ADMIN_PASSWORD = "sua-senha-segura"
node server.js

# No Linux/Mac:
ADMIN_PASSWORD=sua-senha-segura node server.js
```

### Alterar Duração do Token

No arquivo `server.js`, procure pela linha:
```javascript
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
```

Altere o valor `7 * 24 * 60 * 60 * 1000` para:
- **1 dia**: `1 * 24 * 60 * 60 * 1000`
- **3 dias**: `3 * 24 * 60 * 60 * 1000`
- **30 dias**: `30 * 24 * 60 * 60 * 1000`

## 🎯 Funcionalidades do Painel

### Dashboard
- 📊 Estatísticas gerais (usuários, ingressos, eventos, receita)
- 📝 Log de atividades recentes
- 🎪 Eventos em destaque

### Gerenciamento de Eventos
- Visualizar todos os eventos cadastrados
- Criar, editar e deletar eventos
- Filtrar por status

### Gerenciamento de Usuários
- Listar todos os usuários registrados
- Buscar usuários por nome/email
- Visualizar detalhes do usuário
- Deletar usuários (com confirmação)

### Gerenciamento de Ingressos
- Listar todos os ingressos anunciados
- Filtrar por status (Ativo, Vendido, Cancelado)
- Visualizar detalhes do ingresso
- Rastrear proprietário

### Relatórios
- Relatório de Vendas
- Relatório de Usuários
- Relatório Financeiro
- Relatório de Eventos

## 🔐 Fluxo de Segurança

```
1. Desenvolvedor gera token com senha admin
                    ↓
2. Sistema cria token único, armazena hash em data/admin_tokens.json
                    ↓
3. Link seguro enviado ao administrador (fora do sistema)
                    ↓
4. Admin clica no link com token na URL
                    ↓
5. admin.js valida token na URL
                    ↓
6. POST /api/admin/verify-token → verifica se token é válido
                    ↓
7. Token é marcado como "usado"
                    ↓
8. Sessão criada no localStorage com duração de 24h
                    ↓
9. URL é limpa (token removido) por segurança
                    ↓
10. Painel administrativo é exibido
```

## 📱 Logout

Clique no botão "Sair" no canto superior direito para:
- Limpar sessão do navegador
- Ser redirecionado para página inicial
- Necessitar de novo token para acessar novamente

## 🛡️ Boas Práticas

✅ **Sempre use HTTPS em produção** (não apenas HTTP)  
✅ **Altere a senha padrão do admin** (`ADMIN_PASSWORD`)  
✅ **Use senhas fortes** ao gerar tokens  
✅ **Compartilhe links via canais seguros** (WhatsApp, Telegram, Email criptografado)  
✅ **Regenere tokens periodicamente** se a senha admin for comprometida  
✅ **Revise o log de acessos** em `data/admin_tokens.json`  

## 🐛 Troubleshooting

### "Acesso Negado" ao entrar com link válido
- Verifique se o token não expirou (7 dias)
- Certifique-se de copiar a URL completa
- Tente gerar um novo token

### Token não funciona após salvar
- Cada token só pode ser usado uma vez
- Gere um novo token para cada acesso
- Verifique o arquivo `data/admin_tokens.json`

### Sessão expirou
- A sessão admin expira após 24 horas
- Use um novo token para acessar novamente
- Verifique o relógio do servidor

## 📚 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/admin/generate-token` | Gerar novo token de acesso |
| `POST` | `/api/admin/verify-token` | Validar token recebido |
| `GET` | `/api/admin/stats` | Obter estatísticas do dashboard |
| `GET` | `/api/admin/activity-log` | Obter log de atividades |
| `GET` | `/api/admin/featured-events` | Obter eventos em destaque |
| `GET` | `/api/admin/users` | Listar usuários |
| `GET` | `/api/admin/tickets` | Listar ingressos |

## 🎨 Personalização

### Alterar cores do painel

No arquivo `admin.css`, altere as variáveis CSS:

```css
:root {
  --admin-primary: #6366f1;      /* Cor principal */
  --admin-secondary: #8b5cf6;    /* Cor secundária */
  --admin-success: #10b981;      /* Sucesso */
  --admin-warning: #f59e0b;      /* Aviso */
  --admin-danger: #ef4444;       /* Perigo */
}
```

## 📞 Suporte

Para questões sobre o painel administrativo, verifique:
- O arquivo `admin.js` para lógica de autenticação
- O arquivo `server.js` para rotas de API
- O console do navegador (F12) para erros

---

**Versão:** 1.0  
**Data de Criação:** 01/09/2026  
**Status:** ✅ Pronto para produção
