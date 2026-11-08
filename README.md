# TrocaTicket

Plataforma do grupo GJPSV para compra, transferência e revenda segura de ingressos.
O projeto busca reduzir golpes e cambismo, mantendo o ingresso associado a fluxos
de usuário, evento e transferência verificáveis.

## Site publicado

Link: _______________________________________________

## Como rodar

Requisitos: Node.js conforme `.nvmrc` e acesso ao banco configurado.

```powershell
npm install
Copy-Item src/Trocaticket/.env.example src/Trocaticket/.env
# Edite src/Trocaticket/.env com os valores do ambiente
npm run dev
```

O site Node fica em `http://localhost:3000` e o React em
`http://localhost:5173/app/`.

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia API/site Node e frontend React |
| `npm run build` | Gera o frontend em `src/Trocaticket/public/app` |
| `npm start` | Inicia somente o servidor Node |
| `npm test` | Executa os testes automatizados |
| `npm run db:setup -- --dry-run` | Mostra os batches do banco sem conectar |
| `npm run db:setup` | Prepara um banco vazio após as confirmações de segurança |
| `npm run db:migrate-revenda -- --dry-run` | Mostra o plano do índice de revenda sem conectar |

O `db:setup` recusa bancos que já tenham tabelas do schema. Em host Azure, o
`seed.sql` não é executado por padrão.

`db:migrate-revenda` é uma migração deliberada para trocar a unicidade global
de anúncios pela regra de um único anúncio `disponivel` por ingresso. O
`--dry-run` não conecta ao banco; sem essa opção, em Azure o script mostra o
host e o banco e exige a confirmação digitada do `DB_NAME`. Ele nunca é
executado automaticamente pelo servidor.

## Estrutura

```text
.
├── api/                       # Entrada da função Vercel
├── scripts/                   # Scripts auxiliares da raiz
├── sql/                       # Schema e seed do banco
├── src/Trocaticket/
│   ├── account/, auth/, events/, info/, operations/  # Páginas legadas
│   ├── public/                # Assets compilados e uploads
│   ├── frontend/              # Aplicação React/Vite
│   ├── server.js              # API e servidor de arquivos
│   ├── db.js                  # Acesso ao SQL Server
│   ├── armazenamento.js       # Blob/local para uploads
│   └── scripts/db-setup.js    # Preparação segura do banco
├── package.json               # Comandos e workspaces
└── vercel.json                # Deploy
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão com o SQL Server |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE`, `DB_CONNECTION_LIMIT` | Opções da conexão |
| `TROCATICKET_SESSION_SECRET` | Segredo das sessões; obrigatório na Vercel |
| `TROCATICKET_PUBLIC_URL` | URL pública usada em links e e-mails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Envio de e-mails |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CLIENT_EMAIL` | Integração Google |
| `BLOB_READ_WRITE_TOKEN` | Armazenamento de uploads na Vercel Blob |
| `PORT` | Porta local do servidor |

## Publicar na Vercel

Antes de abrir o banco para a Internet, troque a senha do Azure SQL por uma
senha longa e exclusiva.

1. **Fase 5.1 — Firewall:** no Azure SQL, libere o acesso necessário para a
   Vercel e mantenha somente regras indispensáveis.
2. **Fase 5.2 — Repositório:** importe `2026-2-MCC2/Projeto7` em
   [vercel.com/new](https://vercel.com/new), usando a raiz do repositório.
3. **Fase 5.3 — Variáveis:** cadastre na Vercel as variáveis listadas acima,
   com os valores do ambiente de produção. Nunca publique `.env`.
4. **Fase 5.4 — Blob e região:** crie uma Blob Store, configure
   `BLOB_READ_WRITE_TOKEN` e selecione a região `gru1` quando disponível.
   Uploads novos usam URL pública do Blob.
5. **Fase 5.5 — Validação:** confirme build, páginas públicas, login, compra,
   transferência, revenda, e-mails, QR Code, Google Wallet e os GETs da API.
   Pushes na branch configurada do GitHub geram deploys automáticos.

O domínio gratuito `.vercel.app` é fornecido pela Vercel. Um domínio próprio
deve ser comprado em um registrador e adicionado em **Project > Settings >
Domains**.

## Limitações conhecidas

- Respostas de funções da Vercel são limitadas a 4,5 MB.
- Uploads novos vão para o Blob e usam URL pública.
- Anexos antigos de chat, avatares e documentos de fornecedor que existem
  somente no disco local não existem automaticamente na Vercel.
- `seed.sql` é somente para banco local; a senha de desenvolvimento está
  documentada apenas no comentário do topo desse arquivo.
- `db:setup` recusa tabelas existentes e, no Azure, não roda o seed por padrão.
- `dbo.cancelamentos` é opcional e só é consultada pelo servidor se existir.

## Documentação legada

Os documentos abaixo foram mantidos sem apagar ou mover arquivos:

| Documento | Situação encontrada | Proposta |
|---|---|---|
| `START_HERE.txt` | Caminho local antigo, `node server.js` e senhas de exemplo | Manter como histórico ou atualizar depois |
| `SETUP_GUIDE.md` | Comandos antigos, `ADMIN_PASSWORD`, porta 8080 e senhas de exemplo | Substituir por este README |
| `SUMMARY.md` | `node server.js` e fluxo anterior | Manter como histórico |
| `QUICK_REFERENCE.md` | `node server.js` e configuração administrativa antiga | Atualizar em revisão futura |
| `README_ADMIN.txt` | Senhas padrão e comandos antigos | Atualizar antes de uso operacional |
| `ADMIN_GUIDE.md` | `ADMIN_PASSWORD` e senha padrão `admin123` | Atualizar para o fluxo atual |
| `HTTP_EXAMPLES.md` | Exemplos com `node server.js` e senha de exemplo | Atualizar endpoints e autenticação |
| `FLOW_DIAGRAMS.md` | Diagrama usa o comando antigo | Atualizar diagrama |
| `SECURITY_CHECKLIST.md` | Exemplos de senha e instruções administrativas antigas | Revisar com o modelo atual |

## Contribuição

Consulte [CONTRIBUTING.md](CONTRIBUTING.md).
