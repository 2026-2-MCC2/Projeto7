# 🚀 Guia de Instalação e Uso - TrocaTicket Admin

## ⚙️ Pré-requisitos

Antes de usar o painel administrativo, você precisa instalar:

### 1. Node.js e npm

Baixe e instale a versão LTS (recomendada) de Node.js:

📥 **Download**: https://nodejs.org/

**Verificar instalação:**
```bash
node --version
npm --version
```

Ambos os comandos devem retornar a versão instalada.

---

## 📦 Configuração Inicial

### 1. Navegar até a pasta do projeto

```bash
cd "c:\Users\Girliane Ramalho\OneDrive\Desktop\Trocaticket"
```

### 2. Instalar dependências (se necessário)

```bash
npm install
```

### 3. Iniciar o servidor

```bash
node server.js
```

O servidor deve exibir:
```
TrocaTicket em http://localhost:3000
```

---

## 🔐 Como Gerar Token de Administrador

### Opção 1: Usando o Script Auxiliar (Recomendado)

Abra um **novo terminal** (deixe o servidor rodando) e execute:

```bash
node generate-admin-token.js
```

**Com parâmetros personalizados:**
```bash
node generate-admin-token.js --email admin@empresa.com --password sua-senha
```

**Resultado esperado:**
```
🔐 Gerando token de acesso administrativo...

✅ Token gerado com sucesso!

📋 Informações do Token:
────────────────────────────────────────────────────
Email: admin
Token: a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1
Criado em: 01/09/2026, 10:30:45
Válido por: 7 dias

🔗 Link de Acesso Direto:
────────────────────────────────────────────────────
http://localhost:3000/admin.html?token=a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1
```

### Opção 2: Usando cURL (Avançado)

Se você tiver cURL instalado:

```bash
curl -X POST http://localhost:3000/api/admin/generate-token \
  -H "Content-Type: application/json" \
  -d "{\"adminPassword\": \"admin123\", \"email\": \"admin@empresa.com\"}"
```

### Opção 3: Usando PowerShell (Windows)

```powershell
$body = @{
    adminPassword = "admin123"
    email = "admin@empresa.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content
```

---

## 🔗 Acessar o Painel Administrativo

### Passo 1: Copiar o Link

Após gerar o token, você terá um link como:
```
http://localhost:3000/admin.html?token=a7f3c2d...
```

### Passo 2: Enviar ao Administrador

Compartilhe este link de forma **segura**:
- ✅ WhatsApp
- ✅ Email (com criptografia)
- ✅ Telegram
- ✅ Mensagem privada
- ❌ NÃO compartilhe em chats públicos

### Passo 3: Acessar o Painel

O administrador clica no link e automaticamente:
1. ✅ O token é validado
2. ✅ A sessão é criada
3. ✅ O painel carrega
4. ✅ A URL é limpa (token removido por segurança)

---

## 🎯 Funcionalidades Disponíveis

### Dashboard
- Visualizar estatísticas gerais
- Ver atividades recentes
- Acompanhar eventos em destaque

### Eventos
- Criar, editar e deletar eventos
- Gerenciar lotes de ingressos
- Acompanhar status dos eventos

### Usuários
- Listar todos os usuários cadastrados
- Buscar por nome ou email
- Visualizar detalhes do usuário
- Deletar contas de usuários

### Ingressos
- Listar ingressos anunciados
- Filtrar por status (Ativo, Vendido, Cancelado)
- Rastrear proprietário
- Visualizar histórico

### Relatórios
- Relatório de vendas
- Relatório de usuários
- Relatório financeiro
- Relatório de eventos

---

## 🔐 Segurança e Boas Práticas

### Alterar Senha Padrão

A senha padrão é `admin123`. Altere-a:

**No Windows (PowerShell):**
```powershell
$env:ADMIN_PASSWORD = "sua-senha-super-segura-123"
node server.js
```

**No Linux/Mac:**
```bash
export ADMIN_PASSWORD="sua-senha-super-segura-123"
node server.js
```

### Alterar Duração dos Tokens

Edite o arquivo `server.js` e procure por:
```javascript
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
```

Altere `7` para o número de dias desejado:
- **1 dia**: `1 * 24 * 60 * 60 * 1000`
- **3 dias**: `3 * 24 * 60 * 60 * 1000`
- **30 dias**: `30 * 24 * 60 * 60 * 1000`

---

## 🛡️ Checklist de Segurança

- [ ] Alterei a senha padrão do admin
- [ ] Estou usando HTTPS em produção (não apenas HTTP)
- [ ] Compartilho links apenas via canais seguros
- [ ] Reviso regularmente o arquivo `data/admin_tokens.json`
- [ ] Gero novos tokens periodicamente
- [ ] Registro quem tem acesso ao painel

---

## 📁 Estrutura de Arquivos

```
Trocaticket/
├── admin.html              ← Página do painel admin
├── admin.css               ← Estilos do painel
├── admin.js                ← Lógica de autenticação
├── generate-admin-token.js ← Script para gerar tokens
├── server.js               ← Servidor com rotas de admin
├── ADMIN_GUIDE.md          ← Guia completo de admin
├── SETUP_GUIDE.md          ← Este arquivo
└── data/
    └── admin_tokens.json   ← Tokens gerados (criado automaticamente)
```

---

## 🐛 Troubleshooting

### Erro: "node não é reconhecido"

**Solução:**
1. Instale Node.js de https://nodejs.org/
2. Reinicie seu terminal/VS Code
3. Tente novamente

### Erro: "Acesso Negado" ao entrar no painel

**Possíveis causas:**
- Token expirou (duração padrão: 7 dias)
- Token já foi usado
- URL foi alterada
- Servidor está offline

**Solução:**
- Gere um novo token com `node generate-admin-token.js`
- Certifique-se de que o servidor está rodando
- Use a URL completa, sem alterações

### Erro: "Conexão recusada"

**Solução:**
- Certifique-se de que o servidor está rodando: `node server.js`
- Verifique se a porta 3000 está disponível
- Se usar porta diferente: `PORT=8080 node server.js`

### Sessão expirou

- A sessão admin expira após 24 horas
- Gere um novo token para continuar

---

## 📱 Usar com Dispositivo Móvel

1. Gere o token no computador
2. Copie o link completo
3. Envie por WhatsApp/Email para seu telefone
4. Clique no link no navegador do celular
5. O painel será acessível normalmente

---

## 🌍 Usar em Produção

Quando colocar o TrocaTicket em produção:

### 1. Use HTTPS

```bash
# Seu servidor deve estar atrás de um proxy HTTPS (nginx, Apache, etc)
# Ou use certbot para SSL:
sudo certbot certonly --standalone -d seu-dominio.com
```

### 2. Configure Variáveis de Ambiente

```bash
export NODE_ENV=production
export ADMIN_PASSWORD=sua-senha-muito-segura
export PORT=3000
node server.js
```

### 3. Use um Process Manager

```bash
npm install -g pm2
pm2 start server.js --name "trocaticket"
pm2 save
pm2 startup
```

### 4. Revise a Segurança

- [ ] Firewall configurado
- [ ] Apenas HTTPS habilitado
- [ ] Backup dos tokens realizados
- [ ] Logs de acesso monitorados

---

## 📚 Documentação Completa

Para informações mais detalhadas, consulte `ADMIN_GUIDE.md`

---

**Dúvidas?** Revise o console do navegador (F12) para mensagens de erro detalhadas.

Boa sorte! 🍀
