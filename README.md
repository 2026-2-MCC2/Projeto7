# TrocaTicket

Plataforma do Projeto7 para compra, transferência e revenda segura de
ingressos. O projeto reduz golpes e cambismo ao manter o ingresso associado a
fluxos verificáveis de usuário, evento e transferência.

## Site publicado

[Acessar o TrocaTicket](https://projeto7-six.vercel.app)

## Tecnologias

- Node.js com servidor HTTP e API REST
- Frontend React/Vite
- SQL Server/Azure SQL
- Vercel para hospedagem
- Vercel Blob para uploads em produção
- SMTP para envio de e-mails
- Google Wallet para ingressos digitais

## Como executar localmente

### Requisitos

- Node.js em versão LTS
- npm
- Banco SQL Server acessível, local ou Azure

### Instalação

Na raiz do repositório, instale as dependências dos workspaces:

```powershell
npm install
Copy-Item src/Trocaticket/.env.example src/Trocaticket/.env
```

Edite [`src/Trocaticket/.env`](src/Trocaticket/.env) com os valores do ambiente.
O arquivo `.env.example` é apenas um modelo e não é carregado pela aplicação.
Nunca publique o `.env`, pois ele pode conter senhas, chaves e tokens.

Para iniciar o ambiente de desenvolvimento (API e frontend):

```powershell
npm run dev
```

O servidor Node fica em `http://localhost:3000`. O frontend Vite fica em
`http://localhost:5173/app/` quando executado separadamente pelo frontend.

### Comandos

Execute os comandos abaixo na raiz do repositório:

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor Node em modo de desenvolvimento |
| `npm start` | Inicia o servidor Node |
| `npm test` | Executa os testes automatizados |
| `npm run db:setup -- --dry-run` | Exibe os batches do banco sem conectar |
| `npm run db:setup` | Prepara um banco vazio após as confirmações de segurança |
| `npm run db:migrate-revenda -- --dry-run` | Exibe o plano da migração sem conectar |
| `npm run db:migrate-revenda` | Executa a migração do índice de revenda após confirmação |

O `db:setup` recusa bancos que já tenham tabelas do schema. Em um banco Azure,
o seed não é executado por padrão. A migração de revenda nunca é executada
automaticamente pelo servidor.

## Frontend

O frontend React/Vite está em [`src/Trocaticket/frontend`](src/Trocaticket/frontend).
Para executá-lo diretamente com hot reload, abra um terminal:

```powershell
Set-Location src/Trocaticket/frontend
npm run dev
```

Para gerar os arquivos usados pelo servidor Node:

```powershell
npm run build
```

O build é gerado em `src/Trocaticket/public/app`. As páginas legadas continuam
sendo atendidas pelo servidor durante a migração.

## Variáveis de ambiente

Copie [`.env.example`](src/Trocaticket/.env.example) para `.env` e preencha os
valores necessários:

| Variável | Uso |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão com o SQL Server |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE`, `DB_CONNECTION_LIMIT` | Opções da conexão |
| `TROCATICKET_SESSION_SECRET` | Segredo das sessões; obrigatório na Vercel |
| `TROCATICKET_PUBLIC_URL` | URL pública usada em links e e-mails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Envio de e-mails; opcional no desenvolvimento |
| `GOOGLE_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID` | Configuração do Google Wallet |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Credenciais do Google Wallet |
| `BLOB_READ_WRITE_TOKEN` | Uploads na Vercel Blob; obrigatório na Vercel |
| `PORT` | Porta local do servidor; padrão `3000` |

## Banco de dados

Os scripts de banco estão em [`src/Trocaticket`](src/Trocaticket), incluindo o
schema [`trocaticket-azure.sql`](src/Trocaticket/trocaticket-azure.sql).

Antes de abrir o banco para a Internet:

1. Use uma senha longa e exclusiva no Azure SQL.
2. Libere somente o acesso necessário no firewall.
3. Configure as variáveis de banco no ambiente de execução.
4. Execute primeiro os comandos com `--dry-run`.

## Publicação na Vercel

O projeto publicado é [projeto7-six.vercel.app](https://projeto7-six.vercel.app).
Para configurar um novo deploy:

1. Importe o repositório `2026-2-MCC2/Projeto7` em
   [vercel.com/new](https://vercel.com/new), usando a raiz do repositório.
2. Configure na Vercel as variáveis de ambiente de produção.
3. Defina `TROCATICKET_PUBLIC_URL` como a URL pública do projeto.
4. Configure `TROCATICKET_SESSION_SECRET` e
   `BLOB_READ_WRITE_TOKEN`; ambos são obrigatórios na Vercel.
5. Configure o acesso do banco Azure SQL e o firewall.
6. Valide login, compra, transferência, revenda, e-mails, QR Code e uploads.

Nunca faça commit de `.env` ou de qualquer credencial. O `.env.example` deve
conter somente nomes e valores de exemplo.

## Segurança e autorização

As sessões usam tokens assinados pelo servidor, com validade de 12 horas. As
rotas protegidas verificam assinatura, expiração, usuário e permissões. Os
papéis disponíveis são:

- `comum`: perfil, cartões, ingressos, compras e revenda;
- `organizador`: eventos, demandas, cotações, documentos e chat;
- `fornecedor`: perfil, documentos, oportunidades, propostas e chat;
- `bilheteria`: validação, check-in e operações de ingressos;
- `admin`: usuários, eventos, revenda, estatísticas, logs e operações administrativas.

O navegador envia a sessão pelo cabeçalho `Authorization: Bearer`; não há
autenticação por cookie.

## Estrutura principal

```text
.
├── api/                       # Entrada da função Vercel
├── scripts/                   # Diretório reservado para scripts auxiliares
├── src/Trocaticket/
│   ├── frontend/              # Aplicação React/Vite
│   ├── public/                # Build do frontend e arquivos públicos
│   ├── server.js              # API e servidor de arquivos
│   ├── db.js                  # Acesso ao SQL Server
│   ├── armazenamento.js       # Armazenamento local/Vercel Blob
│   ├── scripts/               # Scripts de banco
│   └── trocaticket-azure.sql  # Schema do banco Azure SQL
├── .gitignore
└── vercel.json
```

## Limitações conhecidas

- Funções da Vercel têm limite de resposta de 4,5 MB.
- Uploads novos usam URL pública do Vercel Blob.
- Arquivos antigos armazenados somente no disco local não são migrados
  automaticamente para a Vercel.
- Não há limite de tentativas de login ou de verificação de código.
- O vínculo entre organizador e evento ainda precisa ser endurecido.
- O hash de cartão usa SHA-256 combinado ao id do usuário; utilize somente
  cartões de teste.
- Arquivos emitidos para Google Wallet ou download offline não são revogados
  automaticamente quando o ingresso entra em revenda.
- A sessão expira em 12 horas.

## Contribuição

Propostas de melhoria devem incluir uma descrição clara da alteração e, quando
possível, testes ou instruções para reproduzi-la.
