# Projeto completo

## Árvore de pastas e arquivos do projeto

```text
├── .gitignore
├── .nvmrc
├── api
│   └── index.js
├── CONTRIBUTING.md
├── DDL_todas_tabelas.sql
├── Entrega 2
│   ├── Banco de Dados
│   │   ├── BD entrega 2
│   │   │   └── Entrega 2.sql
│   │   ├── Dicionário de dados
│   │   └── README.md
│   ├── Cálculo II
│   │   ├── Calculo_II_Entrega2_TrocaTicket_Grupo7.pdf
│   │   └── README.md
│   ├── Desenvolvimento Webfull Stack
│   │   ├── evidências.pdf
│   │   ├── README.md
│   │   └── Trocaticket
│   │       ├── account
│   │       │   ├── cartoes.html
│   │       │   ├── editar-perfil.html
│   │       │   ├── editar-telefone.html
│   │       │   ├── ingresso.html
│   │       │   ├── meus-ingressos.html
│   │       │   ├── perfil.html
│   │       │   └── revenda.html
│   │       ├── admin
│   │       │   └── admin.html
│   │       ├── ADMIN_GUIDE.md
│   │       ├── admin.css
│   │       ├── admin.js
│   │       ├── armazenamento.js
│   │       ├── armazenamento.test.js
│   │       ├── auth
│   │       │   ├── cadastro-pj.html
│   │       │   ├── cadastro.html
│   │       │   └── login.html
│   │       ├── auth-fetch.js
│   │       ├── auth-fetch.test.js
│   │       ├── auth-guards.js
│   │       ├── auth-guards.test.js
│   │       ├── auth-route-guards.test.js
│   │       ├── bilheteria-app.js
│   │       ├── bilheteria.css
│   │       ├── cadastro-pj.js
│   │       ├── cadastro.js
│   │       ├── cartoes.css
│   │       ├── cartoes.js
│   │       ├── chat.css
│   │       ├── checkout.css
│   │       ├── checkout.js
│   │       ├── checkout.test.js
│   │       ├── como-funciona-a-revenda.css
│   │       ├── como-funciona-a-revenda.html
│   │       ├── como-funciona-a-revenda.js
│   │       ├── data
│   │       │   ├── admin_tokens.json
│   │       │   └── events.json
│   │       ├── db.js
│   │       ├── editar-perfil.css
│   │       ├── editar-perfil.js
│   │       ├── editar-telefone.css
│   │       ├── editar-telefone.js
│   │       ├── event-edit-image-preservation.test.js
│   │       ├── event-images.js
│   │       ├── event-images.test.js
│   │       ├── evento.css
│   │       ├── evento.js
│   │       ├── events
│   │       │   ├── checkout.html
│   │       │   ├── evento.html
│   │       │   ├── eventos.html
│   │       │   └── ingressos.html
│   │       ├── fix-name-once.js
│   │       ├── FLOW_DIAGRAMS.md
│   │       ├── frontend
│   │       │   ├── index.html
│   │       │   ├── package.json
│   │       │   ├── README.md
│   │       │   ├── src
│   │       │   │   ├── components
│   │       │   │   │   └── AssetImage.jsx
│   │       │   │   ├── lib
│   │       │   │   │   └── api.js
│   │       │   │   ├── main.jsx
│   │       │   │   ├── pages
│   │       │   │   │   ├── Events.jsx
│   │       │   │   │   ├── Home.jsx
│   │       │   │   │   ├── Login.jsx
│   │       │   │   │   ├── Orders.jsx
│   │       │   │   │   ├── resale.css
│   │       │   │   │   ├── Resale.jsx
│   │       │   │   │   └── Ticket.jsx
│   │       │   │   └── styles.css
│   │       │   └── vite.config.js
│   │       ├── generate-admin-token.js
│   │       ├── help.js
│   │       ├── HTTP_EXAMPLES.md
│   │       ├── imagens
│   │       │   ├── arena+.jpeg
│   │       │   ├── banner troca ticket.jpg
│   │       │   ├── Captura de tela 2026-09-17 143856.png
│   │       │   ├── desktop.ini
│   │       │   ├── festa do chefe.jpeg
│   │       │   ├── logo branca troca ticket.png
│   │       │   ├── logo troca ticket.png
│   │       │   ├── mirante esperia.jpeg
│   │       │   ├── sea club.jpeg
│   │       │   ├── terra sp.jpeg
│   │       │   └── trap in sanca.jpeg
│   │       ├── index.html
│   │       ├── info
│   │       │   └── ajuda.html
│   │       ├── ingresso.css
│   │       ├── ingresso.js
│   │       ├── inserir_evento.js
│   │       ├── meus-ingressos.css
│   │       ├── meus-ingressos.js
│   │       ├── operations
│   │       │   ├── bilheteria.html
│   │       │   ├── chat-fornecedor.html
│   │       │   ├── chat.html
│   │       │   ├── demanda-detalhes.html
│   │       │   ├── fornecedor.html
│   │       │   ├── organizador.html
│   │       │   └── proposta-documentacao.html
│   │       ├── organizador.css
│   │       ├── package.json
│   │       ├── pages.css
│   │       ├── pages.js
│   │       ├── perfil.css
│   │       ├── perfil.js
│   │       ├── platform.css
│   │       ├── QUICK_REFERENCE.md
│   │       ├── README_ADMIN.txt
│   │       ├── resale-calculations.js
│   │       ├── resale-calculations.test.js
│   │       ├── resale-route-updates.test.js
│   │       ├── resale-ticket-policy.js
│   │       ├── resale-ticket-policy.test.js
│   │       ├── revenda.css
│   │       ├── revenda.js
│   │       ├── script.js
│   │       ├── scripts
│   │       │   ├── db-setup.js
│   │       │   └── migrate-revenda-index.js
│   │       ├── SECURITY_CHECKLIST.md
│   │       ├── server.js
│   │       ├── SETUP_GUIDE.md
│   │       ├── sobre-a-plataforma.html
│   │       ├── sql
│   │       │   ├── revenda-p2p.sql
│   │       │   ├── schema.sql
│   │       │   └── seed.sql
│   │       ├── START_HERE.txt
│   │       ├── status.js
│   │       ├── style.css
│   │       ├── SUMMARY.md
│   │       └── trocaticket-azure.sql
│   ├── Gestão Empresarial
│   │   ├── Gestão empresarial.pdf
│   │   └── README.md
│   ├── Guia-IA-FECAP-Completo-com-Declaracao.pdf
│   └── Projeto Interdisciplinar
│       ├── banner_troca_ticket (2).pdf
│       ├── projeto extensão-grupo7.pdf
│       └── README.md
├── Entrega1
│   ├── Banco de Dados
│   │   ├── DER - Troca Ticket - N1.pdf
│   │   └── README.md
│   ├── Calculo II
│   │   ├── README.md
│   │   └── Relatorio Tecnico - Projeto 7 TrocaTicket.pdf
│   ├── Desenvolvimento WebFull
│   │   ├── Back-end
│   │   │   ├── package.json
│   │   │   ├── README.md
│   │   │   ├── sql
│   │   │   │   └── trocaticket-azure.sql
│   │   │   └── src
│   │   │       ├── db.js
│   │   │       ├── fix-name-once.js
│   │   │       ├── generate-admin-token.js
│   │   │       ├── inserir_evento.js
│   │   │       ├── server.js
│   │   │       └── status.js
│   │   ├── Front-end
│   │   │   ├── react
│   │   │   │   ├── index.html
│   │   │   │   ├── package.json
│   │   │   │   ├── README.md
│   │   │   │   ├── src
│   │   │   │   │   ├── App.jsx
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── EventCard.jsx
│   │   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   │   ├── FormContato.jsx
│   │   │   │   │   │   ├── Layout.jsx
│   │   │   │   │   │   ├── Loader.jsx
│   │   │   │   │   │   └── Navbar.jsx
│   │   │   │   │   ├── main.jsx
│   │   │   │   │   ├── pages
│   │   │   │   │   │   ├── Contato.jsx
│   │   │   │   │   │   ├── Eventos.jsx
│   │   │   │   │   │   ├── Home.jsx
│   │   │   │   │   │   └── NotFound.jsx
│   │   │   │   │   ├── services
│   │   │   │   │   │   └── mockApi.js
│   │   │   │   │   └── styles
│   │   │   │   │       └── global.css
│   │   │   │   └── vite.config.js
│   │   │   ├── README.md
│   │   │   └── static
│   │   │       └── Trocaticket-legacy
│   │   │           ├── ADMIN_GUIDE.md
│   │   │           ├── admin.css
│   │   │           ├── admin.html
│   │   │           ├── admin.js
│   │   │           ├── ajuda.html
│   │   │           ├── bilheteria.html
│   │   │           ├── bilheteria.js
│   │   │           ├── cadastro-pj.html
│   │   │           ├── cadastro-pj.js
│   │   │           ├── cadastro.html
│   │   │           ├── cadastro.js
│   │   │           ├── cartoes.css
│   │   │           ├── cartoes.html
│   │   │           ├── cartoes.js
│   │   │           ├── data
│   │   │           │   ├── admin_tokens.json
│   │   │           │   └── events.json
│   │   │           ├── db.js
│   │   │           ├── editar-perfil.css
│   │   │           ├── editar-perfil.html
│   │   │           ├── editar-perfil.js
│   │   │           ├── editar-telefone.css
│   │   │           ├── editar-telefone.html
│   │   │           ├── editar-telefone.js
│   │   │           ├── eventos.html
│   │   │           ├── fix-name-once.js
│   │   │           ├── FLOW_DIAGRAMS.md
│   │   │           ├── generate-admin-token.js
│   │   │           ├── help.js
│   │   │           ├── HTTP_EXAMPLES.md
│   │   │           ├── imagens
│   │   │           │   ├── arena+.jpeg
│   │   │           │   ├── Captura de tela 2026-09-17 143856.png
│   │   │           │   ├── desktop.ini
│   │   │           │   ├── festa do chefe.jpeg
│   │   │           │   ├── logo branca troca ticket.png
│   │   │           │   ├── logo troca ticket.png
│   │   │           │   ├── mirante esperia.jpeg
│   │   │           │   ├── sea club.jpeg
│   │   │           │   ├── terra sp.jpeg
│   │   │           │   └── trap in sanca.jpeg
│   │   │           ├── index.html
│   │   │           ├── ingresso.css
│   │   │           ├── ingresso.html
│   │   │           ├── ingresso.js
│   │   │           ├── ingressos.html
│   │   │           ├── inserir_evento.js
│   │   │           ├── login.html
│   │   │           ├── meus-ingressos.css
│   │   │           ├── meus-ingressos.html
│   │   │           ├── meus-ingressos.js
│   │   │           ├── organizador.css
│   │   │           ├── organizador.html
│   │   │           ├── package.json
│   │   │           ├── pages.css
│   │   │           ├── pages.js
│   │   │           ├── perfil.css
│   │   │           ├── perfil.html
│   │   │           ├── perfil.js
│   │   │           ├── QUICK_REFERENCE.md
│   │   │           ├── README_ADMIN.txt
│   │   │           ├── revenda.html
│   │   │           ├── script.js
│   │   │           ├── SECURITY_CHECKLIST.md
│   │   │           ├── server.js
│   │   │           ├── SETUP_GUIDE.md
│   │   │           ├── START_HERE.txt
│   │   │           ├── status.js
│   │   │           ├── style.css
│   │   │           ├── SUMMARY.md
│   │   │           └── trocaticket-azure.sql
│   │   ├── README.md
│   │   └── Trocaticket
│   │       ├── ADMIN_GUIDE.md
│   │       ├── admin.css
│   │       ├── admin.html
│   │       ├── admin.js
│   │       ├── ajuda.html
│   │       ├── bilheteria.html
│   │       ├── bilheteria.js
│   │       ├── cadastro-pj.html
│   │       ├── cadastro-pj.js
│   │       ├── cadastro.html
│   │       ├── cadastro.js
│   │       ├── cartoes.css
│   │       ├── cartoes.html
│   │       ├── cartoes.js
│   │       ├── data
│   │       │   ├── admin_tokens.json
│   │       │   └── events.json
│   │       ├── db.js
│   │       ├── editar-perfil.css
│   │       ├── editar-perfil.html
│   │       ├── editar-perfil.js
│   │       ├── editar-telefone.css
│   │       ├── editar-telefone.html
│   │       ├── editar-telefone.js
│   │       ├── eventos.html
│   │       ├── fix-name-once.js
│   │       ├── FLOW_DIAGRAMS.md
│   │       ├── generate-admin-token.js
│   │       ├── help.js
│   │       ├── HTTP_EXAMPLES.md
│   │       ├── imagens
│   │       │   ├── arena+.jpeg
│   │       │   ├── Captura de tela 2026-09-17 143856.png
│   │       │   ├── desktop.ini
│   │       │   ├── festa do chefe.jpeg
│   │       │   ├── logo branca troca ticket.png
│   │       │   ├── logo troca ticket.png
│   │       │   ├── mirante esperia.jpeg
│   │       │   ├── sea club.jpeg
│   │       │   ├── terra sp.jpeg
│   │       │   └── trap in sanca.jpeg
│   │       ├── index.html
│   │       ├── ingresso.css
│   │       ├── ingresso.html
│   │       ├── ingresso.js
│   │       ├── ingressos.html
│   │       ├── inserir_evento.js
│   │       ├── login.html
│   │       ├── meus-ingressos.css
│   │       ├── meus-ingressos.html
│   │       ├── meus-ingressos.js
│   │       ├── organizador.css
│   │       ├── organizador.html
│   │       ├── package.json
│   │       ├── pages.css
│   │       ├── pages.js
│   │       ├── perfil.css
│   │       ├── perfil.html
│   │       ├── perfil.js
│   │       ├── QUICK_REFERENCE.md
│   │       ├── README_ADMIN.txt
│   │       ├── revenda.html
│   │       ├── script.js
│   │       ├── SECURITY_CHECKLIST.md
│   │       ├── server.js
│   │       ├── SETUP_GUIDE.md
│   │       ├── START_HERE.txt
│   │       ├── status.js
│   │       ├── style.css
│   │       ├── SUMMARY.md
│   │       └── trocaticket-azure.sql
│   ├── Gestão Empresarial
│   │   ├── Proposta de Valor - Gestão Empresarial.pdf
│   │   ├── README.md
│   │   ├── Troca_Ticket_Gustavo_Gestao_Empresarial.docx
│   │   ├── Troca_Ticket_Joao_Gestao_Empresarial.docx
│   │   ├── Troca_Ticket_Pablo_Gestao_Empresarial.docx
│   │   └── Troca_Ticket_Victor_Gestao_Empresarial.docx
│   └── Projeto Interdiciplinar
│       ├── entrega 1 de PI
│       │   └── figma.url
│       └── README.md
├── package.json
├── README.md
├── scripts
├── serve.js
├── src
│   └── Trocaticket
│       ├── account
│       │   ├── cartoes.html
│       │   ├── editar-perfil.html
│       │   ├── editar-telefone.html
│       │   ├── ingresso.html
│       │   ├── meus-ingressos.html
│       │   ├── perfil.html
│       │   └── revenda.html
│       ├── admin
│       │   └── admin.html
│       ├── ADMIN_GUIDE.md
│       ├── admin.css
│       ├── admin.js
│       ├── armazenamento.js
│       ├── armazenamento.test.js
│       ├── auth
│       │   ├── cadastro-pj.html
│       │   ├── cadastro.html
│       │   └── login.html
│       ├── auth-fetch.js
│       ├── auth-fetch.test.js
│       ├── auth-guards.js
│       ├── auth-guards.test.js
│       ├── auth-route-guards.test.js
│       ├── bilheteria-app.js
│       ├── bilheteria.css
│       ├── cadastro-pj.js
│       ├── cadastro.js
│       ├── cartoes.css
│       ├── cartoes.js
│       ├── chat.css
│       ├── checkout.css
│       ├── checkout.js
│       ├── checkout.test.js
│       ├── como-funciona-a-revenda.css
│       ├── como-funciona-a-revenda.html
│       ├── como-funciona-a-revenda.js
│       ├── data
│       │   ├── admin_tokens.json
│       │   └── events.json
│       ├── db.js
│       ├── editar-perfil.css
│       ├── editar-perfil.js
│       ├── editar-telefone.css
│       ├── editar-telefone.js
│       ├── event-edit-image-preservation.test.js
│       ├── event-images.js
│       ├── event-images.test.js
│       ├── evento.css
│       ├── evento.js
│       ├── events
│       │   ├── checkout.html
│       │   ├── evento.html
│       │   ├── eventos.html
│       │   └── ingressos.html
│       ├── fix-name-once.js
│       ├── FLOW_DIAGRAMS.md
│       ├── frontend
│       │   ├── index.html
│       │   ├── package.json
│       │   ├── README.md
│       │   ├── src
│       │   │   ├── components
│       │   │   │   └── AssetImage.jsx
│       │   │   ├── lib
│       │   │   │   └── api.js
│       │   │   ├── main.jsx
│       │   │   ├── pages
│       │   │   │   ├── Events.jsx
│       │   │   │   ├── Home.jsx
│       │   │   │   ├── Login.jsx
│       │   │   │   ├── Orders.jsx
│       │   │   │   ├── resale.css
│       │   │   │   ├── Resale.jsx
│       │   │   │   └── Ticket.jsx
│       │   │   └── styles.css
│       │   └── vite.config.js
│       ├── generate-admin-token.js
│       ├── help.js
│       ├── HTTP_EXAMPLES.md
│       ├── imagens
│       │   ├── arena+.jpeg
│       │   ├── banner troca ticket.jpg
│       │   ├── Captura de tela 2026-09-17 143856.png
│       │   ├── desktop.ini
│       │   ├── festa do chefe.jpeg
│       │   ├── logo branca troca ticket.png
│       │   ├── logo troca ticket.png
│       │   ├── mirante esperia.jpeg
│       │   ├── sea club.jpeg
│       │   ├── terra sp.jpeg
│       │   └── trap in sanca.jpeg
│       ├── index.html
│       ├── info
│       │   └── ajuda.html
│       ├── ingresso.css
│       ├── ingresso.js
│       ├── inserir_evento.js
│       ├── meus-ingressos.css
│       ├── meus-ingressos.js
│       ├── operations
│       │   ├── bilheteria.html
│       │   ├── chat-fornecedor.html
│       │   ├── chat.html
│       │   ├── demanda-detalhes.html
│       │   ├── fornecedor.html
│       │   ├── organizador.html
│       │   └── proposta-documentacao.html
│       ├── organizador.css
│       ├── package.json
│       ├── pages.css
│       ├── pages.js
│       ├── perfil.css
│       ├── perfil.js
│       ├── platform.css
│       ├── QUICK_REFERENCE.md
│       ├── README_ADMIN.txt
│       ├── resale-calculations.js
│       ├── resale-calculations.test.js
│       ├── resale-route-updates.test.js
│       ├── resale-ticket-policy.js
│       ├── resale-ticket-policy.test.js
│       ├── revenda.css
│       ├── revenda.js
│       ├── script.js
│       ├── scripts
│       │   ├── db-setup.js
│       │   └── migrate-revenda-index.js
│       ├── SECURITY_CHECKLIST.md
│       ├── server.js
│       ├── SETUP_GUIDE.md
│       ├── sobre-a-plataforma.html
│       ├── sql
│       │   ├── revenda-p2p.sql
│       │   ├── schema.sql
│       │   └── seed.sql
│       ├── START_HERE.txt
│       ├── status.js
│       ├── style.css
│       ├── SUMMARY.md
│       └── trocaticket-azure.sql
└── vercel.json
```

## Tecnologias

- Framework/principal: o projeto principal usa React 19 com Vite (`src/Trocaticket/frontend/package.json`), com CSS customizado em arquivos locais e páginas legadas em HTML/CSS/JS no repositório.
- CSS: predominante em CSS puro (`.css` e estilos locais), sem Tailwind, Bootstrap ou CSS Modules no front-end principal; o React usa CSS global em `src/Trocaticket/frontend/src/styles.css`.
- Execução: `npm install`; `npm run dev` inicia a API/servidor e o frontend React; `npm run build` gera o app; `npm start` inicia apenas o servidor Node.

## Conteúdo dos arquivos de front-end



### api/index.js

```javascript
module.exports = require('../src/Trocaticket/server.js');

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/cartoes.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../cartoes.css">
    <title>Meus Cartões | TrocaTicket</title>
</head>
<body class="cards-page">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>

        <a href="perfil.html" class="button button-outline" style="padding: 8px 18px; font-size: 13px; text-decoration: none;">
            Voltar
        </a>
    </header>

    <main class="cards-shell">
        <header class="cards-header">
            <h1>Meus Cartões</h1>
            <p>Gerencie seus cartões com segurança.</p>
        </header>

        <nav class="cards-tabs" role="tablist">
            <button class="cards-tab active" type="button" role="tab" aria-selected="true" data-tab="saved">Cartões Salvos</button>
            <button class="cards-tab" type="button" role="tab" aria-selected="false" data-tab="new">Cadastrar Novo Cartão</button>
        </nav>

        <section id="saved-tab" class="cards-tab-panel" role="tabpanel">
            <div id="cards-list" class="cards-list">
                <p class="cards-status">Carregando cartões...</p>
            </div>
        </section>

        <section id="new-tab" class="cards-tab-panel" role="tabpanel" hidden>
            <form id="card-form" class="card-form">
                <label>Nome impresso no cartão
                    <input name="nome_titular" required autocomplete="cc-name" placeholder="NOME COMPLETO">
                </label>
                
                <label>Número do cartão
                    <input name="numero_cartao" required inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="0000 0000 0000 0000">
                </label>
                
                <div class="card-form-row">
                    <label>Validade
                        <input name="validade" required inputmode="numeric" maxlength="5" autocomplete="cc-exp" placeholder="MM/AA">
                    </label>
                    <label>CVV
                        <input name="cvv" required inputmode="numeric" maxlength="4" autocomplete="cc-csc" type="password" placeholder="•••">
                    </label>
                </div>

                <label>CPF do titular
                    <input name="cpf" required placeholder="CPF (11 números; pontuação opcional)">
                </label>

                <p id="card-message" class="cards-status" role="status"></p>
                <button class="cards-primary" type="submit">Salvar Cartão</button>
            </form>
        </section>
    </main>

    <script src="../auth-fetch.js"></script>
    <script src="../cartoes.js" defer></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/editar-perfil.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../editar-perfil.css">
    <title>Editar dados | TrocaTicket</title>
</head>
<body class="edit-profile-page">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>

        <a href="perfil.html" class="button button-outline" style="padding: 8px 18px; font-size: 13px; text-decoration: none;">
            Voltar
        </a>
    </header>

    <main class="edit-profile-shell">
        <h1>Editar dados</h1>
        
        <div class="edit-avatar">
            <label for="avatar-input" title="Clique para alterar a foto">
                <img id="edit-profile-avatar" src="../imagens/logo troca ticket.png" alt="Foto do perfil">
                <div class="avatar-badge">📷</div>
            </label>
            <input type="file" id="avatar-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
        </div>

        <form id="edit-profile-form">
            <div class="readonly-grid">
                <label>Nome<input id="nome" readonly></label>
                <label>Sobrenome<input id="sobrenome" readonly></label>
            </div>
            
            <label>E-mail<input id="email" type="email" readonly></label>
            
            <div class="readonly-grid">
                <label>CPF<input id="cpf" readonly></label>
                <label>Telefone<input id="telefone" readonly></label>
            </div>
            
            <div class="editable-grid">
                <label>Data de nascimento<input id="data_nascimento" type="date" required></label>
                <label>Gênero
                    <select id="genero" required>
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                        <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                </label>
            </div>
            
            <p id="edit-profile-message" role="status"></p>
            <button class="edit-profile-save" type="submit">Salvar alterações</button>
        </form>
    </main>

    <script src="../auth-fetch.js"></script>
    <script src="../editar-perfil.js" defer></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/editar-telefone.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../editar-telefone.css">
    <title>Verificação de telefone | TrocaTicket</title>
</head>
<body class="phone-page">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>

        <a href="perfil.html" class="button button-outline" style="padding: 8px 18px; font-size: 13px; text-decoration: none;">
            Voltar
        </a>
    </header>

    <main class="phone-shell">
        <div class="phone-content-card">
            <h1>Verificação de telefone</h1>
            <div class="phone-divider"></div>
            <p class="phone-lead">Digite o número do seu celular</p>
            
            <form id="phone-form" class="phone-form">
                <div class="phone-number-row">
                    <label class="country-selector" aria-label="País do telefone">
                        <button id="country-display" class="country-display" type="button" aria-expanded="false">+55</button>
                        <div id="country-options" class="country-options" role="listbox" hidden>
                            <button type="button" data-code="+55" data-label="BR +55">BR +55</button>
                            <button type="button" data-code="+1" data-label="US +1">US +1</button>
                            <button type="button" data-code="+351" data-label="PT +351">PT +351</button>
                            <button type="button" data-code="+34" data-label="ES +34">ES +34</button>
                            <button type="button" data-code="+44" data-label="GB +44">GB +44</button>
                            <button type="button" data-code="+49" data-label="DE +49">DE +49</button>
                            <button type="button" data-code="+33" data-label="FR +33">FR +33</button>
                            <button type="button" data-code="+39" data-label="IT +39">IT +39</button>
                            <button type="button" data-code="+81" data-label="JP +81">JP +81</button>
                        </div>
                        <input id="country-code" type="hidden" value="+55">
                    </label>
                    <input id="phone-number" name="telefone" type="tel" inputmode="tel" required placeholder="Digite o número com DDD; separadores são opcionais">
                </div>

                <p class="phone-description">
                    Enviaremos uma mensagem com o código de verificação para o número indicado. Selecione abaixo a forma que deseja recebê-la.
                </p>

                <div class="channel-actions">
                    <button class="channel-button whatsapp" type="button" data-channel="whatsapp">WhatsApp</button>
                    <button class="channel-button sms" type="button" data-channel="sms">SMS</button>
                </div>

                <p id="phone-message" class="phone-message" role="status"></p>
            </form>

            <section id="code-step" class="code-step" hidden>
                <label for="verification-code">Código de verificação</label>
                <input id="verification-code" inputmode="numeric" maxlength="6" pattern="\d{6}" placeholder="Digite os 6 dígitos">
                <button id="confirm-phone" class="confirm-button" type="button">Confirmar telefone</button>
            </section>

            <a class="cancel-link" href="perfil.html">Cancelar</a>
        </div>
    </main>

    <script src="../auth-fetch.js"></script>
    <script src="../editar-telefone.js" defer></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/ingresso.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../ingresso.css">
    <title>Ingresso Digital | TrocaTicket</title>
</head>
<body class="ticket-page-body">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>
        <a href="meus-ingressos.html" class="btn-return-menu">Voltar</a>
    </header>

    <main class="ticket-page-container">
        <div class="ticket-card-wrapper" id="ticket-wrapper">
            
            <!-- Capa do Evento no Topo -->
            <div class="ticket-header-cover">
                <img id="ticket-cover-img" src="../imagens/logo troca ticket.png" alt="Capa do Evento">
                <div class="cover-gradient-overlay"></div>
            </div>

            <!-- Bilhete Estilo Ticket -->
            <div class="ticket-card-content">
                <div class="ticket-notch notch-left"></div>
                <div class="ticket-notch notch-right"></div>

                <div class="ticket-main-header">
                    <h1 id="ticket-event-name">CARREGANDO...</h1>
                    <p class="ticket-artist-name" id="ticket-artist-name"></p>
                    <div class="ticket-date-row">
                        <span class="cal-icon">📅</span>
                        <span id="ticket-date-text">Data a confirmar</span>
                    </div>
                </div>

                <!-- Bloco do QR Code Central -->
                <div class="ticket-qr-box">
                    <div class="canvas-container">
                        <img id="qr-code-image" alt="QR dinâmico do ingresso">
                    </div>
                    <div class="ticket-used-overlay" id="ticket-used-overlay" hidden>
                        <strong>INGRESSO UTILIZADO</strong>
                        <span>Este acesso já foi consumido.</span>
                    </div>
                    <p id="qr-refresh-status" class="qr-refresh-status" aria-live="polite"></p>
                </div>

                <div class="ticket-info-pills">
                    <span class="ticket-type-label" id="ticket-category">INGRESSO DIGITAL</span>
                    <span class="ticket-schedule-pill" id="ticket-time-text">Data e Horário</span>
                </div>

                <div class="ticket-digital-actions">
                    <div id="ticket-digital-actions">
                    <button type="button" class="btn-digital-action btn-offline" id="btn-offline-ticket">
                        <span class="digital-action-icon" aria-hidden="true">&#8681;</span>
                        <span class="digital-action-label">Baixar para Acesso Offline (Enviar por E-mail)</span>
                    </button>
                    <button type="button" class="btn-digital-action btn-google-wallet" id="btn-google-wallet">
                        <span class="wallet-mark" aria-hidden="true">G</span>
                        <span class="digital-action-label">Adicionar à Carteira do Google</span>
                    </button>
                </div>

                <!-- Botões de Ação -->
                <div class="ticket-actions-group">
                    <button type="button" class="btn-action btn-transfer" id="btn-transfer-ticket">
                        TRANSFERIR
                    </button>
                    <button type="button" class="btn-action btn-resell" id="btn-resell-ticket">
                        🏷️ ANUNCIAR EM REVENDA
                    </button>
                </div>
                <p class="transfer-alert" id="transfer-alert-msg"></p>
                <p class="ticket-used-notice" id="ticket-used-notice" role="status" hidden></p>
                <p class="ticket-toast" id="ticket-action-toast" role="status" aria-live="polite"></p>

                <!-- Rodapé com Código do Ingresso e Pedido nas pontas -->
                <div class="ticket-metadata-footer">
                    <span id="ticket-serial-label">INGRESSO: #000000</span>
                    <span id="ticket-order-label">PEDIDO: #000000</span>
                </div>

            </div>
        </div>
        <div class="ticket-carousel-nav" id="carousel-nav-container" style="display: none;">
            <button type="button" class="carousel-nav-btn" id="btn-prev-ticket" aria-label="Ingresso anterior">‹</button>
            <span class="carousel-counter-info" id="carousel-counter-label">INGRESSO(S) 1 / 1</span>
            <button type="button" class="carousel-nav-btn" id="btn-next-ticket" aria-label="Próximo ingresso">›</button>
        </div>
    </main>

    <!-- Modal para Transferência Nominal -->
    <div class="transfer-backdrop" id="transfer-dialog-backdrop" aria-hidden="true">
        <div class="transfer-dialog-box">
            <button class="dialog-close-btn" id="btn-close-transfer-dialog">✕</button>
            <h3>Transferência Nominal</h3>
            <p>Atenção: A transferência direta de titularidade só pode ser feita <strong>uma única vez</strong>. O destinatário não poderá repassar para terceiros, apenas revender.</p>
            <input type="email" id="input-destinatario-email" placeholder="E-mail do novo titular" />
            <div class="dialog-actions-row">
                <button type="button" class="btn-dialog-abort" id="btn-abort-transfer">Cancelar</button>
                <button type="button" class="btn-dialog-execute" id="btn-execute-transfer">Confirmar Envio</button>
            </div>
        </div>
    </div>

    <script src="../auth-fetch.js"></script>
    <script src="../ingresso.js"></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/meus-ingressos.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../meus-ingressos.css">
    <title>Meus pedidos | TrocaTicket</title>
</head>
<body class="page-body">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>
        <a href="../index.html" class="btn-return-menu">Voltar</a>
    </header>

    <main class="orders-container">
        <div class="page-intro">
            <h1 class="orders-main-title">Meus pedidos</h1>
            <p id="ticket-message"></p>
        </div>

        <section id="tickets" class="tickets-list">
            
        </section>
    </main>

    <script src="../auth-fetch.js"></script>
    <script src="../meus-ingressos.js"></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/perfil.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../perfil.css">
    <title>Minha Conta | TrocaTicket</title>
</head>
<body class="profile-page">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>

        <a href="../index.html" class="button button-outline" style="padding: 8px 18px; font-size: 13px; text-decoration: none;">
            Voltar
        </a>
    </header>

    <main class="profile-shell">
        <section class="profile-hero" aria-label="Dados da conta">
            <label class="avatar-upload" for="avatar-input" title="Clique para alterar a foto de perfil">
                <img id="profile-avatar" src="../imagens/logo troca ticket.png" alt="Foto do perfil">
                <span class="avatar-camera" aria-hidden="true">+</span>
            </label>
            <input id="avatar-input" type="file" accept="image/png, image/jpeg, image/webp" hidden>
            <h1 id="profile-name">Carregando...</h1>
            <p id="profile-email">-</p>
        </section>

        <section class="profile-section">
            <h2><span class="section-symbol">⚙</span> Configurações</h2>
            <div class="profile-actions">
                <a class="profile-action" href="editar-perfil.html"><span class="action-icon">♙</span>Editar perfil</a>
                <a class="profile-action" href="editar-telefone.html"><span class="action-icon">⌕</span>Editar telefone</a>
                <a class="profile-action" href="cartoes.html"><span class="action-icon">▣</span>Meus cartões</a>
                <button class="profile-action danger" type="button" id="delete-account"><span class="action-icon">♜</span>Excluir conta</button>
                <button class="profile-action danger" type="button" id="profile-logout"><span class="action-icon">⏻</span>Sair</button>
            </div>
        </section>

        <section class="profile-section profile-info">
            <h2><span class="section-symbol">ⓘ</span> Informações</h2>
            <a class="profile-action" href="../info/ajuda.html"><span class="action-icon">?</span>Central de ajuda</a>
        </section>

        <form id="profile-form" class="profile-edit-form" hidden>
            <label>Nome<input id="nome" name="nome" readonly></label>
            <label>CPF<input id="cpf" name="cpf" readonly></label>
            <label>E-mail<input id="email" name="email" type="email" required></label>
            <label>Telefone<input id="telefone" name="telefone" type="tel" inputmode="tel" placeholder="Número com DDD; separadores opcionais"></label>
            <label>Nova senha<input id="senha" name="senha" type="password" minlength="6"></label>
            <p id="profile-message" role="status"></p>
            <button class="profile-save" type="submit">Salvar alterações</button>
        </form>
    </main>

    <script src="../auth-fetch.js"></script>
    <script src="../perfil.js" defer></script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/account/revenda.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Revenda oficial TrocaTicket: fila transparente, preço original e carteira protegida.">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../pages.css">
  <link rel="stylesheet" href="../revenda.css">
  <script src="../auth-fetch.js"></script>
  <script src="../script.js" defer></script>
  <script src="../revenda.js" defer></script>
  <title>Revenda oficial | TrocaTicket</title>
</head>
<body class="page-body resale-body">
  <header class="site-header">
    <a class="brand" href="../index.html">
      <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
      <span>Troca<span class="brand-accent">Ticket</span></span>
    </a>
    <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-menu">
      <span></span><span></span><span></span>
    </button>
    <nav class="main-nav" id="main-menu" aria-label="Navegação principal">
      <a href="../index.html">
        <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="1.5"></rect><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"></path></svg>
        <span>Eventos</span>
      </a>
      <a id="account-link" href="../auth/login.html">
        <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"></path></svg>
        <span>Entrar / Cadastrar</span>
      </a>
      <a href="meus-ingressos.html">
        <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h14v9H5z"></path><path d="M8 7.5v9M11 10h5M11 13h3"></path></svg>
        <span>Meus ingressos</span>
      </a>
      <a href="../info/ajuda.html">
        <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M9.8 9.5a2.4 2.4 0 1 1 3.8 1.9c-1 .7-1.6 1.1-1.6 2.4M12 16.8h.01"></path></svg>
        <span>Central de ajuda</span>
      </a>
      <a href="javascript:void(0);" id="logout-link">
        <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>Sair</span>
      </a>
    </nav>
  </header>

  <main class="resale-main">
    <section class="resale-hero">
      <p class="eyebrow">TrocaTicket · revenda oficial</p>
      <h1>Seu ingresso.<br><em>Seu valor de volta.</em></h1>
      <p class="resale-lead">Uma nova forma de repassar ingressos com preço justo, prioridade transparente e titularidade protegida.</p>
      <a class="resale-info-link" href="../como-funciona-a-revenda.html">Como funciona a revenda e as regras de reembolso <span>↗</span></a>
    </section>

    <section class="resale-bento" aria-label="Área de revenda">
      <article class="resale-panel announce-panel">
        <div class="panel-heading"><span class="panel-number">01</span><div><p class="eyebrow">Para vendedores</p><h2>Anuncie seu ingresso</h2></div></div>
        <form id="resale-form">
          <label for="ticket-select">Ingresso válido</label>
          <select id="ticket-select" required><option value="">Carregando seus ingressos...</option></select>
          <div class="locked-price"><span>Preço de repasse travado</span><strong id="locked-price">Selecione um ingresso</strong><small id="locked-ticket-category">O valor original do lote, sem ágio.</small></div>
          <fieldset>
            <legend>Escolha sua prioridade</legend>
            <div class="fee-options">
              <label class="fee-card"><input type="radio" name="fee" value="comum" required><span class="fee-check">✓</span><strong>Comum <b>2%</b></strong><small>Posição base</small></label>
              <label class="fee-card"><input type="radio" name="fee" value="basica"><span class="fee-check">✓</span><strong>Básica <b>5%</b></strong><small>Prioridade intermediária</small></label>
              <label class="fee-card fee-premium"><input type="radio" name="fee" value="premium"><span class="fee-check">✓</span><strong>Premium <b>8%</b></strong><small>Topo da fila</small></label>
            </div>
          </fieldset>
          <button class="button button-primary resale-submit" type="submit">Anunciar ingresso <span>↗</span></button>
          <p id="announce-feedback" class="form-feedback" role="status"></p>
        </form>
      </article>

    </section>

    <section class="resale-panel resale-listings-panel" aria-labelledby="my-resale-title">
      <div class="panel-heading">
        <span class="panel-number">02</span>
        <div><p class="eyebrow">Acompanhamento</p><h2 id="my-resale-title">Tickets em revenda</h2></div>
      </div>
      <div id="resale-listings" class="legacy-listings" aria-live="polite">
        <p class="empty-state">Carregando seus anúncios...</p>
      </div>
    </section>

    <section class="resale-bottom">
      <article class="resale-panel wallet-panel">
        <div class="panel-heading"><span class="panel-number">03</span><div><p class="eyebrow">Carteira protegida</p><h2>Seu repasse, com segurança</h2></div></div>
        <div class="wallet-values"><div><small>A liberar</small><strong id="wallet-pending">R$ 0,00</strong></div><div><small>Disponível</small><strong id="wallet-available">R$ 0,00</strong></div></div>
        <p class="wallet-explanation">O saldo fica retido até o check-in do comprador e é liberado 24 horas após o encerramento do evento.</p>
        <form id="withdrawal-form" class="withdrawal-form"><label>Valor do saque<input id="withdrawal-value" type="number" min="0.01" step="0.01" required placeholder="0,00"></label><label>CPF da chave PIX<input id="withdrawal-cpf" inputmode="numeric" required placeholder="Seu CPF"></label><button class="button button-outline" type="submit">Transferir</button><p id="withdrawal-feedback" class="form-feedback" role="status"></p></form>
      </article>
    </section>
  </main>

</body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/admin.css

```css
/* ===== ADMIN PANEL - IDENTIDADE VISUAL DARK ELEVADA ===== */

:root {
  --bg-main: #0c0e14;
  --bg-surface: #151824;
  --bg-surface-elevated: #1e2233;
  --border-color: #272c40;
  --border-focus: #3d4566;
  --primary: #6c5ce7;
  --primary-hover: #5848d6;
  --accent-cyan: #00d2ff;
  --accent-green: #2ecc71;
  --text-main: #f5f6fa;
  --text-muted: #8c93a8;
  --danger: #ff4757;
  --danger-bg: rgba(255, 71, 87, 0.15);
  --success-bg: rgba(46, 204, 113, 0.15);
  --info-bg: rgba(0, 210, 255, 0.12);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.35);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* Header */
.admin-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 36px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header-content {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-title::after {
  content: "Admin";
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(108, 92, 231, 0.2);
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 2px 8px;
  border-radius: 4px;
}

.logout-btn {
  background: var(--danger-bg);
  color: var(--danger);
  border: 1px solid var(--danger);
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--danger);
  color: #fff;
}

/* Barra de Navegação */
.admin-nav {
  background: #11141e;
  padding: 8px 36px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.admin-nav .nav-btn {
  background: transparent;
  color: var(--text-muted);
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-nav .nav-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.admin-nav .nav-btn:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.04);
}

.admin-nav .nav-btn.active {
  color: #fff;
  background: var(--primary);
}

/* Área de Conteúdo */
.admin-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 32px 36px;
}

.admin-section {
  display: none;
  animation: fadeIn 0.25s ease-in-out;
}

.admin-section.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.55rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.section-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Grid de Métricas (Dashboard) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.stat-card:hover {
  border-color: var(--border-focus);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 56px;
  height: 56px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-value {
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

/* Grid Secundário do Dashboard */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.dashboard-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.dashboard-card h3 {
  margin: 0 0 16px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}

.activity-item,
.event-item {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 10px;
}

.activity-item strong,
.event-item-title {
  color: var(--accent-cyan);
  font-size: 0.95rem;
}

.event-item-date,
.event-item-location,
.activity-item small {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 24px 0;
  font-size: 0.9rem;
}

/* Tabelas */
.table-container {
  background: var(--bg-surface);
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table thead tr {
  background: #191c2b;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  padding: 14px 20px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  font-weight: 700;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.92rem;
  color: var(--text-main);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}
.resale-queues-container{display:grid;gap:20px}.resale-queue-card{padding:22px;background:var(--card-bg,#171a22);border:1px solid var(--border-color,#2a313d);border-radius:12px}.resale-queue-heading{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}.resale-queue-heading h3{margin:6px 0 4px}.resale-queue-heading p{margin:0;color:#9ba5ba}.resale-queue-heading>strong{color:#8da5ff;white-space:nowrap}.queue-label{color:#8da5ff;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.resale-queue-card .table-container{margin:0}.resale-queue-card .data-table{min-width:760px}
.resale-queue-filters{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:14px;margin:0 0 20px;padding:16px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:12px}.resale-queue-filters label{display:grid;gap:7px;color:var(--text-muted);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.resale-queue-filters select{padding:10px 12px;border:1px solid var(--border-focus);border-radius:8px;background:var(--bg-surface-elevated);color:var(--text-main);font:inherit}.queue-price-detail{display:block;margin-top:4px;color:var(--text-muted);font-size:.75rem}
.revenue-filters{display:grid;grid-template-columns:minmax(220px,1fr) repeat(2,minmax(180px,240px));align-items:end;gap:16px;margin:0 0 24px;padding:18px 20px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:12px;box-shadow:var(--shadow-card)}.revenue-filters strong,.revenue-filters span{display:block}.revenue-filters strong{font-size:1rem}.revenue-filters span{margin-top:5px;color:var(--text-muted);font-size:.82rem}.revenue-filters label{display:grid;gap:7px;color:var(--text-muted);font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.revenue-filters select{padding:10px 12px;border:1px solid var(--border-focus);border-radius:8px;background:var(--bg-surface-elevated);color:var(--text-main);font:inherit}
@media(max-width:700px){.revenue-filters{grid-template-columns:1fr}.resale-queue-filters{grid-template-columns:1fr}.resale-queue-heading{flex-direction:column}.resale-queue-card{padding:16px}.resale-queue-card .table-container{overflow-x:auto}}

/* Badges de Status */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-badge.status-active,
.status-badge.status-aprovado,
.status-badge.status-valido {
  background: var(--success-bg);
  color: var(--accent-green);
  border: 1px solid rgba(46, 204, 113, 0.25);
}

.status-badge.status-inactive,
.status-badge.status-bloqueado,
.status-badge.status-cancelado {
  background: var(--danger-bg);
  color: var(--danger);
  border: 1px solid rgba(255, 71, 87, 0.25);
}

.status-badge.status-pending,
.status-badge.status-pendente {
  background: rgba(241, 196, 15, 0.12);
  color: #f1c40f;
  border: 1px solid rgba(241, 196, 15, 0.25);
}

/* Botões */
.button,
.card-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.button-primary {
  background: var(--primary);
  color: #fff;
}

.button-primary:hover {
  background: var(--primary-hover);
}

.button-outline {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.button-outline:hover {
  background: var(--bg-surface-elevated);
  border-color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s ease;
}

.action-btn-edit,
.action-btn-view {
  background: var(--info-bg);
  color: var(--accent-cyan);
  border: 1px solid rgba(0, 210, 255, 0.3);
}

.action-btn-delete {
  background: var(--danger-bg);
  color: var(--danger);
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.action-btn:hover {
  opacity: 0.85;
}

/* Campos de Busca e Filtro */
.search-filter input,
.filter-group select,
#authorize-pj-form input,
#authorize-pj-form select {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.search-filter input:focus,
.filter-group select:focus {
  border-color: var(--accent-cyan);
}

/* Janela Flutuante na Direita da Tela */
.modal {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(2px) !important;
  display: none;
  z-index: 1000 !important;
  transition: opacity 0.15s ease;
}

.modal.open {
  display: block !important;
}

.modal.closing {
  opacity: 0 !important;
  pointer-events: none;
}

.modal-content {
  position: fixed !important;
  top: 24px !important;
  right: 24px !important;
  left: auto !important;
  transform: none !important;
  width: 100% !important;
  max-width: 440px !important;
  height: calc(100vh - 48px) !important;
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 14px !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8) !important;
  padding: 28px !important;
  overflow-y: auto !important;
  box-sizing: border-box !important;
  animation: slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-close:hover {
  color: #fff;
}

.modal-content h2 {
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  cursor: grab;
  user-select: none;
}

.modal-content h2:active {
  cursor: grabbing;
}

.modal-content label {
  display: block;
  margin-bottom: 14px;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-muted);
}

.modal-content input[type="text"],
.modal-content input[type="number"],
.modal-content input[type="datetime-local"],
.modal-content select {
  width: 100%;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-top: 6px;
  box-sizing: border-box;
  outline: none;
}

.modal-content input:focus,
.modal-content select:focus {
  border-color: var(--accent-cyan);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Responsivo */
@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .admin-header,
  .admin-nav,
  .admin-content {
    padding-left: 18px;
    padding-right: 18px;
  }
  .modal-content {
    max-width: 92% !important;
    right: 4% !important;
    left: 4% !important;
  }
}

.ticket-filter-menu,
.user-filter-menu {
  position: relative;
}

.filter-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-focus);
  border-radius: 8px;
  padding: 10px 14px;
  background: var(--bg-surface-elevated);
  color: var(--text-main);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.filter-trigger:hover, .filter-trigger[aria-expanded="true"] { border-color: var(--accent-cyan); color: var(--accent-cyan); }
.filter-trigger svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }

.ticket-filter-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 20;
  width: min(620px, calc(100vw - 32px));
  padding: 18px;
  border: 1px solid var(--border-focus);
  border-radius: 10px;
  background: var(--bg-surface-elevated);
  box-shadow: var(--shadow-card);
}

.ticket-filter-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.ticket-filter-grid label { display: grid; gap: 6px; color: var(--text-muted); font-size: 0.75rem; font-weight: 700; }
.ticket-filter-grid input, .ticket-filter-grid select { width: 100%; box-sizing: border-box; border: 1px solid var(--border-color); border-radius: 6px; padding: 9px 10px; background: var(--bg-surface); color: var(--text-main); font: inherit; }
.ticket-filter-grid input:focus, .ticket-filter-grid select:focus { outline: 2px solid var(--accent-cyan); outline-offset: 1px; }
.ticket-filter-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.filter-clear, .filter-apply { border: 0; border-radius: 6px; padding: 9px 14px; font: inherit; font-weight: 700; cursor: pointer; }
.filter-clear { background: transparent; color: var(--text-muted); }
.filter-apply { background: var(--primary); color: #fff; }
.filter-apply:hover { background: var(--primary-hover); }

@media (max-width: 720px) {
  .ticket-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.user-filter-panel {
  right: 0;
  top: calc(100% + 10px);
}

.user-history-card { margin-top: 24px; }
.user-history-search { display: flex; gap: 10px; margin-bottom: 16px; }
.user-history-search input { flex: 1; min-width: 0; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 6px; padding: 10px; }
.user-history-result { color: var(--text-main); line-height: 1.7; }
.user-history-result.error { color: var(--danger); }
.executive-metrics { margin-top: 24px; }
.dashboard-chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
.chart-card { min-width: 0; }
.chart-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px; }
.chart-heading h3 { margin: 0 0 5px; }
.chart-heading p { margin: 0; color: var(--text-muted); font-size: 0.8rem; }
.chart-filters { display: flex; gap: 8px; }
.chart-filters select, .chart-heading > select { max-width: 150px; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 6px; padding: 8px; }
.bar-chart { height: 260px; display: flex; align-items: end; gap: 10px; padding: 24px 8px 0; color: var(--text-muted); }
.bar-column { height: 100%; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: end; align-items: center; gap: 6px; font-size: 0.7rem; }
.bar-column strong { color: var(--text-main); font-size: 0.68rem; white-space: nowrap; }
.bar-column i { display: block; width: min(38px, 70%); min-height: 4px; background: var(--primary); border-radius: 5px 5px 0 0; }
.bar-column small { white-space: nowrap; }
.line-chart { height: 260px; padding-top: 24px; }
.line-chart svg { width: 100%; height: 100%; overflow: visible; }
.line-chart text { fill: var(--text-muted); font-size: 11px; }
.line-chart span, .bar-chart > span { margin: auto; color: var(--text-muted); }
.audit-filters { display: flex; gap: 8px; }
.audit-filters input, .audit-filters select { background: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--text-main); padding: 10px; border-radius: 6px; }

@media (max-width: 900px) {
  .dashboard-chart-grid { grid-template-columns: 1fr; }
  .chart-heading { flex-direction: column; }
  .chart-filters { width: 100%; }
  .chart-filters select, .chart-heading > select { max-width: none; flex: 1; }
}

.admin-homologacao-header-actions,
.admin-homologacao-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-homologacao-card {
  padding: 18px;
}

.admin-homologacao-list {
  display: grid;
  gap: 12px;
}

.admin-homologacao-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-surface-elevated);
}

.admin-homologacao-item > div:first-child {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.admin-homologacao-item small {
  color: var(--text-muted);
}

.admin-homologacao-actions a {
  text-decoration: none;
}

.admin-homologacao-actions {
  justify-content: flex-end;
  min-width: max-content;
}

.admin-homologacao-actions .button {
  white-space: nowrap;
}

.homologacao-reason {
  color: #ffb2bd !important;
}

@media (max-width: 760px) {
  .admin-homologacao-item {
    align-items: stretch;
    flex-direction: column;
  }
}

.admin-homologacao-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.admin-homologacao-kpis .stat-card {
  min-height: 92px;
}

.admin-homologacao-toolbar {
  margin-bottom: 14px;
}

.admin-homologacao-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-surface-elevated);
}

.admin-homologacao-tab {
  border: 0;
  border-radius: 7px;
  padding: 10px 14px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.admin-homologacao-tab:hover,
.admin-homologacao-tab.is-active {
  background: var(--bg-main);
  color: var(--text-main);
}

.admin-homologacao-item {
  display: grid;
  gap: 18px;
  align-items: stretch;
  padding: 20px;
}

.admin-homologacao-company,
.admin-homologacao-document {
  display: grid;
  gap: 14px;
}

.admin-homologacao-document {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.admin-homologacao-documents {
  display: grid;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.admin-homologacao-documents-heading {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.admin-homologacao-document-list {
  display: grid;
  gap: 0;
}

.admin-homologacao-document-list > .admin-homologacao-document {
  grid-template-columns: minmax(0, 1fr) auto auto;
  padding: 14px 0;
  border-top: 1px solid rgba(126, 140, 180, 0.18);
}

.admin-homologacao-document-status {
  display: flex;
  align-items: center;
}

.admin-homologacao-final-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-height: 48px;
  margin: 8px 0 4px;
  padding: 10px 0 12px;
  border-bottom: 1px solid rgba(126, 140, 180, 0.18);
}

.button-final {
  background: linear-gradient(135deg, #39d6c5, #4d8dff);
  border-color: transparent;
  color: #071017;
  font-weight: 700;
}

.button-final:hover {
  filter: brightness(1.1);
}

.button-final.is-disabled,
.button-final:disabled {
  cursor: not-allowed;
  filter: none;
  opacity: 0.55;
}

.admin-homologacao-final-state {
  color: #6de0bd;
  font-weight: 700;
}

.admin-homologacao-final-hint {
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 500;
}

.admin-homologacao-password-label {
  display: grid;
  gap: 7px;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.admin-homologacao-password-label input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  background: var(--bg-main);
  color: var(--text-main);
  font: inherit;
  letter-spacing: normal;
  text-transform: none;
}

.admin-homologacao-item-heading,
.admin-homologacao-item-heading > div {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-homologacao-item-heading {
  justify-content: space-between;
}

.admin-homologacao-company-heading-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.admin-homologacao-status-control {
  display: grid;
  gap: 5px;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.admin-homologacao-status-control select {
  min-width: 220px;
  border: 1px solid var(--border-focus);
  border-radius: 7px;
  padding: 9px 30px 9px 10px;
  background: var(--bg-main);
  color: var(--text-main);
  font: inherit;
  font-size: 0.78rem;
  letter-spacing: normal;
  text-transform: none;
}

.admin-homologacao-item-heading strong {
  font-size: 1.05rem;
}

.admin-homologacao-data-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.admin-homologacao-data-grid span,
.admin-homologacao-document > div:first-child {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.admin-homologacao-data-grid b,
.admin-homologacao-document b {
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.admin-homologacao-document strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-yellow {
  background: rgba(245, 180, 52, 0.14);
  border-color: rgba(245, 180, 52, 0.35);
  color: #f5c45f;
}

.admin-homologacao-dialog {
  width: min(520px, calc(100vw - 32px));
  border: 1px solid var(--border-focus);
  border-radius: 12px;
  padding: 26px;
  background: var(--bg-surface-elevated);
  color: var(--text-main);
  box-shadow: var(--shadow-card);
}

.admin-homologacao-dialog::backdrop {
  background: rgba(0, 0, 0, 0.72);
}

.admin-homologacao-dialog form {
  display: grid;
  gap: 14px;
}

.admin-homologacao-dialog h2 {
  margin: 0;
}

.admin-homologacao-dialog p {
  margin: 0;
  color: var(--text-muted);
}

.admin-homologacao-dialog textarea {
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  background: var(--bg-main);
  color: var(--text-main);
  font: inherit;
}

@media (max-width: 760px) {
  .admin-homologacao-kpis,
  .admin-homologacao-data-grid {
    grid-template-columns: 1fr;
  }

  .admin-homologacao-tabs {
    display: grid;
    width: 100%;
  }

  .admin-homologacao-document {
    grid-template-columns: 1fr;
  }

  .admin-homologacao-document {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-homologacao-company-heading-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-homologacao-status-control select {
    width: 100%;
  }

  .admin-homologacao-document-list > .admin-homologacao-document {
    grid-template-columns: 1fr;
  }

  .admin-homologacao-actions {
    justify-content: flex-start;
  }
}
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/admin.js

```javascript
/**
 * Sistema de Acesso Restrito e Dashboard Administrativo
 * - Validação por permissão de perfil (tipo = 'admin')
 * - Gestão de Eventos (com suporte ao Artista), Usuários, Ingressos e Auditoria
 */

class AdminAccessControl {
  constructor() {
    this.sessionKey = 'adminToken';
    this.init();
  }

  async init() {
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    
    if (!user || !user.email) {
      console.warn('[admin] Nenhum usuário autenticado detectado. Redirecionando para login.');
      window.location.href = '../auth/login.html';
      return;
    }

    try {
      const res = await fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();

      if (!res.ok || !data.ok || !data.user || data.user.tipo !== 'admin') {
        console.error('[admin] Acesso negado: usuário não possui privilégios de administrador.');
        this.showAccessDenied();
        return;
      }

      console.log('[admin] Usuário administrador autenticado com sucesso.');
      this.showAdminPanel();

      if (window.adminPanel) {
        window.adminPanel.loadDashboardData();
      }
    } catch (err) {
      console.error('[admin] Erro ao validar permissão no servidor:', err);
      this.showAccessDenied();
    }
  }

  cancelHomologacaoStatusChange() {
    const pending = this.pendingFinalHomologation;
    if (pending?.select) pending.select.value = pending.previousStatus;
    document.getElementById('admin-homologacao-final-dialog')?.close();
    this.pendingFinalHomologation = null;
  }

  showAdminPanel() {
    const accessCheck = document.getElementById('access-check');
    const adminPanel = document.getElementById('admin-panel');
    const adminContent = document.getElementById('admin-content');

    if (accessCheck) {
      accessCheck.style.display = 'none';
      accessCheck.remove();
    }
    if (adminPanel) adminPanel.style.display = 'block';
    if (adminContent) adminContent.style.display = 'block';
  }

  showAccessDenied() {
    const accessCheck = document.getElementById('access-check');
    const adminPanel = document.getElementById('admin-panel');
    const adminContent = document.getElementById('admin-content');

    if (accessCheck) accessCheck.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
    if (adminContent) adminContent.style.display = 'none';
    
    sessionStorage.removeItem(this.sessionKey);
  }
}

class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.editingEventId = null;
    this.homologacaoDocuments = [];
    this.homologacaoFilter = 'pending';
    this.pendingHomologacaoRejection = null;
    this.pendingFinalHomologation = null;
    this.resaleQueues = [];
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.setupLogout();
    this.setupDraggableModal();
    const authorizeForm = document.getElementById('authorize-pj-form');
    if (authorizeForm) {
      authorizeForm.addEventListener('submit', event => this.authorizePj(event));
    }
    document.getElementById('admin-homologacao-list')?.addEventListener('click', event => this.handleHomologacaoAction(event));
    document.getElementById('admin-homologacao-list')?.addEventListener('change', event => this.handleHomologacaoAction(event));
    document.querySelectorAll('[data-homologacao-filter]').forEach(button => {
      button.addEventListener('click', () => {
        this.homologacaoFilter = button.dataset.homologacaoFilter;
        document.querySelectorAll('[data-homologacao-filter]').forEach(item => item.classList.toggle('is-active', item === button));
        this.renderHomologacao();
      });
    });
    document.getElementById('admin-homologacao-rejection-form')?.addEventListener('submit', event => this.submitHomologacaoRejection(event));
    document.getElementById('admin-homologacao-final-form')?.addEventListener('submit', event => this.submitFinalHomologation(event));
    document.querySelectorAll('[data-close-homologacao-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById('admin-homologacao-rejection-dialog')?.close()));
    document.querySelectorAll('[data-close-final-dialog]').forEach(button => button.addEventListener('click', () => this.cancelHomologacaoStatusChange()));
    document.getElementById('admin-homologacao-final-dialog')?.addEventListener('cancel', () => this.cancelHomologacaoStatusChange());
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Compatibilidade com os links href do HTML (ex: #section-dashboard ou #dashboard)
        const href = btn.getAttribute('href');
        let section = btn.dataset.section;

        if (!section && href) {
          section = href.replace('#', '');
          if (section.startsWith('section-')) {
            section = section.replace('section-', '');
          }
        }

        if (section) this.switchSection(section);
      });
    });
  }

  switchSection(section) {
    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.remove('active');
      sec.style.display = 'none';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const sectionElement = document.getElementById(`section-${section}`) || document.getElementById(section);
    if (sectionElement) {
      sectionElement.classList.add('active');
      sectionElement.style.display = 'block';
    }

    const activeBtn = document.querySelector(`.nav-btn[data-section="${section}"]`) || 
                      document.querySelector(`.nav-btn[href="#section-${section}"]`) || 
                      document.querySelector(`.nav-btn[href="#${section}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    this.currentSection = section;
    this.loadSectionData(section);
  }

  loadSectionData(section) {
    switch (section) {
      case 'usuarios':
        this.loadUsersData();
        break;
      case 'eventos':
        this.loadEventsData();
        break;
      case 'ingressos':
        this.loadTicketsData();
        break;
      case 'filas-revenda':
        this.loadResaleQueuesData();
        break;
      case 'relatorios':
        this.loadReportsData();
        break;
      case 'bilheteria':
        this.loadBilheteriaData();
        break;
      case 'auditoria':
        this.loadAuditData();
        break;
      case 'homologacao':
        this.loadHomologacaoData();
        break;
      default:
        this.loadDashboardData();
        break;
    }
  }

  async loadResaleQueuesData() {
      const container = document.getElementById('resale-queues-container');
      if (!container) return;
      try {
        const response = await fetch('/api/admin/revenda-filas');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Não foi possível carregar as filas.');
        this.resaleQueues = data.queues || [];
        this.populateResaleQueueFilters(this.resaleQueues);
        this.renderResaleQueues(this.resaleQueues);
      } catch (error) {
        container.innerHTML = `<div class="empty-state">${error.message}</div>`;
      }
  }

  populateResaleQueueFilters(queues) {
      const values = {
        event: [...new Set(queues.map(queue => queue.evento).filter(Boolean))].sort(),
        sector: [...new Set(queues.map(queue => queue.setor_nome).filter(Boolean))].sort(),
        category: [...new Set(queues.map(queue => queue.categoria_ingresso).filter(Boolean))].sort()
      };
      [['event', values.event], ['sector', values.sector], ['category', values.category]].forEach(([name, options]) => {
        const select = document.getElementById(`resale-filter-${name}`);
        if (!select) return;
        const current = select.value;
        select.innerHTML = `<option value="">${name === 'event' ? 'Todos os eventos' : name === 'sector' ? 'Todos os setores' : 'Todas as modalidades'}</option>${options.map(value => `<option value="${this.escapeHtml(value)}">${this.escapeHtml(value)}</option>`).join('')}`;
        if (options.includes(current)) select.value = current;
        select.onchange = () => this.filterResaleQueues();
      });
  }

  filterResaleQueues() {
      const event = document.getElementById('resale-filter-event')?.value || '';
      const sector = document.getElementById('resale-filter-sector')?.value || '';
      const category = document.getElementById('resale-filter-category')?.value || '';
      this.renderResaleQueues(this.resaleQueues.filter(queue =>
        (!event || queue.evento === event)
        && (!sector || (queue.setor_nome || '') === sector)
        && (!category || (queue.categoria_ingresso || '') === category)
      ));
  }

  renderResaleQueues(queues) {
      const container = document.getElementById('resale-queues-container');
      if (!container) return;
      if (!queues.length) {
        container.innerHTML = '<div class="empty-state">Nenhum ingresso foi anunciado na revenda.</div>';
        return;
      }
      container.innerHTML = queues.map(queue => `
        <article class="resale-queue-card">
          <div class="resale-queue-heading">
            <div><span class="queue-label">Fila de revenda</span><h3>${queue.evento || 'Evento'} · ${queue.setor_nome || 'Setor geral'}</h3><p>${queue.categoria_ingresso || 'Modalidade não identificada'}</p></div>
            <strong>${queue.total_fila} anúncio${Number(queue.total_fila) === 1 ? '' : 's'}</strong>
          </div>
          <div class="table-container"><table class="data-table"><thead><tr><th>Posição</th><th>Ingresso</th><th>Pedido</th><th>Vendedor</th><th>Prioridade</th><th>Lote / vendedor</th><th>Lote vigente / comprador</th><th>Status</th></tr></thead><tbody>
            ${queue.items.map(item => `<tr><td>${item.posicao}º de ${item.total_fila}</td><td>${item.numero_ingresso || 'N/A'}</td><td>${item.codigo_pedido || 'N/A'}</td><td>${item.vendedor_nome || 'N/A'}</td><td>${item.taxa_nome} · ${item.taxa_percentual}%</td><td>${this.formatCurrency(item.preco_original)}<small class="queue-price-detail">${this.escapeHtml(item.lote_original || 'Lote original')} · líquido: ${this.formatCurrency(item.valor_liquido_estimado)}</small></td><td>${this.formatCurrency(item.preco_vigente)}<small class="queue-price-detail">${this.escapeHtml(item.lote_vigente || item.lote_original || 'Lote original')}</small></td><td><span class="status-badge status-disponivel">Na fila</span></td></tr>`).join('')}
          </tbody></table></div>
        </article>
      `).join('');
  }

  adminAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    return user?.session_token ? { Authorization: 'Bearer ' + user.session_token } : {};
  }

  async loadHomologacaoData() {
    const list = document.getElementById('admin-homologacao-list');
    if (!list) return;
    try {
      const response = await fetch('/api/organizador/fornecedor-documentos', { headers: this.adminAuthHeaders() });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
      this.homologacaoDocuments = data.documents || [];
      this.renderHomologacao();
    } catch (error) {
      console.error('[admin] Erro ao carregar homologação:', error);
      list.innerHTML = `<p class="empty-state">${this.escapeHtml(error.message)}</p>`;
    }
  }

  homologacaoCompanyStatus(item) {
    const items = Array.isArray(item) ? item : [item];
    const companyStatus = this.normalizeStatus(items[0]?.empresa_status);
    const documentStatuses = items.map(document => this.normalizeStatus(document.status));
    if (companyStatus === 'homologado') return 'approved';
    if (companyStatus === 'recusado' || documentStatuses.includes('recusado')) return 'rejected';
    return 'pending';
  }

  renderHomologacao() {
    const list = document.getElementById('admin-homologacao-list');
    if (!list) return;
    const companies = new Map();
    this.homologacaoDocuments.forEach(item => {
      const key = item.empresa_id || item.fornecedor_usuario_id;
      if (!companies.has(key)) companies.set(key, this.homologacaoCompanyStatus(item));
    });
    const counts = { pending: 0, approved: 0, rejected: 0 };
    companies.forEach(status => counts[status] += 1);
    ['pending', 'approved', 'rejected'].forEach(status => {
      const element = document.getElementById(`admin-homologacao-${status}`);
      if (element) element.textContent = counts[status];
    });
    const groupedCompanies = new Map();
    this.homologacaoDocuments.forEach(item => {
      const key = item.empresa_id || `fornecedor-${item.fornecedor_usuario_id}`;
      if (!groupedCompanies.has(key)) groupedCompanies.set(key, []);
      groupedCompanies.get(key).push(item);
    });
    const filteredCompanies = [...groupedCompanies.values()].filter(items => this.homologacaoCompanyStatus(items) === this.homologacaoFilter);
    list.innerHTML = filteredCompanies.length ? filteredCompanies.map(items => this.renderHomologacaoCard(items)).join('') : '<p class="empty-state">Nenhuma empresa nesta categoria.</p>';
  }

  renderHomologacaoCard(items) {
    const item = items[0];
    const status = this.homologacaoCompanyStatus(items);
    const label = status === 'approved' ? 'Homologado' : status === 'rejected' ? 'Recusado' : 'Pendente';
    const badge = status === 'approved' ? 'badge-green' : status === 'rejected' ? 'badge-red' : 'badge-yellow';
    const documentsMarkup = items.map(document => this.renderHomologacaoDocument(document)).join('');
    const companyStatus = status === 'approved' ? 'homologado' : status === 'rejected' ? 'recusado' : 'em analise';
    const statusSelect = item.empresa_id
        ? `<label class="admin-homologacao-status-control">Status da empresa<select data-admin-company-status="${this.escapeHtml(item.empresa_id)}" data-admin-company-name="${this.escapeHtml(item.razao_social || 'Empresa')}" data-previous-status="${this.escapeHtml(companyStatus)}">
            <option value="em análise"${companyStatus === 'em analise' ? ' selected' : ''}>Pendente de Análise</option>
            <option value="homologado"${companyStatus === 'homologado' ? ' selected' : ''}>Homologado Ativo</option>
            <option value="recusado"${companyStatus === 'recusado' ? ' selected' : ''}>Recusado / Com Pendências</option>
          </select></label>`
        : '<span class="admin-homologacao-final-hint">Empresa sem identificador para alteração de status.</span>';
    return `<article class="admin-homologacao-item">
        <div class="admin-homologacao-company">
          <div class="admin-homologacao-item-heading"><div><strong>${this.escapeHtml(item.razao_social || 'Empresa não identificada')}</strong><span class="badge ${badge}">${label}</span></div><div class="admin-homologacao-company-heading-actions">${statusSelect}<small>${this.escapeHtml(item.fornecedor_nome || 'Fornecedor')}</small></div></div>
          <div class="admin-homologacao-data-grid"><span><b>CNPJ</b>${this.escapeHtml(item.cnpj || 'Não informado')}</span><span><b>Categoria</b>${this.escapeHtml(item.categoria || 'Não informada')}</span><span><b>E-mail</b>${this.escapeHtml(item.email_comercial || item.email || 'Não informado')}</span></div>
        </div>
        <div class="admin-homologacao-documents">
          <div class="admin-homologacao-documents-heading"><b>Documentos enviados (${items.length})</b></div>
          <div class="admin-homologacao-document-list">${documentsMarkup}</div>
        </div>
    </article>`;
  }

  renderHomologacaoDocument(item) {
    const documentStatus = this.normalizeStatus(item.status);
    const fileUrl = item.file_url || item.caminho || '';
    const fileName = item.nome_arquivo || item.nome || 'Documento sem nome';
    const date = item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : 'Data não informada';
    const documentLabel = documentStatus === 'aprovado' ? 'Aprovado' : documentStatus === 'recusado' ? 'Recusado' : 'Pendente';
    const documentBadge = documentStatus === 'aprovado' ? 'badge-green' : documentStatus === 'recusado' ? 'badge-red' : 'badge-yellow';
    return `<div class="admin-homologacao-document">
      <div><strong>${this.escapeHtml(fileName)}</strong><small>${this.escapeHtml(item.nome || 'Categoria não informada')} · Enviado em ${date}</small>${documentStatus === 'recusado' && item.motivo_recusa ? `<small class="homologacao-reason">${this.escapeHtml(item.motivo_recusa)}</small>` : ''}</div>
      <div class="admin-homologacao-document-status"><span class="badge ${documentBadge}">${documentLabel}</span></div>
      <div class="admin-homologacao-actions">${fileUrl ? `<a class="button button-secondary" href="${this.escapeHtml(fileUrl)}" target="_blank" rel="noopener noreferrer">Abrir arquivo</a>` : '<span class="empty-state">Arquivo indisponível</span>'}
      ${documentStatus !== 'aprovado' ? `<button type="button" class="button button-primary" data-admin-review-document="${this.escapeHtml(item.id)}" data-admin-review-status="aprovado">Aprovar documento</button>` : ''}
      ${documentStatus !== 'recusado' ? `<button type="button" class="button button-danger" data-admin-review-document="${this.escapeHtml(item.id)}" data-admin-review-status="recusado">Recusar</button>` : ''}</div>
    </div>`;
  }

  normalizeStatus(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  async handleHomologacaoAction(event) {
      const statusSelect = event.target.closest('[data-admin-company-status]');
      if (statusSelect) {
        if (event.type !== 'change') return;
        const previousStatus = statusSelect.dataset.previousStatus || statusSelect.dataset.currentStatus || statusSelect.value;
        this.pendingFinalHomologation = { select: statusSelect, previousStatus };
        const companyName = document.getElementById('admin-homologacao-final-company');
        if (companyName) companyName.textContent = `Confirme a alteração de status de ${statusSelect.dataset.adminCompanyName}. A senha de login é obrigatória para gravar esta mudança.`;
        const password = document.getElementById('admin-homologacao-final-password');
        if (password) password.value = '';
        const title = document.querySelector('#admin-homologacao-final-dialog h2');
        if (title) title.textContent = 'Alterar status da empresa';
        const submit = document.querySelector('#admin-homologacao-final-form button[type="submit"]');
        if (submit) submit.textContent = 'Confirmar alteração';
        const dialog = document.getElementById('admin-homologacao-final-dialog');
        if (dialog && !dialog.open) dialog.showModal();
        return;
      }
      const documentButton = event.target.closest('[data-admin-review-document]');
      if (!documentButton) return;
      if (documentButton.dataset.adminReviewStatus === 'recusado') {
        this.pendingHomologacaoRejection = documentButton;
        document.getElementById('admin-homologacao-reason').value = '';
        document.getElementById('admin-homologacao-rejection-dialog')?.showModal();
        return;
      }
      await this.reviewHomologacaoDocument(documentButton, '');
  }

  async submitHomologacaoRejection(event) {
      event.preventDefault();
      const reason = document.getElementById('admin-homologacao-reason')?.value.trim();
      if (!reason || !this.pendingHomologacaoRejection) return;
      document.getElementById('admin-homologacao-rejection-dialog')?.close();
      await this.reviewHomologacaoDocument(this.pendingHomologacaoRejection, reason);
      this.pendingHomologacaoRejection = null;
  }

  async submitFinalHomologation(event) {
      event.preventDefault();
      const pending = this.pendingFinalHomologation;
      const select = pending?.select;
      const password = document.getElementById('admin-homologacao-final-password')?.value || '';
      if (!select || !password.trim()) return;
      const companyId = select.dataset.adminCompanyStatus;
      if (!companyId) {
        window.alert('Esta empresa não possui um identificador válido para homologação.');
        return;
      }
      const submit = event.target.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Salvando...';
      }
      try {
        const response = await fetch(`/api/organizador/fornecedor-empresas/${companyId}/homologacao`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...this.adminAuthHeaders() },
          body: JSON.stringify({ status: select.value, password })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
        document.getElementById('admin-homologacao-final-dialog')?.close();
        await this.loadHomologacaoData();
      } catch (error) {
        console.error('[admin] Erro na homologação definitiva:', error);
        window.alert(error.message);
        select.value = pending.previousStatus;
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Confirmar alteração';
        }
        if (this.pendingFinalHomologation === pending) this.pendingFinalHomologation = null;
      }
  }

  async reviewHomologacaoDocument(documentButton, reason) {
      const password = window.prompt('Digite sua senha de login para confirmar esta ação:');
      if (!password) return;
      documentButton.disabled = true;
      const originalLabel = documentButton.textContent;
      documentButton.textContent = documentButton.dataset.adminReviewStatus === 'aprovado' ? 'Aprovando...' : 'Recusando...';
      try {
          const response = await fetch(`/api/organizador/fornecedor-documentos/${documentButton.dataset.adminReviewDocument}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...this.adminAuthHeaders() },
            body: JSON.stringify({ status: documentButton.dataset.adminReviewStatus, motivo_recusa: reason, password })
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
        await this.loadHomologacaoData();
      } catch (error) {
        console.error('[admin] Erro na homologação:', error);
        window.alert(error.message);
        documentButton.disabled = false;
        documentButton.textContent = originalLabel;
      }
  }

  escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  setupEventListeners() {
    const newEventBtn = document.getElementById('new-event-btn');
    if (newEventBtn) {
      newEventBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openEventModal(false);
      });
    }

    // Botões de fechar e cancelar do modal
    const modalCloseElements = document.querySelectorAll('.modal-close, #modal-cancel');
    modalCloseElements.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeEventModal();
      });
    });

    const eventForm = document.getElementById('event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', (e) => this.saveEvent(e));
    }

    // Leitura da imagem como Base64
    const filePicker = document.getElementById('event-file-picker');
    if (filePicker) {
      filePicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewBox = document.getElementById('event-img-preview-box');
        const previewImg = document.getElementById('event-img-preview');
        const statusTxt = document.getElementById('event-img-status');
        const hiddenInput = document.getElementById('event-imagem');

        if (statusTxt) statusTxt.textContent = 'Carregando imagem...';
        if (previewBox) previewBox.style.display = 'flex';

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result;
          if (hiddenInput) hiddenInput.value = base64String;
          if (previewImg) previewImg.src = base64String;
          if (statusTxt) statusTxt.textContent = `Pronto: ${file.name}`;
        };
        reader.onerror = () => {
          if (statusTxt) statusTxt.textContent = 'Erro ao ler arquivo.';
        };
        reader.readAsDataURL(file);
      });
    }

    const userSearch = document.getElementById('user-search');
    if (userSearch) {
      userSearch.addEventListener('input', (e) => this.filterUsers(e.target.value));
    }

    const userFilterTrigger = document.getElementById('user-filter-trigger');
    const userFilterPanel = document.getElementById('user-filter-panel');
    if (userFilterTrigger && userFilterPanel) {
      userFilterTrigger.addEventListener('click', () => {
        const isOpen = !userFilterPanel.hidden;
        userFilterPanel.hidden = isOpen;
        userFilterTrigger.setAttribute('aria-expanded', String(!isOpen));
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.user-filter-menu')) {
          userFilterPanel.hidden = true;
          userFilterTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    document.getElementById('user-filter-apply')?.addEventListener('click', () => {
      this.applyUserFilters();
      userFilterPanel.hidden = true;
      userFilterTrigger.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('user-filter-clear')?.addEventListener('click', () => {
      document.querySelectorAll('#user-filter-panel input, #user-filter-panel select').forEach(field => { field.value = ''; });
      this.applyUserFilters();
    });

    document.getElementById('audit-actor')?.addEventListener('input', () => this.loadAuditData());
    document.getElementById('audit-type')?.addEventListener('change', () => this.loadAuditData());
    document.getElementById('user-history-search')?.addEventListener('click', () => this.searchUserHistory());

    const filterTrigger = document.getElementById('ticket-filter-trigger');
    const filterPanel = document.getElementById('ticket-filter-panel');
    if (filterTrigger && filterPanel) {
      filterTrigger.addEventListener('click', () => {
        const isOpen = !filterPanel.hidden;
        filterPanel.hidden = isOpen;
        filterTrigger.setAttribute('aria-expanded', String(!isOpen));
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.ticket-filter-menu')) {
          filterPanel.hidden = true;
          filterTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    document.getElementById('filter-apply')?.addEventListener('click', () => {
      this.applyTicketFilters();
      if (filterPanel) filterPanel.hidden = true;
      if (filterTrigger) filterTrigger.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('filter-clear')?.addEventListener('click', () => {
      document.querySelectorAll('#ticket-filter-panel input, #ticket-filter-panel select').forEach(field => { field.value = ''; });
      this.applyTicketFilters();
    });
  }

  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn') || document.querySelector('.admin-header button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      sessionStorage.removeItem('adminToken');
      window.location.href = '/index.html';
    }
  }

  // ===== DASHBOARD =====

  loadDashboardData() {
    this.loadChartEvents();

    this.fetchActivityLog()
      .then(activities => this.updateActivityList(activities))
      .catch(error => console.error('Erro ao carregar atividades:', error));

    this.fetchFeaturedEvents()
      .then(events => this.updateFeaturedEvents(events))
      .catch(error => console.error('Erro ao carregar eventos:', error));
  }

  async loadChartEvents() {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      const select = document.getElementById('gmv-event');
      if (!select) return;
      select.innerHTML = '<option value="">Selecione um evento</option>' + (data.events || [])
        .filter(event => event.status === 'publicado' || event.status === 'encerrado')
        .map(event => `<option value="${event.id}">${event.name || event.nome}</option>`).join('');
      select.addEventListener('change', () => this.refreshCharts());
      document.getElementById('gmv-period')?.addEventListener('change', () => this.refreshCharts());
      document.getElementById('trend-period')?.addEventListener('change', () => this.refreshCharts());
      document.getElementById('revenue-period')?.addEventListener('change', () => this.refreshCharts());
      document.getElementById('revenue-type')?.addEventListener('change', () => this.refreshCharts());
      this.refreshCharts();
    } catch (error) {
      console.error('Erro ao carregar eventos dos gráficos:', error);
    }
  }

  refreshCharts() {
    const eventId = document.getElementById('gmv-event')?.value || '';
    const gmvPeriod = document.getElementById('gmv-period')?.value || 'daily';
    const trendPeriod = document.getElementById('trend-period')?.value || 'daily';
    const revenuePeriod = document.getElementById('revenue-period')?.value || 'daily';
    const revenueType = document.getElementById('revenue-type')?.value || 'tickets';
    this.fetchStats(eventId, gmvPeriod, trendPeriod, revenuePeriod, revenueType).then(stats => {
      this.updateStats(stats);
      this.renderBarChart(stats.gmvSeries || [], eventId);
      this.renderLineChart(stats.trendSeries || []);
    });
  }

  async fetchStats(eventId = '', gmvPeriod = 'daily', trendPeriod = 'daily', revenuePeriod = 'daily', revenueType = 'tickets') {
    try {
      const query = new URLSearchParams({ gmv_period: gmvPeriod, trend_period: trendPeriod, revenue_period: revenuePeriod, revenue_type: revenueType });
      if (eventId) query.set('event_id', eventId);
      const response = await fetch(`/api/admin/stats?${query}`);
      const data = await response.json();
      if (!response.ok || data.ok !== true) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data.stats || { totalUsers: 0, totalTickets: 0, totalEvents: 0, totalRevenue: 0 };
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
      return { totalUsers: 0, totalTickets: 0, totalEvents: 0, totalRevenue: 0 };
    }
  }

  updateStats(stats) {
    const elUsers = document.getElementById('total-users');
    const elTickets = document.getElementById('total-tickets');
    const elEvents = document.getElementById('total-events');
    const elRevenue = document.getElementById('total-revenue');

    if (elUsers) elUsers.textContent = stats.totalUsers ?? '0';
    if (elTickets) elTickets.textContent = stats.totalTickets ?? '0';
    if (elEvents) elEvents.textContent = stats.totalEvents ?? '0';
    if (elRevenue) elRevenue.textContent = this.formatCurrency(stats.totalRevenue || 0);
    const revenueLabel = document.querySelector('#total-revenue')?.closest('.stat-info')?.querySelector('.stat-label');
    const revenueType = document.getElementById('revenue-type')?.value || 'tickets';
    if (revenueLabel) revenueLabel.textContent = {
      general: 'Receita · geral',
      tickets: 'Receita · ingressos',
      administration: 'Receita · taxas de administração',
      priority: 'Receita · taxas de prioridade'
    }[revenueType] || 'Receita total';
    const cancellations = document.getElementById('pending-cancellations');
    if (cancellations) cancellations.textContent = stats.pendingCancellations ?? 0;
  }

  renderBarChart(series, eventId) {
    const chart = document.getElementById('gmv-chart');
    if (!chart || !eventId) { if (chart) chart.innerHTML = '<span>Selecione um evento para visualizar o GMV.</span>'; return; }
    const max = Math.max(...series.map(point => Number(point.value)), 1);
    chart.innerHTML = series.length ? series.map(point => `<div class="bar-column" title="${point.label}: ${this.formatCurrency(point.value)}"><strong>${this.formatCurrency(point.value)}</strong><i style="height:${Math.max(4, (point.value / max) * 100)}%"></i><small>${point.label}</small></div>`).join('') : '<span>Nenhuma venda no período.</span>';
  }

  renderLineChart(series) {
    const chart = document.getElementById('trend-chart');
    if (!chart || !series.length) { if (chart) chart.innerHTML = '<span>Sem dados suficientes.</span>'; return; }
    const width = 700;
    const height = 210;
    const max = Math.max(...series.map(point => Number(point.value)), 1);
    const points = series.map((point, index) => `${(index / Math.max(series.length - 1, 1)) * width},${height - (Number(point.value) / max) * 170 - 20}`).join(' ');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Tendência geral de vendas"><polyline points="${points}" fill="none" stroke="var(--accent-cyan)" stroke-width="3" />${series.map((point, index) => `<text x="${(index / Math.max(series.length - 1, 1)) * width}" y="205" text-anchor="middle">${point.label}</text>`).join('')}</svg>`;
  }

  async fetchActivityLog() {
    try {
      const response = await fetch('/api/admin/activity-log?limit=5');
      const data = await response.json();
      return data.activities || [];
    } catch (error) {
      return [];
    }
  }

  updateActivityList(activities) {
    const listContainer = document.getElementById('activity-list');
    if (!listContainer) return;

    if (activities.length === 0) {
      listContainer.innerHTML = '<p class="empty-state">Nenhuma atividade registrada</p>';
      return;
    }

    listContainer.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <strong>${this.repairAuditText(activity.actorName || 'Sistema')} (${this.translateUserType(activity.actorType || 'sistema')})</strong><br>
        <span>${this.formatAuditDescription(activity.description, activity.action, activity.itemType, activity.itemId)}</span><br>
        <small>${this.translateAuditItem(activity.itemType, activity.itemId)} · ${this.formatDateTime(activity.timestamp || activity.createdAt)}</small>
      </div>
    `).join('');
  }

  repairAuditText(value) {
    let text = String(value || '');
    for (let attempt = 0; attempt < 3; attempt += 1) {
      text = text.replaceAll('ÃƒÂ', 'Ã').replaceAll('Ãƒ', 'Ã');
      if (!/[ÃÂâ€™]/.test(text) || typeof TextDecoder === 'undefined') break;
      const bytes = Uint8Array.from([...text].map(character => character.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      if (decoded === text || decoded.includes('\ufffd')) break;
      text = decoded;
    }
    return text;
  }

  formatAuditDescription(description, action, itemType, itemId) {
    const text = this.repairAuditText(description || '');
    const generic = text.match(/^Ação\s+(GET|POST|PUT|PATCH|DELETE)\s+realizada em (.+)\.?$/i);
    if (!generic) return text || this.formatAuditAction(this.repairAuditText(action));
    const labels = {
      GET: 'Consulta realizada',
      POST: 'Cadastro realizado',
      PUT: 'Atualização realizada',
      PATCH: 'Atualização realizada',
      DELETE: 'Exclusão realizada'
    };
    const item = this.translateAuditItem(itemType, itemId);
    return `${labels[generic[1].toUpperCase()] || 'Atividade registrada'}: ${item}`;
  }

  formatAuditAction(action) {
    return this.repairAuditText(action).replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  translateAuditItem(type, id) {
    const normalizedType = this.repairAuditText(type).toLowerCase();
    const labels = { evento: 'Evento', ingresso: 'Ingresso', usuario: 'Usuário', pedido: 'Pedido', registro: 'Registro', conta: 'Conta' };
    const label = labels[normalizedType] || this.repairAuditText(type) || 'Item';
    return id ? `${label}: ${this.repairAuditText(id)}` : label;
  }

  async fetchFeaturedEvents() {
    try {
      const response = await fetch('/api/admin/featured-events?limit=5');
      const data = await response.json();
      if (!response.ok || data.ok !== true) throw new Error();
      return data.events || [];
    } catch (error) {
      return [];
    }
  }

  updateFeaturedEvents(events) {
    const container = document.getElementById('featured-events');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = '<p class="empty-state">Nenhum evento cadastrado</p>';
      return;
    }

    container.innerHTML = events.map(event => `
      <div class="event-item">
        <div class="event-item-title">${event.name || event.nome || 'Evento sem nome'}</div>
        ${event.artista ? `<div style="font-size: 0.8rem; color: #00d2ff; font-weight: 700;">${event.artista}</div>` : ''}
        <div class="event-item-date">${this.formatDate(event.date || event.data_evento)}</div>
        <div class="event-item-location">${event.location || event.local || 'Local não informado'}</div>
      </div>
    `).join('');
  }

  async loadAuditData() {
    const actor = document.getElementById('audit-actor')?.value || '';
    const type = document.getElementById('audit-type')?.value || '';
    try {
      const response = await fetch(`/api/admin/activity-log?limit=200&actor=${encodeURIComponent(actor)}&type=${encodeURIComponent(type)}`);
      const data = await response.json();
      const body = document.getElementById('audit-table-body');
      if (!body) return;
      body.innerHTML = data.logs?.length ? data.logs.map(log => `<tr><td>${this.repairAuditText(log.actorName || 'Sistema')}</td><td>${this.translateUserType(log.actorType || 'sistema')}</td><td>${this.formatAuditAction(log.action)}</td><td>${this.formatAuditDescription(log.description, log.action, log.itemType, log.itemId)}</td><td>${this.translateAuditItem(log.itemType, log.itemId)}</td><td>${this.formatDateTime(log.timestamp)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">Nenhuma atividade registrada</td></tr>';
    } catch { }
  }

  // ===== USUÁRIOS =====

  async loadUsersData() {
    try {
      const response = await fetch('/api/admin/usuarios');
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
      this.renderUsersTable(data.users || []);
    } catch (error) {
      this.renderUsersTable([]);
    }
  }

  renderUsersTable(users) {
    const tbody = document.getElementById('usuarios-table-body');
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">Nenhum usuário cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.name || user.nome || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.telefone || user.phone || 'N/A'}</td>
        <td>${this.formatDate(user.createdAt || user.criado_em)}</td>
        <td><span class="status-badge status-${user.status || 'ativa'}" data-status="${user.status || 'ativa'}">${this.translateUserStatus(user.status)}</span></td>
        <td>${this.translateUserType(user.tipo)}</td>
        <td class="action-buttons">
          <button class="action-btn action-btn-delete user-access-action" data-user-id="${user.id}" data-user-type="${user.tipo || 'comum'}" data-user-status="${user.status || 'ativa'}">Alterar acesso</button>
          <button class="action-btn action-btn-delete user-delete-action" data-user-id="${user.id}" data-user-name="${user.name || user.nome || 'este usuário'}">Excluir conta</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.user-access-action').forEach(button => {
      button.addEventListener('click', () => this.editUserAccess(
        button.dataset.userId,
        button.dataset.userType,
        button.dataset.userStatus
      ));
    });
    tbody.querySelectorAll('.user-delete-action').forEach(button => {
      button.addEventListener('click', () => this.deleteUser(button.dataset.userId, button.dataset.userName));
    });
  }

  applyUserFilters() {
    const rows = document.querySelectorAll('#usuarios-table-body tr');
    const value = id => document.getElementById(id)?.value.trim().toLowerCase() || '';
    const name = value('filter-user-name');
    const email = value('filter-user-email');
    const phone = value('filter-user-phone');
    const phoneDigits = phone.replace(/\D/g, '');
    const status = value('filter-user-status');
    const type = value('filter-user-type');
    const date = document.getElementById('filter-user-date')?.value || '';

    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      const cells = row.querySelectorAll('td');
      const cell = index => (cells[index]?.textContent || '').trim().toLowerCase();
      const rowDate = cell(3).split('/').reverse().join('-');
      const rowStatus = row.querySelector('.status-badge')?.dataset.status || '';
      const rowPhone = cell(2);
      row.style.display = (!name || cell(0).includes(name)) && (!email || cell(1).includes(email)) &&
        (!phone || (phoneDigits ? rowPhone.replace(/\D/g, '').includes(phoneDigits) : rowPhone.includes(phone))) && (!status || rowStatus === status) &&
        (!type || cell(5) === this.translateUserType(type).toLowerCase()) && (!date || rowDate === date) ? '' : 'none';
    });
  }

  filterUsers(query) {
    const field = document.getElementById('filter-user-name');
    if (field) field.value = query || '';
    this.applyUserFilters();
  }

  async searchUserHistory() {
    const query = document.getElementById('user-history-query')?.value.trim();
    const result = document.getElementById('user-history-result');
    if (!query || !result) return;
    try {
      const response = await fetch(`/api/admin/user-history?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Usuário não encontrado.');
      result.className = 'user-history-result';
      result.innerHTML = `<strong>${data.user.nome}</strong> · ${data.user.email}<br><small>${this.translateUserType(data.user.tipo)} · ${this.translateUserStatus(data.user.status)}</small><hr><b>Compras:</b> ${data.purchases.length} · <b>Ingressos:</b> ${data.tickets.length}<br>${data.purchases.map(p => `<div>Pedido ${p.codigo_pedido} · ${this.formatCurrency(p.valor_total)} ·${this.formatDate(p.criado_em)}</div>`).join('') || '<div>Nenhuma compra registrada.</div>'}`;
    } catch (error) { result.className = 'user-history-result error'; result.textContent = error.message; }
  }

  async editUserAccess(userId, currentType, currentStatus) {
    const type = prompt('Tipo (admin, comum, organizador, fornecedor ou bilheteria):', currentType);
    if (!type) return;
    const status = prompt('Status (ativa ou suspensa):', currentStatus);
    if (!status) return;
    const adminPassword = prompt('Digite sua senha de administrador para confirmar:');
    if (!adminPassword) return;
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: type, status, admin_email: user?.email, admin_password: adminPassword }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível alterar o acesso.');
      this.loadUsersData();
    } catch (error) { alert(error.message); }
  }

  translateUserStatus(status) {
    return { pendente_verificacao: 'Pendente de verificação', ativa: 'Ativa', suspensa: 'Suspensa', excluida: 'Excluída' }[status] || 'Ativa';
  }

  translateUserType(type) {
    return { admin: 'Admin', comum: 'Comum', comprador: 'Comum', organizador: 'Organizador', fornecedor: 'Fornecedor', bilheteria: 'Bilheteria', sistema: 'Sistema', cliente: 'Cliente' }[type] || 'Comum';
  }

  async deleteUser(userId, userName = 'este usuário') {
    if (!confirm(`Excluir a conta de ${userName}? A conta será desativada e não poderá acessar a plataforma.`)) return;
    const adminPassword = prompt('Digite sua senha de administrador para confirmar a exclusão:');
    if (!adminPassword) return;
    const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_email: user?.email, admin_password: adminPassword })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível excluir a conta.');
      alert('Conta excluída com sucesso.');
      this.loadUsersData();
    } catch (error) {
      alert(error.message);
    }
  }

  // ===== EVENTOS (COM ARTISTA) =====

  async loadEventsData() {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      this.renderEventsTable(data.events || []);
    } catch (error) {
      this.renderEventsTable([]);
    }
  }

  renderEventsTable(events) {
    const tbody = document.getElementById('eventos-table-body');
    if (!tbody) return;

    if (events.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8" class="empty-state">Nenhum evento cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = events.map(event => `
      <tr>
        <td><strong>${event.name || event.titulo || 'N/A'}</strong></td>
        <td style="color: #00d2ff; font-weight: 700;">${event.artista || '-'}</td>
        <td>${this.formatDate(event.date || event.data_evento)}</td>
        <td>${event.location || event.local || 'N/A'}</td>
        <td>${this.formatCurrency(event.price)}</td>
        <td><span class="status-badge ${event.destaque ? 'status-active' : 'status-inactive'}">${event.destaque ? 'Sim' : 'Não'}</span></td>
        <td><span class="status-badge status-active">${event.status || 'Ativo'}</span></td>
        <td class="action-buttons">
          <button class="action-btn action-btn-edit" onclick="adminPanel.editEvent('${event.id}')">Editar</button>
          <button class="action-btn action-btn-delete" onclick="adminPanel.deleteEvent('${event.id}')">Deletar</button>
        </td>
      </tr>
    `).join('');
  }

  openEventModal(isEdit = false) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('event-form');
    const previewBox = document.getElementById('event-img-preview-box');
    const filePicker = document.getElementById('event-file-picker');

    if (filePicker) filePicker.value = '';
    if (previewBox) previewBox.style.display = 'none';

    if (!isEdit) {
      this.editingEventId = null;
      if (form) form.reset();
      if (title) title.textContent = 'Novo Evento';
    } else {
      if (title) title.textContent = 'Editar Evento';
    }

    if (modal) {
      modal.classList.remove('closing');
      modal.style.display = 'flex';
      modal.classList.add('open');
    }
  }

  closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      modal.style.display = 'none';
      this.editingEventId = null;
      
      const content = modal.querySelector('.modal-content');
      if (content) {
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.transform = 'translate(-50%, -50%)';
      }
    }, 150);
  }

  async editEvent(eventId) {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      
      if (!response.ok || !data.ok || !data.event) {
        throw new Error(data.message || 'Erro ao carregar dados do evento.');
      }

      const ev = data.event;
      this.editingEventId = eventId;
      this.openEventModal(true);

      const form = document.getElementById('event-form');
      if (form) {
        if (form.elements['nome']) form.elements['nome'].value = ev.name || ev.nome || '';
        if (form.elements['artista']) form.elements['artista'].value = ev.artista || '';
        if (form.elements['local']) form.elements['local'].value = ev.location || ev.local || '';
        if (form.elements['preco']) form.elements['preco'].value = ev.price || ev.ticket_calculado || 0;
        if (form.elements['imagem']) form.elements['imagem'].value = ev.imagem || '';
        if (form.elements['status']) form.elements['status'].value = ev.status || 'publicado';
        if (form.elements['destaque']) form.elements['destaque'].checked = Boolean(ev.destaque);

        const toLocalDateTimeValue = value => {
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return '';
          return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        };
        const eventStart = ev.date || ev.data_evento;
        if (form.elements['data_evento'] && eventStart) {
          form.elements['data_evento'].value = toLocalDateTimeValue(eventStart);
        }
        if (form.elements['data_fim'] && ev.endDate) {
          form.elements['data_fim'].value = toLocalDateTimeValue(ev.endDate);
        }

        if (ev.imagem) {
          const previewBox = document.getElementById('event-img-preview-box');
          const previewImg = document.getElementById('event-img-preview');
          const statusTxt = document.getElementById('event-img-status');
          if (previewBox && previewImg && statusTxt) {
            previewImg.src = ev.imagem;
            statusTxt.textContent = 'Imagem salva configurada';
            previewBox.style.display = 'flex';
          }
        }
      }
    } catch (error) {
      console.error('[admin] Erro ao carregar evento para edição:', error);
      alert(error.message);
    }
  }

  async saveEvent(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
    payload.actor_id = actor?.id;
    payload.actor_name = actor?.nome || actor?.name;
    payload.actor_type = actor?.tipo;

    payload.destaque = form.elements['destaque']?.checked ? 1 : 0;

    const isEdit = Boolean(this.editingEventId);
    const endpoint = isEdit ? `/api/events/${this.editingEventId}` : '/api/events';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao salvar evento.');

      alert(data.message || 'Evento salvo com sucesso!');
      this.closeEventModal();
      this.loadEventsData();
    } catch (error) {
      console.error('[admin] Erro ao salvar evento:', error);
      alert(error.message);
    }
  }

  async deleteEvent(eventId) {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;
    try {
      const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor_id: actor?.id, actor_name: actor?.nome || actor?.name, actor_type: actor?.tipo })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao deletar evento.');
      alert('Evento deletado com sucesso!');
      this.loadEventsData();
    } catch (error) {
      console.error('[admin] Erro ao deletar evento:', error);
      alert(error.message);
    }
  }

  // ===== CONFIGURAR ARRASTAR O MODAL (DRAGGABLE) =====
  setupDraggableModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    const title = content ? content.querySelector('h2') : null;

    if (!content || !title) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    title.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = content.getBoundingClientRect();
      content.style.transform = 'none';
      content.style.top = `${rect.top}px`;
      content.style.left = `${rect.left}px`;

      initialLeft = rect.left;
      initialTop = rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      content.style.left = `${initialLeft + dx}px`;
      content.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  // ===== INGRESSOS =====

  async loadTicketsData() {
    try {
      const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
      const response = await fetch('/api/admin/tickets', {
        headers: actor?.session_token ? { Authorization: `Bearer ${actor.session_token}` } : {}
      });
      const data = await response.json();
      this.renderTicketsTable(data.tickets || []);
    } catch (error) {
      this.renderTicketsTable([]);
    }
  }

  renderTicketsTable(tickets) {
    const tbody = document.getElementById('ingressos-table-body');
    if (!tbody) return;

    this.populateTicketFilterOptions(tickets);

    if (tickets.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8" class="empty-state">Nenhum ingresso registrado</td></tr>';
      return;
    }

    tbody.innerHTML = tickets.map(ticket => `
      <tr>
        <td>${ticket.numero_ingresso || 'N/A'}</td>
        <td>${ticket.codigo_pedido || 'N/A'}</td>
        <td>${ticket.eventName || 'N/A'}</td>
        <td>${ticket.ownerName || 'N/A'}</td>
        <td>${this.formatCurrency(ticket.price)}</td>
        <td><span class="status-badge status-${ticket.status}" data-status="${ticket.status}">${this.translateStatus(ticket.status)}</span></td>
        <td>${this.formatDate(ticket.createdAt)}</td>
        <td class="action-buttons">
          <button class="action-btn action-btn-view" onclick="adminPanel.viewTicket('${ticket.id}')">Ver</button>
          <select class="ticket-status-action" data-ticket-id="${ticket.id}" aria-label="Alterar status do ingresso">
            <option value="">Alterar status</option>
            <option value="cancelado">Cancelado</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.ticket-status-action').forEach(select => {
      select.addEventListener('change', event => {
        this.changeTicketStatus(event.currentTarget.dataset.ticketId, event.currentTarget.value);
      });
    });
  }

  populateTicketFilterOptions(tickets) {
    const options = (id, values, emptyLabel) => {
      const select = document.getElementById(id);
      if (!select) return;
      const selected = select.value;
      const unique = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      select.innerHTML = `<option value="">${emptyLabel}</option>` + unique
        .map(value => `<option value="${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}">${value}</option>`)
        .join('');
      if (unique.includes(selected)) select.value = selected;
    };

    options('filter-event', tickets.map(ticket => ticket.eventName), 'Todos os eventos');
    options('filter-owner', tickets.map(ticket => ticket.ownerName), 'Todos os proprietários');
  }

  applyTicketFilters() {
    const rows = document.querySelectorAll('#ingressos-table-body tr');
    const get = id => document.getElementById(id)?.value.trim().toLowerCase() || '';
    const code = get('filter-ticket-code');
    const order = get('filter-order-code');
    const event = get('filter-event');
    const owner = get('filter-owner');
    const status = get('filter-status');
    const priceValue = document.getElementById('filter-price')?.value;
    const price = priceValue === '' ? null : Number(priceValue);
    const date = document.getElementById('filter-date')?.value || '';

    rows.forEach(row => {
      if (row.classList.contains('empty-row')) return;
      const cells = row.querySelectorAll('td');
      const cell = index => (cells[index]?.textContent || '').trim().toLowerCase();
      const rowPrice = Number(cell(4).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
      const rowDate = cell(6).split('/').reverse().join('-');
      const statusValue = row.querySelector('.status-badge')?.dataset.status || '';
      row.style.display = (!code || cell(0).includes(code)) &&
        (!order || cell(1).includes(order)) &&
        (!event || cell(2).includes(event)) &&
        (!owner || cell(3).includes(owner)) &&
        (!status || statusValue === status) &&
        (price === null || rowPrice === price) &&
        (!date || rowDate === date) ? '' : 'none';
    });
  }

  filterTickets(status) {
    const field = document.getElementById('filter-status');
    if (field) field.value = status || '';
    this.applyTicketFilters();
  }

  async changeTicketStatus(ticketId, status) {
    if (!status) return;
    if (!confirm(`Alterar o ingresso para ${this.translateStatus(status)}?`)) return;
    try {
      const actor = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actor_id: actor?.id, actor_email: actor?.email, actor_name: actor?.nome || actor?.name, actor_type: actor?.tipo })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao alterar status.');
      this.loadTicketsData();
    } catch (error) {
      console.error('[admin] Erro ao alterar status:', error);
      alert(error.message);
    }
  }

  viewTicket(ticketId) {
    alert(`Visualizando ingresso: ${ticketId}`);
  }

  // ===== RELATÓRIOS & BILHETERIA =====

  loadReportsData() {
    console.log('[admin] Seção de relatórios pronta.');
  }

  async loadBilheteriaData() {
    try {
      const response = await fetch('/api/admin/bilheteria');
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error();
      const body = document.getElementById('bilheteria-audit-body');
      if (body) {
        body.innerHTML = data.audit && data.audit.length ? data.audit.map(item => `
          <tr>
            <td>${item.numero_ingresso}</td>
            <td>${item.evento}</td>
            <td>${item.titular}</td>
            <td>${item.status}</td>
            <td>${this.formatDate(item.atualizado_em)}</td>
          </tr>
        `).join('') : '<tr><td colspan="5">Nenhuma auditoria registrada.</td></tr>';
      }
    } catch (error) {
      console.error('[admin] Erro ao carregar bilheteria:', error);
    }
  }

  async authorizePj(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = document.getElementById('authorize-pj-message');
    try {
      const response = await fetch('/api/admin/autorizar-pj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
      if (message) message.textContent = 'Empresa pré-autorizada com sucesso.';
      form.reset();
    } catch (error) {
      console.error('[admin] Erro na pré-autorização:', error);
      if (message) message.textContent = error.message;
    }
  }

  // ===== UTILITÁRIOS =====

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = dateString instanceof Date
      ? dateString
      : new Date(String(dateString).includes('T') ? dateString : `${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = dateString instanceof Date ? dateString : new Date(String(dateString).includes('T') ? dateString : `${dateString.replace(' ', 'T')}Z`);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  translateStatus(status) {
    const statusMap = {
      'active': 'Ativo',
      'sold': 'Vendido',
      'cancelled': 'Cancelado',
      'pending': 'Pendente',
      'inactive': 'Inativo',
      'valido': 'Ativo',
      'ativo': 'Ativo',
      'resgatado': 'Resgatado',
      'expirado': 'Expirado',
      'anunciado': 'Anunciado',
      'reservado': 'Reservado',
      'cancelamento_solicitado': 'Cancelamento solicitado',
      'cancelado': 'Cancelado',
      'bloqueado': 'Bloqueado'
    };
    return statusMap[status] || status;
  }
}

let adminPanel;
let accessControl;

document.addEventListener('DOMContentLoaded', () => {
  adminPanel = new AdminPanel();
  adminPanel.init();
  window.adminPanel = adminPanel;
  accessControl = new AdminAccessControl();
});
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/admin/admin.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../admin.css">
    <script src="../auth-fetch.js"></script>
    <script src="../admin.js" defer></script>
    <title>TrocaTicket | Painel Administrativo</title>
</head>
<body>
    <div id="access-check" style="display: none;">
        <div class="access-denied">
            <h1>Acesso Negado</h1>
            <p>Você não possui autorização para acessar esta página.</p>
        </div>
    </div>

    <div id="admin-panel">
        <header class="admin-header">
            <div class="admin-header-content">
                <h1 class="admin-title">Painel Administrativo</h1>
                <button class="logout-btn" id="logout-btn">Sair</button>
            </div>
        </header>

        <nav class="admin-nav">
          <a href="#dashboard" class="nav-btn active">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8"></rect><rect x="13" y="3" width="8" height="8"></rect><rect x="3" y="13" width="8" height="8"></rect><rect x="13" y="13" width="8" height="8"></rect></svg>
                <span>Dashboard</span>
            </a>
            <a href="#eventos" class="nav-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="1.5"></rect><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"></path></svg>
                <span>Eventos</span>
            </a>
            <a href="#usuarios" class="nav-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"></path></svg>
                <span>Usuários</span>
            </a>
            <a href="#ingressos" class="nav-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h14v9H5z"></path><path d="M8 7.5v9M11 10h5M11 13h3"></path></svg>
                <span>Ingressos</span>
            </a>
            <a href="#filas-revenda" class="nav-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14"></path><circle cx="3" cy="6" r="1"></circle><circle cx="3" cy="12" r="1"></circle><circle cx="3" cy="18" r="1"></circle></svg>
                <span>Filas de revenda</span>
            </a>
            <a href="#relatorios" class="nav-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"></path><path d="M6 14l3-3 3 3 5-7"></path><circle cx="8" cy="10" r="1"></circle></svg>
                <span>Relatórios</span>
            </a>
            <a href="#bilheteria" class="nav-btn">
                <span>Bilheteria</span>
            </a>
            <a href="#auditoria" class="nav-btn">
                <span>Equipe</span>
            </a>
            <a href="#homologacao" class="nav-btn">
                <span>Homologação</span>
            </a>
        </nav>

        <main id="admin-content" class="admin-content">
            <!-- Dashboard Section -->
             <!--#section-not-found -->
            <section id="section-dashboard" class="admin-section active">
                <div class="section-header">
                    <h2>Dashboard</h2>
                    <p class="section-subtitle">Visão geral do sistema</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <span class="stat-label">Usuários Cadastrados</span>
                            <span class="stat-value" id="total-users">0</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎫</div>
                        <div class="stat-info">
                            <span class="stat-label">Total de Ingressos</span>
                            <span class="stat-value" id="total-tickets">0</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-info">
                            <span class="stat-label">Eventos Ativos</span>
                            <span class="stat-value" id="total-events">0</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <span class="stat-label">Receita Total</span>
                            <span class="stat-value" id="total-revenue">R$ 0</span>
                        </div>
                    </div>
                </div>
                <div class="revenue-filters" aria-label="Filtros de receita">
                    <div><strong>Receita exibida</strong><span>Escolha o período e a origem do valor.</span></div>
                    <label>Período<select id="revenue-period"><option value="daily">Últimos 7 dias</option><option value="weekly">Últimas 7 semanas</option><option value="monthly">Últimos 12 meses</option><option value="yearly">Últimos 5 anos</option></select></label>
                    <label>Tipo de receita<select id="revenue-type"><option value="general">Geral</option><option value="tickets">Ingressos</option><option value="administration">Taxas de administração</option><option value="priority">Taxas de prioridade</option></select></label>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Atividade Recente</h3>
                        <div class="activity-list" id="activity-list">
                            <p class="empty-state">Nenhuma atividade registrada</p>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Eventos em Destaque</h3>
                        <div class="featured-events" id="featured-events">
                            <p class="empty-state">Nenhum evento cadastrado</p>
                        </div>
                    </div>
                </div>
                <div class="stats-grid executive-metrics">
                    <div class="stat-card"><div class="stat-icon">🛡️</div><div class="stat-info"><span class="stat-label">Cancelamentos pendentes</span><span class="stat-value" id="pending-cancellations">0</span></div></div>
                </div>
                <div class="dashboard-chart-grid">
                    <div class="dashboard-card chart-card">
                        <div class="chart-heading"><div><h3>GMV por evento</h3><p>Vendas agrupadas por período</p></div><div class="chart-filters"><select id="gmv-event" required><option value="">Selecione um evento</option></select><select id="gmv-period"><option value="daily">Diário</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option></select></div></div>
                        <div id="gmv-chart" class="bar-chart"><span>Selecione um evento para visualizar o GMV.</span></div>
                    </div>
                    <div class="dashboard-card chart-card">
                        <div class="chart-heading"><div><h3>Tendência geral de vendas</h3><p>Todos os eventos do site</p></div><select id="trend-period"><option value="daily">Dia</option><option value="weekly">Semana</option><option value="monthly">Mês</option><option value="yearly">Ano</option></select></div>
                        <div id="trend-chart" class="line-chart"><span>Sem dados suficientes</span></div>
                    </div>
                </div>
            </section>

            <!-- Eventos Section -->
            <section id="section-eventos" class="admin-section">
                <div class="section-header">
                    <h2>Gerenciamento de Eventos</h2>
                    <button class="button button-primary" id="new-event-btn">+ Novo Evento</button>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Evento</th>
                                <th>Artista</th>
                                <th>Data</th>
                                <th>Local</th>
                                <th>Preço</th>
                                <th>Carrossel</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="eventos-table-body">
                            <tr class="empty-row">
                                <td colspan="8" class="empty-state">Nenhum evento cadastrado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="section-auditoria" class="admin-section">
                <div class="section-header">
                    <h2>Atividades Recentes da Equipe</h2>
                    <div class="audit-filters">
                        <input type="search" id="audit-actor" placeholder="Nome do responsável">
                        <select id="audit-type"><option value="">Todos os tipos</option><option value="admin">Admin</option><option value="organizador">Organizador</option><option value="fornecedor">Fornecedor</option><option value="bilheteria">Bilheteria</option><option value="sistema">Sistema</option></select>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table"><thead><tr><th>Responsável</th><th>Tipo</th><th>Ação</th><th>Descrição</th><th>Item afetado</th><th>Data e hora</th></tr></thead><tbody id="audit-table-body"><tr><td colspan="6" class="empty-state">Nenhuma atividade registrada</td></tr></tbody></table>
                </div>
            </section>

            <section id="section-homologacao" class="admin-section">
                <div class="section-header">
                    <div>
                        <h2>Homologação</h2>
                        <p class="section-subtitle">Analise a confiabilidade documental das empresas fornecedoras.</p>
                    </div>
                </div>
                <div class="admin-homologacao-kpis">
                    <article class="stat-card"><div class="stat-icon">◷</div><div class="stat-info"><span class="stat-label">Pendentes de análise</span><span class="stat-value" id="admin-homologacao-pending">0</span></div></article>
                    <article class="stat-card"><div class="stat-icon">✓</div><div class="stat-info"><span class="stat-label">Homologadas ativas</span><span class="stat-value" id="admin-homologacao-approved">0</span></div></article>
                    <article class="stat-card"><div class="stat-icon">!</div><div class="stat-info"><span class="stat-label">Recusadas / pendências</span><span class="stat-value" id="admin-homologacao-rejected">0</span></div></article>
                </div>
                <div class="admin-homologacao-toolbar">
                    <div class="admin-homologacao-tabs" role="tablist" aria-label="Filtrar homologações">
                        <button type="button" class="admin-homologacao-tab is-active" data-homologacao-filter="pending" role="tab">Pendentes de análise</button>
                        <button type="button" class="admin-homologacao-tab" data-homologacao-filter="approved" role="tab">Homologados</button>
                        <button type="button" class="admin-homologacao-tab" data-homologacao-filter="rejected" role="tab">Recusados</button>
                    </div>
                </div>
                <div class="dashboard-card admin-homologacao-card">
                    <div id="admin-homologacao-list" class="admin-homologacao-list">
                        <p class="empty-state">Carregando documentação dos fornecedores...</p>
                    </div>
                </div>
            </section>

            <!-- Usuários Section -->
            <section id="section-usuarios" class="admin-section">
                <div class="section-header">
                    <h2>Gerenciamento de Usuários</h2>
                    <div class="filter-group user-filter-menu">
                        <button type="button" class="filter-trigger" id="user-filter-trigger" aria-expanded="false" aria-controls="user-filter-panel" title="Filtrar usuários">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6.2 7.1v5.4l-3.6 1.8v-7.2L4 5Z"></path></svg>
                            <span>Filtrar</span>
                        </button>
                        <div class="ticket-filter-panel user-filter-panel" id="user-filter-panel" hidden>
                            <div class="ticket-filter-grid">
                                <label>Nome<input type="search" id="filter-user-name" placeholder="Nome do usuário"></label>
                                <label>E-mail<input type="search" id="filter-user-email" placeholder="E-mail"></label>
                                <label>Telefone<input type="search" id="filter-user-phone" placeholder="Telefone"></label>
                                <label>Status<select id="filter-user-status">
                                    <option value="">Todos os status</option>
                                    <option value="pendente_verificacao">Pendente de verificação</option>
                                    <option value="ativa">Ativa</option>
                                    <option value="suspensa">Suspensa</option>
                                    <option value="excluida">Excluída</option>
                                </select></label>
                                <label>Tipo de usuário<select id="filter-user-type">
                                    <option value="">Todos os tipos</option>
                                    <option value="admin">Admin</option>
                                    <option value="comum">Comum</option>
                                    <option value="organizador">Organizador</option>
                                    <option value="fornecedor">Fornecedor</option>
                                    <option value="bilheteria">Bilheteria</option>
                                </select></label>
                                <label>Data de cadastro<input type="date" id="filter-user-date"></label>
                            </div>
                            <div class="ticket-filter-actions">
                                <button type="button" class="filter-clear" id="user-filter-clear">Limpar filtros</button>
                                <button type="button" class="filter-apply" id="user-filter-apply">Aplicar filtros</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Data de Cadastro</th>
                                <th>Status</th>
                                <th>Tipo de Usuário</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="usuarios-table-body">
                            <tr class="empty-row">
                                <td colspan="7" class="empty-state">Nenhum usuário cadastrado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="dashboard-card user-history-card">
                    <h3>Histórico vinculado ao perfil</h3>
                    <div class="user-history-search"><input type="search" id="user-history-query" placeholder="Nome, telefone, e-mail ou CPF"><button type="button" class="filter-apply" id="user-history-search">Pesquisar</button></div>
                    <div id="user-history-result" class="empty-state">Pesquise um usuário para consultar compras, ingressos e transações.</div>
                </div>
            </section>

            <!-- Ingressos Section -->
            <section id="section-ingressos" class="admin-section">
                <div class="section-header">
                    <h2>Gerenciamento de Ingressos</h2>
                    <div class="filter-group ticket-filter-menu">
                        <button type="button" class="filter-trigger" id="ticket-filter-trigger" aria-expanded="false" aria-controls="ticket-filter-panel" title="Filtrar ingressos">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6.2 7.1v5.4l-3.6 1.8v-7.2L4 5Z"></path></svg>
                            <span>Filtrar</span>
                        </button>
                        <div class="ticket-filter-panel" id="ticket-filter-panel" hidden>
                            <div class="ticket-filter-grid">
                                <label>Código do ingresso<input type="search" id="filter-ticket-code" placeholder="TKT-..."></label>
                                <label>Código do pedido<input type="search" id="filter-order-code" placeholder="PED-..."></label>
                                <label>Evento<select id="filter-event"><option value="">Todos os eventos</option></select></label>
                                <label>Proprietário<select id="filter-owner"><option value="">Todos os proprietários</option></select></label>
                                <label>Preço<input type="number" id="filter-price" min="0" step="0.01" placeholder="0,00"></label>
                                <label>Status<select id="filter-status">
                                    <option value="">Todos os status</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="resgatado">Resgatado</option>
                                    <option value="expirado">Expirado</option>
                                    <option value="anunciado">Anunciado</option>
                                    <option value="reservado">Reservado</option>
                                    <option value="cancelamento_solicitado">Cancelamento solicitado</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="bloqueado">Bloqueado</option>
                                </select></label>
                                <label>Data de aquisição<input type="date" id="filter-date"></label>
                            </div>
                            <div class="ticket-filter-actions">
                                <button type="button" class="filter-clear" id="filter-clear">Limpar filtros</button>
                                <button type="button" class="filter-apply" id="filter-apply">Aplicar filtros</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Código do Ingresso</th>
                                <th>Código do Pedido</th>
                                <th>Evento</th>
                                <th>Proprietário</th>
                                <th>Preço</th>
                                <th>Status</th>
                                <th>Data de Aquisição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="ingressos-table-body">
                            <tr class="empty-row">
                                <td colspan="8" class="empty-state">Nenhum ingresso registrado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="section-filas-revenda" class="admin-section">
                <div class="section-header">
                    <h2>Filas de revenda</h2>
                    <p class="section-subtitle">Acompanhe os ingressos anunciados e a posição de cada um</p>
                </div>
                <div class="resale-queue-filters" aria-label="Filtros das filas de revenda">
                    <label>Evento<select id="resale-filter-event"><option value="">Todos os eventos</option></select></label>
                    <label>Setor<select id="resale-filter-sector"><option value="">Todos os setores</option></select></label>
                    <label>Modalidade<select id="resale-filter-category"><option value="">Todas as modalidades</option></select></label>
                </div>
                <div id="resale-queues-container" class="resale-queues-container">
                    <div class="empty-state">Carregando filas de revenda...</div>
                </div>
            </section>

            <!-- Relatórios Section -->
            <section id="section-relatorios" class="admin-section">
                <div class="section-header">
                    <h2>Relatórios e Análises</h2>
                </div>

                <div class="reports-grid">
                    <div class="report-card">
                        <h3>Relatório de Vendas</h3>
                        <p>Análise de ingressos vendidos por período</p>
                        <button class="button button-outline">Gerar Relatório</button>
                    </div>
                    <div class="report-card">
                        <h3>Relatório de Usuários</h3>
                        <p>Crescimento e engajamento de usuários</p>
                        <button class="button button-outline">Gerar Relatório</button>
                    </div>
                    <div class="report-card">
                        <h3>Relatório Financeiro</h3>
                        <p>Fluxo de receita e taxas aplicadas</p>
                        <button class="button button-outline">Gerar Relatório</button>
                    </div>
                    <div class="report-card">
                        <h3>Relatório de Eventos</h3>
                        <p>Desempenho e métricas por evento</p>
                        <button class="button button-outline">Gerar Relatório</button>
                    </div>
                </div>
            </section>

            <section id="section-bilheteria" class="admin-section">
                <div class="section-header"><h2>Bilheteria Matriz</h2><p class="section-subtitle">Auditoria de vouchers e transferências</p></div>
                <form id="authorize-pj-form" class="section-header">
                    <input name="email" type="email" required placeholder="E-mail corporativo">
                    <select name="tipo" required><option value="organizador">Organizador</option><option value="fornecedor">Fornecedor</option><option value="bilheteria">Bilheteria</option></select>
                    <button class="button button-primary" type="submit">Pré-autorizar empresa</button>
                    <span id="authorize-pj-message" class="section-subtitle"></span>
                </form>
                <div class="table-container"><table class="data-table"><thead><tr><th>Ingresso</th><th>Evento</th><th>Titular</th><th>Status</th><th>Atualizado</th></tr></thead><tbody id="bilheteria-audit-body"><tr><td colspan="5">Carregando...</td></tr></tbody></table></div>
            </section>
        </main>
    </div>
    <dialog id="admin-homologacao-rejection-dialog" class="admin-homologacao-dialog">
        <form method="dialog" id="admin-homologacao-rejection-form">
            <button type="button" class="modal-close" data-close-homologacao-dialog aria-label="Fechar">×</button>
            <h2>Justificar recusa</h2>
            <p>Informe o motivo que será registrado para o fornecedor.</p>
            <textarea id="admin-homologacao-reason" required minlength="3" placeholder="Ex.: CNPJ irregular ou documento ilegível."></textarea>
            <div class="modal-actions"><button type="button" class="button button-outline" data-close-homologacao-dialog>Cancelar</button><button type="submit" class="button button-primary">Continuar</button></div>
        </form>
    </dialog>
    <dialog id="admin-homologacao-final-dialog" class="admin-homologacao-dialog">
        <form method="dialog" id="admin-homologacao-final-form">
            <button type="button" class="modal-close" data-close-final-dialog aria-label="Fechar">×</button>
            <h2>Alterar status da empresa</h2>
            <p id="admin-homologacao-final-company">A alteração de status exige a senha de login do administrador.</p>
            <label class="admin-homologacao-password-label" for="admin-homologacao-final-password">Senha de login
                <input id="admin-homologacao-final-password" type="password" autocomplete="current-password" required>
            </label>
            <div class="modal-actions"><button type="button" class="button button-outline" data-close-final-dialog>Cancelar</button><button type="submit" class="button button-primary">Confirmar alteração</button></div>
        </form>
    </dialog>

    <!-- Modal com seletor de arquivo de imagem, toggle do carrossel e campo Artista -->
    <div id="event-modal" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 520px;">
            <button class="modal-close" type="button">✕</button>
            <h2 id="modal-title">Novo Evento</h2>
            <form id="event-form">
                <label>
                    <span>Nome do Evento</span>
                    <input type="text" name="nome" id="event-nome" required placeholder="Ex: Mirante Esperia">
                </label>
                <label style="margin-top: 6px;">
                    <span>Artista / Atração Principal</span>
                    <input type="text" name="artista" id="event-artista" placeholder="Ex: WIU, KayBlack, Ryu, The Runner">
                </label>
                <label style="margin-top: 6px;">
                    <span>Data e Horário</span>
                    <input type="datetime-local" name="data_evento" id="event-data" required>
                </label>
                <label style="margin-top: 6px;">
                    <span>Data e Horário de Encerramento</span>
                    <input type="datetime-local" name="data_fim" id="event-data-end" required>
                </label>
                <label style="margin-top: 6px;">
                    <span>Local</span>
                    <input type="text" name="local" id="event-local" required placeholder="Ex: Parque Anhembi - SP">
                </label>
                <label style="margin-top: 6px;">
                    <span>Preço Base (R$)</span>
                    <input type="number" step="0.01" name="preco" id="event-preco" placeholder="0.00" required>
                </label>

                <!-- SELETOR DE IMAGEM COM PREVIEW -->
                <label style="margin-top: 6px;">
                    <span>Imagem / Pôster do Evento</span>
                    <input type="file" id="event-file-picker" accept="image/*" style="margin-top: 4px; padding: 6px; cursor: pointer; border: 1px dashed var(--primary, #6c5ce7); border-radius: 6px; width: 100%; box-sizing: border-box;">
                    <input type="hidden" name="imagem" id="event-imagem">
                </label>
                <div id="event-img-preview-box" style="display: none; align-items: center; gap: 12px; margin-top: 8px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
                    <img id="event-img-preview" src="" alt="Prévia" style="width: 54px; height: 54px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2);">
                    <span id="event-img-status" style="font-size: 0.82rem; color: #a4a6b0; word-break: break-all;">Imagem carregada</span>
                </div>

                <label style="margin-top: 10px;">
                    <span>Status</span>
                    <select name="status" id="event-status">
                        <option value="publicado">Publicado</option>
                        <option value="rascunho">Rascunho</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </label>

                <label style="display: flex; align-items: center; gap: 10px; margin-top: 12px; cursor: pointer; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px;">
                    <input type="checkbox" name="destaque" id="event-destaque" style="width: 18px; height: 18px; accent-color: var(--primary, #6c5ce7); cursor: pointer;">
                    <span style="font-weight: 600; font-size: 0.9rem;">Incluir este evento no Carrossel da Página Inicial</span>
                </label>

                <div class="modal-actions" style="margin-top: 18px;">
                    <button type="button" class="button button-outline" id="modal-cancel">Cancelar</button>
                    <button type="submit" class="button button-primary" id="modal-submit-btn">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/armazenamento.js

```javascript
const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const root = __dirname;
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

function assertUploadSize(data) {
  if (!data || data.length <= MAX_UPLOAD_BYTES) return;
  const error = new Error('O arquivo deve ter no máximo 4,5 MB.');
  error.statusCode = 413;
  throw error;
}

async function salvarArquivo(pasta, nome, dados, tipo) {
  assertUploadSize(dados);
  const safeFolder = String(pasta).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const safeName = path.basename(String(nome));
  if (!safeFolder || !safeName) throw new Error('Caminho de arquivo inválido.');

  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    const error = new Error('Armazenamento de arquivos não configurado para produção.');
    error.statusCode = 503;
    console.error('[armazenamento] BLOB_READ_WRITE_TOKEN é obrigatório na Vercel.');
    throw error;
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${safeFolder}/${safeName}`, dados, {
      access: 'public',
      contentType: tipo || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false
    });
    return blob.url;
  }

  const directory = path.join(root, 'public', 'uploads', safeFolder);
  try {
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, safeName), dados);
  } catch (error) {
    throw new Error(`Não foi possível salvar o arquivo localmente: ${error.message}`);
  }
  return `/uploads/${safeFolder}/${safeName}`;
}

module.exports = { MAX_UPLOAD_BYTES, salvarArquivo };

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/armazenamento.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

const { salvarArquivo } = require('./armazenamento');

test('produção sem Blob recusa upload sem tentar usar o disco local', async () => {
  const previousVercel = process.env.VERCEL;
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;
  process.env.VERCEL = '1';
  delete process.env.BLOB_READ_WRITE_TOKEN;

  try {
    await assert.rejects(
      salvarArquivo('avatars', 'avatar.png', Buffer.from('mock'), 'image/png'),
      error => error.statusCode === 503
        && error.message === 'Armazenamento de arquivos não configurado para produção.'
    );
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
    if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousToken;
  }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth-fetch.js

```javascript
(function installAuthenticatedFetch() {
  const originalFetch = window.fetch.bind(window);

  function readSessionToken() {
    for (const key of ['trocaticket-user', 'usuario']) {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) continue;
        const user = JSON.parse(stored);
        if (user && typeof user.session_token === 'string' && user.session_token) {
          return user.session_token;
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  function isSameOriginApiRequest(input) {
    const requestUrl = typeof input === 'string' ? input : input && input.url;
    if (!requestUrl) return false;
    try {
      const url = new URL(requestUrl, window.location.href);
      return url.origin === window.location.origin && url.pathname.startsWith('/api/');
    } catch {
      return false;
    }
  }

  window.fetch = function authenticatedFetch(input, init) {
    if (!isSameOriginApiRequest(input)) return originalFetch(input, init);

    const token = readSessionToken();
    if (!token) return originalFetch(input, init);

    const headers = new Headers(
      (init && init.headers) || (typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined)
    );
    if (headers.has('Authorization')) return originalFetch(input, init);

    headers.set('Authorization', `Bearer ${token}`);
    return originalFetch(input, { ...(init || {}), headers });
  };
})();

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth-fetch.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('./auth-fetch.js'), 'utf8');

function createHarness(storageValues = {}) {
  const calls = [];
  const localStorage = {
    getItem(key) {
      return storageValues[key] ?? null;
    }
  };
  const window = {
    location: { href: 'https://example.test/account/page.html', origin: 'https://example.test' },
    localStorage,
    fetch(...args) {
      calls.push(args);
      return Promise.resolve({ ok: true });
    }
  };
  vm.runInNewContext(source, {
    window,
    URL,
    Headers,
    Request,
    Promise
  });
  return { window, calls };
}

test('adiciona o Bearer em chamada same-origin para API quando há token', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: '[REMOVIDO]' }) });
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1].headers.get('Authorization'), 'Bearer abc');
});

test('mantém a chamada sem token', async () => {
  const harness = createHarness();
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1], undefined);
});

test('não substitui Authorization já enviado', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: '[REMOVIDO]' }) });
  await harness.window.fetch('/api/events', { headers: { Authorization: 'Bearer original' } });
  assert.equal(new Headers(harness.calls[0][1].headers).get('Authorization'), 'Bearer original');
});

test('preserva FormData sem definir Content-Type', async () => {
  const harness = createHarness({ 'trocaticket-user': JSON.stringify({ session_token: '[REMOVIDO]' }) });
  const body = new FormData();
  body.append('file', 'content');
  await harness.window.fetch('/api/avatar', { method: 'POST', body });
  const options = harness.calls[0][1];
  assert.equal(options.headers.get('Authorization'), 'Bearer abc');
  assert.equal(options.headers.has('Content-Type'), false);
  assert.equal(options.body, body);
});

test('ignora JSON inválido no armazenamento', async () => {
  const harness = createHarness({ 'trocaticket-user': '{invalid' });
  await harness.window.fetch('/api/events');
  assert.equal(harness.calls[0][1], undefined);
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth-guards.js

```javascript
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

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth-guards.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuthGuards } = require('./auth-guards');

function createHarness({ token = { sub: 7 }, rows = [{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'admin', status: 'aprovado' }] } = {}) {
  const responses = [];
  const db = {
    queries: [],
    async query(sql, params) {
      this.queries.push({ sql, params });
      return [rows, { affectedRows: 0 }];
    }
  };
  const send = (_response, status, payload) => responses.push({ status, payload });
  const guards = createAuthGuards({
    db,
    readSessionToken: () => token,
    send
  });
  return { db, guards, responses };
}

test('requireSession valida o usuário atual pelo sub do token', async () => {
  const harness = createHarness();

  const user = await harness.guards.requireSession({}, {});

  assert.equal(user.email, 'atual@example.com');
  assert.deepEqual(harness.db.queries[0].params, [7]);
  assert.equal(harness.responses.length, 0);
});

test('requireSession responde 401 para token ausente ou inválido', async () => {
  const harness = createHarness({ token: null });

  const user = await harness.guards.requireSession({}, {});

  assert.equal(user, null);
  assert.deepEqual(harness.responses, [{
    status: 401,
    payload: { ok: false, message: 'Sessão inválida ou expirada.' }
  }]);
  assert.equal(harness.db.queries.length, 0);
});

test('requireSession recusa usuário inexistente ou inativo sem expor detalhes', async () => {
  for (const status of ['bloqueado', 'suspensa', 'excluida']) {
    const harness = createHarness({ rows: [{ id: 7, email: 'atual@example.com', tipo: 'admin', status }] });
    const user = await harness.guards.requireSession({}, {});
    assert.equal(user, null);
    assert.equal(harness.responses[0].status, 401);
    assert.equal(harness.responses[0].payload.message, 'Sessão inválida ou expirada.');
  }

  const missing = createHarness({ rows: [] });
  assert.equal(await missing.guards.requireSession({}, {}), null);
  assert.equal(missing.responses[0].status, 401);
});

test('requireSameUser usa o e-mail atual do banco, não o claim antigo', async () => {
  const harness = createHarness();

  assert.equal(await harness.guards.requireSameUser({}, {}, 'ATUAL@example.com').then(Boolean), true);
  assert.equal(await harness.guards.requireSameUser({}, {}, 'antigo@example.com'), null);
  assert.deepEqual(harness.responses, [{
    status: 403,
    payload: { ok: false, message: 'Acesso negado.' }
  }]);
});

test('requireRole aceita somente os tipos autorizados', async () => {
  const allowed = createHarness();
  assert.equal(await allowed.guards.requireRole({}, {}, ['admin', 'organizador']).then(Boolean), true);

  const denied = createHarness({ rows: [{ id: 7, email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }] });
  assert.equal(await denied.guards.requireRole({}, {}, ['admin']), null);
  assert.deepEqual(denied.responses, [{
    status: 403,
    payload: { ok: false, message: 'Acesso negado.' }
  }]);
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth-route-guards.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const { EventEmitter } = require('node:events');

const db = require('./db');
const serverPath = path.resolve(__dirname, 'server.js');

function sessionToken(id = 7, email = 'atual@example.com') {
  const secret = process.env.TROCATICKET_SESSION_SECRET
    || process.env.DB_PASSWORD
    || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
  const claims = Buffer.from(JSON.stringify({
    sub: id,
    email,
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function request(method, url, body, token = sessionToken()) {
  const request = new EventEmitter();
  request.method = method;
  request.url = url;
  request.headers = token ? { authorization: `Bearer ${token}` } : {};
  process.nextTick(() => {
    if (body !== undefined) request.emit('data', JSON.stringify(body));
    request.emit('end');
  });
  return request;
}

function response() {
  return {
    status: null,
    payload: null,
    writeHead(status) {
      this.status = status;
    },
    end(payload) {
      this.payload = JSON.parse(payload);
    }
  };
}

async function invoke(handler, req) {
  const res = response();
  await handler(req, res);
  return res;
}

test('rotas de perfil respondem 401 sem sessão e 403 para outro titular', async () => {
  const originalQuery = db.query;
  let queries = 0;
  db.query = async () => {
    queries += 1;
    return [[{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const unauthenticated = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=atual@example.com', undefined, null));
    assert.equal(unauthenticated.status, 401);
    assert.equal(queries, 0);

    const other = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=outro@example.com'));
    assert.equal(other.status, 403);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('meus ingressos usa o e-mail atual do usuário da sessão', async () => {
  const originalQuery = db.query;
  const currentUser = {
    id: 7,
    nome: 'Pessoa',
    email: 'novo@example.com',
    tipo: 'comum',
    status: 'aprovado'
  };
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) return [[currentUser], {}];
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);

    const unauthenticated = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=novo@example.com', undefined, null));
    assert.equal(unauthenticated.status, 401);

    const otherUser = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=outro@example.com', undefined, sessionToken(7, 'antigo@example.com')));
    assert.equal(otherUser.status, 403);

    const currentEmail = await invoke(handler, request('GET', '/api/usuario/meus-ingressos?email=novo@example.com', undefined, sessionToken(7, 'antigo@example.com')));
    assert.equal(currentEmail.status, 200);
    assert.equal(currentEmail.payload.ok, true);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('rota de perfil responde 200 para o titular atual', async () => {
  const originalQuery = db.query;
  db.query = async () => [[{
    id: 7,
    nome: 'Pessoa',
    email: 'atual@example.com',
    tipo: 'comum',
    status: 'aprovado',
    foto_perfil: null
  }], {}];

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('GET', '/api/usuario/meu-perfil?email=atual@example.com'));
    assert.equal(result.status, 200);
    assert.equal(result.payload.ok, true);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('compra rejeita e-mail diferente antes de consultar esquema ou evento', async () => {
  const originalQuery = db.query;
  let queries = 0;
  db.query = async () => {
    queries += 1;
    return [[{ id: 7, nome: 'Pessoa', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('POST', '/api/ingressos/comprar', {
      email: 'outro@example.com',
      evento_id: 1,
      quantidade: 1
    }));
    assert.equal(result.status, 403);
    assert.equal(result.payload.message, 'Acesso negado.');
    assert.equal(queries, 1);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('rotas administrativas exigem admin e não devolvem segredos de usuários', async () => {
  const originalQuery = db.query;
  let usersSql = '';
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: 'hash',
        codigo_verificacao: '123456'
      }], {}];
    }
    usersSql = String(sql);
    return [[{
      id: 8,
      nome: 'Pessoa',
      email: 'pessoa@example.com',
      tipo: 'comum',
      status: 'aprovado',
      cpf: '00000000000',
      telefone: '11999999999',
      email_verificado: true
    }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const unauthenticated = await invoke(handler, request('GET', '/api/admin/users', undefined, null));
    assert.equal(unauthenticated.status, 401);

    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Comprador',
          email: 'atual@example.com',
          tipo: 'comprador',
          status: 'aprovado'
        }], {}];
      }
      return [[], {}];
    };
    const buyer = await invoke(handler, request('GET', '/api/admin/users'));
    assert.equal(buyer.status, 403);

    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'atual@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }], {}];
      }
      return [[{
        id: 8,
        nome: 'Pessoa',
        email: 'pessoa@example.com',
        tipo: 'comprador',
        status: 'aprovado',
        email_verificado: true
      }], {}];
    };
    const admin = await invoke(handler, request('GET', '/api/admin/users'));
    assert.equal(admin.status, 200);
    assert.equal(usersSql.includes('codigo_verificacao'), false);
    assert.equal(admin.payload.users[0].codigo_verificacao, undefined);
    assert.equal(admin.payload.users[0].senha_hash, undefined);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('admin_email diferente da sessão é rejeitado', async () => {
  const originalQuery = db.query;
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: 'hash'
      }], {}];
    }
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, request('PATCH', '/api/admin/users/8', {
      admin_email: 'outro@example.com',
      admin_password: '[REMOVIDO]',
      tipo: 'comum',
      status: 'ativa'
    }));
    assert.equal(result.status, 403);
    assert.equal(result.payload.message, 'Acesso negado.');
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('rotas de eventos e organizador exigem sessão e papel autorizado', async () => {
  const originalQuery = db.query;
  db.query = async (sql) => {
    if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: 'hash'
      }], {}];
    }
    return [[{ id: 42 }], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const routes = [
      ['POST', '/api/events'],
      ['PUT', '/api/events/1'],
      ['DELETE', '/api/events/1'],
      ['GET', '/api/organizador/dashboard?evento_id=1'],
      ['GET', '/api/organizador/chat'],
      ['POST', '/api/organizador/eventos'],
      ['POST', '/api/organizador/eventos/1/imagem'],
      ['PUT', '/api/organizador/eventos'],
      ['POST', '/api/organizador/cotacoes']
    ];

    for (const [method, route] of routes) {
      const unauthenticated = await invoke(handler, request(method, route, {}, null));
      assert.equal(unauthenticated.status, 401, route);
    }

    const buyerQuery = db.query;
    db.query = async (sql) => {
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{ id: 7, nome: 'Comprador', email: 'atual@example.com', tipo: 'comum', status: 'aprovado' }], {}];
      }
      return [[], {}];
    };
    const buyer = await invoke(handler, request('POST', '/api/events', {}, sessionToken()));
    assert.equal(buyer.status, 403);
    db.query = buyerQuery;

    const created = await invoke(handler, request('POST', '/api/organizador/cotacoes', {
      evento_id: 1,
      titulo: 'Som',
      escopo: 'Contratação',
      valor_estimado: 100
    }));
    assert.equal(created.status, 201);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('upload de imagem de evento rejeita sem sessão antes de ler o corpo', async () => {
  const originalQuery = db.query;
  db.query = async () => {
    throw new Error('não deveria consultar o banco sem sessão');
  };

  const uploadRequest = new EventEmitter();
  uploadRequest.method = 'POST';
  uploadRequest.url = '/api/organizador/eventos/1/imagem';
  uploadRequest.headers = {};
  uploadRequest.on = () => {
    throw new Error('não deveria ler o corpo sem sessão');
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const result = await invoke(handler, uploadRequest);
    assert.equal(result.status, 401);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

test('impede remover o último administrador e permite alteração com outro admin ativo', async () => {
  const originalQuery = db.query;
  const passwordHash = '$2b$04$ySqOnCxwNp3Uw/o9ywcbAucTOTZAa0rLq2XrCOTWhBuYr75S1mi7.';
  let activeAdminCount = 0;
  let target = { id: 7, nome: 'Admin', tipo: 'admin', status: 'aprovado' };
  db.query = async (sql) => {
    const text = String(sql);
    if (text.includes('SELECT id, nome, email, cpf, telefone') && text.includes('foto_perfil')) {
      return [[{
        id: 7,
        nome: 'Admin',
        email: 'atual@example.com',
        tipo: 'admin',
        status: 'aprovado',
        senha_hash: passwordHash
      }], {}];
    }
    if (text.includes('SELECT id, nome, tipo, status FROM dbo.usuarios WHERE id = ?')) {
      return [[target], {}];
    }
    if (text.includes('COUNT(*) AS total')) {
      return [[{ total: activeAdminCount }], {}];
    }
    if (text.includes('UPDATE dbo.usuarios')) {
      return [[{ id: target.id, nome: target.nome, email: 'target@example.com', tipo: 'admin', status: 'suspensa' }], {}];
    }
    return [[], {}];
  };

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const payload = { admin_email: 'atual@example.com', admin_password: '[REMOVIDO]', tipo: 'admin', status: 'suspensa' };

    const lastAdmin = await invoke(handler, request('PATCH', '/api/admin/users/7', payload));
    assert.equal(lastAdmin.status, 409);
    assert.equal(lastAdmin.payload.message, 'Não é possível remover o último administrador.');

    activeAdminCount = 1;
    const withAnotherAdmin = await invoke(handler, request('PATCH', '/api/admin/users/7', payload));
    assert.equal(withAnotherAdmin.status, 200);

    target = { id: 8, nome: 'Pessoa', tipo: 'comum', status: 'aprovado' };
    const commonUser = await invoke(handler, request('PATCH', '/api/admin/users/8', {
      ...payload,
      tipo: 'admin',
      status: 'ativa'
    }));
    assert.equal(commonUser.status, 200);
  } finally {
    db.query = originalQuery;
    delete require.cache[serverPath];
  }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth/cadastro-pj.html

```html
<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="../pages.css"><title>Cadastro corporativo | TrocaTicket</title></head><body class="page-body"><header class="site-header"><a class="brand" href="../index.html">TrocaTicket</a></header><main class="page-main"><section class="page-form"><div class="page-form-content"><h1>Cadastro corporativo</h1><p>Use o e-mail pré-autorizado pelo administrador.</p><form id="pj-form"><input name="nome" required placeholder="Nome do responsável"><input name="razao_social" required placeholder="Razão social"><input name="cnpj" required placeholder="CNPJ"><input name="telefone" required placeholder="Telefone"><input name="email" required type="email" placeholder="E-mail corporativo"><input name="senha" required minlength="6" type="password" placeholder="Senha"><p class="page-message" id="pj-message"></p><button class="button button-primary button-full" type="submit">Concluir cadastro</button></form></div></section></main><script src="../auth-fetch.js"></script><script src="../cadastro-pj.js" defer></script></body></html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth/cadastro.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../pages.css">
    <script src="../auth-fetch.js"></script>
    <script src="../cadastro.js" defer></script>
    <title>Cadastro | TrocaTicket</title>
</head>
<body class="page-body" data-page="cadastro">
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>
    </header>
    <main class="page-main">
        <section class="page-form registration-page-form">
            <div class="page-form-content">
                <h1>Crie sua conta</h1>
                <p class="login-subtitle">Compre e revenda ingressos com segurança.</p>
                <form id="register-page-form">
                    <div class="form-row">
                        <input required name="nome" placeholder="Nome">
                        <input required name="sobrenome" placeholder="Sobrenome">
                    </div>
                    <input required name="cpf" placeholder="CPF (11 números; pontuação opcional)">
                    <input required name="nascimento" type="date" aria-label="Data de nascimento">
                    <select required name="sexo" aria-label="Sexo">
                        <option value="" disabled selected>Sexo</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                    <input required name="celular" type="tel" placeholder="Celular">
                    <input required name="email" type="email" placeholder="E-mail">
                    <input required name="senha" type="password" minlength="6" placeholder="Senha">
                    <input required name="confirmarSenha" type="password" minlength="6" placeholder="Confirme a senha">
                    <p class="page-message" id="page-message"></p>
                    <button class="button button-primary button-full login-submit" type="submit">Cadastrar</button>
                </form>
                <p class="form-foot login-register">Já possui cadastro? <a href="login.html">Entrar</a></p>
                <p class="form-foot login-register"><a href="login.html">Voltar para o login</a></p>
            </div>
            <div id="register-success" class="register-success" hidden>
                <div class="success-icon">✓</div>
                <h2>Cadastro concluído</h2>
                <p>Redirecionando para o início...</p>
            </div>
            <div id="verification-step" hidden>
                <h2>Confirme seu e-mail</h2>
                <p>Digite o código de 6 dígitos enviado para o seu e-mail.</p>
                <form id="verification-form">
                    <input id="verification-code" name="codigo" inputmode="numeric" pattern="\d{6}" maxlength="6" required placeholder="Código de verificação">
                    <p class="page-message" id="verification-message"></p>
                    <button class="button button-primary button-full" type="submit">Confirmar código</button>
                </form>
            </div>
        </section>
    </main>
</body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/auth/login.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | TrocaTicket</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        body {
            background-color: #0c0e14;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            margin: 0;
            font-family: 'Manrope', sans-serif;
            color: #fff;
        }
        .login-page-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        }
        .login-card {
            background: transparent;
            width: 100%;
            max-width: 460px;
            text-align: center;
        }
        .divider-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 26px;
        }
        .divider-line {
            flex: 1;
            height: 1px;
            background: #272c40;
        }
        .divider-text {
            color: #8c92a0;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
        }
        .input-group {
            position: relative;
            margin-bottom: 14px;
        }
        .input-control {
            width: 100%;
            height: 54px;
            background: #eef2fa;
            border: 1.5px solid transparent;
            border-radius: 8px;
            padding: 0 16px;
            font-size: 15px;
            color: #182035;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }
        .input-control:focus {
            background: #fff;
            border-color: #27b7ff;
            box-shadow: 0 0 0 3px rgba(39, 183, 255, 0.15);
        }
        .btn-toggle-eye {
            position: absolute;
            top: 50%;
            right: 14px;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: #798196;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-toggle-eye:hover {
            color: #27b7ff;
        }
        .forgot-row {
            text-align: right;
            margin: 4px 0 20px 0;
        }
        .forgot-link {
            color: #e08b16;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
        }
        .forgot-link:hover {
            text-decoration: underline;
        }
        .login-error-msg {
            color: #ff4757;
            font-size: 13px;
            margin-bottom: 16px;
            min-height: 18px;
            display: none;
        }
        .btn-login-submit {
            width: 100%;
            height: 52px;
            background: linear-gradient(95deg, #1890ff, #5956e9);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: opacity 0.2s ease;
        }
        .btn-login-submit:hover {
            opacity: 0.9;
        }
        .btn-register-link {
            width: 100%;
            height: 52px;
            margin-top: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1.5px solid #2b3144;
            background: rgba(255, 255, 255, 0.02);
            color: #fff;
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-decoration: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }
        .btn-register-link:hover {
            border-color: #27b7ff;
            color: #27b7ff;
            background: rgba(39, 183, 255, 0.08);
        }
        .register-footer {
            margin-top: 30px;
            font-size: 13px;
            color: #8c92a0;
        }
        .register-footer a {
            color: #e08b16;
            font-weight: 800;
            text-decoration: none;
        }
        .register-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header class="site-header">
        <a class="brand" href="../index.html">
            <img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket">
            <span>Troca<span class="brand-accent">Ticket</span></span>
        </a>
    </header>

    <main class="login-page-container">
        <div class="login-card">
            <div class="divider-container">
                <div class="divider-line"></div>
                <span class="divider-text">OU</span>
                <div class="divider-line"></div>
            </div>

            <form id="login-form">
                <div class="input-group">
                    <input type="email" id="login-email" class="input-control" placeholder="E-mail" required autocomplete="email">
                </div>

                <div class="input-group">
                    <input type="password" id="login-senha" class="input-control" placeholder="Senha" required minlength="6" autocomplete="current-password">
                    <button type="button" class="btn-toggle-eye" id="toggle-password" aria-label="Alternar exibição da senha">
                        <svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>

                <div class="forgot-row">
                    <a href="#" class="forgot-link">Esqueci minha senha</a>
                </div>

                <div class="login-error-msg" id="login-error-msg"></div>

                <button type="submit" class="btn-login-submit" id="btn-submit">ENTRAR</button>

                <a class="btn-register-link" href="cadastro.html">CADASTRAR-SE</a>
            </form>

            <div class="register-footer">
                Não possui conta? <a href="cadastro.html">Cadastre-se</a>
            </div>
        </div>
    </main>

    <script src="../auth-fetch.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('login-form');
            const emailInput = document.getElementById('login-email');
            const senhaInput = document.getElementById('login-senha');
            const errorMsg = document.getElementById('login-error-msg');
            const btnSubmit = document.getElementById('btn-submit');
            const togglePasswordBtn = document.getElementById('toggle-password');

            // Alternar exibição de senha
            togglePasswordBtn.addEventListener('click', () => {
                const isPassword = senhaInput.getAttribute('type') === 'password';
                senhaInput.setAttribute('type', isPassword ? 'text' : 'password');
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorMsg.style.display = 'none';
                errorMsg.textContent = '';

                const email = emailInput.value.trim();
                const senha = senhaInput.value;

                if (!email || !senha) {
                    errorMsg.textContent = 'Preencha o e-mail e a senha.';
                    errorMsg.style.display = 'block';
                    return;
                }

                try {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'ENTRANDO...';

                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, senha })
                    });

                    const data = await response.json();

                    if (!response.ok || !data.ok) {
                        throw new Error(data.message || 'E-mail ou senha inválidos.');
                    }

                    // A sessão assinada é validada pelo servidor nas rotas operacionais.
                    const sessionUser = { ...data.user, session_token: data.session_token };
                    localStorage.setItem('trocaticket-user', JSON.stringify(sessionUser));
                    localStorage.setItem('usuario', JSON.stringify(sessionUser));

                    const requestedRedirect = new URLSearchParams(window.location.search).get('redirect') || '';
                    const safeRedirect = /^(?:\.\.\/)?(?:meus-ingressos\.html|ingresso\.html(?:\?evento=[^&]*)?|\.{2}\/operations\/(?:organizador|fornecedor)\.html)$/.test(requestedRedirect)
                        ? requestedRedirect
                        : '../index.html';
                    window.location.href = safeRedirect;
                } catch (err) {
                    console.error('[login] Erro na requisição:', err);
                    errorMsg.textContent = err.message || 'Erro ao conectar ao servidor.';
                    errorMsg.style.display = 'block';
                } finally {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'ENTRAR';
                }
            });
        });
    </script>
</body>
</html>
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/bilheteria-app.js

```javascript
const state = {
    events: [],
    tickets: [],
    provider: 'Troca Ticket',
    selectedTicketId: null,
    selectedDemoTicketId: null,
    demoOptionsOpen: false,
    supportStatusFilter: '*',
    operator: null,
    scanner: null,
    scannerRunning: false,
    scannerStarting: false,
    cameraSwitching: false,
    activeCameraId: null,
    torchEnabled: false,
    scanBusy: false,
    overlayTimer: null,
    toastTimer: null,
    contingencyLookupTimer: null,
    sessionCount: 0,
    audit: []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const byId = id => document.getElementById(id);
const OPERATOR_TYPES = new Set(['admin', 'bilheteria', 'organizador']);

function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function readOperator() {
    try { return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null'); }
    catch { return null; }
}
function canOperate() { return Boolean(state.operator?.email && state.operator?.session_token && OPERATOR_TYPES.has(String(state.operator.tipo || '').toLowerCase())); }

async function apiRequest(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body) headers.set('Content-Type', 'application/json');
    if (state.operator?.session_token) headers.set('Authorization', `Bearer ${state.operator.session_token}`);
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
        const error = new Error(data.message || `Falha HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }
    return data;
}

function getEvent(eventId) { return state.events.find(event => String(event.id) === String(eventId)); }
function getTicket(ticketId) {
    return state.tickets.find(ticket => String(ticket.id) === String(ticketId) || String(ticket.numero_ingresso).toLowerCase() === String(ticketId).toLowerCase());
}
function makeOption(value, label) { return `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`; }
function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(date);
}
function formatCpf(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 11 ? `${digits.slice(0, 3)}.***.**${digits.slice(7, 9)}-${digits.slice(9)}` : value || 'Não informado';
}
function formatFullCpf(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 11 ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}` : value || 'Não informado';
}
function statusClass(status) {
    if (status === 'disponível') return 'available';
    if (status === 'utilizado') return 'used';
    return 'revoked';
}
function statusLabel(status) {
    if (status === 'disponível') return 'Disponível';
    if (status === 'utilizado') return 'Utilizado';
    return status === 'expirado' ? 'Expirado' : 'Revogado / transferido';
}
function normalizeProvider(ticket) {
    const savedProvider = String(ticket.provider || '').trim();
    if (['Troca Ticket', 'BlackTag', 'Ticketmaster', 'Ticket360'].includes(savedProvider)) return savedProvider;
    const codes = `${ticket.externalCode || ''} ${ticket.numero_ingresso || ''}`.toUpperCase();
    if (/\b(BT|BLACKTAG)[-_]/.test(codes)) return 'BlackTag';
    if (/\b(TM|TICKETMASTER)[-_]/.test(codes)) return 'Ticketmaster';
    if (/\b(T360|TICKET360)[-_]/.test(codes)) return 'Ticket360';
    return ticket.integratorId ? `Parceira #${ticket.integratorId}` : 'Troca Ticket';
}
function normalizeCategory(value) {
    const text = String(value || '').trim();
    return text.replace(/meia[- ]entrada/gi, 'Meia Entrada') || 'Não identificado';
}
function normalizeLotName(value) {
    const text = String(value || '').trim();
    const number = text.match(/(?:lote\s*)?(\d+)\s*(?:º|°|o)?\s*lote?/i)?.[1];
    return number ? `${number}º lote` : text || 'Não identificado';
}
function normalizeTicket(ticket) {
    const rawStatus = String(ticket.status || '').toLowerCase();
    const status = ['ativo', 'valido', 'disponível', 'disponivel'].includes(rawStatus) ? 'disponível'
        : ['utilizado', 'usado', 'checked_in'].includes(rawStatus) ? 'utilizado'
            : rawStatus === 'expirado' ? 'expirado' : 'revogado/transferido';
    return {
        ...ticket,
        id: String(ticket.id),
        numero_ingresso: ticket.numero_ingresso || String(ticket.id),
        externalCode: ticket.externalCode || ticket.codigo_original_bilheteria || ticket.numero_ingresso,
        orderCode: ticket.orderCode || ticket.codigo_pedido || 'Não identificado',
        holder: ticket.ownerName || ticket.titular || 'Titular não informado',
        cpf: ticket.ownerCpf || ticket.cpf || '',
        eventId: ticket.eventId ?? ticket.evento_id,
        eventName: ticket.eventName || ticket.evento || 'Evento não informado',
        sector: ticket.sector || ticket.setor || 'Setor não informado',
        lotName: normalizeLotName(ticket.lotName || ticket.lote || ticket.lote_nome),
        ticketCategory: normalizeCategory(ticket.ticketCategory || ticket.modalidade || ticket.modalidade_ingresso || ticket.tipo_ingresso),
        purchaseDate: ticket.purchaseDate || ticket.criado_em || null,
        provider: normalizeProvider(ticket),
        status,
        checkinAt: ticket.checkinAt || ticket.utilizado_em || null,
        checkinOperator: ticket.checkinOperator || ticket.operador || (status === 'utilizado' ? state.operator?.nome || state.operator?.name || '' : ''),
        emissionMethod: ticket.emissionMethod || (ticket.integratorId ? 'Emissão por bilheteria parceira' : 'Emissão própria')
    };
}
function formatLotCategory(ticket) {
    const lot = String(ticket.lotName || ticket.lote || ticket.lote_nome || ticket.lot || '').trim();
    const modality = String(ticket.ticketType || ticket.modalidade || ticket.modalidade_ingresso || ticket.tipo_ingresso || '').trim();
    if (!lot && !modality) return 'não identificado';
    return `${lot || 'não identificado'} - ${modality || 'não identificado'}`;
}

function findDemoTicketMatches(value) {
    const query = String(value || '').trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    const candidates = query ? state.tickets : state.tickets.filter(ticket =>
        String(ticket.eventId) === String(byId('gate-event').value) && ticket.status === 'disponível'
    );
    return candidates.filter(ticket => !query
        || String(ticket.holder).toLowerCase().includes(query)
        || String(ticket.numero_ingresso).toLowerCase().includes(query)
        || String(ticket.id).toLowerCase().includes(query)
        || (digits.length >= 2 && String(ticket.cpf || '').replace(/\D/g, '').includes(digits))
    ).slice(0, 30);
}

function renderEvents() {
    byId('gate-event').innerHTML = state.events.length ? state.events.map(event => makeOption(event.id, event.name)).join('') : makeOption('', 'Nenhum evento cadastrado');
    byId('provider-event').innerHTML = [makeOption('*', 'Todos os eventos'), ...state.events.map(event => makeOption(event.id, event.name))].join('');
    byId('gate-event').disabled = !state.events.length;
    byId('gate-sector').disabled = !state.events.length;
    updateScannerAvailability();
    renderGateSectors();
}
function updateScannerAvailability() {
    byId('toggle-scanner').disabled = !byId('gate-event').value || state.scannerStarting;
}
function renderGateSectors() {
    const event = getEvent(byId('gate-event').value);
    const sectors = Array.isArray(event?.sectors) ? event.sectors : [];
    byId('gate-sector').innerHTML = [makeOption('*', 'Todas as Áreas / Portaria Geral'), ...sectors.map(sector => makeOption(sector.name || sector.nome || sector, sector.name || sector.nome || sector))].join('');
    renderGateSummary();
}
function renderGateSummary() {
    const event = getEvent(byId('gate-event').value);
    const sector = byId('gate-sector').selectedOptions[0]?.textContent || 'Portaria Geral';
    byId('gate-summary').textContent = event ? `${event.name} · ${sector}` : 'Nenhum evento cadastrado';
}
function renderDemoTicketOptions() {
    const input = byId('demo-ticket-search');
    const options = byId('demo-ticket-options');
    if (!input || !options) return;
    const selectedTicket = state.tickets.find(ticket => ticket.id === state.selectedDemoTicketId);
    if (selectedTicket && !state.demoOptionsOpen) {
        options.hidden = true;
        options.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        return;
    }
    const matches = findDemoTicketMatches(input.value);
    const emptyMessage = !canOperate()
        ? 'Entre com uma conta da equipe para pesquisar ingressos.'
        : input.value.trim()
            ? 'Nenhum ingresso corresponde ao titular, CPF ou código informado.'
            : 'Nenhum ingresso disponível para o evento selecionado.';
    options.innerHTML = matches.length ? matches.map(ticket => `<button class="combobox-option" type="button" role="option" aria-selected="false" data-demo-ticket-id="${escapeHTML(ticket.id)}"><strong>${escapeHTML(ticket.holder)}</strong><small>CPF ${escapeHTML(formatCpf(ticket.cpf))} · ${escapeHTML(ticket.numero_ingresso)} · ${escapeHTML(ticket.eventName)} · ${escapeHTML(statusLabel(ticket.status))}</small></button>`).join('') : `<p class="combobox-empty">${emptyMessage}</p>`;
    options.hidden = !state.demoOptionsOpen;
    input.setAttribute('aria-expanded', String(state.demoOptionsOpen && matches.length > 0));
}
async function loadPlatformData({ preserveSelection = true } = {}) {
    const previousEventId = byId('gate-event').value;
    const previousProviderEvent = byId('provider-event').value;
    const eventData = await apiRequest('/api/events');
    let ticketData = { tickets: [] };
    let ticketLoadError = null;
    if (canOperate()) {
        try {
            ticketData = await apiRequest('/api/admin/tickets');
        } catch (error) {
            ticketLoadError = error;
            console.warn('[bilheteria] Não foi possível carregar ingressos protegidos:', error.message);
        }
    }
    state.events = (eventData.events || []).map(event => ({ ...event, id: String(event.id), sectors: event.sectors || [] }));
    state.tickets = (ticketData.tickets || []).map(normalizeTicket);
    renderEvents();
    if (preserveSelection && getEvent(previousEventId)) byId('gate-event').value = previousEventId;
    renderGateSectors();
    byId('provider-event').value = previousProviderEvent === '*' || getEvent(previousProviderEvent) ? previousProviderEvent : '*';
    renderDemoTicketOptions();
    renderProviderTable();
    if (ticketLoadError) showToast(`Ingressos indisponíveis: ${ticketLoadError.message}`);
}
function updateClock() {
    byId('current-time').textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date());
}
function showToast(message) {
    const toast = byId('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

async function loadAudit() {
    try {
        const data = await apiRequest('/api/admin/activity-log?limit=100');
        state.audit = (data.logs || data.activities || []).filter(entry => /ingresso|checkin/i.test(`${entry.action || ''} ${entry.description || ''}`));
    } catch (error) {
        console.warn('[bilheteria] Não foi possível carregar auditoria:', error.message);
        state.audit = [];
    }
    renderAudit();
}

async function requestActivePayload(ticket) {
    if (!canOperate()) throw new Error('Entre com uma conta da equipe de operação para visualizar hashes ativos.');
    return apiRequest(`/api/admin/tickets/${encodeURIComponent(ticket.id)}/qr`);
}
async function validatePayload(payload) {
    if (!canOperate()) return { kind: 'error', title: 'Acesso da equipe necessário', detail: 'Entre na plataforma com uma conta da equipe de operação.' };
    if (!byId('gate-event').value) return { kind: 'error', title: 'Nenhum evento selecionado', detail: 'Selecione um evento real antes de validar.' };
    try {
        const result = await apiRequest('/api/bilheteria/validar-acesso', {
            method: 'POST',
            body: JSON.stringify({ qr_code_payload: String(payload || '').trim(), evento_id: Number(byId('gate-event').value), setor_catraca: byId('gate-sector').value })
        });
        const ticket = result.ticket || {};
        return { kind: 'success', title: 'ACESSO LIBERADO', detail: `<strong>${escapeHTML(ticket.titular || '')}</strong><br>${escapeHTML(ticket.setor || 'Setor não informado')} · ${escapeHTML(ticket.numero_ingresso || '')}<br>Origem: ${escapeHTML(ticket.bilheteria || 'Troca Ticket')}` };
    } catch (error) {
        const result = error.data || {};
        const kind = result.kind === 'warning' ? 'warning' : 'error';
        const previousCheckin = result.checkinAt ? ` Check-in anterior: ${formatDate(result.checkinAt)}.` : '';
        return { kind, title: kind === 'warning' ? 'SETOR INCORRETO' : result.message || error.message, detail: `${escapeHTML(result.message || error.message)}${escapeHTML(previousCheckin)}` };
    }
}
function playFeedback(kind) {
    try {
        const audio = new AudioContext();
        const beep = (frequency, duration, delay = 0, type = 'sine') => {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.08, audio.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration);
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.start(audio.currentTime + delay);
            oscillator.stop(audio.currentTime + delay + duration);
        };
        if (kind === 'success') beep(880, 0.15);
        else if (kind === 'warning') { beep(587, 0.1); beep(587, 0.1, 0.16); }
        else beep(220, 0.35, 0, 'triangle');
        window.setTimeout(() => audio.close(), 700);
    } catch (error) { console.warn('[bilheteria] Áudio indisponível:', error); }
}
function showFeedback(result) {
    const overlay = byId('feedback-overlay');
    clearTimeout(state.overlayTimer);
    overlay.dataset.kind = result.kind;
    byId('feedback-symbol').textContent = result.kind === 'success' ? '✓' : result.kind === 'warning' ? '!' : '×';
    byId('feedback-kicker').textContent = result.kind === 'success' ? 'VALIDAÇÃO APROVADA' : result.kind === 'warning' ? 'ATENÇÃO · PORTÃO' : 'ACESSO RECUSADO';
    byId('feedback-title').textContent = result.title;
    byId('feedback-detail').innerHTML = result.detail;
    overlay.hidden = false;
    playFeedback(result.kind);
    state.overlayTimer = window.setTimeout(() => {
        overlay.hidden = true;
        state.scanBusy = false;
        const tokenInput = byId('token-input');
        if (result.kind === 'success' && tokenInput) tokenInput.focus({ preventScroll: true });
    }, 2000);
}
async function processPayload(payload) {
    if (state.scanBusy) return;
    state.scanBusy = true;
    state.sessionCount += 1;
    byId('session-count').textContent = String(state.sessionCount);
    byId('last-scan').textContent = new Date().toLocaleTimeString('pt-BR');
    const result = await validatePayload(payload);
    showFeedback(result);
    if (result.kind === 'success') {
        const tokenInput = byId('token-input');
        if (tokenInput) tokenInput.value = '';
        const manualTokenDetails = byId('manual-token-details');
        if (manualTokenDetails) manualTokenDetails.open = true;
        loadPlatformData().catch(error => console.error('[bilheteria] Atualização após check-in falhou:', error));
        loadAudit();
    }
}

function renderCameraOptions(cameras, preferredId = null) {
    const select = byId('camera-select');
    const previousId = select.value;
    const availableIds = new Set(cameras.map(camera => camera.id));
    select.innerHTML = makeOption('', 'Automática · priorizar traseira') + cameras.map((camera, index) => makeOption(camera.id, camera.label || `Câmera ${index + 1}`)).join('');
    if (preferredId && availableIds.has(preferredId)) select.value = preferredId;
    else if (previousId && availableIds.has(previousId)) select.value = previousId;
    else select.value = cameras.find(camera => /back|rear|environment|traseira|principal/i.test(camera.label))?.id || '';
}
async function refreshCameraOptions(preferredId = state.activeCameraId) {
    if (!window.Html5Qrcode) return [];
    try {
        const cameras = await Html5Qrcode.getCameras();
        renderCameraOptions(cameras, preferredId);
        return cameras;
    } catch (error) {
        console.warn('[bilheteria] Não foi possível listar câmeras:', error);
        return [];
    }
}
async function startScanner(cameraId = byId('camera-select').value || null) {
    if (state.scannerRunning || state.scannerStarting) return;
    if (!byId('gate-event').value) return showToast('Selecione um evento cadastrado antes de iniciar o leitor.');
    if (!window.Html5Qrcode) {
        byId('camera-hint').textContent = 'Biblioteca de câmera indisponível. Confira sua conexão ou use a entrada manual.';
        return showToast('Leitor indisponível. Use a validação manual.');
    }
    state.scannerStarting = true;
    byId('toggle-scanner').disabled = true;
    byId('toggle-scanner').textContent = 'Abrindo câmera…';
    byId('scanner-status').textContent = 'Abrindo câmera…';
    byId('scanner-status').className = 'status-chip status-neutral';
    try {
        state.scanner = new Html5Qrcode('reader', { verbose: false });
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 };
        try {
            await state.scanner.start(cameraId || { facingMode: 'environment' }, config, decodedText => processPayload(decodedText), () => {});
            state.scannerRunning = true;
        } catch (firstError) {
            if (cameraId) throw firstError;
            const cameras = await Html5Qrcode.getCameras();
            const rearCamera = cameras.find(camera => /back|rear|environment|traseira|principal/i.test(camera.label)) || cameras[0];
            if (!rearCamera) throw firstError;
            renderCameraOptions(cameras, rearCamera.id);
            await state.scanner.start(rearCamera.id, config, decodedText => processPayload(decodedText), () => {});
            state.scannerRunning = true;
        }
        byId('scanner-placeholder').hidden = true;
        byId('scanner-status').textContent = 'Câmera ativa';
        byId('scanner-status').className = 'status-chip status-success';
        byId('toggle-scanner').textContent = 'Pausar validação';
        byId('toggle-scanner').classList.add('is-running');
        const video = $('#reader video');
        state.activeCameraId = video?.srcObject?.getVideoTracks?.()[0]?.getSettings?.().deviceId || cameraId;
        await refreshCameraOptions(state.activeCameraId);
        configureTorchButton();
    } catch (error) {
        await stopScanner();
        byId('camera-hint').textContent = 'Permita acesso à câmera e use localhost/HTTPS. Também é possível escolher outra câmera.';
        showToast(`Câmera indisponível: ${error.message || 'permissão negada'}`);
    } finally {
        state.scannerStarting = false;
        updateScannerAvailability();
    }
}
async function switchScannerCamera(cameraId) {
    if (!state.scannerRunning || state.cameraSwitching || cameraId === state.activeCameraId) return;
    state.cameraSwitching = true;
    await stopScanner();
    await startScanner(cameraId || null);
    state.cameraSwitching = false;
}
function configureTorchButton() {
    const track = $('#reader video')?.srcObject?.getVideoTracks?.()[0];
    const button = byId('torch-toggle');
    button.hidden = !track?.getCapabilities?.().torch;
    state.torchEnabled = false;
    button.classList.remove('is-on');
    button.textContent = 'Lanterna';
}
async function toggleTorch() {
    const track = $('#reader video')?.srcObject?.getVideoTracks?.()[0];
    if (!track) return;
    try {
        state.torchEnabled = !state.torchEnabled;
        await track.applyConstraints({ advanced: [{ torch: state.torchEnabled }] });
        byId('torch-toggle').classList.toggle('is-on', state.torchEnabled);
        byId('torch-toggle').textContent = state.torchEnabled ? 'Desligar lanterna' : 'Lanterna';
        byId('torch-toggle').setAttribute('aria-label', state.torchEnabled ? 'Desligar lanterna' : 'Ligar lanterna');
    } catch { state.torchEnabled = false; showToast('Este dispositivo não permitiu alterar a lanterna.'); }
}
async function stopScanner() {
    if (state.scanner) {
        if (state.scannerRunning) {
            try { await state.scanner.stop(); } catch (error) { console.warn('[bilheteria] Falha ao parar câmera:', error); }
        }
        try { state.scanner.clear(); } catch (error) { console.warn('[bilheteria] Falha ao limpar leitor:', error); }
    }
    state.scanner = null;
    state.scannerRunning = false;
    state.activeCameraId = null;
    state.scanBusy = false;
    byId('scanner-placeholder').hidden = false;
    byId('torch-toggle').hidden = true;
    byId('scanner-status').textContent = 'Câmera pausada';
    byId('scanner-status').className = 'status-chip status-neutral';
    byId('toggle-scanner').textContent = 'Iniciar validação contínua';
    byId('toggle-scanner').classList.remove('is-running');
}

function renderContingencyTicket(ticket) {
    const container = byId('contingency-ticket-detail');
    if (!container) return;
    state.selectedTicketId = ticket ? String(ticket.id) : null;
    if (!ticket) {
        container.innerHTML = '<div class="empty-state"><span aria-hidden="true">▤</span><strong>Nenhum ingresso consultado</strong><p>Digite, cole ou selecione um ingresso para consultar os dados em tempo real.</p></div>';
        return;
    }
    const manualForm = ticket.status === 'disponível' ? `<form class="manual-approval" id="manual-approval"><label for="manual-reason">Motivo da liberação<select id="manual-reason" required><option value="Tela do telemóvel danificada">Tela do telemóvel danificada</option><option value="Problema de leitura na catraca">Problema de leitura na catraca</option><option value="Celular descarregado - documento físico conferido">Celular descarregado - documento físico conferido</option></select></label><button class="button button-primary" type="submit">Aprovar check-in manual</button><p class="manual-approval-note">A liberação será gravada atomicamente, com o operador responsável e na trilha de auditoria.</p></form>` : `<p class="security-note">${ticket.status === 'utilizado' ? `Ingresso consumido em ${escapeHTML(formatDate(ticket.checkinAt))}.` : 'Este ingresso não está disponível para check-in.'}</p>`;
    container.innerHTML = `<h3>Detalhes do ingresso</h3><dl class="ticket-data"><div><dt>Titular atual</dt><dd>${escapeHTML(ticket.holder)}</dd></div><div><dt>CPF</dt><dd>${escapeHTML(formatFullCpf(ticket.cpf))}</dd></div><div><dt>Código do bilhete</dt><dd>${escapeHTML(ticket.numero_ingresso)}</dd></div><div><dt>Setor</dt><dd>${escapeHTML(ticket.sector)}</dd></div><div><dt>Evento</dt><dd>${escapeHTML(ticket.eventName)}</dd></div><div><dt>Status atual</dt><dd><span class="table-status ${statusClass(ticket.status)}">${escapeHTML(statusLabel(ticket.status))}</span></dd></div></dl>${manualForm}`;
}

function findContingencyMatches(value) {
    const query = String(value || '').trim().toLowerCase();
    if (!query) return [];
    const digits = query.replace(/\D/g, '');
    return state.tickets.filter(ticket => String(ticket.numero_ingresso).toLowerCase().includes(query)
        || String(ticket.id).toLowerCase().includes(query)
        || String(ticket.holder).toLowerCase().includes(query)
        || (digits.length >= 3 && String(ticket.cpf || '').replace(/\D/g, '').includes(digits)))
        .slice(0, 20);
}

function renderContingencyOptions() {
    const input = byId('contingency-search');
    const options = byId('contingency-options');
    if (!input || !options) return;
    const matches = findContingencyMatches(input.value);
    options.innerHTML = matches.length
        ? matches.map(ticket => `<button class="combobox-option" type="button" role="option" aria-selected="false" data-contingency-ticket-id="${escapeHTML(ticket.id)}"><strong>${escapeHTML(ticket.holder)}</strong><small>CPF ${escapeHTML(formatCpf(ticket.cpf))} · ${escapeHTML(ticket.numero_ingresso)} · ${escapeHTML(ticket.eventName)} · ${escapeHTML(statusLabel(ticket.status))}</small></button>`).join('')
        : input.value.trim() ? '<p class="combobox-empty">Nenhum ingresso corresponde ao CPF ou código informado.</p>' : '';
    options.hidden = !input.value.trim() || !matches.length;
    input.setAttribute('aria-expanded', String(Boolean(input.value.trim()) && matches.length > 0));
}

function lookupContingencyTicket(value) {
    const query = String(value || '').trim();
    if (!query) {
        renderContingencyTicket(null);
        renderContingencyOptions();
        return;
    }
    const matches = findContingencyMatches(query);
    renderContingencyTicket(matches.length === 1 ? matches[0] : null);
    renderContingencyOptions();
}

async function approveManualCheckin(event) {
    if (event.target.id !== 'manual-approval') return;
    event.preventDefault();
    const ticket = getTicket(state.selectedTicketId);
    if (!ticket || ticket.status !== 'disponível') return;
    try {
        const result = await apiRequest(`/api/bilheteria/tickets/${encodeURIComponent(ticket.id)}/checkin-manual`, { method: 'POST', body: JSON.stringify({ motivo: byId('manual-reason').value }) });
        await loadPlatformData();
        await loadAudit();
        renderContingencyTicket(getTicket(ticket.id));
        showToast(result.message);
    } catch (error) { showToast(error.message); }
}

function populateProviderFilters(tickets) {
    const options = (id, values, emptyLabel) => {
        const select = byId(id);
        if (!select) return;
        const selected = select.value || '*';
        const unique = [...new Set(values.filter(value => value && !/^(?:setor\s+)?não\s+(?:informado|identificado)$/i.test(String(value).trim()) && !/lote\s+legal/i.test(String(value))))].sort((first, second) => String(first).localeCompare(String(second), 'pt-BR'));
        select.innerHTML = `<option value="*">${emptyLabel}</option>` + unique.map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join('');
        select.value = unique.includes(selected) ? selected : '*';
    };
    const selectedEvent = byId('provider-filter-event')?.value || '*';
    const configuredEvents = (state.events || []).filter(event => selectedEvent === '*' || event.name === selectedEvent);
    const scopedTickets = selectedEvent === '*' ? tickets : tickets.filter(ticket => ticket.eventName === selectedEvent);
    const configuredSectors = configuredEvents.flatMap(event => (event.sectors || []).map(sector => sector.name || sector.nome));
    const configuredLots = configuredEvents.flatMap(event => (event.lots || []).map(lot => normalizeLotName(lot.name || lot.nome)));
    const configuredCategories = configuredEvents.flatMap(event => (event.lots || []).flatMap(lot => [lot.ticketType, Number(lot.halfPrice) > 0 || Number(lot.halfAvailable) > 0 ? 'Meia Entrada' : '', ...(Array.isArray(lot.modalities) ? lot.modalities.map(modality => normalizeCategory(modality.nome || modality.name)) : [])]));
    options('provider-filter-event', [...tickets.map(ticket => ticket.eventName), ...(state.events || []).map(event => event.name)], 'Todos os eventos');
    options('provider-filter-sector', [...scopedTickets.map(ticket => ticket.sector), ...configuredSectors], 'Todos os setores');
    options('provider-filter-lot', [...scopedTickets.map(ticket => ticket.lotName), ...configuredLots], 'Todos os lotes');
    options('provider-filter-category', [...scopedTickets.map(ticket => ticket.ticketCategory), ...configuredCategories.map(normalizeCategory)], 'Todas as categorias');
    options('provider-filter-operator', scopedTickets.map(ticket => ticket.checkinOperator || 'Não informado'), 'Todos os porteiros');
    options('provider-filter-reason', scopedTickets.map(ticket => ticket.checkinReason || 'Não informado'), 'Todas as causas');
}

function renderProviderTable() {
    const selectedEvent = byId('provider-filter-event').value || '*';
    const selectedSector = byId('provider-filter-sector').value || '*';
    const selectedLot = byId('provider-filter-lot').value || '*';
    const selectedCategory = byId('provider-filter-category').value || '*';
    const selectedStatus = byId('provider-status-filter').value || '*';
    const selectedOrigin = byId('provider-origin-filter').value || '*';
    const selectedOperator = byId('provider-filter-operator').value || '*';
    const selectedReason = byId('provider-filter-reason').value || '*';
    const globalQuery = String(byId('provider-global-search')?.value || '').trim().toLowerCase();
    const providerTickets = state.tickets.filter(ticket => ticket.provider === state.provider);
    populateProviderFilters(providerTickets);
    const visibleTickets = providerTickets.filter(ticket => (selectedEvent === '*' || ticket.eventName === selectedEvent)
        && (selectedSector === '*' || ticket.sector === selectedSector)
        && (selectedLot === '*' || ticket.lotName === selectedLot)
        && (selectedCategory === '*' || ticket.ticketCategory === selectedCategory)
        && (selectedStatus === '*' || ticket.status === selectedStatus)
        && (selectedOrigin === '*' || (selectedOrigin === 'own' ? ticket.provider === 'Troca Ticket' : ticket.provider !== 'Troca Ticket'))
        && (selectedOperator === '*' || (ticket.checkinOperator || 'Não informado') === selectedOperator)
        && (selectedReason === '*' || (ticket.checkinReason || 'Não informado') === selectedReason)
        && (!globalQuery || Object.values(ticket).join(' ').toLowerCase().includes(globalQuery)));
    byId('provider-caption').textContent = `${visibleTickets.length} de ${providerTickets.length} · ${state.provider} · ${selectedEvent === '*' ? 'todos os eventos' : selectedEvent}`;
    byId('metric-ingested').textContent = String(providerTickets.length);
    byId('metric-checkins').textContent = String(providerTickets.filter(ticket => ticket.status === 'utilizado').length);
    byId('metric-transferred').textContent = String(providerTickets.filter(ticket => Number(ticket.versao_titularidade || 1) > 1).length);
    byId('provider-ticket-rows').innerHTML = visibleTickets.length ? visibleTickets.map(ticket => `<tr><td>${escapeHTML(ticket.eventName)}</td><td>${escapeHTML(ticket.externalCode)}</td><td>${escapeHTML(ticket.orderCode)}</td><td>${escapeHTML(ticket.numero_ingresso)}</td><td>${escapeHTML(ticket.holder)}</td><td>${escapeHTML(formatCpf(ticket.cpf))}</td><td>${escapeHTML(ticket.sector)}</td><td>${escapeHTML(ticket.lotName)}</td><td>${escapeHTML(ticket.ticketCategory)}</td><td>${escapeHTML(formatDate(ticket.purchaseDate))}</td><td>${escapeHTML(ticket.provider)}</td><td><span class="table-status ${statusClass(ticket.status)}">${escapeHTML(statusLabel(ticket.status))}</span></td><td>${escapeHTML(formatDate(ticket.checkinAt))}</td><td>${escapeHTML(ticket.checkinOperator || 'Não informado')}</td><td>${escapeHTML(ticket.checkinReason || 'Não informado')}</td></tr>`).join('') : `<tr><td class="table-empty" colspan="15">${canOperate() ? 'Nenhum ingresso corresponde aos filtros selecionados.' : 'Entre com uma conta da equipe para acessar ingressos e dados pessoais.'}</td></tr>`;
    const batchStatus = byId('batch-status');
    if (batchStatus) {
        batchStatus.textContent = `Banco atualizado · ${new Date().toLocaleTimeString('pt-BR')}`;
        batchStatus.className = 'status-chip status-success';
    }
}

async function refreshProviderData() {
    try {
        await loadPlatformData();
        await loadAudit();
        showToast('Ingressos atualizados a partir do banco Troca Ticket.');
    } catch (error) { showToast(error.message); }
}
function renderAudit() {
    const query = byId('audit-search').value.trim().toLowerCase();
    const digits = query.replace(/\D/g, '');
    const relatedTicketIds = new Set(state.tickets.filter(ticket => digits.length >= 3 && String(ticket.cpf || '').replace(/\D/g, '').includes(digits))
        .flatMap(ticket => [ticket.id, ticket.numero_ingresso, ticket.externalCode].filter(Boolean).map(value => String(value).toLowerCase())));
    const logs = state.audit.filter(entry => {
        if (!query) return true;
        const text = `${entry.itemId || ''} ${entry.description || ''} ${entry.action || ''} ${entry.itemType || ''} ${entry.actorName || ''}`.toLowerCase();
        return text.includes(query) || [...relatedTicketIds].some(ticketId => text.includes(ticketId));
    });
    byId('audit-rows').innerHTML = logs.length ? logs.map(entry => {
        const transfer = /transferencia/i.test(`${entry.action || ''} ${entry.description || ''}`);
        const stateLabel = transfer ? 'Concluída' : /aceit|conclu/i.test(entry.description || '') ? 'Concluída' : /revog|cancel/i.test(entry.description || '') ? 'Revogada' : 'Registro operacional';
        const originHolder = entry.originHolder || entry.description?.match(/titular anterior ([^;]+)/i)?.[1] || 'Consultar auditoria';
        const recipientHolder = entry.recipientHolder || entry.currentHolder || entry.description?.match(/novo titular ([^;]+)/i)?.[1] || 'Consultar auditoria';
        return `<tr><td>${escapeHTML(entry.itemId || 'Ingresso')}</td><td>${escapeHTML(originHolder)}</td><td>${escapeHTML(recipientHolder)}</td><td><span class="table-status ${stateLabel === 'Concluída' ? 'available' : stateLabel === 'Revogada' ? 'revoked' : 'used'}">${stateLabel}</span></td><td>${transfer ? '<span class="security-note">Hash anterior invalidado; novo hash gerado atomicamente.</span>' : '—'}</td><td>${escapeHTML(formatDate(entry.timestamp))}</td></tr>`;
    }).join('') : `<tr><td class="table-empty" colspan="6">${query ? 'Nenhum log corresponde ao ID ou CPF pesquisado.' : 'Nenhuma movimentação de bilheteria encontrada na auditoria.'}</td></tr>`;
}
async function showActivePayload(event) {
    const button = event.target.closest('[data-show-payload]');
    if (!button) return;
    const output = $(`[data-payload-for="${CSS.escape(button.dataset.showPayload)}"]`);
    button.disabled = true;
    try {
        const result = await requestActivePayload(getTicket(button.dataset.showPayload));
        output.textContent = `${result.payload} · válido até ${new Date(result.expiresAt).toLocaleTimeString('pt-BR')}`;
    } catch (error) { output.textContent = error.message; }
    finally { button.disabled = false; }
}

function bindEvents() {
    $$('.tab-button').forEach(button => button.addEventListener('click', () => {
        $$('.tab-button').forEach(tab => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
        $$('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.tab; panel.classList.toggle('is-active', !panel.hidden); });
    }));
    byId('gate-event').addEventListener('change', () => {
        state.selectedDemoTicketId = null;
        state.demoOptionsOpen = false;
        const demoTicketSearch = byId('demo-ticket-search');
        if (demoTicketSearch) demoTicketSearch.value = '';
        renderGateSectors();
        renderDemoTicketOptions();
        updateScannerAvailability();
    });
    byId('gate-sector').addEventListener('change', renderGateSummary);
    byId('toggle-scanner').addEventListener('click', () => state.scannerRunning ? stopScanner() : startScanner());
    byId('camera-select').addEventListener('change', event => switchScannerCamera(event.target.value));
    byId('refresh-cameras').addEventListener('click', async () => {
        const cameras = await refreshCameraOptions();
        showToast(cameras.length ? `${cameras.length} câmera(s) encontrada(s).` : 'Nenhuma câmera encontrada. Confira as permissões do navegador.');
    });
    byId('torch-toggle').addEventListener('click', toggleTorch);
    const contingencySearch = byId('contingency-search');
    const contingencyOptions = byId('contingency-options');
    if (contingencySearch) {
        contingencySearch.addEventListener('focus', () => renderContingencyOptions());
        contingencySearch.addEventListener('input', event => {
            window.clearTimeout(state.contingencyLookupTimer);
            state.contingencyLookupTimer = window.setTimeout(() => lookupContingencyTicket(event.target.value), 250);
        });
        contingencySearch.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                const options = byId('contingency-options');
                if (options) options.hidden = true;
                contingencySearch.setAttribute('aria-expanded', 'false');
            }
            if (event.key === 'Enter') {
                const firstOption = byId('contingency-options')?.querySelector('[data-contingency-ticket-id]');
                if (firstOption) { event.preventDefault(); firstOption.click(); }
            }
        });
    }
    if (contingencyOptions) {
        contingencyOptions.addEventListener('click', event => {
            const option = event.target.closest('[data-contingency-ticket-id]');
            if (!option) return;
            const ticket = getTicket(option.dataset.contingencyTicketId);
            if (!ticket) return;
            const searchInput = byId('contingency-search');
            if (searchInput) {
                searchInput.value = `${ticket.holder} · CPF ${formatCpf(ticket.cpf)} · ${ticket.numero_ingresso}`;
                searchInput.setAttribute('aria-expanded', 'false');
            }
            renderContingencyTicket(ticket);
            renderContingencyOptions();
        });
    }
    const contingencyTicketDetail = byId('contingency-ticket-detail');
    if (contingencyTicketDetail) contingencyTicketDetail.addEventListener('submit', approveManualCheckin);
    $$('.integrator-pill').forEach(button => button.addEventListener('click', () => {
        state.provider = button.dataset.provider;
        $$('.integrator-pill').forEach(pill => pill.classList.toggle('is-active', pill === button));
        renderProviderTable();
    }));
    ['provider-filter-event', 'provider-filter-sector', 'provider-filter-lot', 'provider-filter-category', 'provider-filter-operator', 'provider-filter-reason'].forEach(id => byId(id).addEventListener('change', renderProviderTable));
    byId('provider-status-filter').addEventListener('change', renderProviderTable);
    byId('provider-origin-filter').addEventListener('change', renderProviderTable);
    byId('provider-global-search').addEventListener('input', renderProviderTable);
    byId('sync-provider').addEventListener('click', refreshProviderData);
    byId('provider-ticket-rows').addEventListener('click', showActivePayload);
    byId('audit-search').addEventListener('input', renderAudit);
}

async function initialize() {
    state.operator = readOperator();
    const hasOperatorAccess = canOperate();
    byId('operator-name').textContent = hasOperatorAccess ? (state.operator.nome || state.operator.name || 'Equipe de Portaria') : 'Acesso restrito';
    byId('operator-status').textContent = hasOperatorAccess ? `Perfil ${state.operator.tipo}` : 'Entre com uma conta da equipe';
    byId('toggle-scanner').disabled = !byId('gate-event').value;
    const contingencySearch = byId('contingency-search');
    if (contingencySearch) contingencySearch.disabled = !hasOperatorAccess;
    updateClock();
    window.setInterval(updateClock, 1000);
    bindEvents();
    try {
        await loadPlatformData({ preserveSelection: false });
        await loadAudit();
    } catch (error) {
        console.error('[bilheteria] Erro ao carregar dados da plataforma:', error);
        byId('gate-event').innerHTML = makeOption('', 'Não foi possível carregar eventos');
        byId('gate-sector').innerHTML = makeOption('*', 'Todas as Áreas / Portaria Geral');
        byId('provider-ticket-rows').innerHTML = `<tr><td class="table-empty" colspan="13">${escapeHTML(error.message)}</td></tr>`;
        showToast(`Não foi possível carregar o painel: ${error.message || 'erro desconhecido'}`);
    }
}

initialize();

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/bilheteria.css

```css
:root {
    color-scheme: dark;
    --bg: #101114;
    --panel: #171a20;
    --panel-raised: #202531;
    --line: #292b35;
    --text: #f7f6f2;
    --muted: #a4a6b0;
    --blue: #27b7ff;
    --green: #7ce0a2;
    --green-dark: #173d2b;
    --amber: #ffc66d;
    --red: #ff7777;
    --radius: 8px;
    font-family: 'Manrope', sans-serif;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Manrope', sans-serif; }
button, input, select, textarea { font: inherit; }
button, select { cursor: pointer; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.app-shell { min-height: 100vh; }
.app-header { position: sticky; z-index: 50; top: 0; height: 82px; padding: 0 max(32px, calc((100% - 1180px) / 2)); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: rgba(16, 19, 19, 0.93); backdrop-filter: blur(16px); }
.brand { display: inline-flex; gap: 10px; align-items: center; color: var(--text); text-decoration: none; }
.header-meta { display: flex; align-items: center; gap: 9px; color: var(--muted); font-size: 12px; }
.header-meta time { padding-left: 12px; border-left: 1px solid var(--line); color: var(--text); font-variant-numeric: tabular-nums; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 0 4px #ffc66d1a; }
.main-content { width: min(1440px, 100%); margin: 0 auto; padding: 35px 5vw 72px; }
.page-heading, .panel-title-row, .table-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.page-heading { margin-bottom: 28px; }
.eyebrow { margin: 0 0 7px; color: var(--blue); font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
h1, h2, h3, p { margin-top: 0; }
h1 { margin-bottom: 7px; font-size: 34px; line-height: 1.12; }
.subheading { margin: 0; color: var(--muted); font-size: 14px; }
.operator-badge { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); }
.operator-avatar { width: 32px; height: 32px; display: grid; place-items: center; background: #202531; color: var(--blue); font-size: 11px; font-weight: 700; }
.operator-badge strong, .operator-badge small { display: block; }
.operator-badge strong { font-size: 12px; }
.operator-badge small { margin-top: 3px; color: var(--muted); font-size: 10px; }
.tab-bar { display: flex; gap: 4px; overflow-x: auto; border-bottom: 1px solid var(--line); scrollbar-width: thin; }
.tab-button { position: relative; flex: 0 0 auto; min-height: 48px; padding: 0 18px; border: 0; background: transparent; color: var(--muted); font-size: 13px; font-weight: 650; }
.tab-button:hover { color: var(--text); }
.tab-button.is-active { color: var(--blue); }
.tab-button.is-active::after { position: absolute; right: 12px; bottom: -1px; left: 12px; height: 2px; background: var(--blue); content: ""; }
.tab-panel { padding-top: 27px; animation: panel-in .25s ease both; }
.tab-panel[hidden] { display: none; }
@keyframes panel-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.panel-title-row { margin-bottom: 20px; }
.panel-title-row h2 { margin: 0; font-size: 21px; }
.surface { min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); }
.status-chip { display: inline-flex; align-items: center; min-height: 27px; padding: 0 10px; border: 1px solid var(--line); border-radius: 99px; font-size: 10px; font-weight: 700; white-space: nowrap; }
.status-neutral { color: #c5c5cf; background: #202531; }
.status-success { color: var(--green); background: #183323; border-color: #356848; }
.status-warning { color: var(--amber); background: #392c18; border-color: #725528; }
.status-danger { color: var(--red); background: #3a2022; border-color: #70383b; }
.gate-config { display: grid; grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) auto; align-items: end; gap: 14px; margin-bottom: 16px; }
label { display: grid; gap: 8px; color: #d0cfd6; font-size: 11px; font-weight: 650; }
input, select, textarea { width: 100%; min-width: 0; min-height: 42px; padding: 10px 12px; border: 1px solid #393b46; border-radius: 5px; background: #14161c; color: var(--text); }
textarea { min-height: 70px; resize: vertical; }
input::placeholder, textarea::placeholder { color: #898b96; }
.button { min-height: 42px; padding: 0 15px; border: 1px solid transparent; border-radius: 5px; color: #101714; font-size: 12px; font-weight: 750; transition: filter .15s, transform .15s, background .15s; }
.button:hover { filter: brightness(1.08); transform: translateY(-1px); }
.button:disabled { cursor: not-allowed; opacity: .5; transform: none; }
.button-start { min-width: 235px; background: var(--green); }
.button-start.is-running { border-color: #744144; background: #49272a; color: #ffd2d2; }
.button-primary { background: var(--green); }
.button-secondary { border-color: #393b46; background: #202531; color: var(--text); }
.button-small { min-height: 38px; padding: 0 12px; white-space: nowrap; }
.scanner-layout { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(230px, .65fr); gap: 16px; }
.scanner-column { padding: 16px; }
.camera-controls { display: grid; grid-template-columns: minmax(180px, 1fr) auto; align-items: end; gap: 10px; margin-bottom: 12px; }
.camera-controls label { min-width: 0; }
.camera-controls select { min-height: 40px; }
.scanner-frame { position: relative; display: flex; min-height: 325px; overflow: hidden; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 5px; background: #101114; }
.torch-toggle { position: absolute; z-index: 2; top: 12px; right: 12px; min-height: 36px; padding: 0 11px; border: 1px solid #393b46; border-radius: 5px; background: #171a20e8; color: var(--text); font-size: 11px; font-weight: 700; }
.torch-toggle[hidden] { display: none; }
.torch-toggle.is-on { border-color: #b78b3e; background: #392c18; color: var(--amber); }
#reader { position: relative; z-index: 1; width: 100%; max-width: 560px; margin: 0 auto; }
#reader__scan_region { width: 100% !important; min-height: 0 !important; }
#reader video, #reader__scan_region video { display: block !important; width: 100% !important; max-height: 460px; aspect-ratio: 1; object-fit: cover; }
#reader__dashboard, #reader__status_span, #reader__header_message { display: none !important; }
#reader__scan_region img { display: none !important; }
.scanner-placeholder { position: absolute; z-index: 2; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; color: var(--muted); pointer-events: none; text-align: center; }
.scanner-placeholder[hidden] { display: none; }
.scanner-placeholder strong { color: var(--text); font-size: 14px; }
.scanner-placeholder span:last-child { font-size: 11px; }
.scan-symbol { width: 54px; height: 54px; display: grid; place-items: center; margin-bottom: 3px; border: 1px solid #27678a; color: var(--blue); font-size: 34px; }
.scanner-hint { margin: 12px 2px 0; color: var(--muted); font-size: 11px; line-height: 1.55; }
.manual-token { margin-top: 17px; border-top: 1px solid var(--line); padding-top: 14px; }
.manual-token summary { width: fit-content; color: #c5c5cf; font-size: 12px; font-weight: 650; cursor: pointer; }
.manual-token form { display: grid; gap: 10px; margin-top: 14px; }
.manual-token form label, .demo-token-tools > label { color: var(--muted); }
.manual-token form .button { justify-self: start; }
.demo-token-tools { display: grid; gap: 9px; margin-top: 16px; }
.inline-controls { display: flex; gap: 8px; }
.inline-controls select { flex: 1; }
.ticket-combobox { position: relative; flex: 1; min-width: 0; }
.ticket-combobox input { width: 100%; }
.combobox-options { position: absolute; z-index: 15; top: calc(100% + 4px); right: 0; left: 0; max-height: 260px; overflow-y: auto; padding: 5px; border: 1px solid #393b46; border-radius: 5px; background: #171a20; box-shadow: 0 12px 28px #0009; }
.combobox-options[hidden] { display: none; }
.combobox-option { display: grid; gap: 4px; width: 100%; padding: 10px; border: 0; border-radius: 4px; background: transparent; color: var(--text); text-align: left; }
.combobox-option:hover, .combobox-option:focus-visible { outline: 0; background: #202531; }
.combobox-option strong { font-size: 11px; }
.combobox-option small, .combobox-empty { margin: 0; color: var(--muted); font-size: 10px; }
.combobox-empty { padding: 11px; }
.gate-side { display: flex; flex-direction: column; }
.gate-side-heading { display: flex; align-items: center; gap: 12px; }
.gate-icon { width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid #27678a; background: #152632; color: var(--blue); font-size: 17px; font-weight: 800; }
.gate-side-heading .eyebrow { margin-bottom: 4px; font-size: 9px; }
.gate-side-heading strong { font-size: 13px; }
.side-divider { height: 1px; margin: 20px 0; background: var(--line); }
.side-stat { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 15px; color: var(--muted); font-size: 11px; }
.side-stat strong { color: var(--text); font-variant-numeric: tabular-nums; }
.security-note { margin: auto 0 0; padding: 12px; border-left: 2px solid #557c60; background: #1d2923; color: #b8c9be; font-size: 10px; line-height: 1.6; }
.support-layout { display: grid; grid-template-columns: minmax(250px, .78fr) minmax(0, 1.5fr); align-items: start; gap: 16px; }
.search-surface > label { margin-bottom: 9px; }
.search-input-wrap { position: relative; }
.search-input-wrap span { position: absolute; top: 7px; left: 12px; color: var(--muted); font-size: 22px; }
.search-input-wrap input { padding-left: 42px; }
.field-hint { margin: 8px 0 0; color: var(--muted); font-size: 10px; }
.search-results { display: grid; gap: 7px; margin-top: 15px; }
.search-result { display: flex; justify-content: space-between; gap: 10px; width: 100%; padding: 11px; border: 1px solid var(--line); border-radius: 5px; background: #14161c; color: var(--text); text-align: left; }
.search-result:hover, .search-result.is-selected { border-color: #59866a; background: #1c2a22; }
.search-result strong, .search-result small { display: block; }
.search-result strong { font-size: 11px; }
.search-result small { margin-top: 4px; color: var(--muted); font-size: 10px; }
.quick-filters { display: flex; flex-wrap: wrap; gap: 6px; margin: 13px 0 0; }
.filter-chip { min-height: 31px; padding: 0 10px; border: 1px solid var(--line); border-radius: 99px; background: #14161c; color: #c5c5cf; font-size: 10px; font-weight: 650; }
.filter-chip:hover { border-color: #557c60; color: var(--text); }
.filter-chip.is-active { border-color: #568767; background: #1d3024; color: var(--green); }
.empty-state { min-height: 245px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--muted); text-align: center; }
.empty-state > span { margin-bottom: 12px; color: #73817f; font-size: 28px; }
.empty-state strong { color: var(--text); font-size: 13px; }
.empty-state p { max-width: 280px; margin: 7px 0 0; font-size: 11px; line-height: 1.5; }
.ticket-detail h3 { margin-bottom: 16px; font-size: 15px; }
.ticket-data { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 0 0 20px; }
.ticket-data div { min-width: 0; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.ticket-data dt { color: var(--muted); font-size: 10px; }
.ticket-data dd { overflow-wrap: anywhere; margin: 5px 0 0; font-size: 12px; font-weight: 650; }
.manual-approval { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 10px; padding-top: 14px; border-top: 1px solid var(--line); }
.manual-approval .button { min-width: 200px; }
.manual-approval-note { grid-column: 1 / -1; margin: 0; color: var(--muted); font-size: 10px; }
.integrator-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
.integrator-pill { min-height: 39px; padding: 0 13px; border: 1px solid var(--line); border-radius: 5px; background: var(--panel); color: #c5c5cf; font-size: 11px; font-weight: 700; }
.integrator-pill small { margin-left: 5px; color: var(--muted); font-size: 9px; font-weight: 500; }
.integrator-pill.is-active { border-color: #27678a; background: #152632; color: var(--blue); }
.metrics-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 15px; }
.metric-card { min-height: 90px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; padding: 14px; border: 1px solid var(--line); border-radius: 5px; background: var(--panel); }
.metric-card span { color: var(--muted); font-size: 10px; }
.metric-card strong { font-size: 20px; font-variant-numeric: tabular-nums; }
.metric-card .api-status { color: var(--green); font-size: 12px; }
.integration-settings { display: grid; grid-template-columns: minmax(180px, 1fr) minmax(200px, 1fr) auto; align-items: end; gap: 12px; margin-bottom: 15px; }
.provider-filters { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 12px; margin-bottom: 15px; }
.audit-search { width: min(250px, 45%); min-width: 180px; color: var(--muted); font-size: 10px; }
.audit-search input { min-height: 36px; }
.table-surface, .audit-surface { padding: 0; overflow: hidden; }
.table-heading { padding: 16px 18px; }
.table-heading h3 { margin: 0; font-size: 13px; }
.table-heading p { margin: 5px 0 0; color: var(--muted); font-size: 10px; }
.table-scroll { width: 100%; overflow-x: auto; overflow-y: hidden; }
.table-scroll-top { max-height: none; overflow-x: auto; overflow-y: hidden; border-bottom: 1px solid var(--line); transform: rotateX(180deg); }
.table-scroll-top > table { transform: rotateX(180deg); }
#provider-table-scroll { scrollbar-gutter: stable; }
#provider-table-scroll::-webkit-scrollbar { height: 10px; width: 10px; }
#provider-table-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 999px; }
.provider-table-grid { width: 1955px; min-width: 1955px; }
.provider-table-grid col:nth-child(1) { width: 150px; }
.provider-table-grid col:nth-child(2), .provider-table-grid col:nth-child(3) { width: 125px; }
.provider-table-grid col:nth-child(4) { width: 175px; }
.provider-table-grid col:nth-child(5) { width: 125px; }
.provider-table-grid col:nth-child(6), .provider-table-grid col:nth-child(7) { width: 160px; }
.provider-table-grid col:nth-child(8), .provider-table-grid col:nth-child(9) { width: 145px; }
.provider-table-grid col:nth-child(10) { width: 105px; }
.provider-table-grid col:nth-child(11), .provider-table-grid col:nth-child(12) { width: 165px; }
.provider-table-grid col:nth-child(13) { width: 355px; }
th, td { overflow: hidden; padding: 12px 14px; border-top: 1px solid var(--line); border-right: 1px solid #252832; font-size: 10px; text-overflow: ellipsis; vertical-align: middle; }
th:last-child, td:last-child { border-right: 0; }
thead th, tbody td { box-sizing: border-box; }
th { color: var(--muted); background: #171a20; font-size: 9px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
td { color: #dce3e0; }
td .cell-main, td .cell-sub { display: block; }
td .cell-sub { margin-top: 4px; color: var(--muted); font-size: 9px; }
.table-empty { padding: 25px; color: var(--muted); text-align: center; white-space: normal; }
.table-status { display: inline-block; padding: 4px 7px; border: 1px solid var(--line); border-radius: 99px; font-size: 9px; }
.table-status.available { color: var(--green); border-color: #355e43; background: #1d3024; }
.table-status.used { color: var(--amber); border-color: #66502e; background: #332919; }
.table-status.revoked { color: var(--red); border-color: #603b3c; background: #352123; }
.active-payload { display: block; max-width: 320px; overflow-wrap: anywhere; margin-top: 7px; color: var(--blue); font: 10px/1.5 'DM Mono', monospace; white-space: normal; }
.transfer-layout { display: grid; grid-template-columns: minmax(270px, .75fr) minmax(0, 1.4fr); align-items: start; gap: 15px; }
.transfer-form { display: grid; gap: 14px; }
.transfer-form .security-note { margin: 0; }
.form-message { min-height: 0; margin: 0; color: var(--green); font-size: 11px; line-height: 1.5; }
.form-message:empty { display: none; }
.feedback-overlay { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 24px; background: #080b0ddf; animation: overlay-in .12s ease-out; }
.feedback-overlay[hidden] { display: none; }
@keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
.feedback-content { width: min(700px, 100%); max-height: 86vh; overflow: auto; padding: clamp(26px, 5vw, 54px); border: 2px solid currentColor; border-radius: 10px; background: #15221a; color: var(--green); text-align: center; box-shadow: 0 0 55px #0009, 0 0 35px currentColor 22; }
.feedback-overlay[data-kind="warning"] .feedback-content { background: #2a2113; color: var(--amber); }
.feedback-overlay[data-kind="error"] .feedback-content { background: #2b171a; color: var(--red); }
.feedback-symbol { display: block; margin-bottom: 12px; font-size: 46px; font-weight: 800; line-height: 1; }
.feedback-kicker { margin-bottom: 8px; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
.feedback-content h2 { margin-bottom: 14px; color: #fff; font-size: 38px; }
.feedback-content #feedback-detail { color: #e5ece8; font-size: 15px; line-height: 1.65; }
.feedback-content #feedback-detail strong { color: currentColor; }
.toast { position: fixed; z-index: 30; right: 20px; bottom: 20px; max-width: min(420px, calc(100vw - 40px)); padding: 13px 16px; border: 1px solid #568767; border-radius: 5px; background: #1d3024; color: var(--text); font-size: 12px; box-shadow: 0 12px 30px #0007; opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity .18s, transform .18s; }
.toast.is-visible { opacity: 1; transform: translateY(0); }

@media (max-width: 900px) {
    .main-content { padding-right: 22px; padding-left: 22px; }
    .scanner-layout { grid-template-columns: minmax(0, 1fr) 240px; }
    .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .integration-settings { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .integration-settings .button { grid-column: 1 / -1; }
    .provider-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 780px) {
    .gate-config { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gate-config .button { grid-column: 1 / -1; width: 100%; }
    .scanner-layout, .support-layout, .transfer-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
    .app-header { height: 68px; padding: 0 16px; }
    .header-meta { font-size: 0; }
    .header-meta time { padding-left: 0; border: 0; font-size: 11px; }
    .main-content { padding: 25px 14px 48px; }
    .page-heading { align-items: flex-start; flex-direction: column; gap: 15px; margin-bottom: 20px; }
    .operator-badge { align-self: stretch; }
    .tab-bar { margin: 0 -14px; padding: 0 8px; }
    .tab-button { min-height: 45px; padding: 0 12px; font-size: 11px; }
    .tab-panel { padding-top: 20px; }
    .panel-title-row { align-items: flex-start; }
    .panel-title-row h2 { font-size: 19px; }
    h1 { font-size: 27px; }
    .surface { padding: 15px; }
    .gate-config, .scanner-layout, .support-layout, .transfer-layout { grid-template-columns: 1fr; }
    .gate-config .button { width: 100%; }
    .camera-controls { grid-template-columns: minmax(0, 1fr) auto; }
    .camera-controls .button { min-height: 40px; padding: 0 9px; font-size: 10px; }
    .scanner-frame { min-height: 275px; }
    .gate-side { min-height: 225px; }
    .security-note { margin-top: 14px; }
    .integration-settings { grid-template-columns: 1fr; }
    .integration-settings .button { grid-column: auto; }
    .provider-filters { grid-template-columns: 1fr; }
    .audit-search { width: 100%; min-width: 0; }
    .metrics-grid { gap: 8px; }
    .metric-card { min-height: 82px; padding: 11px; }
    .metric-card strong { font-size: 18px; }
    .ticket-data { gap: 12px; }
    .manual-approval { grid-template-columns: 1fr; }
    .manual-approval .button { width: 100%; }
    .manual-approval-note { grid-column: auto; }
    .inline-controls { align-items: stretch; flex-direction: column; }
    .ticket-combobox { width: 100%; }
    .table-heading { align-items: flex-start; padding: 14px; }
    th, td { padding: 11px 12px; }
    .feedback-content #feedback-detail { font-size: 13px; }
    .feedback-content h2 { font-size: 25px; }
}
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/cadastro-pj.js

```javascript
const form = document.getElementById('pj-form');
const message = document.getElementById('pj-message');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch('/api/auth/cadastro-pj', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    localStorage.setItem('trocaticket-authenticated', 'true');
    localStorage.setItem('trocaticket-user', JSON.stringify(data.user));
    window.location.href = data.redirect;
  } catch (error) { console.error('[cadastro-pj] Erro:', error); message.textContent = error.message; }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/cadastro.js

```javascript
const form = document.getElementById('register-page-form');
const message = document.getElementById('page-message');
const verificationMessage = document.getElementById('verification-message');
const verificationStep = document.getElementById('verification-step');
const verificationForm = document.getElementById('verification-form');
let verificationEmail = '';

function showMessage(text) {
  const target = verificationStep.hidden ? message : verificationMessage;
  target.textContent = text;
}

async function post(url, body) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
  return data;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (data.senha !== data.confirmarSenha) return showMessage('As senhas precisam ser iguais.');
  const cpf = String(data.cpf || '').replace(/\D/g, '');
  const telefone = String(data.celular || '').replace(/\D/g, '');
  if (cpf.length !== 11) return showMessage('Informe um CPF com 11 números. A pontuação é opcional.');
  if (telefone.length < 10 || telefone.length > 15) return showMessage('Informe um telefone com 10 a 15 números, incluindo o código do país se necessário.');
  try {
    showMessage('Enviando cadastro...');
    await post('/api/auth/register-pf', { nome: `${data.nome} ${data.sobrenome}`, cpf, telefone, nascimento: data.nascimento, sexo: data.sexo, email: data.email, senha: data.senha });
    verificationEmail = data.email;
    document.querySelector('.page-form-content').hidden = true;
    verificationStep.hidden = false;
    showMessage('Cadastro criado. Verifique sua caixa de entrada e informe o código recebido.');
  } catch (error) {
    console.error('[cadastro] Erro:', error);
    showMessage(error.message);
  }
});

verificationForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const result = await post('/api/auth/verificar-codigo', { email: verificationEmail, codigo: verificationForm.codigo.value.trim() });
    localStorage.setItem('trocaticket-authenticated', 'true');
    localStorage.setItem('trocaticket-user', JSON.stringify(result.user));
    window.location.href = '/index.html';
  } catch (error) {
    console.error('[cadastro] Erro ao verificar código:', error);
    showMessage(error.message);
  }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/cartoes.css

```css
/* ===== TELA MEUS CARTÕES (ESCALA 80% EM 100% ZOOM NATIVO) ===== */
.cards-page {
  min-height: 100vh;
  margin: 0;
  background: #1d1e23;
  color: #f4f4f5;
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.cards-shell {
  width: min(540px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 44px;
}

.cards-back {
  display: inline-block;
  color: #aeb7df;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.cards-back:hover {
  color: #ffffff;
}

.cards-header {
  margin: 20px 0 20px;
}

.cards-header h1 {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.cards-header p:last-child {
  margin: 0;
  color: #a4a6b0;
  font-size: 13px;
}

.cards-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
  border-radius: 10px;
  background: #2b2c34;
}

.cards-tab {
  min-height: 40px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #bfc0c6;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.cards-tab.active {
  background: #7186d0;
  color: #ffffff;
}

.cards-tab-panel {
  margin-top: 18px;
}

.cards-tab-panel[hidden] {
  display: none;
}

.cards-list {
  display: grid;
  gap: 12px;
}

.saved-card {
  padding: 16px;
  border: 1px solid #3c3e47;
  border-radius: 12px;
  background: #25262c;
}

.saved-card-top,
.saved-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-brand {
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
}

.card-digits {
  margin: 14px 0;
  color: #ffffff;
  font-size: 16px;
  letter-spacing: 2px;
  font-family: 'DM Mono', monospace;
}

.card-holder {
  color: #c5c6cb;
  font-size: 12px;
  font-weight: 700;
}

.card-expiry {
  color: #9ca3af;
  font-size: 12px;
}

.card-delete {
  border: 0;
  background: transparent;
  color: #f87171;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
}

.card-delete:hover {
  color: #ef4444;
}

.card-form {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 12px;
  background: #25262c;
}

.card-form label {
  display: grid;
  gap: 5px;
  color: #c9cbd2;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.card-form input {
  min-height: 42px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #3c3e47;
  border-radius: 8px;
  background: #1d1e23;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  outline: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-form input:focus {
  border-color: #7186d0;
  box-shadow: 0 0 0 2px rgba(113, 134, 208, 0.2);
}

.card-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cards-primary {
  min-height: 44px;
  margin-top: 4px;
  border: 0;
  border-radius: 8px;
  background: #7186d0;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cards-primary:hover {
  background: #5d74c4;
}

.cards-status {
  min-height: 16px;
  margin: 4px 0 0;
  font-size: 12px;
  color: #d8a0a0;
  text-align: center;
}

.card-form input:-webkit-autofill,
.card-form input:-webkit-autofill:hover,
.card-form input:-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff;
  -webkit-box-shadow: 0 0 0 1000px #1d1e23 inset;
  box-shadow: 0 0 0 1000px #1d1e23 inset;
  transition: background-color 9999s ease-out 0s;
}

@media (max-width: 520px) {
  .cards-shell {
    width: min(100% - 24px, 540px);
    padding-top: 18px;
  }
  .cards-header h1 {
    font-size: 22px;
  }
  .cards-tab {
    font-size: 11px;
  }
  .card-form-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/cartoes.js

```javascript
const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
const list = document.getElementById('cards-list');
const form = document.getElementById('card-form');
const message = document.getElementById('card-message');

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/index.html';
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const menuHeaderSair = document.getElementById('menu-header-sair');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (menuHeaderSair) {
  menuHeaderSair.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });
}

if (!user) window.location.href = '../auth/login.html';

function showTab(name) {
  document.querySelectorAll('.cards-tab').forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.getElementById('saved-tab').hidden = name !== 'saved';
  document.getElementById('new-tab').hidden = name !== 'new';
}

document.querySelectorAll('.cards-tab').forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

function renderCards(cards) {
  if (!cards.length) {
    list.innerHTML = '<p class="cards-status">Nenhum cartão cadastrado. Clique na aba ao lado para adicionar.</p>';
    return;
  }
  list.innerHTML = cards.map(card => `
    <article class="saved-card">
      <div class="saved-card-top">
        <strong class="card-brand">${card.bandeira || 'Cartão'}</strong>
        <button class="card-delete" type="button" data-delete="${card.id}">Excluir Cartão</button>
      </div>
      <div class="card-digits">•••• •••• •••• ${card.ultimos_digitos}</div>
      <div class="saved-card-bottom">
        <span class="card-holder">${card.nome_titular}</span>
        <span class="card-expiry">Validade ${card.validade_mes}/${String(card.validade_ano).slice(-2)}</span>
      </div>
    </article>
  `).join('');
}

async function loadCards() {
  try {
    const response = await fetch(`/api/usuario/cartoes?email=${encodeURIComponent(user.email)}`);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    renderCards(data.cards || []);
  } catch (error) {
    console.error('[cartoes] Erro ao carregar:', error);
    list.innerHTML = `<p class="cards-status">${error.message || 'Não foi possível carregar os cartões.'}</p>`;
  }
}

if (form.numero_cartao) {
  form.numero_cartao.addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  });
}

if (form.validade) {
  form.validade.addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  values.cpf = String(values.cpf || '').replace(/\D/g, '');
  if (values.cpf.length !== 11) {
    message.style.color = '#f87171';
    message.textContent = 'Informe um CPF com 11 números. A pontuação é opcional.';
    return;
  }
  const [month, year] = values.validade.split('/');
  try {
    const response = await fetch('/api/usuario/cartoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, email: user.email, validade_mes: month, validade_ano: year })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    form.reset();
    message.style.color = '#4ade80';
    message.textContent = 'Cartão salvo com segurança.';
    await loadCards();
    showTab('saved');
  } catch (error) {
    console.error('[cartoes] Erro ao salvar:', error);
    message.style.color = '#f87171';
    message.textContent = error.message || 'Não foi possível salvar o cartão.';
  }
});

list.addEventListener('click', async event => {
  const button = event.target.closest('[data-delete]');
  if (!button || !confirm('Excluir este cartão?')) return;
  try {
    const response = await fetch(`/api/usuario/cartoes/${button.dataset.delete}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    await loadCards();
  } catch (error) {
    console.error('[cartoes] Erro ao excluir:', error);
    message.style.color = '#f87171';
    message.textContent = error.message;
  }
});

loadCards();
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/chat.css

```css
.chat-page{height:100vh;height:100dvh;min-height:0;overflow:hidden}
.chat-shell{height:100%;min-height:0;display:grid;grid-template-columns:minmax(280px,360px) minmax(0,1fr);background:#090d18}
.chat-sidebar{display:flex;min-height:0;flex-direction:column;border-right:1px solid var(--border-color);background:#101827}
.chat-sidebar-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border-color)}
.chat-sidebar-header .brand{font-size:1.15rem}.chat-sidebar-header .brand-logo{height:28px}
.chat-back-link{color:var(--text-muted);font-size:.75rem;text-decoration:none}.chat-back-link:hover{color:var(--cyan)}
.chat-sidebar-title{display:flex;align-items:center;justify-content:space-between;padding:24px 22px 14px}.chat-sidebar-title h1{margin:4px 0 0;font-size:1.6rem}
.chat-search{display:flex;align-items:center;gap:8px;margin:0 18px 14px;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:#0c1422;color:var(--text-muted)}
.chat-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--text-primary)}.chat-contact-list{min-height:0;overflow-y:auto}
.chat-contact{display:flex;align-items:center;gap:11px;width:100%;padding:14px 18px;border:0;border-bottom:1px solid rgba(148,163,184,.1);background:transparent;color:var(--text-primary);text-align:left;cursor:pointer}
.chat-contact:hover,.chat-contact.is-selected{background:rgba(124,106,242,.15)}
.chat-contact-avatar,.chat-empty-icon{display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7c6af2,#4cc9f0);color:#fff;font-weight:800}
.chat-contact-copy{display:grid;gap:3px;min-width:0;flex:1}.chat-contact-copy strong,.chat-contact-copy small,.chat-contact-copy em{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chat-contact-copy small{color:var(--cyan);font-size:.7rem}.chat-contact-copy em{color:var(--text-muted);font-size:.72rem;font-style:normal}.chat-contact-time{align-self:flex-start;color:var(--text-muted);font-size:.65rem}
.chat-contact-meta{display:grid;justify-items:end;align-self:flex-start;gap:5px;min-width:28px}.chat-contact-meta .chat-row-unread{margin:0}.chat-card-unread-dot{display:block;width:9px;height:9px;border-radius:50%;background:#32e875;box-shadow:0 0 0 3px rgba(50,232,117,.12),0 0 10px rgba(50,232,117,.7)}
.chat-avatar-image{object-fit:cover;padding:0}.chat-conversation-header .chat-avatar-image{width:100%;height:100%;border-radius:50%}.chat-message-avatar{width:28px;height:28px;flex:none;align-self:flex-end;object-fit:cover;border-radius:50%;border:1px solid rgba(76,201,240,.5);margin:0 8px 2px 0}
.chat-conversation{position:relative;min-width:0;min-height:0;background:radial-gradient(circle at 50% 20%,rgba(76,201,240,.06),transparent 40%),#0c1422}
.chat-empty-state{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;text-align:center;color:var(--text-muted)}
.chat-empty-state[hidden],.chat-active-conversation[hidden],.chat-camera-modal[hidden]{display:none!important}.chat-empty-icon{width:72px;height:72px;margin-bottom:16px;font-size:1.7rem}.chat-empty-state h2{margin:0;color:var(--text-primary)}.chat-empty-state p{margin:8px 0}
.chat-active-conversation{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto}.chat-conversation-header{display:flex;align-items:center;gap:12px;min-width:0;padding:18px 26px;border-bottom:1px solid var(--border-color);background:rgba(16,24,39,.92)}
.chat-conversation-header>div:nth-child(2){min-width:0}.chat-conversation-header h2,.chat-conversation-header p{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chat-conversation-header h2{margin:0;font-size:1.05rem}.chat-conversation-header p{margin:4px 0 0;color:var(--text-muted);font-size:.78rem}.chat-status{margin-left:auto;white-space:nowrap;color:var(--green);font-size:.72rem}
.chat-message-list{overflow-y:auto;padding:28px clamp(18px,6vw,80px);background-image:linear-gradient(rgba(12,20,34,.86),rgba(12,20,34,.86)),radial-gradient(#25344b 1px,transparent 1px);background-size:auto,18px 18px}
.chat-bubble-row{display:flex;margin:8px 0}.chat-bubble-row.is-mine{justify-content:flex-end}.chat-bubble{max-width:min(620px,78%);padding:10px 13px;border-radius:10px 10px 10px 2px;background:#1d2a3d;box-shadow:0 2px 6px rgba(0,0,0,.15)}
.chat-bubble-row.is-mine .chat-bubble{border-radius:10px 10px 2px 10px;background:#344b23}.chat-bubble p{margin:0;color:var(--text-primary);line-height:1.45}.chat-bubble small{display:block;margin-top:5px;color:var(--text-muted);font-size:.65rem;text-align:right}
.chat-composer{display:flex;align-items:center;gap:10px;min-width:0;padding:16px 26px;border-top:1px solid var(--border-color);background:#101827}.chat-composer input{flex:1;min-width:80px;padding:12px 14px;border:1px solid var(--border-color);border-radius:10px;outline:0;background:#0c1422;color:var(--text-primary)}.chat-composer .btn-primary{margin:0;white-space:nowrap}
.chat-clip-button,.chat-camera-button{display:grid;place-items:center;width:42px;height:42px;border:1px solid var(--border-color);border-radius:10px;background:#0c1422;color:var(--text-primary);font-size:1.1rem;cursor:pointer}.chat-clip-button:hover,.chat-camera-button:hover{border-color:var(--cyan);background:rgba(76,201,240,.12)}.chat-clip-button input{display:none}
.chat-attachment-name{max-width:180px;overflow:hidden;color:var(--text-muted);font-size:.72rem;text-overflow:ellipsis;white-space:nowrap}.chat-attachment-image{display:block;max-width:260px;max-height:220px;border-radius:8px;margin-bottom:6px}.chat-attachment-link{display:block;margin-bottom:6px;color:var(--cyan);text-decoration:underline}
.chat-camera-modal{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.78)}.chat-camera-card{width:min(620px,100%);padding:16px;border:1px solid var(--border-color);border-radius:16px;background:var(--bg-panel-alt)}.chat-camera-card video{display:block;width:100%;max-height:65vh;border-radius:10px;background:#000}.chat-camera-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}
.chat-no-contacts,.chat-no-messages{padding:24px;color:var(--text-muted);text-align:center}.nav-link-btn{display:block;text-decoration:none}
@media(max-width:720px){
  .chat-shell{grid-template-columns:1fr;grid-template-rows:minmax(190px,38dvh) minmax(0,1fr)}
  .chat-sidebar{height:auto;border-right:0;border-bottom:1px solid var(--border-color)}
  .chat-conversation{height:auto}
  .chat-sidebar-header{padding:12px 16px}
  .chat-sidebar-title{padding:14px 16px 10px}
  .chat-sidebar-title h1{font-size:1.35rem}
  .chat-search{margin:0 14px 8px}
  .chat-contact{padding:10px 14px}
  .chat-contact-copy em{display:none}
  .chat-conversation-header{padding:12px 16px}
  .chat-message-list{padding:14px 12px}
  .chat-bubble{max-width:88%}
  .chat-composer{padding:10px 12px;gap:8px}
  .chat-attachment-name{max-width:110px}
  .chat-status{display:none}
}
@media(max-width:430px){
  .chat-shell{grid-template-rows:minmax(170px,34dvh) minmax(0,1fr)}
  .chat-sidebar-title{padding-top:10px}
  .chat-sidebar-title h1{font-size:1.2rem}
  .chat-contact-avatar,.chat-empty-icon{width:38px;height:38px}
  .chat-contact{gap:8px;padding:8px 12px}
  .chat-contact-copy small{font-size:.65rem}
  .chat-composer{display:grid;grid-template-columns:40px 40px minmax(0,1fr);padding:8px}
  .chat-composer .chat-attachment-name{grid-column:1 / -1;grid-row:1;max-width:none;min-width:0}
  .chat-composer input#chat-message-input{grid-column:1 / 3;grid-row:2;min-width:0}
  .chat-composer .btn-primary{grid-column:3;grid-row:2;padding:10px 12px}
  .chat-clip-button,.chat-camera-button{width:40px;height:40px}
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/checkout.css

```css
.official-facts{display:grid;gap:9px;margin:0;padding:0;list-style:none}.official-facts li{display:flex;gap:8px;align-items:baseline;color:#e5e7eb;font-size:12px;line-height:1.45}.official-facts li::before{content:'•';color:var(--cyan);font-weight:800}.official-facts span{color:var(--muted)}.official-facts strong{color:#f8fafc;font-weight:700}.official-rules{margin:16px 0 0;color:#c5ccd6;font-size:12px;line-height:1.7}
.order-summary.is-inline{position:static!important;order:4;width:100%;margin:0 0 28px;border:1px solid #303744;border-radius:14px;background:var(--panel)}.order-summary.is-inline .summary-inner{width:100%;padding:14px 16px}.accordion-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0;border:0;background:transparent;color:#fff;text-align:left;font-size:15px;font-weight:800}.accordion-trigger span:first-child{line-height:1.35}.accordion-chevron{color:var(--cyan);font-size:18px;transition:transform .2s}.accordion-trigger[aria-expanded="false"] .accordion-chevron{transform:rotate(180deg)}.accordion-content{display:block;margin-top:16px}.accordion-content.is-collapsed{display:none}.official-section,.stay-section{padding:20px}.stay-section>.accordion-content>p{margin:0;color:#c5ccd6;font-size:12px;line-height:1.7}
.promo-section{order:1!important}.map-section{order:2!important;margin-bottom:14px!important;padding:0!important;border:0!important;background:transparent!important}.map-section>div{display:none}.map-section .secondary-action{width:auto!important;margin:0!important;padding:9px 12px!important;border-color:#3a4659;font-size:11px}.ticket-section{order:3!important}
.checkout-content{display:flex!important;flex-direction:column}.checkout-countdown{order:0}.promo-section{order:1}.ticket-section{order:2}.map-section{order:3}.official-section{order:4}.stay-section{order:5}
.quantity-control input{-moz-appearance:textfield;appearance:textfield;cursor:default}.quantity-control input::-webkit-inner-spin-button,.quantity-control input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.checkout-content{margin-top:20px!important}.checkout-countdown{min-height:64px;padding:16px 18px!important}
.checkout-countdown>div{display:flex;align-items:baseline;gap:10px;min-width:0;white-space:nowrap}.checkout-countdown strong{display:inline!important;font-size:12px}.checkout-countdown small{display:inline!important;margin:0;color:var(--cyan);font:500 12px 'DM Mono',monospace}.checkout-event-heading strong{display:none!important}
@media (min-width:768px){.checkout-hero{height:clamp(380px,38vw,620px)}.checkout-hero img{object-fit:cover;object-position:center}}

@media (max-width:767px){
  html,body{width:100%;min-width:0;overflow-x:hidden}
  .checkout-shell{width:100%;min-width:0;padding-bottom:92px}
  .checkout-hero{width:100%;height:min(78vh,560px);min-height:360px}
  .checkout-hero img{width:100%;height:100%;object-fit:contain;object-position:center;background:#000}
  .checkout-back{top:12px;left:12px;width:38px;height:38px}
  .checkout-event-heading{right:16px;bottom:24px;left:16px;width:auto;max-width:none}
  .checkout-event-heading h1{font-size:clamp(25px,8vw,38px);overflow-wrap:anywhere}
  .checkout-event-heading strong{font-size:13px;overflow-wrap:anywhere}
  .checkout-content{width:calc(100% - 24px);max-width:none;min-width:0;margin:12px auto 0}
  .checkout-countdown{width:100%;min-width:0;margin-bottom:16px;padding:14px}
  .checkout-countdown>div{min-width:0;white-space:normal}
  .checkout-countdown strong,.checkout-countdown small{overflow-wrap:anywhere}
  .checkout-section,.promo-section,.map-section,.official-section,.stay-section{width:100%;min-width:0}
  .section-heading{align-items:flex-start;flex-direction:column;gap:6px}
  .checkout-section h2{font-size:20px}
  .ticket-option{grid-template-columns:minmax(0,1fr) auto;min-width:0}
  .ticket-option h3,.ticket-option p{overflow-wrap:anywhere}
  .promo-form{width:100%;min-width:0}
  .promo-form input{width:1%;min-width:0}
  .promo-form button{padding:0 12px;white-space:nowrap}
  .official-grid{grid-template-columns:1fr;gap:10px}
  .official-grid strong{font-size:22px}
}

@media (max-width:480px){
  .checkout-shell{padding-bottom:76px}
  .checkout-hero{height:clamp(230px,82vw,360px);min-height:0}
  .checkout-back{top:8px;left:8px;width:32px;height:32px;font-size:18px}
  .checkout-event-heading{right:12px;bottom:16px;left:12px}
  .checkout-event-heading p{margin-bottom:5px;font-size:8px}
  .checkout-event-heading h1{font-size:clamp(20px,7vw,32px)}
  .checkout-event-heading strong{margin-top:5px;font-size:11px}
  .checkout-content{width:calc(100% - 16px);margin-top:8px}
  .checkout-countdown{gap:8px;margin-bottom:12px;padding:10px;border-radius:9px}
  .checkout-countdown strong{font-size:10px}
  .checkout-countdown small{font-size:9px}
  .checkout-section{margin-bottom:14px}
  .checkout-section h2{font-size:17px}
  .section-heading{margin-bottom:9px}
  .sector-trigger{padding:11px 10px}
  .sector-trigger strong{font-size:12px}
  .sector-trigger small{font-size:9px}
  .sector-options{padding:0 7px 7px}
  .ticket-option{grid-template-columns:1fr;padding:9px;gap:6px}
  .ticket-option h3{font-size:11px}
  .ticket-option p{font-size:9px}
  .ticket-option-price{text-align:left}
  .ticket-option-price strong{font-size:12px}
  .ticket-option-price small{font-size:9px}
  .quantity-control{margin-top:6px}
  .promo-section,.official-section,.stay-section{padding:12px;border-radius:10px}
  .promo-section h2,.stay-section h2{font-size:17px}
  .promo-form input,.promo-form button{height:38px;font-size:11px}
  .promo-form button{padding:0 9px}
  .official-section,.stay-section{font-size:10px}
  .accordion-trigger{font-size:12px}
  .official-facts li{font-size:10px}
  .official-rules{margin-top:10px;font-size:10px;line-height:1.5}
  .stay-section>.accordion-content>p{font-size:10px}
  .map-section .secondary-action,.secondary-action{padding:9px 10px;font-size:10px}
  .order-summary.is-inline{margin-bottom:14px}
  .order-summary.is-inline .summary-inner{padding:10px}
}

@media (max-width:320px){
  .checkout-hero{height:220px}
  .checkout-event-heading h1{font-size:20px}
  .checkout-content{width:calc(100% - 10px)}
  .checkout-countdown{padding:8px}
  .checkout-section h2{font-size:15px}
  .promo-section,.official-section,.stay-section{padding:9px}
  .promo-form button{padding:0 7px}
}
.event-map-image{display:block;width:100%;max-height:70vh;object-fit:contain;background:#000;border-radius:8px}
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;600;700;800&display=swap');
:root{--bg:#0d0f12;--panel:#161920;--panel-2:#1b202a;--line:#2a313d;--muted:#9aa4b2;--blue:#2563eb;--cyan:#60a5fa;--green:#86efac;--white:#f8fafc;--danger:#fb7185}*{box-sizing:border-box}html{background:var(--bg);scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--white);font-family:Manrope,sans-serif}button,input{font:inherit}button{cursor:pointer}.checkout-shell{min-height:100vh;padding-bottom:128px}.checkout-hero{height:clamp(310px,55vw,560px);position:relative;overflow:hidden;background:#171920}.checkout-hero img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}.checkout-hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,15,18,.12) 25%,var(--bg) 100%)}.checkout-back{position:absolute;top:20px;left:20px;z-index:2;width:42px;height:42px;border:1px solid #ffffff44;border-radius:50%;display:grid;place-items:center;color:#fff;background:#0d0f1299;text-decoration:none;font-size:23px;backdrop-filter:blur(12px)}.checkout-event-heading{position:absolute;right:0;bottom:36px;left:0;z-index:1;width:min(760px,calc(100% - 40px));margin:auto}.checkout-event-heading p,.eyebrow{margin:0 0 8px;color:var(--muted);font:500 10px 'DM Mono',monospace;letter-spacing:.14em;text-transform:uppercase}.checkout-event-heading h1{max-width:760px;margin:0;color:#fff;font-size:clamp(30px,6vw,52px);line-height:1.03;letter-spacing:-.04em}.checkout-event-heading strong{display:block;margin-top:10px;color:var(--cyan);font-size:15px}.checkout-content{width:min(760px,calc(100% - 40px));margin:-6px auto 0}.checkout-countdown{display:flex;align-items:center;gap:12px;margin-bottom:26px;padding:14px 16px;border:1px solid #263d65;border-radius:12px;background:#111a2c}.countdown-pulse{width:9px;height:9px;border-radius:50%;background:#60a5fa;box-shadow:0 0 0 5px #2563eb33}.checkout-countdown strong,.checkout-countdown small{display:block}.checkout-countdown strong{font-size:12px}.checkout-countdown small{margin-top:3px;color:var(--cyan);font:500 12px 'DM Mono',monospace}.checkout-section{margin-bottom:28px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:14px}.checkout-section h2{margin:0;font-size:24px;letter-spacing:-.03em}.selection-count{color:var(--muted);font:11px 'DM Mono',monospace}.sector-accordion{margin-bottom:10px;border:1px solid var(--line);border-radius:12px;background:var(--panel);overflow:hidden}.sector-trigger{width:100%;display:flex;justify-content:space-between;align-items:center;padding:17px 16px;border:0;background:transparent;color:#fff;text-align:left}.sector-trigger strong{font-size:15px}.sector-trigger small{display:block;margin-top:3px;color:var(--muted);font-size:11px}.sector-chevron{color:var(--cyan);font-size:18px;transition:transform .2s}.sector-accordion.is-open .sector-chevron{transform:rotate(180deg)}.sector-options{display:none;padding:0 12px 12px}.sector-accordion.is-open .sector-options{display:grid;gap:8px}.ticket-option{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid #303846;border-radius:9px;background:var(--panel-2)}.ticket-option h3{margin:0;font-size:13px}.ticket-option p{margin:4px 0 0;color:var(--muted);font-size:11px}.ticket-option-price{text-align:right}.ticket-option-price strong{display:block;font-size:14px}.ticket-option-price small{display:block;margin-top:3px;color:var(--muted);font-size:10px}.quantity-control{display:flex;align-items:center;gap:7px;margin-top:10px}.quantity-control button{width:26px;height:26px;border:1px solid #435066;border-radius:5px;background:transparent;color:#fff;font-size:17px;line-height:1}.quantity-control input{width:34px;height:26px;padding:0;border:1px solid #435066;border-radius:5px;background:#101319;color:#fff;text-align:center}.promo-section,.map-section,.official-section,.stay-section{padding:20px;border:1px solid var(--line);border-radius:14px;background:var(--panel)}.promo-section h2{font-size:19px}.promo-form{display:flex;margin-top:15px}.promo-form input{min-width:0;flex:1;height:44px;padding:0 12px;border:1px solid #384354;border-radius:7px 0 0 7px;background:#101319;color:#fff;outline:0}.promo-form button{height:44px;padding:0 18px;border:0;border-radius:0 7px 7px 0;background:var(--blue);color:#fff;font-weight:800}.promo-feedback{min-height:16px;margin:8px 0 0;color:var(--green);font-size:11px}.promo-feedback.is-error{color:var(--danger)}.secondary-action{width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding:14px 15px;border:1px solid #3a4659;border-radius:8px;background:transparent;color:#fff;text-align:left;font-size:12px;font-weight:700}.secondary-action:hover{border-color:var(--cyan);color:var(--cyan)}.official-grid{display:grid;grid-template-columns:150px 1fr;gap:18px;margin-top:14px}.official-grid div{display:grid;align-content:start;gap:8px;padding:14px;border-radius:8px;background:#101319}.official-grid span{color:var(--muted);font-size:10px}.official-grid strong{font-size:25px;color:var(--cyan)}.official-grid p,.stay-section>p{margin:0;color:#c5ccd6;font-size:12px;line-height:1.7}.official-section>a{display:inline-block;margin-top:15px;color:var(--cyan);font-size:11px;font-weight:700}.stay-section h2{font-size:20px}.stay-section>p{margin-top:7px}.stay-map{position:relative;height:170px;overflow:hidden;margin-top:16px;border:1px solid #324052;border-radius:10px;background:radial-gradient(circle at 40% 45%,#24415a 0 2px,transparent 3px),linear-gradient(125deg,transparent 30%,#263b3d 31% 36%,transparent 37%),repeating-linear-gradient(25deg,#182a2c 0 13px,#1b3230 14px 16px)}.map-road{position:absolute;height:3px;background:#d3c78d88;transform:rotate(-20deg)}.road-one{top:55px;left:-10%;width:120%}.road-two{top:112px;left:-15%;width:130%;transform:rotate(18deg)}.map-pin{position:absolute;z-index:1;display:grid;place-items:center;width:27px;height:27px;border:2px solid #fff;border-radius:50% 50% 50% 0;background:#2563eb;color:#fff;font-size:13px;transform:rotate(-45deg)}.map-pin::first-letter{transform:rotate(45deg)}.pin-one{top:65px;left:49%}.pin-two{top:35px;left:24%;background:#db5c78}.pin-three{top:109px;right:19%;background:#55a77d}.stay-map strong{position:absolute;bottom:12px;left:14px;color:#fff;font-size:11px}.order-summary{position:fixed;right:0;bottom:0;left:0;z-index:10;border-top:1px solid #303744;background:#0d0f12eF;backdrop-filter:blur(18px)}.summary-inner{width:min(760px,calc(100% - 40px));display:flex;align-items:center;gap:18px;margin:auto;padding:14px 0}.summary-lines{display:grid;gap:3px;min-width:110px}.summary-lines span{font-size:11px}.summary-lines strong{font-size:19px}.summary-lines small{color:var(--muted);font-size:9px}.buy-button{min-height:50px;flex:1;border:0;border-radius:8px;background:var(--blue);color:#fff;font-size:12px;font-weight:800;letter-spacing:.06em}.buy-button:disabled{cursor:not-allowed;opacity:.45}.buy-button:hover:not(:disabled){background:#1d4ed8}.map-modal[hidden]{display:none}.map-modal{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px}.map-overlay{position:absolute;inset:0;background:#000b;backdrop-filter:blur(8px)}.map-dialog{position:relative;z-index:1;width:min(650px,100%);padding:24px;border:1px solid #364151;border-radius:14px;background:#161920;box-shadow:0 24px 70px #0009}.map-dialog h2{margin:0 0 16px}.map-close{position:absolute;top:12px;right:14px;border:0;background:transparent;color:#fff;font-size:24px}.event-map-visual{position:relative;min-height:330px;overflow:hidden;border:1px solid #526178;border-radius:9px;background:linear-gradient(25deg,#1c3b39,#293d3f 45%,#162a32)}.stage-label,.map-zone{position:absolute;padding:9px 12px;border:1px solid #ffffff66;border-radius:6px;background:#111827cc;color:#fff;font:700 10px 'DM Mono',monospace}.stage-label{top:20px;left:50%;transform:translateX(-50%);background:#2563eb}.zone-a{top:42%;left:18%;width:64%;text-align:center}.zone-b{right:12%;bottom:18%}.zone-c{bottom:12%;left:10%}.map-dialog>p:last-child{margin:13px 0 0;color:var(--muted);font-size:11px}
@media(max-width:560px){.checkout-event-heading,.checkout-content{width:calc(100% - 32px)}.official-grid{grid-template-columns:1fr}.summary-inner{width:calc(100% - 32px);gap:12px}.summary-lines{min-width:92px}.buy-button{font-size:11px}.ticket-option{grid-template-columns:1fr}.ticket-option-price{text-align:left}.checkout-shell{padding-bottom:124px}}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/checkout.js

```javascript
function restoreCheckoutButton(button, originalText = 'COMPRAR INGRESSOS') {
  button.disabled = false;
  button.textContent = originalText;
}

document.addEventListener('DOMContentLoaded', async () => {
  const eventId = new URLSearchParams(window.location.search).get('id');
  const elements = {
    cover: document.getElementById('checkout-cover'), kicker: document.getElementById('checkout-kicker'), name: document.getElementById('checkout-event-name'), lineup: document.getElementById('checkout-lineup'), classification: document.getElementById('classification'), location: document.getElementById('stay-location'), sectors: document.getElementById('sector-list'), summaryItems: document.getElementById('summary-items'), subtotal: document.getElementById('summary-total'), fees: document.getElementById('summary-fees'), buy: document.getElementById('buy-button'), countdownLabel: document.getElementById('countdown-label'), countdownValue: document.getElementById('countdown-value'), promoForm: document.getElementById('promo-form'), promoCode: document.getElementById('promo-code'), promoFeedback: document.getElementById('promo-feedback'), map: document.getElementById('map-modal'), mapButton: document.getElementById('map-button'), mapImage: document.getElementById('event-map-image'), mapVisual: document.getElementById('event-map-visual'), stayButton: document.getElementById('stay-button')
  };
  let currentEvent = null;
  let ticketOptions = [];
  const quantities = new Map();
  let discountRate = 0;
  let countdownTimer = null;

  function resolveImagePath(image) {
    if (!image || typeof image !== 'string' || !image.trim()) return '';
    const value = image.trim();
    if (/^(data:|blob:|https?:\/\/|\/)/i.test(value)) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  }

  function resolveImage(event) {
    const horizontalImage = event.imagem_horizontal || event.banner_desktop || event.bannerHorizontal;
    const verticalImage = event.imagem || event.capaVertical;
    const preferredImage = window.matchMedia('(min-width: 768px)').matches ? horizontalImage : verticalImage;
    const fallbackImage = window.matchMedia('(min-width: 768px)').matches ? verticalImage : horizontalImage;
    if (resolveImagePath(preferredImage)) return resolveImagePath(preferredImage);
    if (resolveImagePath(fallbackImage)) return resolveImagePath(fallbackImage);
    const name = String(event.name || '').toLowerCase();
    if (name.includes('sea') || name.includes('club')) return '/imagens/sea club.jpeg';
    if (name.includes('arena')) return '/imagens/arena+.jpeg';
    if (name.includes('trap') || name.includes('sanca')) return '/imagens/trap in sanca.jpeg';
    return '/imagens/logo troca ticket.png';
  }

  function money(value) { return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`; }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }
  function eventDate(value) { const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? 'Data a confirmar' : parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }

  function lotOrder(lot, index) {
    const number = String(lot.name || '').match(/\d+/)?.[0];
    return number ? Number(number) : index + 1;
  }

  function getVisibleLots(event) {
    const allLots = Array.isArray(event.lots) ? event.lots : [];
    if (!allLots.length) return allLots;
    const now = Date.now();
    const lotsBySector = allLots.reduce((groups, lot, index) => {
      const sector = lot.sector || 'Setor geral';
      (groups[sector] ||= []).push({ lot, index });
      return groups;
    }, {});
    return Object.values(lotsBySector).flatMap(sectorLots => {
      const orderedLots = sectorLots.sort((first, second) => lotOrder(first.lot, first.index) - lotOrder(second.lot, second.index));
      const hasDateRule = orderedLots.some(({ lot }) => /data|date|virada/i.test(String(lot.rule || '')));
      if (hasDateRule) {
        const activeLot = orderedLots
          .filter(({ lot }) => {
            const gate = lot.startDate || lot.switchDate;
            return !gate || new Date(gate).getTime() <= now;
          })
          .at(-1);
        return activeLot ? [activeLot.lot] : [];
      }
      const availableLot = orderedLots.find(({ lot }) => Number(lot.available || 0) > 0);
      return availableLot ? [availableLot.lot] : [];
    });
  }

  function normalizedOptions(event) {
    const configuredSectors = Array.isArray(event.sectors) ? event.sectors : [];
    const lots = Array.isArray(event.lots) && event.lots.length
      ? getVisibleLots(event)
      : configuredSectors.map((sector, sectorIndex) => ({ id: `sector-${sector.id || sectorIndex}`, sector: sector.name || sector.nome, name: 'Lote atual', ticketType: 'Inteira', price: Number(event.price || 0), available: Number(sector.capacity || 999) }))
        .concat(configuredSectors.length ? [] : [{ id: 'default', sector: 'Setor geral', name: 'Lote atual', ticketType: 'Inteira', price: Number(event.price || 0), available: 999 }]);
    const options = [];
    lots.forEach((lot, lotIndex) => {
      const fallbackSector = configuredSectors[lotIndex]?.name || configuredSectors[lotIndex]?.nome || 'Setor geral';
      const sector = lot.sector && lot.sector !== 'Setor geral' ? lot.sector : fallbackSector;
      const configuredLotNumber = String(lot.name || '').match(/\d+/)?.[0];
      const lotNumber = configuredLotNumber || String(lotIndex + 1);
      const base = { lot, lotIndex, sector, lotName: lot.name || `${lotNumber}º lote`, lotNumber, price: Number(lot.price || event.price || 0), available: Number(lot.fullAvailable ?? lot.available ?? 999), startDate: lot.startDate, endDate: lot.endDate, switchDate: lot.switchDate };
      options.push({ ...base, id: `${lot.id || lotIndex}-full`, type: lot.ticketType || 'Inteira', price: base.price, available: Number(lot.available || 0) });
      if (Number(lot.halfPrice) > 0 && Number(lot.halfAvailable || 0) > 0) options.push({ ...base, id: `${lot.id || lotIndex}-half`, type: 'Meia Entrada', price: Number(lot.halfPrice), available: Number(lot.halfAvailable) });
      (Array.isArray(lot.modalities) ? lot.modalities : []).forEach((modality, modalityIndex) => {
        const modalityName = modality.nome || modality.name || 'Modalidade';
        const modalityPrice = Number(modality.preco || modality.price || 0);
        const modalityQuantity = Number(modality.quantidade || modality.quantity || 0);
        if (modalityName && modalityPrice > 0 && modalityQuantity > 0) options.push({ ...base, id: `${lot.id || lotIndex}-custom-${modalityIndex}`, type: modalityName, price: modalityPrice, available: modalityQuantity });
      });
    });
    return options.filter(option => option.available > 0).sort((first, second) => first.price - second.price);
  }

  function groupedOptions() { return ticketOptions.reduce((groups, option) => { (groups[option.sector] ||= []).push(option); return groups; }, {}); }

  function renderTicketOptions() {
    const groups = groupedOptions();
    if (!Object.keys(groups).length) { elements.sectors.innerHTML = '<p class="loading-state">Ingressos esgotados.</p>'; return; }
    elements.sectors.innerHTML = Object.entries(groups).map(([sector, options], index) => `
      <article class="sector-accordion">
        <button class="sector-trigger" type="button" aria-expanded="false"><strong>${escapeHtml(sector)}</strong><span class="sector-chevron">⌄</span></button>
        <div class="sector-options">${options.map(option => `<div class="ticket-option" data-ticket="${escapeHtml(option.id)}"><div><h3>${escapeHtml(option.type)}</h3><p>${option.lotNumber}º lote</p><div class="quantity-control"><button type="button" data-minus aria-label="Diminuir quantidade">−</button><input type="number" min="0" max="${option.available}" value="0" readonly inputmode="none" aria-label="Quantidade de ${escapeHtml(option.type)}"><button type="button" data-plus aria-label="Aumentar quantidade">+</button></div></div><div class="ticket-option-price"><strong>${money(option.price)}</strong><small>por ingresso</small></div></div>`).join('')}</div>
      </article>`).join('');
    elements.sectors.querySelectorAll('.sector-trigger').forEach(trigger => trigger.addEventListener('click', () => { const accordion = trigger.closest('.sector-accordion'); const isOpen = accordion.classList.toggle('is-open'); trigger.setAttribute('aria-expanded', String(isOpen)); }));
    elements.sectors.querySelectorAll('.ticket-option').forEach(row => {
      const option = ticketOptions.find(item => item.id === row.dataset.ticket);
      const input = row.querySelector('input');
      const update = value => { const quantity = Math.max(0, Math.min(option.available, Number(value) || 0)); input.value = quantity; if (quantity) quantities.set(option.id, quantity); else quantities.delete(option.id); updateSummary(); };
      row.querySelector('[data-minus]').addEventListener('click', () => update(Number(input.value) - 1));
      row.querySelector('[data-plus]').addEventListener('click', () => update(Number(input.value) + 1));
      input.addEventListener('change', () => update(input.value));
    });
  }

  function updateSummary() {
    let itemCount = 0; let baseTotal = 0;
    quantities.forEach((quantity, id) => { const option = ticketOptions.find(item => item.id === id); if (option) { itemCount += quantity; baseTotal += option.price * quantity; } });
    const discount = baseTotal * discountRate; const taxable = baseTotal - discount; const fee = taxable * 0.14; const total = taxable + fee;
    elements.summaryItems.textContent = `${itemCount} ${itemCount === 1 ? 'ingresso' : 'ingressos'}`; elements.subtotal.textContent = money(total); elements.fees.textContent = `Taxa de serviço: ${money(fee)}${discount ? ` · Desconto: -${money(discount)}` : ''}`; elements.buy.disabled = false; elements.buy.dataset.total = String(total); elements.buy.dataset.quantity = String(itemCount);
  }

  function updateCountdown() {
    const now = Date.now(); const target = new Date(currentEvent.endDate || currentEvent.date).getTime();
    const label = 'Término das vendas online em:'; const remaining = Math.max(0, target - now); const seconds = Math.floor(remaining / 1000); const days = Math.floor(seconds / 86400); const hours = Math.floor((seconds % 86400) / 3600); const minutes = Math.floor((seconds % 3600) / 60); const restSeconds = seconds % 60;
    elements.countdownLabel.textContent = label; elements.countdownValue.textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(restSeconds).padStart(2, '0')}s`;
  }

  async function completePurchase() {
    let user; try { user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null'); } catch { user = null; }
    if (!user || !user.email) { window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`; return; }
    const quantity = Number(elements.buy.dataset.quantity || 0); const total = Number(elements.buy.dataset.total || 0); if (!quantity) { alert('Selecione pelo menos 1 ingresso para continuar.'); return; }
    const items = [...quantities.entries()].map(([id, selectedQuantity]) => { const option = ticketOptions.find(item => item.id === id); return option ? { quantity: selectedQuantity, price: option.price, sector: option.sector, lotName: `${option.lotNumber}º lote`, category: option.type } : null; }).filter(Boolean);
    elements.buy.disabled = true; elements.buy.textContent = 'PROCESSANDO...';
    try {
      const response = await fetch('/api/ingressos/comprar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, evento_id: currentEvent.id, quantidade: quantity, preco: total / quantity, valor_total: total, items }) });
      const data = await response.json(); if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível concluir a compra.');
      alert('Compra realizada com sucesso!'); window.location.href = `/account/meus-ingressos.html?evento=${encodeURIComponent(currentEvent.name)}`;
      } catch (error) { alert(error.message); } finally { restoreCheckoutButton(elements.buy); }
  }

  elements.promoForm.addEventListener('submit', event => { event.preventDefault(); const code = elements.promoCode.value.trim().toUpperCase(); const coupons = { TROCA10: .10, EVENTO5: .05 }; if (coupons[code]) { discountRate = coupons[code]; elements.promoFeedback.className = 'promo-feedback'; elements.promoFeedback.textContent = `Cupom aplicado: ${coupons[code] * 100}% de desconto.`; } else { discountRate = 0; elements.promoFeedback.className = 'promo-feedback is-error'; elements.promoFeedback.textContent = code ? 'Cupom inválido ou expirado.' : 'Digite um cupom para aplicar.'; } updateSummary(); });
  elements.buy.addEventListener('click', completePurchase);
  elements.mapButton.addEventListener('click', () => { elements.map.hidden = false; });
  elements.map.querySelectorAll('[data-close-map]').forEach(element => element.addEventListener('click', () => { elements.map.hidden = true; }));
  elements.stayButton.addEventListener('click', () => { const query = encodeURIComponent(`${currentEvent.name} hospedagem ${currentEvent.location || ''}`); window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer'); });

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    const title = trigger.firstElementChild;
    const content = trigger.nextElementSibling;
    const titleText = title.textContent.replace(/^[+-]\s*/, '');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;
      trigger.setAttribute('aria-expanded', String(nextState));
      content.classList.toggle('is-collapsed', !nextState);
      title.textContent = `${nextState ? '-' : '+'} ${titleText}`;
    });
  });

  const ticketSection = document.querySelector('.ticket-section');
  const orderSummary = document.querySelector('.order-summary');
  const updateSummaryPlacement = () => {
    if (!ticketSection || !orderSummary) return;
    orderSummary.classList.toggle('is-inline', ticketSection.getBoundingClientRect().bottom <= window.innerHeight);
  };
  window.addEventListener('scroll', updateSummaryPlacement, { passive: true });
  updateSummaryPlacement();

  try {
    const response = await fetch(`/api/events/${encodeURIComponent(eventId)}`); const data = await response.json(); currentEvent = data.event; if (!response.ok || !currentEvent) throw new Error('Evento não encontrado.');
    if (currentEvent.mapa_evento) {
      elements.mapImage.src = resolveImagePath(currentEvent.mapa_evento);
      elements.mapImage.hidden = false;
      elements.mapVisual.hidden = true;
    }
    elements.cover.src = resolveImage(currentEvent); elements.cover.alt = `Capa de ${currentEvent.name}`; elements.kicker.textContent = `${eventDate(currentEvent.date)} · ${currentEvent.location || 'Local a confirmar'}`; elements.name.textContent = currentEvent.artista ? `${currentEvent.name || 'Evento'} - ${currentEvent.artista}` : (currentEvent.name || 'Evento'); elements.lineup.textContent = ''; elements.classification.textContent = currentEvent.classification || 'Livre'; elements.location.textContent = currentEvent.location || 'a região do evento';
    const imageMediaQuery = window.matchMedia('(min-width: 768px)');
    const refreshCheckoutImage = () => { elements.cover.src = resolveImage(currentEvent); };
    if (imageMediaQuery.addEventListener) imageMediaQuery.addEventListener('change', refreshCheckoutImage);
    else imageMediaQuery.addListener(refreshCheckoutImage);
    const eventStart = new Date(currentEvent.date); const eventEnd = new Date(currentEvent.endDate || currentEvent.date); const formatTime = value => Number.isNaN(value.getTime()) ? 'A confirmar' : value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const eventLocation = currentEvent.location || 'A confirmar';
    document.getElementById('official-event-name').textContent = currentEvent.artista ? `${currentEvent.name || 'Evento'} - ${currentEvent.artista}` : (currentEvent.name || 'Evento'); document.getElementById('official-event-date').textContent = eventDate(currentEvent.date); document.getElementById('official-event-time').textContent = `${formatTime(eventStart)} às ${formatTime(eventEnd)}`; document.getElementById('official-event-venue').textContent = eventLocation; document.getElementById('official-event-address').textContent = currentEvent.address || eventLocation; document.getElementById('official-event-city').textContent = currentEvent.city || eventLocation; document.getElementById('official-event-style').textContent = currentEvent.genre || currentEvent.estilo || 'A confirmar'; document.getElementById('official-event-opening').textContent = formatTime(eventStart); document.title = `Checkout | ${currentEvent.name}`;
    ticketOptions = normalizedOptions(currentEvent); renderTicketOptions(); updateSummary(); updateCountdown(); countdownTimer = window.setInterval(updateCountdown, 1000);
  } catch (error) { elements.name.textContent = 'Não foi possível carregar o checkout'; elements.sectors.innerHTML = `<p class="loading-state">${escapeHtml(error.message)}</p>`; elements.buy.disabled = false; }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/checkout.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require.resolve('./checkout.js'), 'utf8');
const helperSource = source.match(/function restoreCheckoutButton\([\s\S]*?\n\}/)?.[0];
if (!helperSource) throw new Error('restoreCheckoutButton não encontrado em checkout.js');
const restoreCheckoutButton = vm.runInNewContext(`(${helperSource})`);

test('reabilita o botão e restaura o texto após falha de compra', () => {
  const button = { disabled: true, textContent: 'PROCESSANDO...' };

  restoreCheckoutButton(button);

  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'COMPRAR INGRESSOS');
});

test('restaura o texto original informado pelo checkout', () => {
  const button = { disabled: true, textContent: 'PROCESSANDO...' };

  restoreCheckoutButton(button, 'Finalizar pedido');

  assert.equal(button.disabled, false);
  assert.equal(button.textContent, 'Finalizar pedido');
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/como-funciona-a-revenda.css

```css
.resale-guide-body{background:#0a0f1a;color:#eaf0fa;font-family:'Manrope',sans-serif}.guide-header{background:#0a0f1a}.guide-header .brand-logo{width:34px;height:34px;object-fit:contain}.guide-header .brand-accent{color:#38bdf8}.guide-back{padding:8px 18px;font-size:13px}.guide-main{width:min(760px,calc(100% - 40px));margin:auto;padding:82px 0 110px}.guide-eyebrow{margin:0 0 14px;color:#38bdf8;font:10px 'JetBrains Mono',monospace;letter-spacing:.13em;text-transform:uppercase}.guide-intro{padding-bottom:72px}.guide-intro h1{max-width:680px;margin:0 0 24px;font-size:clamp(43px,8vw,72px);line-height:.98;letter-spacing:-.07em}.guide-lead{max-width:620px;margin:0;color:#9aa8bf;font-size:17px;line-height:1.7}.guide-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:48px;padding-top:25px;border-top:1px solid #1e2a40}.guide-summary div{display:grid;gap:8px}.guide-summary strong{font-size:13px}.guide-summary span,.guide-note,.guide-steps p,.timeline span,.faq-section p{color:#9aa8bf;font-size:12px;line-height:1.65}.guide-section{padding:64px 0;border-top:1px solid #1e2a40}.guide-section h2,.guide-help h2,.guide-final h2{margin:0 0 32px;font-size:31px;letter-spacing:-.055em}.guide-steps{counter-reset:steps;list-style:none;padding:0;margin:0}.guide-steps li{counter-increment:steps;display:grid;grid-template-columns:42px 1fr;gap:20px;padding:22px 0;border-bottom:1px solid #1e2a40}.guide-steps li::before{content:counter(steps,decimal-leading-zero);color:#38bdf8;font:11px 'JetBrains Mono',monospace;padding-top:3px}.guide-steps strong{font-size:15px}.guide-steps p{margin:7px 0 0}.fee-list{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}.fee-list div{display:grid;gap:8px;padding:18px;border:1px solid #1e2a40;background:#101828}.fee-list strong{font-size:13px}.fee-list span{color:#38bdf8;font:20px 'JetBrains Mono',monospace}.fee-list small{color:#9aa8bf;font-size:11px}.fee-list .premium span{color:#9a8cff}.simulator{margin-top:35px;border-top:1px solid #1e2a40}.simulator-controls{display:grid;grid-template-columns:1fr 1fr;gap:25px;padding:26px 0;border-bottom:1px solid #1e2a40}.simulator fieldset{border:0;padding:0;margin:0}.simulator legend{margin-bottom:10px;font-size:12px;font-weight:700}.segmented{display:grid;gap:6px}.segmented button{display:flex;justify-content:space-between;align-items:center;border:1px solid #1e2a40;background:transparent;color:#9aa8bf;padding:11px 12px;text-align:left;font-size:11px}.segmented button span{font-family:'JetBrains Mono',monospace}.segmented button[aria-pressed=true]{border-color:#38bdf8;background:#10283b;color:#eaf0fa}.simulator-result{padding-top:27px}.result-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.result-grid div{display:grid;gap:8px}.result-grid small{color:#9aa8bf;font-size:10px}.result-grid strong{color:#38bdf8;font:15px 'JetBrains Mono',monospace}.simulator-caption{color:#9aa8bf;font-size:11px;line-height:1.6}.sim-queue{display:grid;border-top:1px solid #1e2a40}.sim-queue-row{display:grid;grid-template-columns:35px 1fr auto;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid #1e2a40;color:#9aa8bf;font-size:11px}.sim-queue-row b{color:#38bdf8;font:11px 'JetBrains Mono',monospace}.sim-queue-row strong{color:#eaf0fa;font-size:11px}.sim-queue-row em{color:#9aa8bf;font-style:normal;font-family:'JetBrains Mono',monospace}.sim-queue-row.user{background:#10283b;padding-left:9px;padding-right:9px}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.timeline div{display:grid;gap:9px}.timeline b{color:#38bdf8;font:11px 'JetBrains Mono',monospace}.timeline strong{font-size:13px}.faq-section details{border-bottom:1px solid #1e2a40}.faq-section summary{padding:20px 0;cursor:pointer;font-size:14px;font-weight:700;list-style:none}.faq-section summary::-webkit-details-marker{display:none}.faq-section summary::after{content:'+';float:right;color:#38bdf8;font:18px 'JetBrains Mono',monospace}.faq-section details[open] summary::after{content:'−'}.faq-section p{margin:0;padding:0 34px 20px 0}.guide-help,.guide-final{padding:48px 0;border-top:1px solid #1e2a40}.guide-help h2,.guide-final h2{max-width:520px;margin-bottom:24px}.guide-button{display:inline-flex;align-items:center;gap:12px;padding:13px 18px;font-size:12px;font-weight:700}.guide-button.secondary{border:1px solid #1e2a40;color:#eaf0fa}.guide-button.secondary:hover,.guide-button.secondary:focus-visible{border-color:#38bdf8;color:#38bdf8}.guide-button.primary{background:#38bdf8;color:#07111d}.guide-button.primary:hover,.guide-button.primary:focus-visible{filter:brightness(1.1)}.guide-final{padding-bottom:0}.guide-final h2{font-size:40px}.guide-button:focus-visible,.segmented button:focus-visible,.faq-section summary:focus-visible{outline:2px solid #38bdf8;outline-offset:3px}@media(max-width:720px){.guide-main{width:min(100% - 28px,620px);padding-top:52px}.guide-header{padding:0 14px}.guide-summary,.fee-list,.timeline,.simulator-controls{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr 1fr}.guide-intro{padding-bottom:50px}.guide-section{padding:48px 0}.guide-final h2{font-size:32px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition-duration:.01ms!important}}
.queue-notice{margin:18px 0;color:#f2d28a;font-size:11px;line-height:1.6}.sim-queue-row{display:grid;grid-template-columns:35px 1fr auto;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid #1e2a40;color:#9aa8bf;font-size:11px}.sim-queue-row b{color:#38bdf8;font:11px 'JetBrains Mono',monospace}.sim-queue-row strong{color:#eaf0fa;font-size:11px}.sim-queue-row em{color:#9aa8bf;font-style:normal;font-family:'JetBrains Mono',monospace}.sim-queue-row.user{background:#10283b;padding-left:9px;padding-right:9px}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.timeline div{display:grid;gap:9px}.timeline b{color:#38bdf8;font:11px 'JetBrains Mono',monospace}.timeline strong{font-size:13px}.faq-section details{border-bottom:1px solid #1e2a40}.faq-section summary{padding:20px 0;cursor:pointer;font-size:14px;font-weight:700;list-style:none}.faq-section summary::-webkit-details-marker{display:none}.faq-section summary::after{content:'+';float:right;color:#38bdf8;font:18px 'JetBrains Mono',monospace}.faq-section details[open] summary::after{content:'−'}.faq-section p{margin:0;padding:0 34px 20px 0}.guide-help,.guide-final{padding:48px 0;border-top:1px solid #1e2a40}.guide-help h2,.guide-final h2{max-width:520px;margin-bottom:24px}.guide-button{display:inline-flex;align-items:center;gap:12px;padding:13px 18px;font-size:12px;font-weight:700}.guide-button.secondary{border:1px solid #1e2a40;color:#eaf0fa}.guide-button.secondary:hover,.guide-button.secondary:focus-visible{border-color:#38bdf8;color:#38bdf8}.guide-button.primary{background:#38bdf8;color:#07111d}.guide-button.primary:hover,.guide-button.primary:focus-visible{filter:brightness(1.1)}.guide-final{padding-bottom:0}.guide-final h2{font-size:40px}.guide-button:focus-visible,.segmented button:focus-visible,.faq-section summary:focus-visible{outline:2px solid #38bdf8;outline-offset:3px}@media(max-width:720px){.guide-main{width:min(100% - 28px,620px);padding-top:52px}.guide-header{padding:0 14px}.guide-summary,.fee-list,.timeline,.simulator-controls{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr 1fr}.guide-intro{padding-bottom:50px}.guide-section{padding:48px 0}.guide-final h2{font-size:32px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition-duration:.01ms!important}}

/* Ajustes responsivos da página informativa */
.guide-header{padding-inline:clamp(16px,5vw,32px);gap:16px}
.guide-header .brand{min-width:0}
.guide-header .brand>span{overflow:hidden;text-overflow:ellipsis}
.guide-back{flex:0 0 auto;white-space:nowrap}
.guide-main{padding-inline:clamp(0px,2vw,16px)}
.guide-intro h1,.guide-section h2,.guide-help h2,.guide-final h2{overflow-wrap:anywhere}
.guide-summary>div,.fee-list>div,.timeline>div{min-width:0}
.segmented button{min-width:0;gap:8px}
.segmented button span{white-space:nowrap}
.result-grid strong{overflow-wrap:anywhere}
.sim-queue-row strong{min-width:0;overflow-wrap:anywhere}
.sim-queue-row em{white-space:nowrap}
.guide-button{max-width:100%;text-align:center}

@media (max-width: 720px) {
  .guide-header{height:70px}
  .guide-header .brand{font-size:20px!important}
  .guide-header .brand-logo{width:30px;height:30px}
  .guide-back{padding:7px 12px;font-size:12px}
  .guide-main{width:min(100% - 32px,620px);padding-top:46px;padding-bottom:72px}
  .guide-intro h1{font-size:clamp(38px,11vw,58px);line-height:1.02}
  .guide-lead{font-size:15px;line-height:1.6}
  .guide-summary{gap:0;margin-top:34px}
  .guide-summary div{padding:16px 0;border-bottom:1px solid #1e2a40}
  .guide-summary div:last-child{border-bottom:0}
  .guide-section{padding:46px 0}
  .guide-section h2,.guide-help h2{font-size:27px;line-height:1.1}
  .guide-steps li{grid-template-columns:30px 1fr;gap:12px;padding:18px 0}
  .guide-steps strong{font-size:14px}
  .fee-list{gap:0}
  .fee-list div{grid-template-columns:1fr auto;align-items:center;padding:15px 0;border-width:1px 0 0}
  .fee-list div:last-child{border-bottom:1px solid #1e2a40}
  .fee-list small{grid-column:1/-1}
  .simulator{margin-top:28px}
  .simulator-controls{gap:22px;padding:22px 0}
  .segmented button{padding:12px 10px}
  .result-grid{grid-template-columns:1fr 1fr;gap:20px 12px}
  .result-grid strong{font-size:13px}
  .sim-queue-row{grid-template-columns:28px minmax(0,1fr);gap:8px}
  .sim-queue-row em{grid-column:2}
  .timeline{gap:0}
  .timeline div{padding:18px 0;border-bottom:1px solid #1e2a40}
  .timeline div:last-child{border-bottom:0}
  .guide-help,.guide-final{padding:40px 0}
  .guide-final h2{font-size:32px}
  .guide-button{width:100%;justify-content:center}
}

@media (max-width: 420px) {
  .guide-header{padding-inline:12px}
  .guide-header .brand{gap:7px;font-size:17px!important}
  .guide-header .brand-logo{width:27px;height:27px}
  .guide-back{padding:6px 9px;font-size:11px}
  .guide-main{width:calc(100% - 24px);padding-top:38px}
  .guide-intro h1{font-size:clamp(34px,11vw,46px)}
  .guide-eyebrow{font-size:9px}
  .result-grid{grid-template-columns:1fr}
  .result-grid strong{font-size:14px}
  .sim-queue-row{font-size:10px}
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/como-funciona-a-revenda.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Entenda como funciona a revenda oficial de ingressos TrocaTicket.">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="como-funciona-a-revenda.css">
  <title>Como funciona a revenda | TrocaTicket</title>
</head>
<body class="resale-guide-body">
  <header class="site-header guide-header">
    <a class="brand" href="/">
      <img class="brand-logo" src="imagens/logo troca ticket.png" alt="TrocaTicket">
      <span>Troca<span class="brand-accent">Ticket</span></span>
    </a>
    <button class="button button-outline guide-back" type="button" aria-label="Voltar para a página anterior">Voltar</button>
  </header>

  <main class="guide-main">
    <section class="guide-intro">
      <p class="guide-eyebrow">TrocaTicket · transparência</p>
      <h1>Recupere parte do valor do seu ingresso, com segurança</h1>
      <p class="guide-lead">A revenda oficial conecta quem precisa repassar um ingresso válido a quem quer comprar com autenticidade, preço justo e titularidade protegida.</p>
      <div class="guide-summary" aria-label="Resumo da revenda">
        <div><strong>Preço fixo</strong><span>O valor fica travado no lote original.</span></div>
        <div><strong>Prioridades de comum a premium</strong><span>Você escolhe a taxa que define sua posição na fila.</span></div>
        <div><strong>Transação segura e protegida</strong><span>O ingresso antigo é revogado e um novo é emitido para o comprador.</span></div>
      </div>
    </section>

    <section class="guide-section" id="como-vender">
      <p class="guide-eyebrow">O fluxo</p>
      <h2>Como vender seu ingresso</h2>
      <ol class="guide-steps">
        <li><div><strong>Anuncie na aba de revenda</strong><p>Selecione um ingresso válido da TrocaTicket ou de uma bilheteria parceira, cadastrado no evento.</p></div></li>
        <li><div><strong>Escolha a taxa de prioridade</strong><p>Opte por Comum (2%), Básica (5%) ou Premium (8%). A escolha é obrigatória.</p></div></li>
        <li><div><strong>O ingresso entra na fila</strong><p>A ordem considera primeiro a maior taxa, depois o menor preço e, por fim, quem anunciou antes.</p></div></li>
        <li><div><strong>A venda é concluída</strong><p>O comprador recebe o próximo ingresso da fila. O ingresso anterior é revogado e outro é emitido com os dados do comprador.</p></div></li>
        <li><div><strong>Receba após o evento</strong><p>O valor líquido fica retido até o check-in e 24 horas após o encerramento do evento.</p></div></li>
      </ol>
    </section>

    <section class="guide-section" id="simulador">
      <p class="guide-eyebrow">Transparência</p>
      <h2>Quanto você recebe e onde fica na fila</h2>
      <div class="fee-list">
        <div><strong>Comum</strong><span>2%</span><small>Posição base</small></div>
        <div><strong>Básica</strong><span>5%</span><small>Prioridade intermediária</small></div>
        <div class="premium"><strong>Premium</strong><span>8%</span><small>Topo da fila</small></div>
      </div>
      <p class="guide-note">A taxa de prioridade incide sobre o valor do lote. A taxa de administração paga na compra é devolvida integralmente ao vendedor quando o ingresso é vendido, junto com o saldo. Em caso de empate, a fila considera o menor preço do ingresso e depois o horário do anúncio.</p>
      <div class="simulator">
        <div class="simulator-controls">
          <fieldset><legend>Lote</legend><div class="segmented" data-group="lot"><button type="button" data-value="1" aria-pressed="false">1º lote <span>R$ 120,00</span></button><button type="button" data-value="2" aria-pressed="true">2º lote <span>R$ 150,00</span></button><button type="button" data-value="3" aria-pressed="false">3º lote <span>R$ 180,00</span></button></div></fieldset>
          <fieldset><legend>Taxa de prioridade</legend><div class="segmented" data-group="fee"><button type="button" data-value="2" aria-pressed="false">Comum <span>2%</span></button><button type="button" data-value="5" aria-pressed="true">Básica <span>5%</span></button><button type="button" data-value="8" aria-pressed="false">Premium <span>8%</span></button></div></fieldset>
        </div>
        <div class="simulator-result" aria-live="polite">
          <div class="result-grid"><div><small>Preço do lote</small><strong id="sim-price">R$ 150,00</strong></div><div><small>Taxa de prioridade (sobre o lote)</small><strong id="sim-fee">R$ 7,50</strong></div><div><small>Taxa de administração devolvida</small><strong id="sim-admin-fee">R$ 22,50</strong></div><div><small>Total que você recebe</small><strong id="sim-net">R$ 165,00</strong></div><div><small>Sua posição</small><strong id="sim-position">6º entre 10 anúncios em Pista Premium (modalidade inteira)</strong></div></div>
          <p class="queue-notice">Novos anúncios com prioridade maior podem passar à frente do seu.</p>
          <p class="simulator-caption">Simulação com uma fila de exemplo de 10 anúncios. Os dados são ilustrativos e não fazem chamadas ao backend.</p>
          <div id="sim-queue" class="sim-queue"></div>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <p class="guide-eyebrow">Repasse protegido</p>
      <h2>Quando o dinheiro chega</h2>
      <div class="timeline">
        <div><b>01</b><strong>Venda concluída</strong><span>O valor do lote, a taxa de prioridade e a devolução integral da taxa de administração entram na carteira como saldo retido.</span></div>
        <div><b>02</b><strong>Evento realizado</strong><span>O check-in do comprador confirma o uso válido do ingresso.</span></div>
        <div><b>03</b><strong>Saldo liberado por PIX de mesma titularidade</strong><span>Após 24 horas do encerramento, o saque é liberado para uma chave PIX compatível.</span></div>
      </div>
    </section>

    <section class="guide-section faq-section">
      <p class="guide-eyebrow">Dúvidas frequentes</p>
      <h2>Perguntas frequentes</h2>
      <details><summary>Quem pode anunciar um ingresso?</summary><p>Quem possui um ingresso válido da TrocaTicket ou de uma bilheteria parceira, cadastrado no evento e apto para transferência.</p></details>
      <details><summary>Posso escolher o preço do anúncio?</summary><p>Não. O preço é travado no valor original pago pelo lote, sem ágio ou especulação.</p></details>
      <details><summary>O comprador recebe o meu ingresso?</summary><p>O próximo ingresso da fila é consumido. O ingresso antigo é revogado e um novo ingresso, com UUID e dados exclusivos do comprador, é emitido na conta dele. A modalidade também é preservada: meia-entrada continua sendo meia-entrada, inteira continua sendo inteira e assim por diante.</p></details>
      <details><summary>Por que o saldo não fica disponível imediatamente?</summary><p>O valor fica retido até o check-in do comprador e 24 horas após o encerramento do evento, reduzindo riscos de fraude e chargeback.</p></details>
      <details><summary>A taxa de administração que paguei na compra é devolvida?</summary><p>Sim. Ela é devolvida integralmente junto com o saldo quando o ingresso for vendido. <!-- TODO: definir a regra para ingressos de bilheteria parceira, cuja taxa foi paga ao parceiro. --></p></details>
      <details><summary>Posso ver minha posição na fila?</summary><p>Sim. Você vê sua posição e o total de anúncios no seu setor e modalidade. A posição pode mudar quando entram anúncios com prioridade maior.</p></details>
      <details><summary>Posso aumentar minha prioridade depois de anunciar?</summary><p>Sim. A diferença entre a prioridade anterior e a nova só é cobrada do repasse se o ingresso for vendido.</p></details>
    </section>

    <section class="guide-help">
      <p class="guide-eyebrow">Precisa de mais ajuda?</p>
      <h2>Para mais dúvidas, consulte a nossa central de ajuda</h2>
      <a class="guide-button secondary" href="info/ajuda.html">Consultar central de ajuda</a>
    </section>

    <section class="guide-final">
      <p class="guide-eyebrow">Pronto para começar?</p>
      <h2>Anuncie seu ingresso com segurança.</h2>
      <a class="guide-button primary" href="revenda/anunciar">Anunciar meu ingresso <span>↗</span></a>
    </section>
  </main>
  <script src="como-funciona-a-revenda.js" defer></script>
</body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/como-funciona-a-revenda.js

```javascript
(function () {
  document.querySelector('.guide-back').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = 'account/revenda.html';
  });

  const prices = { 1: 120, 2: 150, 3: 180 };
  const feeNames = { 2: 'Comum', 5: 'Básica', 8: 'Premium' };
  const examples = [
    { name: 'Anúncio 01', lot: 3, fee: 8, time: 1 },
    { name: 'Anúncio 02', lot: 2, fee: 8, time: 2 },
    { name: 'Anúncio 03', lot: 1, fee: 5, time: 3 },
    { name: 'Anúncio 04', lot: 3, fee: 5, time: 4 },
    { name: 'Anúncio 05', lot: 1, fee: 2, time: 5 },
    { name: 'Anúncio 06', lot: 2, fee: 2, time: 6 },
    { name: 'Anúncio 07', lot: 3, fee: 8, time: 7 },
    { name: 'Anúncio 08', lot: 1, fee: 5, time: 8 },
    { name: 'Anúncio 09', lot: 2, fee: 2, time: 9 }
  ];
  let selectedLot = 2;
  let selectedFee = 5;
  const formatMoney = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const queue = document.querySelector('#sim-queue');
  const sortListings = listings => listings.sort((a, b) => b.fee - a.fee || prices[a.lot] - prices[b.lot] || a.time - b.time);
  function render() {
    const user = { name: 'Seu anúncio', lot: selectedLot, fee: selectedFee, time: 10, user: true };
    const listings = sortListings([...examples, user]);
    const position = listings.indexOf(user) + 1;
    const price = prices[selectedLot];
    const feeValue = price * selectedFee / 100;
    const administrationFee = price * 15 / 100;
    document.querySelector('#sim-net').textContent = formatMoney(price - feeValue + administrationFee);
    document.querySelector('#sim-price').textContent = formatMoney(price);
    document.querySelector('#sim-fee').textContent = formatMoney(feeValue);
    document.querySelector('#sim-admin-fee').textContent = formatMoney(administrationFee);
    document.querySelector('#sim-position').textContent = `${position}º entre 10 anúncios em Pista Premium (modalidade inteira)`;
    queue.innerHTML = listings.map((item, index) => `<div class="sim-queue-row${item.user ? ' user' : ''}"><b>${String(index + 1).padStart(2, '0')}</b><strong>${item.name} · ${item.lot}º lote · ${feeNames[item.fee]}</strong><em>${item.user ? 'agora' : `há ${10 - item.time}h`}</em></div>`).join('');
  }
  document.querySelectorAll('.segmented').forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
      if (group.dataset.group === 'lot') selectedLot = Number(button.dataset.value);
      if (group.dataset.group === 'fee') selectedFee = Number(button.dataset.value);
      render();
    });
  });
  render();
})();

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/data/admin_tokens.json

```json
[
  {
    "token": "ef17db09923e8494c48f5ed5d9ed8c14bc66fd8005dab6cc9000043de8ceb76f",
    "rawToken": "a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1",
    "createdAt": "2026-09-01T10:30:45.123Z",
    "expiresAt": "2026-09-08T10:30:45.123Z",
    "email": "admin@empresa.com",
    "used": true,
    "usedAt": "2026-09-01T12:39:31.663Z"
  },
  {
    "token": "3e079efc3c6f1f3f88952b2d4527d2b14c6b240bc0cbc2b5acee7ca3d0776330",
    "rawToken": "1b72e29d478a1b61b88d584b17dfc24bf2f7f6e61289c8f6429f8a21477dd5c1",
    "createdAt": "2026-09-01T12:32:35.809Z",
    "expiresAt": "2026-09-08T12:32:35.811Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T12:33:29.016Z"
  },
  {
    "token": "1ba55d000b4ff351a90e94bcd9808444e65a7936348d51a534cab8f5e9d51d19",
    "createdAt": "2026-09-01T12:42:14.506Z",
    "expiresAt": "2026-09-08T12:42:14.542Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T12:42:24.545Z"
  },
  {
    "token": "c839d90890530e9e02a0df0345580c399bb59d4fc3d88a9647c9df88bec76507",
    "createdAt": "2026-09-01T12:46:49.570Z",
    "expiresAt": "2026-09-08T12:46:49.605Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T12:59:13.979Z"
  },
  {
    "token": "1473b0595bccb29fa423ebf704667b1ac8ef8da22dd5f47b9bebc83ff333ee4a",
    "createdAt": "2026-09-01T13:00:34.270Z",
    "expiresAt": "2026-09-08T13:00:34.270Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T13:01:13.591Z"
  },
  {
    "token": "d72efb9e19ed9290e04c4bc7c327fab7ed7c68d0911407230a9642da1867a0b3",
    "createdAt": "2026-09-01T13:08:26.484Z",
    "expiresAt": "2026-09-08T13:08:26.504Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T13:08:49.514Z"
  },
  {
    "token": "c3a8bc343fbf358b0f7a5e3a3869cfd5144188e4b56c7c63466ca48283bfaf1a",
    "createdAt": "2026-09-01T13:11:29.839Z",
    "expiresAt": "2026-09-08T13:11:29.844Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T13:12:34.216Z"
  },
  {
    "token": "b80e70ff4def150ef41d988cfe9242bf5b10c3dfca43d62d0780bc8b92b77cf3",
    "createdAt": "2026-09-01T13:17:39.272Z",
    "expiresAt": "2026-09-08T13:17:39.298Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T13:17:59.340Z"
  },
  {
    "token": "40df2750bb6e1324cce5943c1a4d3b1e9efbcd79104eaa076e1b398e24a9fb31",
    "createdAt": "2026-09-01T15:25:05.614Z",
    "expiresAt": "2026-09-08T15:25:05.635Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T19:09:21.994Z"
  },
  {
    "token": "3f805e80908c7cba259223e7c3e27c48eea79905ff024412001c152fbc5d5da4",
    "createdAt": "2026-09-01T19:08:45.209Z",
    "expiresAt": "2026-09-08T19:08:45.210Z",
    "email": "admin",
    "used": true,
    "usedAt": "2026-09-01T21:31:48.842Z"
  }
]
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/data/events.json

```json
[
  {"id":"trap-in-sanca","name":"Trap in Sanca","date":"18 ABR 2026","place":"Arena Multiplace, São Paulo","region":"São Paulo","price":180,"image":"imagens/trap in sanca.jpeg","origin":"Blacktag"},
  {"id":"terra-sp","name":"Terra SP","date":"02 MAI 2026","place":"Terra SP, São Paulo","region":"São Paulo","price":220,"image":"imagens/terra sp.jpeg","origin":"Ticketmaster"},
  {"id":"festa-do-chefe","name":"Festa do Chefe","date":"16 MAI 2026","place":"Campinas Hall, Campinas","region":"Campinas","price":145,"image":"imagens/festa do chefe.jpeg","origin":"Bilheteria Digital"}
]

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/db.js

```javascript
const path = require('path');
const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
  console.warn('[db] DB_HOST e DB_PASSWORD não configurados. Copie src/Trocaticket/.env.example para .env ou configure as variáveis da Vercel.');
}

const config = {
  server: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'TrocaTicket',
  options: {
    encrypt: String(process.env.DB_ENCRYPT || 'true').toLowerCase() !== 'false',
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERTIFICATE || 'false').toLowerCase() === 'true',
    enableArithAbort: true
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
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

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/editar-perfil.css

```css
/* ===== TELA EDITAR PERFIL ===== */
.edit-profile-page {
  min-height: 100vh;
  margin: 0;
  background: #1d1e23;
  color: #f4f4f5;
}

.edit-profile-shell {
  width: min(500px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 44px;
}

.edit-profile-shell h1 {
  margin: 0 0 16px;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.edit-avatar {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 20px;
  border: 3px solid #292a30;
  border-radius: 50%;
  background: #15161a;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.edit-avatar label {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.edit-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  height: 26px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.edit-avatar:hover .avatar-badge {
  opacity: 1;
}

.edit-profile-shell form {
  display: grid;
  gap: 14px;
}

.readonly-grid,
.editable-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.edit-profile-shell label {
  display: grid;
  gap: 5px;
  color: #c9cbd2;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.edit-profile-shell input,
.edit-profile-shell select {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1.5px solid #3c3d43;
  border-radius: 10px;
  background: #303137;
  color: #f4f4f5;
  font: inherit;
  font-size: 14px;
  outline: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.edit-profile-shell input[readonly] {
  background: #25262c;
  color: #8f919b;
  border-color: #34353c;
  cursor: not-allowed;
}

.edit-profile-shell input:focus,
.edit-profile-shell select:focus {
  border-color: #7186d0;
  box-shadow: 0 0 0 2px rgba(113, 134, 208, 0.2);
}

.edit-profile-shell #edit-profile-message {
  min-height: 16px;
  margin: 0;
  font-size: 13px;
  text-align: center;
  color: #dba0a0;
}

.edit-profile-shell #edit-profile-message.success {
  color: #4ade80;
}

.edit-profile-save {
  min-height: 44px;
  border: 0;
  border-radius: 10px;
  background: #7186d0;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-profile-save:hover {
  background: #5d74c4;
}

@media (max-width: 560px) {
  .edit-profile-shell {
    width: min(100% - 24px, 500px);
    padding-top: 16px;
  }
  .readonly-grid,
  .editable-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/editar-perfil.js

```javascript
const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
const form = document.getElementById('edit-profile-form');
const message = document.getElementById('edit-profile-message');
const avatarEl = document.getElementById('edit-profile-avatar');
const avatarInput = document.getElementById('avatar-input');

// Função auxiliar para normalizar e aplicar a URL da foto
function applyAvatar(url) {
  if (!avatarEl) return;
  if (!url || !String(url).trim()) {
    avatarEl.src = 'imagens/logo troca ticket.png';
    return;
  }
  const cleanUrl = String(url).trim();
  avatarEl.src = cleanUrl.startsWith('http') || cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
}

// Validação de autenticação e busca de dados
if (!user || !user.email) {
  window.location.href = '../auth/login.html';
} else {
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`)
    .then(response => response.json())
    .then(data => {
      if (!data.ok || !data.user) throw new Error(data.message || 'Não foi possível carregar os dados.');
      const profile = data.user;

      // Renderiza foto de perfil vinda do banco
      applyAvatar(profile.foto_perfil);

      // Preenche os campos do formulário
      const fullName = (profile.nome || profile.name || '').trim().split(/\s+/);
      document.getElementById('nome').value = fullName.shift() || '';
      document.getElementById('sobrenome').value = fullName.join(' ');
      document.getElementById('email').value = profile.email || '';
      document.getElementById('cpf').value = profile.cpf || '';
      document.getElementById('telefone').value = profile.telefone || '';
      document.getElementById('data_nascimento').value = profile.data_nascimento ? String(profile.data_nascimento).slice(0, 10) : '';
      document.getElementById('genero').value = profile.genero || '';
    })
    .catch(error => {
      console.error('[editar-perfil] Erro ao carregar:', error);
      if (message) message.textContent = error.message;
    });
}

// Upload direto ao selecionar imagem
if (avatarInput) {
  avatarInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file || !user || !user.email) return;

    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('file', file);

    try {
      if (message) {
        message.className = '';
        message.textContent = 'Enviando foto...';
      }

      const response = await fetch('/api/usuario/avatar', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao enviar foto.');

      applyAvatar(data.avatarUrl);
      user.foto_perfil = data.avatarUrl;
      localStorage.setItem('trocaticket-user', JSON.stringify(user));
      localStorage.setItem('trocaticket-avatar', data.avatarUrl);

      if (message) {
        message.className = 'success';
        message.textContent = 'Foto atualizada com sucesso!';
      }
    } catch (err) {
      console.error('[avatar-upload] Erro:', err);
      if (message) {
        message.className = '';
        message.textContent = err.message || 'Falha ao atualizar foto.';
      }
    }
  });
}

// Envio das alterações de dados
form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const response = await fetch('/api/usuario/meu-perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailAtual: user.email,
        email: user.email,
        nome: document.getElementById('nome').value.trim(),
        sobrenome: document.getElementById('sobrenome').value.trim(),
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value.trim(),
        genero: document.getElementById('genero').value,
        data_nascimento: document.getElementById('data_nascimento').value
      })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);
    
    // Atualiza cache local
    Object.assign(user, data.user);
    localStorage.setItem('trocaticket-user', JSON.stringify(user));

    message.className = 'success';
    message.textContent = 'Dados atualizados com sucesso.';
    setTimeout(() => {
      window.location.href = '../account/perfil.html';
    }, 700);
  } catch (error) {
    console.error('[editar-perfil] Erro ao salvar:', error);
    message.className = '';
    message.textContent = error.message;
  }
});
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/editar-telefone.css

```css
/* ===== TELA VERIFICAÇÃO DE TELEFONE (PROPORCIONAL EM 100% ZOOM) ===== */
.phone-page {
  min-height: 100vh;
  margin: 0;
  background: #1d1e23;
  color: #f4f4f5;
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.phone-shell {
  width: min(500px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 48px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.phone-content-card {
  width: 100%;
  text-align: center;
}

.phone-content-card h1 {
  margin: 0;
  color: #f59e0b;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-align: left;
}

.phone-divider {
  height: 2px;
  margin-top: 8px;
  background: #d97706;
}

.phone-lead {
  margin: 22px 0 20px;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 600;
}

.phone-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phone-number-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
}

.country-selector {
  position: relative;
  display: block;
}

.country-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border: 1.5px solid #d97706;
  border-radius: 8px;
  background: #25262c;
  color: #f4f4f5;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.country-display:hover {
  border-color: #f59e0b;
}

.country-options {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  width: 130px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #d97706;
  border-radius: 8px;
  background: #25262c;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.country-options[hidden] {
  display: none;
}

.country-options button {
  display: block;
  width: 100%;
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-bottom: 1px solid #3c3d43;
  background: #25262c;
  color: #e5e7eb;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.country-options button:last-child {
  border-bottom: 0;
}

.country-options button:hover,
.country-options button:focus-visible {
  background: #3b82f6;
  color: #fff;
  outline: 0;
}

.phone-number-row input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #3c3d43;
  border-radius: 8px;
  background: #2b2c34;
  color: #f4f4f5;
  font: inherit;
  font-size: 14px;
  outline: 0;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phone-number-row input:focus {
  border-color: #7186d0;
  box-shadow: 0 0 0 2px rgba(113, 134, 208, 0.2);
}

.phone-number-row input::placeholder {
  color: #8b8d98;
}

.phone-description {
  margin: 0 auto;
  max-width: 440px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.5;
}

.channel-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}

.channel-button,
.confirm-button {
  height: 44px;
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.channel-button:hover,
.confirm-button:hover {
  opacity: 0.9;
}

.channel-button:active,
.confirm-button:active {
  transform: scale(0.98);
}

.channel-button.whatsapp {
  background: linear-gradient(105deg, #22c55e, #16a34a);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25);
}

.channel-button.sms {
  background: linear-gradient(105deg, #3b82f6, #6366f1);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
}

.phone-message {
  min-height: 16px;
  margin: 4px 0 0;
  font-size: 13px;
  color: #f87171;
}

.code-step {
  display: grid;
  gap: 8px;
  margin-top: 18px;
  text-align: left;
}

.code-step[hidden] {
  display: none;
}

.code-step label {
  color: #d1d5db;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.code-step input {
  height: 44px;
  box-sizing: border-box;
  padding: 0 14px;
  border: 1.5px solid #4b4d58;
  border-radius: 8px;
  background: #25262c;
  color: #fff;
  font: inherit;
  font-size: 15px;
  text-align: center;
  letter-spacing: 4px;
  outline: 0;
}

.code-step input:focus {
  border-color: #7186d0;
  box-shadow: 0 0 0 2px rgba(113, 134, 208, 0.2);
}

.confirm-button {
  background: linear-gradient(105deg, #3b82f6, #6366f1);
  margin-top: 4px;
}

.cancel-link {
  display: inline-block;
  margin-top: 24px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.cancel-link:hover {
  color: #f59e0b;
}

@media (max-width: 520px) {
  .phone-shell {
    width: min(100% - 24px, 500px);
    padding-top: 20px;
  }
  .phone-number-row {
    grid-template-columns: 80px 1fr;
    gap: 8px;
  }
  .channel-actions {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/editar-telefone.js

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  const form = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-number');
  const countryCode = document.getElementById('country-code');
  const countryDisplay = document.getElementById('country-display');
  const countryOptions = document.getElementById('country-options');
  const message = document.getElementById('phone-message');
  const codeStep = document.getElementById('code-step');
  let selectedChannel = '';

  function getInternationalPhone() {
    const rawValue = String(phoneInput.value || '').trim();
    const countryDigits = String(countryCode.value || '').replace(/\D/g, '');
    let phoneDigits = rawValue.replace(/\D/g, '');
    const hasInternationalPrefix = /^\s*(?:\+|00)/.test(rawValue);
    if (hasInternationalPrefix) {
      if (/^\s*00/.test(rawValue)) phoneDigits = phoneDigits.slice(2);
    } else {
      const maxNationalDigits = { '1': 10, '33': 9, '34': 9, '39': 11, '44': 10, '49': 11, '55': 11, '81': 10, '351': 9 }[countryDigits] || 12;
      if (phoneDigits.startsWith(countryDigits) && phoneDigits.length > maxNationalDigits) {
        phoneDigits = phoneDigits.slice(countryDigits.length);
      }
      phoneDigits = `${countryDigits}${phoneDigits}`;
    }
    return phoneDigits.length >= 10 && phoneDigits.length <= 15 ? `+${phoneDigits}` : null;
  }

  if (!user || !user.email) {
    window.location.href = '../auth/login.html';
    return;
  }

  // Dropdown de seleção de código de país
  if (countryDisplay && countryOptions) {
    countryDisplay.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !countryOptions.hidden;
      countryOptions.hidden = isOpen;
      countryDisplay.setAttribute('aria-expanded', String(!isOpen));
    });

    countryOptions.querySelectorAll('[data-code]').forEach(option => {
      option.addEventListener('click', () => {
        countryCode.value = option.dataset.code;
        countryDisplay.textContent = option.dataset.code;
        countryOptions.hidden = true;
        countryDisplay.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.country-selector')) {
        countryOptions.hidden = true;
        countryDisplay.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Preenche com o telefone salvo se houver
  fetch(`/api/usuario/meu-perfil?email=${encodeURIComponent(user.email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok && data.user && data.user.telefone) {
        phoneInput.value = data.user.telefone;
      }
    })
    .catch(err => console.error('[editar-telefone]', err));

  // Solicitar envio do código
  document.querySelectorAll('[data-channel]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      selectedChannel = button.dataset.channel;
      const phone = getInternationalPhone();
      if (!phone) {
        message.style.color = '#f87171';
        message.textContent = 'Informe um telefone válido com 10 a 15 números, incluindo o código do país.';
        return;
      }
      
      try {
        message.style.color = '#38bdf8';
        message.textContent = `Enviando código por ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}...`;
        
        const response = await fetch('/api/usuario/telefone/solicitar-verificacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            telefone: phone,
            canal: selectedChannel
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

        message.style.color = '#4ade80';
        message.textContent = `${data.message || 'Código enviado com sucesso.'} Digite o código recebido.`;
        codeStep.hidden = false;
        document.getElementById('verification-code').focus();
      } catch (error) {
        console.error('[editar-telefone] Erro ao enviar código:', error);
        message.style.color = '#f87171';
        message.textContent = error.message;
      }
    });
  });

  // Confirmar verificação do código
  const confirmBtn = document.getElementById('confirm-phone');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const phone = getInternationalPhone();
      const code = document.getElementById('verification-code').value.trim();

      if (!phone) {
        message.style.color = '#f87171';
        message.textContent = 'Informe um telefone válido com 10 a 15 números, incluindo o código do país.';
        return;
      }

      if (!code) {
        message.style.color = '#f87171';
        message.textContent = 'Por favor, digite o código de verificação.';
        return;
      }

      try {
        const response = await fetch('/api/usuario/telefone/confirmar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            telefone: phone,
            codigo: code
          })
        });

        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.message || `HTTP ${response.status}`);

        user.telefone = phone.replace(/\D/g, '');
        localStorage.setItem('trocaticket-user', JSON.stringify(user));

        message.style.color = '#4ade80';
        message.textContent = data.message || 'Telefone confirmado com sucesso!';
        
        setTimeout(() => {
          window.location.href = '../account/perfil.html';
        }, 700);
      } catch (error) {
        console.error('[editar-telefone] Erro ao confirmar código:', error);
        message.style.color = '#f87171';
        message.textContent = error.message;
      }
    });
  }
});
```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/event-edit-image-preservation.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const path = require('node:path');

function sessionToken() {
  const secret = process.env.TROCATICKET_SESSION_SECRET
    || process.env.DB_PASSWORD
    || crypto.createHash('sha256').update(path.join(__dirname, 'trocaticket-session')).digest('hex');
  const claims = Buffer.from(JSON.stringify({
    sub: 7,
    email: 'admin@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(claims).digest('base64url');
  return `${claims}.${signature}`;
}

function createRequest(body) {
  const request = new EventEmitter();
  request.method = 'PUT';
  request.url = '/api/organizador/eventos';
  request.headers = { host: 'localhost:3010', authorization: `Bearer ${sessionToken()}` };
  process.nextTick(() => {
    request.emit('data', JSON.stringify(body));
    request.emit('end');
  });
  return request;
}

function createResponse() {
  return {
    status: null,
    payload: null,
    writeHead(status) {
      this.status = status;
    },
    end(payload) {
      this.payload = payload;
    }
  };
}

test('edição preserva imagens quando o painel envia URLs gerenciadas', async () => {
  const queries = [];
  const connection = {
    async beginTransaction() {},
    async query(sql, params) {
      queries.push({ sql, params });
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'admin@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }]];
      }
      return [[]];
    },
    async commit() {},
    async rollback() {},
    release() {}
  };
  const mockDb = {
    async query(sql, params) {
      queries.push({ sql, params });
      if (String(sql).includes('FROM dbo.usuarios WHERE id = ?')) {
        return [[{
          id: 7,
          nome: 'Admin',
          email: 'admin@example.com',
          tipo: 'admin',
          status: 'aprovado',
          senha_hash: 'hash'
        }]];
      }
      return [[]];
    },
    async getConnection() {
      return connection;
    }
  };
  const serverPath = path.resolve(__dirname, 'server.js');
  const dbPath = path.resolve(__dirname, 'db.js');
  delete require.cache[dbPath];
  const db = require(dbPath);
  const originalQuery = db.query;
  const originalGetConnection = db.getConnection;
  db.query = mockDb.query;
  db.getConnection = mockDb.getConnection;

  try {
    delete require.cache[serverPath];
    const handler = require(serverPath);
    const response = createResponse();
    await handler(createRequest({
      id: 7,
      nome: 'Evento de teste',
      artista: 'Artista',
      descricao: 'Descrição',
      local: 'Local',
      data_evento: '2026-12-01T18:00',
      data_fim: '2026-12-01T23:00',
      capacidade: 100,
      classificacao: 'Livre',
      status: 'publicado',
      destaque: false,
      preco: 120,
      imagem: '/api/events/7/imagem?campo=imagem&v=249347',
      imagem_horizontal: '/api/events/7/imagem?campo=banner&v=4132843',
      setores: [],
      lotes: []
    }), response);

    const update = queries.find(({ sql }) => /^\s*UPDATE dbo\.eventos/i.test(sql));
    assert.ok(update, `a rota deveria gerar um UPDATE de evento; status=${response.status}; payload=${response.payload}; queries=${queries.map(query => query.sql).join(' | ')}`);
    assert.equal(update.params[11], null);
    assert.equal(update.params[12], null);
    assert.equal(response.status, 200);
  } finally {
    db.query = originalQuery;
    db.getConnection = originalGetConnection;
    delete require.cache[serverPath];
  }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/event-images.js

```javascript
const EVENT_IMAGE_FIELDS = Object.freeze({
  imagem: 'imagem',
  banner: 'banner_desktop',
  mapa: 'mapa_evento'
});

function isManagedEventImageUrl(value) {
  return /^\/api\/events\/\d+\/imagem\?campo=(?:imagem|banner|mapa)(?:&v=[^&]+)?$/i.test(String(value || '').trim());
}

function eventImageResponse(value, eventId, field, version) {
  const image = value == null ? null : String(value);
  if (!image || !/^data:/i.test(image)) return value || null;
  const publicField = Object.entries(EVENT_IMAGE_FIELDS).find(([, column]) => column === field)?.[0] || field;
  return `/api/events/${eventId}/imagem?campo=${publicField}&v=${encodeURIComponent(String(version ?? ''))}`;
}

function eventImageVersion(value) {
  const image = String(value || '');
  return /^data:/i.test(image) ? Buffer.byteLength(image, 'utf8') : null;
}

function preserveEventImageInput(value) {
  const image = value == null ? null : String(value).trim();
  return image && isManagedEventImageUrl(image) ? null : (image || null);
}

function decodeDataImage(value) {
  const match = String(value || '').match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) return null;
  return { contentType: match[1].toLowerCase(), data: Buffer.from(match[2].replace(/\s/g, ''), 'base64') };
}

module.exports = {
  EVENT_IMAGE_FIELDS,
  decodeDataImage,
  eventImageResponse,
  eventImageVersion,
  isManagedEventImageUrl,
  preserveEventImageInput
};

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/event-images.test.js

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const { eventImageResponse, eventImageVersion, preserveEventImageInput } = require('./event-images');

test('converts only data images to versioned event URLs', () => {
  assert.equal(eventImageResponse('data:image/png;base64,AAAA', 6, 'imagem', 42), '/api/events/6/imagem?campo=imagem&v=42');
  assert.equal(eventImageResponse('/uploads/events/banner.jpg', 6, 'banner_desktop', 42), '/uploads/events/banner.jpg');
  assert.equal(eventImageResponse('https://blob.vercel-storage.com/banner.jpg', 6, 'banner_desktop', 42), 'https://blob.vercel-storage.com/banner.jpg');
  assert.equal(eventImageVersion('data:image/png;base64,AAAA'), 26);
});

test('preserves the stored image when an API image URL is submitted back', () => {
  assert.equal(preserveEventImageInput('/api/events/6/imagem?campo=imagem&v=42'), null);
  assert.equal(preserveEventImageInput('/uploads/events/banner.jpg'), '/uploads/events/banner.jpg');
  assert.equal(preserveEventImageInput('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/evento.css

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;600;700;800&display=swap');

:root { --bg: #0d0f12; --panel: #161920; --line: #292f39; --muted: #9aa4b2; --blue: #2563eb; --white: #f8fafc; }
* { box-sizing: border-box; }
html { background: var(--bg); }
body { margin: 0; min-width: 320px; background: var(--bg); color: var(--white); font-family: Manrope, sans-serif; }
button, select { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
button { cursor: pointer; }
.event-detail-page { width: 100%; min-height: 100vh; margin: auto; padding-bottom: 94px; background: var(--bg); }
.event-hero { width: 100%; height: clamp(300px, 58vw, 560px); position: relative; overflow: hidden; background: #171920; }
.event-cover { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center; }
.event-hero-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,15,18,.14) 28%, var(--bg) 100%); }
.event-back, .event-icon-button { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; background: rgba(13,15,18,.62); color: #fff; backdrop-filter: blur(12px); text-decoration: none; }
.event-back { position: absolute; top: 18px; left: 18px; font-size: 23px; z-index: 2; }
.event-quick-actions { position: absolute; top: 18px; right: 18px; display: flex; gap: 8px; z-index: 2; }
.event-icon-button svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
.event-icon-button:hover, .event-back:hover { border-color: #93c5fd; background: #1d4ed8; }
.event-icon-button.is-favorite { color: #fb7185; border-color: #fb7185; }
.event-icon-button.is-favorite svg { fill: currentColor; }
.event-content { position: relative; z-index: 1; width: min(760px, calc(100% - 40px)); margin: -42px auto 0; padding: 0 0 26px; }
.event-kicker, .section-label { color: var(--muted); font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
.event-kicker { margin: 0 0 8px; }
.event-card-title { grid-column: 1 / -1; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
#event-name { max-width: 620px; margin: 0; color: #fff; font-size: clamp(23px, 5vw, 34px); line-height: 1.08; letter-spacing: -.03em; }
.event-lineup { display: none; }
.event-info-card { display: grid; grid-template-columns: 52px 1fr; gap: 14px; padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); }
.venue-logo { width: 52px; height: 52px; border: 2px solid #60a5fa; border-radius: 50%; object-fit: cover; background: var(--bg); }
.event-info-main { display: grid; gap: 8px; min-width: 0; }
.event-info-row { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 12px; line-height: 1.35; }
.event-info-icon { width: 18px; color: #60a5fa; text-align: center; }
.calendar-link { width: fit-content; margin-top: 2px; padding: 0; border: 0; background: transparent; color: #60a5fa; font-size: 11px; font-weight: 800; }
.calendar-link:hover { color: #bfdbfe; text-decoration: underline; }
.calendar-link span { margin-left: 3px; font-size: 15px; }
.venue-details { grid-column: 1 / -1; display: grid; gap: 3px; padding-top: 12px; border-top: 1px solid var(--line); }
.venue-details strong { color: var(--white); font-size: 13px; }
.venue-details span { color: var(--muted); font-size: 12px; }
.description-section { padding: 28px 0 22px; }
.section-label { margin: 0 0 12px; }
.event-description { color: #d1d5db; font-size: 14px; line-height: 1.8; }
.event-description strong { color: #fff; font-weight: 800; }
.sector-section { display: grid; gap: 8px; }
.sector-section label { color: var(--muted); font-size: 12px; font-weight: 700; }
.sector-section select { width: 100%; height: 46px; padding: 0 12px; border: 1px solid #374151; border-radius: 8px; outline: 0; background: var(--panel); color: var(--white); }
.sector-section select:focus { border-color: #60a5fa; }
.purchase-bar { position: fixed; right: 0; bottom: 0; left: 0; z-index: 5; display: flex; align-items: center; gap: 14px; padding: 14px max(20px, calc((100% - 760px) / 2)); border-top: 1px solid rgba(255,255,255,.1); background: rgba(13,15,18,.88); backdrop-filter: blur(18px); }
.purchase-bar > div { display: grid; gap: 2px; min-width: 96px; }
.purchase-bar span { color: var(--muted); font-size: 10px; }
.purchase-bar strong { color: #fff; font-size: 18px; }
.purchase-button { min-height: 48px; flex: 1; border: 0; border-radius: 8px; background: var(--blue); color: #fff; font-size: 13px; font-weight: 800; letter-spacing: .08em; }
.purchase-button:hover:not(:disabled) { background: #1d4ed8; }
.purchase-button:disabled { cursor: wait; opacity: .5; }
@media (min-width: 700px) { .event-content { width: min(760px, calc(100% - 72px)); } }
@media (min-width: 768px) {
  .event-hero { height: clamp(360px, 38vw, 620px); }
  .event-cover { object-fit: cover; object-position: center; }
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/evento.js

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const eventId = new URLSearchParams(window.location.search).get('id');
  const elements = {
    cover: document.getElementById('event-cover'),
    kicker: document.getElementById('event-kicker'),
    name: document.getElementById('event-name'),
    lineup: document.getElementById('event-lineup'),
    date: document.getElementById('event-date'),
    time: document.getElementById('event-time'),
    venue: document.getElementById('event-venue'),
    address: document.getElementById('event-address'),
    description: document.getElementById('event-description'),
    purchase: document.getElementById('btn-confirm-purchase'),
    share: document.getElementById('event-share'),
    favorite: document.getElementById('event-favorite'),
    calendar: document.getElementById('event-calendar')
  };
  let currentEvent = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function resolveImagePath(image) {
    if (!image || typeof image !== 'string' || !image.trim()) return '';
    const value = image.trim();
    if (/^(data:|blob:|https?:\/\/|\/)/i.test(value)) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  }

  function resolveEventImage(event) {
    const horizontalImage = event.imagem_horizontal || event.banner_desktop || event.bannerHorizontal;
    const verticalImage = event.imagem || event.capaVertical;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const preferredImage = isDesktop ? horizontalImage : verticalImage;
    const fallbackImage = isDesktop ? verticalImage : horizontalImage;
    if (resolveImagePath(preferredImage)) return resolveImagePath(preferredImage);
    if (resolveImagePath(fallbackImage)) return resolveImagePath(fallbackImage);
    const eventName = String(event.name || '').toLowerCase();
    if (eventName.includes('arena')) return '/imagens/arena+.jpeg';
    if (eventName.includes('sea') || eventName.includes('club')) return '/imagens/sea club.jpeg';
    if (eventName.includes('esperia') || eventName.includes('mirante')) return '/imagens/mirante esperia.jpeg';
    if (eventName.includes('sanca') || eventName.includes('trap')) return '/imagens/trap in sanca.jpeg';
    if (eventName.includes('terra')) return '/imagens/terra sp.jpeg';
    if (eventName.includes('chefe')) return '/imagens/festa do chefe.jpeg';
    return '/imagens/logo troca ticket.png';
  }

  function getDateTime(value) {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return { date: 'Data a confirmar', time: 'Horário a confirmar' };
    return {
      date: parsedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }),
      time: parsedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  }

  function getShortDate(value) {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? 'DATA A DEFINIR' : parsedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  }

  function getDescription(event) {
    const description = String(event.descricao || event.description || '').trim() || `Uma experiência especial no ${event.name || 'evento'}. Ingressos digitais, acesso seguro e titularidade protegida pela TrocaTicket.`;
    return escapeHtml(description).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\r?\n/g, '<br>');
  }

  function setFavoriteState() {
    const isFavorite = localStorage.getItem(`trocaticket-favorite-${currentEvent.id}`) === 'true';
    elements.favorite.classList.toggle('is-favorite', isFavorite);
    elements.favorite.setAttribute('aria-pressed', String(isFavorite));
    elements.favorite.setAttribute('aria-label', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
  }

  function renderEvent(event) {
    const dateTime = getDateTime(event.date);
    const location = event.location || 'Local a confirmar';
    currentEvent = event;
    elements.cover.src = resolveEventImage(event);
    elements.cover.onerror = () => {
      elements.cover.onerror = null;
      elements.cover.src = '/imagens/logo troca ticket.png';
    };
    elements.cover.alt = `Capa do evento ${event.name || 'Evento'}`;
    elements.kicker.textContent = `${getShortDate(event.date)} · ${location}`;
    elements.name.textContent = event.artista ? `${event.name || 'Evento'} - ${event.artista}` : (event.name || 'Evento');
    elements.lineup.textContent = '';
    elements.date.textContent = dateTime.date;
    elements.time.textContent = `Abertura da casa às ${dateTime.time}`;
    elements.venue.textContent = location;
    elements.address.textContent = location;
    elements.description.innerHTML = getDescription(event);

    elements.purchase.disabled = false;
    setFavoriteState();
    document.title = `${event.name || 'Evento'} | TrocaTicket`;
  }

  async function handlePurchase() {
    if (!currentEvent) return;
    window.location.href = `checkout.html?id=${encodeURIComponent(currentEvent.id)}`;
  }

  elements.favorite.addEventListener('click', () => {
    const nextState = elements.favorite.getAttribute('aria-pressed') !== 'true';
    localStorage.setItem(`trocaticket-favorite-${currentEvent.id}`, String(nextState));
    setFavoriteState();
  });

  elements.share.addEventListener('click', async () => {
    const shareData = { title: currentEvent.name, text: `${currentEvent.name} · ${currentEvent.location || 'Local a confirmar'}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); alert('Link do evento copiado.'); }
    } catch (error) {
      if (error.name !== 'AbortError') alert('Não foi possível compartilhar este evento.');
    }
  });

  elements.calendar.addEventListener('click', () => {
    const startDate = new Date(currentEvent.date);
    if (Number.isNaN(startDate.getTime())) { alert('A data deste evento ainda não está configurada.'); return; }
    const endDate = new Date(currentEvent.endDate || startDate.getTime() + 3 * 60 * 60 * 1000);
    const toCalendarDate = value => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const description = currentEvent.descricao || currentEvent.description || `Evento ${currentEvent.name || 'TrocaTicket'} com ingresso digital e acesso seguro.`;
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.search = new URLSearchParams({
      action: 'TEMPLATE',
      text: currentEvent.name || 'Evento TrocaTicket',
      dates: `${toCalendarDate(startDate)}/${toCalendarDate(endDate)}`,
      location: currentEvent.location || 'Local a confirmar',
      details: description
    }).toString();
    const calendarWindow = window.open(googleCalendarUrl.toString(), '_blank', 'noopener,noreferrer');
    if (!calendarWindow) window.location.assign(googleCalendarUrl.toString());
  });

  elements.purchase.addEventListener('click', handlePurchase);

  try {
    const response = await fetch('/api/events');
    const data = await response.json();
    const event = (data.events || []).find(item => String(item.id) === String(eventId));
    if (!response.ok || !event) throw new Error('Evento não encontrado.');
    renderEvent(event);
    const imageMediaQuery = window.matchMedia('(min-width: 768px)');
    const refreshEventImage = () => {
      elements.cover.src = resolveEventImage(currentEvent);
    };
    if (imageMediaQuery.addEventListener) imageMediaQuery.addEventListener('change', refreshEventImage);
    else imageMediaQuery.addListener(refreshEventImage);
  } catch (error) {
    elements.name.textContent = 'Evento não encontrado';
    elements.description.textContent = error.message;
    elements.purchase.disabled = true;
  }
});

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/events/checkout.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../checkout.css">
  <script src="../auth-fetch.js"></script>
  <script src="../checkout.js" defer></script>
  <title>Checkout | TrocaTicket</title>
</head>
<body class="checkout-page">
  <main class="checkout-shell" aria-live="polite">
    <header class="checkout-hero">
      <img id="checkout-cover" src="../imagens/logo troca ticket.png" alt="">
      <div class="checkout-hero-shade"></div>
      <a class="checkout-back" id="checkout-back" href="../index.html#eventos" aria-label="Voltar">&#8592;</a>
      <div class="checkout-event-heading">
        <p id="checkout-kicker">CARREGANDO EVENTO</p>
        <h1 id="checkout-event-name">Carregando...</h1>
        <strong id="checkout-lineup"></strong>
      </div>
    </header>

    <div class="checkout-content">
      <section class="checkout-countdown" aria-live="polite">
        <span class="countdown-pulse"></span>
        <div><strong id="countdown-label">Carregando lote...</strong><small id="countdown-value">--d --h --m --s</small></div>
      </section>

      <section class="checkout-section ticket-section">
        <div class="section-heading"><div><p class="eyebrow">Escolha seus ingressos</p><h2>Ingressos disponíveis</h2></div></div>
        <div class="sector-accordion-list" id="sector-list"><p class="loading-state">Carregando lotes...</p></div>
      </section>

      <aside class="order-summary" aria-label="Resumo do pedido">
        <div class="summary-inner"><div class="summary-lines"><span id="summary-items">0 ingressos</span><strong id="summary-total">R$ 0,00</strong><small id="summary-fees">Taxa de serviço: R$ 0,00</small></div><button class="buy-button" id="buy-button" type="button">COMPRAR INGRESSOS</button></div>
      </aside>

      <section class="checkout-section promo-section">
        <div><h2>Código promocional</h2></div>
        <form class="promo-form" id="promo-form"><input id="promo-code" type="text" autocomplete="off" placeholder="Digite seu cupom"><button type="submit">Aplicar</button></form>
        <p class="promo-feedback" id="promo-feedback" role="status"></p>
      </section>

      <section class="checkout-section map-section">
        <div><p class="eyebrow">Planeje sua experiência</p><h2>Mapa do evento</h2></div>
        <button class="secondary-action" type="button" id="map-button">Ver mapa do evento</button>
      </section>

      <section class="checkout-section official-section">
        <button class="accordion-trigger" type="button" aria-expanded="true"><span id="official-title">- Informações</span><span class="accordion-chevron">⌃</span></button>
        <div class="accordion-content"><ul class="official-facts" id="official-facts"><li><span>Evento</span><strong id="official-event-name">A confirmar</strong></li><li><span>Data</span><strong id="official-event-date">A confirmar</strong></li><li><span>Horário</span><strong id="official-event-time">A confirmar</strong></li><li><span>Local</span><strong id="official-event-venue">A confirmar</strong></li><li><span>Endereço do local</span><strong id="official-event-address">A confirmar</strong></li><li><span>Cidade</span><strong id="official-event-city">A confirmar</strong></li><li><span>Classificação indicativa</span><strong id="classification">Livre</strong></li><li><span>Estilo do evento</span><strong id="official-event-style">A confirmar</strong></li><li><span>Hora de abertura dos portões</span><strong id="official-event-opening">A confirmar</strong></li></ul><p class="official-rules">Ingressos digitais e nominais. A meia-entrada exige comprovação na entrada. Compras aprovadas não podem ser canceladas fora das regras oficiais do evento.</p><a href="../info/ajuda.html#comprar">Consultar regras da bilheteria e central de ajuda</a></div>
      </section>

      <section class="checkout-section stay-section">
        <button class="accordion-trigger" type="button" aria-expanded="true"><span id="stay-title">+ Garanta sua hospedagem: encontre as melhores opções de acomodações próximas ao evento!</span><span class="accordion-chevron">⌃</span></button>
        <div class="accordion-content"><p>Encontre as melhores opções de acomodações próximas ao evento.</p><div class="stay-map"><span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-pin pin-one">⌂</span><span class="map-pin pin-two">⌂</span><span class="map-pin pin-three">⌂</span><strong id="stay-location">Explore a região do evento</strong></div><button class="secondary-action full-action" type="button" id="stay-button">Ver acomodações e explorar no mapa</button></div>
      </section>
    </div>

    <div class="map-modal" id="map-modal" hidden><div class="map-overlay" data-close-map></div>    <div class="map-dialog" role="dialog" aria-modal="true" aria-labelledby="map-title"><button class="map-close" type="button" data-close-map aria-label="Fechar mapa">×</button><h2 id="map-title">Mapa do evento</h2><img id="event-map-image" class="event-map-image" src="" alt="Mapa do evento" hidden><div class="event-map-visual" id="event-map-visual"><span class="stage-label">PALCO PRINCIPAL</span><span class="map-zone zone-a">PISTA</span><span class="map-zone zone-b">BAR</span><span class="map-zone zone-c">ENTRADA</span></div></div></div>
  </main>
</body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/events/evento.html

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../evento.css">
  <script src="../auth-fetch.js"></script>
  <script src="../evento.js" defer></script>
  <title>Detalhes do evento | TrocaTicket</title>
</head>
<body class="event-page">
  <main class="event-detail-page" aria-live="polite">
    <section class="event-hero" aria-label="Capa do evento">
      <img id="event-cover" class="event-cover" src="../imagens/logo troca ticket.png" alt="">
      <div class="event-hero-shade"></div>
      <a class="event-back" href="../index.html#eventos" aria-label="Voltar para eventos">&#8592;</a>
      <div class="event-quick-actions">
        <button type="button" class="event-icon-button" id="event-share" aria-label="Compartilhar evento" title="Compartilhar evento">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg>
        </button>
        <button type="button" class="event-icon-button" id="event-favorite" aria-label="Adicionar aos favoritos" aria-pressed="false" title="Favorito">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.3-8.8 10.4-8.8 10.4S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg>
        </button>
      </div>
    </section>

    <section class="event-content">
      <section class="event-info-card" aria-label="Informações práticas">
        <div class="event-card-title">
          <p class="event-kicker" id="event-kicker">CARREGANDO EVENTO</p>
          <h1 id="event-name">Carregando...</h1>
          <p class="event-lineup" id="event-lineup"></p>
        </div>
        <img class="venue-logo" src="../imagens/logo troca ticket.png" alt="Logo do estabelecimento">
        <div class="event-info-main">
          <div class="event-info-row"><span class="event-info-icon">&#128197;</span><span id="event-date">Data a confirmar</span></div>
          <div class="event-info-row"><span class="event-info-icon">&#128336;</span><span id="event-time">Abertura da casa a confirmar</span></div>
          <button type="button" class="calendar-link" id="event-calendar">Adicionar ao calendário <span aria-hidden="true">+</span></button>
        </div>
        <div class="venue-details"><strong id="event-venue">Local a confirmar</strong><span id="event-address">Endereço a confirmar</span></div>
      </section>

      <section class="description-section">
        <p class="section-label">Descrição do evento</p>
        <div class="event-description" id="event-description">Carregando descrição...</div>
      </section>

    </section>

    <div class="purchase-bar">
      <button type="button" class="purchase-button" id="btn-confirm-purchase" disabled>COMPRAR</button>
    </div>
  </main>
</body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/events/eventos.html

```html
<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="../pages.css"><script src="../auth-fetch.js"></script><script src="../pages.js" type="module"></script><title>Eventos | TrocaTicket</title></head><body class="page-body" data-page="eventos"><header class="site-header"><a class="brand" href="../index.html"><img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket"></a><a class="back-link" href="../index.html">Voltar para início</a></header><main class="page-main"><div class="page-intro"><p class="eyebrow">Catálogo TrocaTicket</p><h1>Eventos disponíveis</h1><p>Explore datas, locais e valores atuais da fila de ingressos.</p></div><section class="page-grid" id="page-events"></section></main></body></html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/events/ingressos.html

```html
<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="../pages.css"><script src="../auth-fetch.js"></script><script src="../pages.js" type="module"></script><title>Minha conta | TrocaTicket</title></head><body class="page-body" data-page="ingressos"><header class="site-header"><a class="brand" href="../index.html"><img class="brand-logo" src="../imagens/logo troca ticket.png" alt="TrocaTicket"></a><a class="back-link" href="../index.html">Voltar para início</a></header><main class="page-main"><section class="account-card page-panel"><p class="eyebrow">Área pessoal</p><h1>Minha conta</h1><p class="hero-text">Dados da conta e histórico de ingressos em um só lugar.</p><div class="account-info"><div><small>Nome</small><strong id="account-name"></strong></div><div><small>E-mail</small><strong id="account-email"></strong></div><div><small>Status</small><strong class="account-status">Conta autenticada</strong></div></div><button class="button button-outline" id="logout-page">Sair da conta</button></section></main></body></html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/fix-name-once.js

```javascript
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

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/index.html

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#10131d" />
    <title>TrocaTicket</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/package.json

```json
{
  "name": "trocaticket-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.2",
    "vite": "^7.1.7"
  }
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/components/AssetImage.jsx

```jsx
import { useState } from 'react';

const FALLBACK_ASSET = '/imagens/logo troca ticket.png';

export function resolveAssetUrl(value, fallback = FALLBACK_ASSET) {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  if (/^(data:|blob:|https?:\/\/)/i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  return `/${raw.replace(/^\.?\//, '')}`;
}

export function AssetImage({ src, fallback = FALLBACK_ASSET, alt = '', ...props }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...props}
      src={failed ? fallback : resolveAssetUrl(src, fallback)}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/lib/api.js

```javascript
const cache = new Map();

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('trocaticket-user') || localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const user = readUser();
  const headers = new Headers(options.headers || {});
  if (user?.session_token) headers.set('Authorization', ['Bearer', user.session_token].join(' '));
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || `Erro HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  user: readUser,
  logout() {
    localStorage.removeItem('trocaticket-user');
    localStorage.removeItem('usuario');
  },
  async events() {
    if (!cache.has('events')) cache.set('events', request('/api/events'));
    return cache.get('events');
  },
  async orders({ cursor = '', signal } = {}) {
    const user = readUser();
    if (!user?.email) throw Object.assign(new Error('Faça login para ver seus pedidos.'), { status: 401 });
    const params = new URLSearchParams({ email: user.email, limit: '20' });
    if (cursor) params.set('cursor', cursor);
    return request(`/api/usuario/meus-ingressos?${params}`, { signal });
  },
  async allOrders({ signal } = {}) {
    if (!cache.has('all-orders')) {
      const requestPromise = (async () => {
        const tickets = [];
        let cursor = '';
        do {
          const data = await api.orders({ cursor, signal });
          tickets.push(...(data.tickets || []));
          cursor = data.nextCursor || '';
        } while (cursor);
        return tickets;
      })();
      cache.set('all-orders', requestPromise);
      requestPromise.catch(() => cache.delete('all-orders'));
    }
    return cache.get('all-orders');
  },
  async ticket(id, signal) {
    const user = readUser();
    if (!user?.email) throw Object.assign(new Error('Faça login para ver seu ingresso.'), { status: 401 });
    const params = new URLSearchParams({ email: user.email, includeQr: 'true' });
    return request(`/api/usuario/meus-ingressos/${encodeURIComponent(id)}?${params}`, { signal });
  },
  async resaleQueue(eventId, signal) {
    return request(`/api/revenda/fila?evento_id=${encodeURIComponent(eventId)}`, { signal });
  },
  async announceResale(ticketId, fee) {
    return request('/api/revenda/anunciar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingresso_id: ticketId, taxa: fee })
    });
  },
  async cancelResale(resaleId) {
    return request(`/api/revenda/${encodeURIComponent(resaleId)}`, { method: 'DELETE' });
  },
  async upgradeResalePriority(resaleId, fee) {
    return request(`/api/revenda/${encodeURIComponent(resaleId)}/prioridade`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taxa: fee })
    });
  },
  async myResaleListings() {
    return request('/api/revenda/meus-anuncios');
  },
  async buyResale(eventId, setorNome = '', categoria = '') {
    return request('/api/revenda/comprar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento_id: eventId, setor_nome: setorNome, categoria_ingresso: categoria })
    });
  },
  async wallet() {
    return request('/api/wallet');
  },
  async requestPixWithdrawal(value, cpf) {
    return request('/api/wallet/saques/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: value, cpf })
    });
  },
  async login(email, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });
    if (data.user) {
      const sessionUser = { ...data.user, session_token: data.session_token };
      localStorage.setItem('trocaticket-user', JSON.stringify(sessionUser));
      localStorage.setItem('usuario', JSON.stringify(sessionUser));
    }
    return data;
  }
};

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/main.jsx

```jsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api.js';
import './styles.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Ticket = lazy(() => import('./pages/Ticket.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Resale = lazy(() => import('./pages/Resale.jsx'));

function routeFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/events') return { page: 'events' };
  if (path === '/orders') return { page: 'orders' };
  if (path === '/login') return { page: 'login' };
  if (path === '/resale') return { page: 'resale' };
  if (path.startsWith('/ticket/')) return { page: 'ticket', id: path.split('/').pop() };
  return { page: 'home' };
}

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Shell({ children }) {
  const user = api.user();
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>
          Troca<span>Ticket</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="/events" onClick={(event) => { event.preventDefault(); navigate('/events'); }}>Eventos</a>
          <a href="/orders" onClick={(event) => { event.preventDefault(); navigate('/orders'); }}>Meus pedidos</a>
          <a href="/resale" onClick={(event) => { event.preventDefault(); navigate('/resale'); }}>Revenda</a>
          {user ? (
            <button type="button" className="link-button" onClick={() => { api.logout(); navigate('/'); }}>Sair</button>
          ) : (
            <a href="/login" onClick={(event) => { event.preventDefault(); navigate('/login'); }}>Entrar</a>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(routeFor(window.location.pathname));
  useEffect(() => {
    const onPopState = () => setRoute(routeFor(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const page = route.page === 'events' ? <Events /> :
    route.page === 'orders' ? <Orders /> :
    route.page === 'ticket' ? <Ticket id={route.id} /> :
    route.page === 'login' ? <Login /> : <Home />;
  const resolvedPage = route.page === 'resale' ? <Resale /> : page;
  return <Shell><Suspense fallback={null}>{resolvedPage}</Suspense></Shell>;
}

createRoot(document.getElementById('root')).render(<App />);

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Events.jsx

```jsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

export default function Events() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.events().then(data => setEvents(data.events || [])).catch(err => setError(err.message)); }, []);
  return <section className="page-section"><p className="eyebrow">Catálogo TrocaTicket</p><h1>Eventos disponíveis</h1>{error ? <p className="error">{error}</p> : events && <div className="event-grid">{events.map(event => <article className="event-card" key={event.id}><AssetImage src={event.imagem} alt={event.name || 'Evento'} loading="lazy" /><h2>{event.name}</h2><p>{event.location || 'Local a confirmar'}</p></article>)}</div>}</section>;
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Home.jsx

```jsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

export default function Home() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.events().then(data => setEvents(data.events || [])).catch(err => setError(err.message)); }, []);
  return <section className="page-section">
    <div className="hero-copy">
      <p className="eyebrow">A troca segura começa aqui</p>
      <h1>Seu ingresso ainda tem <em>história</em> para contar.</h1>
      <p>Compre, acompanhe e acesse seus ingressos sem recarregar a página.</p>
    </div>
    <h2>Eventos em destaque</h2>
    {error ? <p className="error">{error}</p> : events && <div className="event-grid">{events.slice(0, 6).map(event => <article className="event-card" key={event.id}><AssetImage src={event.imagem} alt={event.name || 'Evento'} loading="lazy" /><h3>{event.name}</h3><p>{event.location || 'Local a confirmar'}</p></article>)}</div>}
  </section>;
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Login.jsx

```jsx
import { useState } from 'react';
import { api } from '../lib/api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(event) { event.preventDefault(); setError(''); try { await api.login(email, password); window.history.pushState({}, '', '/orders'); window.dispatchEvent(new PopStateEvent('popstate')); } catch (err) { setError(err.message); } }
  return <section className="page-section narrow"><h1>Entrar</h1><form className="login-form" onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Senha<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>{error && <p className="error">{error}</p>}<button className="primary-button">Entrar</button></form></section>;
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Orders.jsx

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

function openTicket(id) {
  window.history.pushState({}, '', `/ticket/${id}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function preloadOrders() {
      let cursor = '';
      try {
        do {
          const data = await api.orders({ cursor, signal: controller.signal });
          if (!active) return;
          setOrders(current => [...current, ...(data.tickets || [])]);
          cursor = data.nextCursor || '';
        } while (cursor && !controller.signal.aborted);
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (active) setHydrated(true);
      }
    }

    preloadOrders();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const events = useMemo(() => {
    const groups = new Map();
    orders.forEach(ticket => {
      const name = ticket.eventName || ticket.evento || 'Evento sem título';
      if (!groups.has(name)) {
        groups.set(name, {
          name,
          location: ticket.location || 'Local a confirmar',
          tickets: []
        });
      }
      groups.get(name).tickets.push(ticket);
    });
    return [...groups.values()];
  }, [orders]);

  return (
    <section className="page-section">
      <h1>Meus pedidos</h1>
      {error && <p className="error">{error}</p>}
      {!error && hydrated && !events.length && (
        <p className="orders-empty" aria-live="polite">
          Não há pedidos disponíveis para esta conta.
        </p>
      )}
      <div className="order-list">
        {events.map(event => {
          const isExpanded = expandedEvent === event.name;
          return (
            <article className={`event-order-group${isExpanded ? ' is-expanded' : ''}`} key={event.name}>
              <button
                type="button"
                className="order-card"
                aria-expanded={isExpanded}
                onClick={() => setExpandedEvent(isExpanded ? null : event.name)}
              >
                <strong>{event.name}</strong>
                <span>{event.location}</span>
                <small>{event.tickets.length} ingresso{event.tickets.length === 1 ? '' : 's'}</small>
              </button>
              {isExpanded && (
                <div className="ticket-sublist">
                  {event.tickets.map(ticket => (
                    <button type="button" className="ticket-subcard" key={ticket.id} onClick={() => openTicket(ticket.id)}>
                      <strong>Ingresso #{ticket.codigo_ingresso || ticket.numero_ingresso || ticket.id}</strong>
                      <span>{ticket.transferido ? 'Transferido' : ticket.repassado ? 'Repassado, conferir em Revenda' : ticket.emRevenda ? 'Em revenda' : ticket.status}</span>
                      <small>Titular: {ticket.titular || 'Não informado'} · Pedido: {ticket.codigo_pedido || 'Não informado'}</small>
                    </button>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/resale.css

```css
.resale-page{max-width:820px}
.resale-listings{margin-top:28px;padding:24px;background:#191e2a;border:1px solid #2b3345;border-radius:16px}
.resale-section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:18px}.resale-section-heading h2{margin:0}.resale-section-heading>span,.resale-field-hint,.resale-empty{color:#9ba5ba;font-size:.85rem}
.resale-listing-grid{display:grid;gap:12px}.resale-listing{padding:16px;border:1px solid #2b3345;border-radius:12px;background:#10131d}.resale-listing.is-pending{border-left:3px solid #f2bb61}.resale-listing.is-sold{border-left:3px solid #75d6a0}.listing-topline,.listing-details{display:flex;justify-content:space-between;gap:12px;align-items:center}.listing-topline strong{color:#fff}.listing-topline span{color:#f2bb61;font-size:.78rem;text-align:right}.is-sold .listing-topline span{color:#75d6a0}.resale-listing p,.resale-listing small{color:#9ba5ba;font-size:.82rem}.resale-listing p{margin:9px 0}.listing-details{border-top:1px solid #2b3345;border-bottom:1px solid #2b3345;padding:10px 0;color:#cfd6e5;font-size:.85rem}.listing-details strong{color:#b6ed4c}.listing-cancel{margin:12px 0 0;padding:8px 12px;font-size:.8rem}
.listing-actions{display:flex;flex-wrap:wrap;gap:8px}.queue-notice{color:#f2d28a!important}
.resale-queue,.wallet-card{margin-top:28px;padding:24px;background:#191e2a;border:1px solid #2b3345;border-radius:16px}
.queue-row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #2b3345;color:#cfd6e5}
.queue-row span:last-child{color:#b6ed4c}
.resale-notice{margin:24px 0;padding:18px 20px;border:1px solid #6c5730;border-left:4px solid #f2bb61;border-radius:12px;background:#29251d;color:#f5e3b2}
.resale-notice p{margin:6px 0 0;color:#d9c99e}
.resale-form{display:grid;gap:20px;margin-top:28px;padding:24px;background:#191e2a;border:1px solid #2b3345;border-radius:16px}
.resale-form label,.resale-form legend{color:#cfd6e5;font-weight:700}.resale-field-hint{display:block;margin-top:-12px}
.resale-form select{display:block;width:100%;margin-top:8px;padding:12px;border:1px solid #46516a;border-radius:8px;background:#10131d;color:#fff}
.resale-form fieldset{border:0;padding:0;margin:0}
.fee-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
.fee-option{display:grid;gap:5px;padding:14px;border:1px solid #46516a;border-radius:10px;cursor:pointer}
.fee-option.selected{border-color:#b6ed4c;background:#202b22}
.fee-option input{accent-color:#b6ed4c}
.fee-option span,.resale-price,.wallet-card>p{color:#9ba5ba;font-size:.85rem}
.resale-price{margin:0}.success{color:#75d6a0}
.resale-steps{margin-top:28px;color:#cfd6e5}.resale-steps li{margin:8px 0}
.wallet-balances{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.wallet-balances span{display:grid;gap:4px;color:#9ba5ba}
.wallet-balances strong{color:#b6ed4c;font-size:1.35rem}
.withdrawal-form{display:grid;grid-template-columns:1fr 1fr auto;gap:8px}
.withdrawal-form input{min-width:0;padding:11px;border:1px solid #46516a;border-radius:8px;background:#10131d;color:#fff}
.withdrawal-form .secondary-button{margin:0}
@media(max-width:640px){.fee-grid,.withdrawal-form,.wallet-balances{grid-template-columns:1fr}}
@media(max-width:640px){.resale-section-heading,.listing-topline,.listing-details{align-items:flex-start;flex-direction:column}.listing-topline span{text-align:left}}
.rate-modal-backdrop{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:rgba(3,6,14,.78);backdrop-filter:blur(8px)}
.rate-modal-card{position:relative;width:min(100%,520px);padding:30px;border:1px solid #46516a;border-radius:16px;background:#191e2a;box-shadow:0 24px 80px rgba(0,0,0,.55)}
.rate-modal-card h2{margin:4px 0 8px}.rate-modal-card>p:not(.eyebrow){color:#9ba5ba;font-size:.85rem}.rate-modal-close{position:absolute;top:12px;right:16px;border:0;background:none;color:#9ba5ba;font-size:24px;cursor:pointer}.rate-modal-options{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.rate-modal-options .fee-card{display:grid;gap:6px;padding:14px;border:1px solid #46516a;border-radius:10px;cursor:pointer}.rate-modal-options .fee-card input{position:absolute;opacity:0}.rate-modal-options .fee-card.selected{border-color:#8da5ff;background:rgba(85,104,210,.2)}.rate-modal-actions{display:flex;justify-content:flex-end;gap:8px}.rate-modal-actions button{width:auto}.rate-modal-actions button:disabled{opacity:.5}
@media(max-width:640px){.rate-modal-options{grid-template-columns:1fr}.rate-modal-actions{flex-direction:column}.rate-modal-actions button{width:100%}}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Resale.jsx

```jsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import './resale.css';

const fees = [
  { value: 'comum', label: 'Comum', percent: 2, description: 'Posição base' },
  { value: 'basica', label: 'Básica', percent: 5, description: 'Prioridade intermediária' },
  { value: 'premium', label: 'Premium', percent: 8, description: 'Topo da fila' }
];
const formatMoney = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Resale() {
  const [tickets, setTickets] = useState([]);
  const [fee, setFee] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [upgradingId, setUpgradingId] = useState(null);
  const [rateModal, setRateModal] = useState(null);
  const [rateChoice, setRateChoice] = useState('');
  const [rateFeedback, setRateFeedback] = useState({});
  const [eventId, setEventId] = useState('');
  const [sectorName, setSectorName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);
  const [withdrawal, setWithdrawal] = useState({ value: '', cpf: '' });
  const user = api.user();
  const requestedTicketId = new URLSearchParams(window.location.search).get('ingresso_id');
  const requestedTicketCode = new URLSearchParams(window.location.search).get('ingresso_codigo');

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([api.allOrders(), api.myResaleListings(), api.wallet()])
      .then(([allTickets, resaleData, walletData]) => {
        setTickets(allTickets || []);
        const requestedTicket = (allTickets || []).find(ticket =>
          (requestedTicketId && String(ticket.id) === String(requestedTicketId))
          || (requestedTicketCode && [ticket.codigo_ingresso, ticket.numero_ingresso, ticket.codigo_original_bilheteria].some(code =>
            String(code || '').trim().toLowerCase() === String(requestedTicketCode).trim().toLowerCase()
          ))
        );
        if (requestedTicket) {
          setSelectedTicket(String(requestedTicket.id));
          setEventId(requestedTicket.eventId || '');
          setSectorName(requestedTicket.sector || requestedTicket.setor || '');
          setCategoryName(requestedTicket.ticketCategory || requestedTicket.categoria_ingresso || '');
        }
        setMyListings(resaleData.listings || []);
        setWallet(walletData.wallet);
      })
      .catch(err => setError(err.message));
    const refreshListings = () => api.myResaleListings()
      .then(data => setMyListings(data.listings || []))
      .catch(() => {});
    const intervalId = window.setInterval(refreshListings, 15000);
    return () => window.clearInterval(intervalId);
  }, [user?.email]);

  async function requestWithdrawal(event) {
    event.preventDefault();
    try {
      await api.requestPixWithdrawal(withdrawal.value, withdrawal.cpf);
      setMessage('Saque PIX solicitado. Ele será processado após a validação da titularidade.');
      setWithdrawal({ value: '', cpf: '' });
      const data = await api.wallet();
      setWallet(data.wallet);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    if (!eventId) {
      setListings([]);
      return;
    }
    api.resaleQueue(eventId).then(data => setListings(data.listings || [])).catch(err => setError(err.message));
  }, [eventId]);

  async function announce(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!selectedTicket || !fee) {
      setError('Selecione um ingresso e uma taxa de repasse.');
      return;
    }
    try {
      await api.announceResale(selectedTicket, fee);
      setMessage('Ingresso anunciado na fila de revenda.');
      setSelectedTicket('');
      setFee('');
      const data = await api.myResaleListings();
      setMyListings(data.listings || []);
      const allTickets = await api.allOrders();
      setTickets(allTickets || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function cancelListing(listingId) {
    setCancellingId(listingId);
    setError('');
    try {
      await api.cancelResale(listingId);
      setMessage('Anúncio cancelado. O ingresso voltou para sua carteira.');
      const [allTickets, resaleData] = await Promise.all([api.allOrders(), api.myResaleListings()]);
      setTickets(allTickets || []);
      setMyListings(resaleData.listings || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCancellingId(null);
    }

  }

  async function changeRate(listingId, feeKey) {
    setUpgradingId(listingId);
    setError('');
    setRateFeedback(current => ({ ...current, [listingId]: '' }));
    try {
      const data = await api.upgradeResalePriority(listingId, feeKey);
      setRateFeedback(current => ({ ...current, [listingId]: { text: `${data.message} Diferença no repasse: ${formatMoney(data.diferenca_repasse)}.`, error: false } }));
      const resaleData = await api.myResaleListings();
      setMyListings(resaleData.listings || []);
    } catch (requestError) {
      setRateFeedback(current => ({ ...current, [listingId]: { text: requestError.message, error: true } }));
    } finally {
      setUpgradingId(null);
      setRateModal(null);
      setRateChoice('');
    }
  }

  const activeListingIds = new Set(myListings.filter(item => item.status === 'disponivel').map(item => String(item.ingresso_id)));
  const availableTickets = tickets.filter(ticket =>
    ['ativo', 'valido'].includes(String(ticket.status).toLowerCase())
    && !activeListingIds.has(String(ticket.id))
  );

  return (
    <section className="page-section resale-page">
      <p className="eyebrow">Revenda oficial</p>
      <h1>Revenda P2P de ingressos</h1>
      <div className="resale-notice" role="note">
        <strong>Fora do prazo de reembolso?</strong>
        <p>Se já passaram 7 dias previstos no Código de Defesa do Consumidor ou você teve dificuldade com o estorno, use a revenda oficial como alternativa segura para recuperar o valor investido.</p>
      </div>
      {!user && <p className="error">Faça login para anunciar ou comprar ingressos.</p>}
      {user && (
        <form className="resale-form" onSubmit={announce}>
          <label>Ingresso válido
            <select value={selectedTicket} onChange={event => {
              const value = event.target.value;
              const ticket = tickets.find(item => String(item.id) === String(value));
              setSelectedTicket(value);
              setEventId(ticket?.eventId || '');
              setSectorName(ticket?.sector || ticket?.setor || '');
              setCategoryName(ticket?.ticketCategory || ticket?.categoria_ingresso || '');
            }}>
              <option value="">Selecione um ingresso</option>
              {availableTickets.map(ticket => (
                <option key={ticket.id} value={ticket.id}>{ticket.eventName || ticket.evento} - #{ticket.codigo_ingresso || ticket.numero_ingresso} · Setor: {ticket.sector || ticket.setor || 'Setor geral'} · {ticket.ticketCategory || 'Categoria não identificada'}</option>
              ))}
            </select>
            {!availableTickets.length && <small className="resale-field-hint">Todos os seus ingressos válidos já estão anunciados ou não estão disponíveis.</small>}
          </label>
          {selectedTicket && <small className="resale-field-hint">A fila e a compra serão processadas somente para o setor pago: {sectorName || 'Setor geral'}.</small>}
          <fieldset>
            <legend>Taxa de repasse obrigatória</legend>
            <div className="fee-grid">
              {fees.map(item => (
                <label className={`fee-option${fee === item.value ? ' selected' : ''}`} key={item.value}>
                  <input type="radio" name="fee" value={item.value} checked={fee === item.value} onChange={event => setFee(event.target.value)} />
                  <strong>{item.label} · {item.percent}%</strong>
                  <span>{item.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="resale-price">O preço é travado no valor original pago. Não é permitido ágio ou sobrepreço. A modalidade também é preservada: meia-entrada retorna como meia-entrada, inteira retorna como inteira e assim por diante.</p>
          <button type="submit" className="primary-button">Anunciar na revenda</button>
        </form>
      )}
      {user && (
        <section className="resale-listings" aria-labelledby="my-resale-title">
          <div className="resale-section-heading">
            <div><p className="eyebrow">Acompanhamento</p><h2 id="my-resale-title">Tickets em revenda</h2></div>
            <span>{myListings.length} anúncio{myListings.length === 1 ? '' : 's'}</span>
          </div>
          {!myListings.length ? <p className="resale-empty">Você ainda não colocou ingressos na revenda.</p> : (
            <div className="resale-listing-grid">
              {myListings.map(listing => {
                const active = listing.status === 'disponivel';
                const queuePosition = Number(listing.posicao || listing.position || 1);
                const queueTotal = Number(listing.total_fila || listing.totalFila || 1);
                const partnerBoxOffice = listing.bilheteria_id != null && listing.bilheteria_origem !== 'Troca Ticket';
                const administrationFee = Number(listing.taxa_administracao_valor || (partnerBoxOffice ? 0 : listing.preco_original * 14 / 100));
                return <article className={`resale-listing ${active ? 'is-pending' : 'is-sold'}`} key={listing.id}>
                  <div className="listing-topline"><strong>{listing.evento}</strong><span>{active ? 'Aguardando repasse / Na fila' : listing.status === 'vendida' ? 'Vendido / Repassado' : 'Anúncio cancelado'}</span></div>
                  <p>Ingresso #{listing.numero_ingresso} · {listing.categoria_ingresso || 'Modalidade preservada'}</p>
                  <div className="listing-details"><span>{listing.setor_nome || 'Setor geral'} · {listing.lote_nome || 'Lote pago'} · {listing.categoria_ingresso || 'Modalidade preservada'} · {listing.taxa_nome} · {listing.taxa_percentual}%</span><strong>{formatMoney(Number(listing.preco_original))}</strong></div>
                  {active ? <><small>Repasse estimado se vendido: {formatMoney(Number(listing.preco_original) - Number(listing.preco_original) * Number(listing.taxa_percentual) / 100 + administrationFee)}. Taxa de administração devolvida: {formatMoney(administrationFee)}. Só a taxa de prioridade é descontada.</small><small>Posição: {queuePosition}º entre {queueTotal} anúncios em {listing.setor_nome || 'Setor geral'} ({listing.categoria_ingresso || 'modalidade não identificada'})</small><small className="queue-notice">Novos anúncios com prioridade maior podem passar à frente do seu.</small><div className="listing-actions"><button type="button" className="secondary-button" disabled={upgradingId === listing.id} onClick={() => { setRateModal(listing); setRateChoice(String(listing.taxa_percentual) === '2' ? 'comum' : String(listing.taxa_percentual) === '5' ? 'basica' : 'premium'); }}>Alterar taxa</button><button type="button" className="secondary-button listing-cancel" disabled={cancellingId === listing.id} onClick={() => cancelListing(listing.id)}>{cancellingId === listing.id ? 'Cancelando...' : 'Cancelar anúncio'}</button></div>{rateFeedback[listing.id]?.text && <small className={rateFeedback[listing.id].error ? 'error' : 'success'}>{rateFeedback[listing.id].text}</small>}</> : listing.status === 'vendida' && <small>Ingresso antigo revogado. Saldo líquido em custódia para liberação pós-evento: {formatMoney(Number(listing.valor_liquido || 0))}.</small>}
                </article>;
              })}
            </div>
          )}
          {rateModal && <div className="rate-modal-backdrop" role="presentation" onClick={() => setRateModal(null)}>
            <section className="rate-modal-card" role="dialog" aria-modal="true" aria-labelledby="rate-modal-title" onClick={event => event.stopPropagation()}>
              <button type="button" className="rate-modal-close" onClick={() => setRateModal(null)} aria-label="Fechar">×</button>
              <p className="eyebrow">Prioridade na fila</p>
              <h2 id="rate-modal-title">Alterar taxa</h2>
              <p>Escolha a prioridade desejada para este anúncio.</p>
              <div className="rate-modal-options">
                {fees.map(item => <label className={`fee-card${rateChoice === item.value ? ' selected' : ''}`} key={item.value}>
                  <input type="radio" name="rate-modal-fee" value={item.value} checked={rateChoice === item.value} onChange={() => setRateChoice(item.value)} />
                  <strong>{item.label} · {item.percent}%</strong><small>{item.description}</small>
                </label>)}
              </div>
              <div className="rate-modal-actions">
                <button type="button" className="secondary-button" onClick={() => setRateModal(null)}>Cancelar</button>
                <button type="button" className="primary-button" disabled={!rateChoice || upgradingId === rateModal.id} onClick={() => changeRate(rateModal.id, rateChoice)}>Confirmar alteração</button>
              </div>
            </section>
          </div>}
        </section>
      )}
      {eventId && (
        <div className="resale-queue">
          <h2>Fila prioritária do evento</h2>
          {!listings.length ? <p>Nenhum ingresso disponível na fila.</p> : listings.map((listing, index) => (
            <div className="queue-row" key={listing.id}><strong>#{index + 1}</strong><span>{listing.setor_nome || 'Setor geral'} · {listing.taxa_nome} · {listing.taxa_percentual}% · {listing.categoria_ingresso || 'Categoria não identificada'}</span><span>R$ {Number(listing.preco_original).toFixed(2)}</span></div>
          ))}
          <button type="button" className="secondary-button" onClick={async () => {
            try {
              await api.buyResale(eventId, sectorName, categoryName);
              setMessage('Compra concluída. O novo ingresso já está vinculado à sua conta.');
              const [ordersData, resaleData, queueData] = await Promise.all([
                api.orders(),
                api.myResaleListings(),
                api.resaleQueue(eventId)
              ]);
              setTickets(ordersData.tickets || []);
              setMyListings(resaleData.listings || []);
              setListings(queueData.listings || []);
            } catch (requestError) { setError(requestError.message); }
          }}>Comprar ingresso do topo da fila</button>
        </div>
      )}
      {user && wallet && (
        <section className="wallet-card">
          <h2>Carteira Troca Ticket</h2>
          <div className="wallet-balances">
            <span>A liberar<strong>R$ {wallet.pendente.toFixed(2)}</strong></span>
            <span>Disponível<strong>R$ {wallet.disponivel.toFixed(2)}</strong></span>
          </div>
          <p>O saldo só fica disponível 24 horas após o fim do evento e com check-in confirmado. Saques PIX exigem CPF da mesma titularidade.</p>
          <form onSubmit={requestWithdrawal} className="withdrawal-form">
            <input type="number" min="0.01" step="0.01" placeholder="Valor do saque" value={withdrawal.value} onChange={event => setWithdrawal({ ...withdrawal, value: event.target.value })} required />
            <input inputMode="numeric" placeholder="CPF da chave PIX" value={withdrawal.cpf} onChange={event => setWithdrawal({ ...withdrawal, cpf: event.target.value })} required />
            <button type="submit" className="secondary-button">Transferir</button>
          </form>
        </section>
      )}
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="resale-steps">
        <h2>Como funciona</h2>
        <ol><li>A taxa define sua prioridade: Premium, Básica ou Comum.</li><li>Empates são resolvidos pelo menor preço e depois pelo horário do anúncio.</li><li>Na compra, o titular anterior perde o acesso e um novo ingresso exclusivo é gerado para o comprador, mantendo a modalidade original do ingresso.</li></ol>
      </div>
    </section>
  );
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/pages/Ticket.jsx

```jsx
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { AssetImage } from '../components/AssetImage.jsx';

function goToTicket(id) {
  window.history.pushState({}, '', `/ticket/${id}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Ticket({ id }) {
  const [ticket, setTicket] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setTicket(null);
    setError('');
    Promise.all([api.ticket(id, controller.signal), api.allOrders({ signal: controller.signal })])
      .then(([detail, orders]) => {
        const selected = detail.ticket;
        const eventName = selected.eventName || selected.evento;
        setTicket(selected);
        setSiblings(orders.filter(item => (item.eventName || item.evento) === eventName));
      })
      .catch(requestError => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      });
    return () => controller.abort();
  }, [id]);

  const currentIndex = useMemo(() => siblings.findIndex(item => String(item.id) === String(id)), [siblings, id]);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  if (error) return <section className="page-section"><p className="error">{error}</p></section>;
  if (!ticket) return <section className="page-section" aria-busy="true" />;

  return (
    <section className="page-section ticket-detail">
      <div className="ticket-carousel">
        <button type="button" className="ticket-carousel-arrow ticket-carousel-prev" disabled={!previous} onClick={() => previous && goToTicket(previous.id)} aria-label="Ingresso anterior">‹</button>
        <div className="ticket-carousel-card">
          <h1>{ticket.eventName || ticket.evento}</h1>
          <p>{ticket.location || 'Local a confirmar'}</p>
          {ticket.transferido
            ? <div className="ticket-qr-state"><strong>INGRESSO TRANSFERIDO</strong><span>Este ingresso foi transferido.</span></div>
            : ticket.repassado
            ? <div className="ticket-qr-state"><strong>INGRESSO REPASSADO</strong><span>Confira em Revenda.</span></div>
            : ticket.emRevenda
            ? <div className="ticket-qr-state"><strong>INGRESSO EM REVENDA</strong><span>Cancele o anúncio para voltar a usar o QR Code.</span></div>
            : ticket.qr_code_image
            ? <AssetImage className="ticket-qr" src={ticket.qr_code_image} alt="QR Code do ingresso" />
            : <p>QR Code indisponível para este ingresso.</p>}
          <p>Status: <strong>{ticket.transferido ? 'Transferido' : ticket.repassado ? 'Repassado' : ticket.emRevenda ? 'Em revenda' : ticket.status}</strong></p>
          <div className="ticket-actions">
            {!ticket.emRevenda && <><button type="button" className="primary-button">Baixar para Acesso Offline</button>
            <button type="button" className="secondary-button">Adicionar à Carteira do Google</button>
            <button type="button" className="secondary-button">Transferir</button></>}
            <button type="button" className="secondary-button" onClick={() => {
              const reference = ticket.codigo_ingresso || ticket.numero_ingresso || ticket.id;
              window.history.pushState({}, '', `/resale?ingresso_id=${encodeURIComponent(ticket.id)}&ingresso_codigo=${encodeURIComponent(reference)}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}>Anunciar em Revenda</button>
          </div>
          <p className="ticket-counter" aria-live="polite">Ingresso {Math.max(currentIndex + 1, 1)} de {Math.max(siblings.length, 1)}</p>
        </div>
        <button type="button" className="ticket-carousel-arrow ticket-carousel-next" disabled={!next} onClick={() => next && goToTicket(next.id)} aria-label="Próximo ingresso">›</button>
      </div>
      <a className="secondary-button" href="/orders" onClick={event => { event.preventDefault(); window.history.pushState({}, '', '/orders'); window.dispatchEvent(new PopStateEvent('popstate')); }}>Voltar aos pedidos</a>
    </section>
  );
}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/src/styles.css

```css
:root{font-family:Inter,system-ui,sans-serif;color:#f5f7fb;background:#10131d;line-height:1.5}*{box-sizing:border-box}body{margin:0}.app-shell{min-height:100vh}.app-header{display:flex;align-items:center;justify-content:space-between;padding:18px 6%;border-bottom:1px solid #252b3b;position:sticky;top:0;background:#10131df2;backdrop-filter:blur(12px);z-index:2}.app-brand{font-size:1.4rem;font-weight:800;color:#fff;text-decoration:none}.app-brand span{color:#b6ed4c}.app-header nav{display:flex;gap:18px;align-items:center}.app-header a,.link-button{color:#cfd6e5;text-decoration:none;background:none;border:0;font:inherit;cursor:pointer}.app-header a:hover,.link-button:hover{color:#b6ed4c}.app-main{max-width:1180px;margin:auto;padding:56px 6%}.page-section{min-height:60vh}.hero-copy{max-width:680px;margin-bottom:56px}.hero-copy h1{font-size:clamp(2.4rem,7vw,5.4rem);line-height:1.02;margin:.2em 0}.hero-copy em{color:#b6ed4c;font-style:normal}.eyebrow{color:#b6ed4c;text-transform:uppercase;letter-spacing:.14em;font-size:.75rem;font-weight:700}.event-grid,.order-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}.event-card,.order-card{background:#191e2a;border:1px solid #2b3345;border-radius:16px;overflow:hidden}.event-card{padding-bottom:18px}.event-card img{width:100%;height:160px;object-fit:cover}.event-card h2,.event-card h3,.event-card p{margin:12px 18px}.order-card{display:flex;flex-direction:column;gap:6px;padding:20px;color:#fff;text-decoration:none;width:100%;text-align:left;cursor:pointer}.order-card span,.order-card small{color:#9ba5ba}.event-order-group{min-width:0}.event-order-group.is-expanded .order-card{border-color:#b6ed4c}.ticket-sublist{display:grid;gap:8px;padding:8px 0 0 18px}.ticket-subcard{display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border:1px solid #2b3345;border-radius:10px;background:#141925;color:#fff;text-align:left;cursor:pointer}.ticket-subcard span{color:#9ba5ba}.primary-button,.secondary-button{display:inline-block;margin-top:24px;padding:12px 18px;border-radius:10px;border:0;font-weight:700;cursor:pointer;text-decoration:none}.primary-button{background:#b6ed4c;color:#10131d}.secondary-button{border:1px solid #46516a;color:#fff}.error{color:#ff7f8a}.narrow{max-width:460px;margin:auto}.login-form{display:grid;gap:16px}.login-form label{display:grid;gap:6px;color:#cfd6e5}.login-form input{padding:12px;border:1px solid #46516a;border-radius:8px;background:#191e2a;color:#fff}.ticket-detail{text-align:center}.ticket-qr{display:block;width:min(280px,100%);margin:28px auto;border-radius:12px;background:#fff;padding:12px}@media(max-width:640px){.app-header{align-items:flex-start;gap:16px}.app-header nav{gap:10px;font-size:.85rem;flex-wrap:wrap;justify-content:flex-end}.app-main{padding-top:36px}}
.ticket-qr-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;width:min(280px,100%);min-height:180px;margin:28px auto;padding:16px;border:1px solid rgba(255,198,109,.7);border-radius:12px;background:#171a24;color:#f2e6cf}.ticket-qr-state strong{padding:6px 8px;border:1px solid rgba(255,198,109,.5);border-radius:4px;background:rgba(255,198,109,.12);color:#ffd27e;font-size:.7rem}.ticket-qr-state span{font-size:.8rem}@media(max-width:640px){.app-header{align-items:flex-start;gap:16px}.app-header nav{gap:10px;font-size:.85rem;flex-wrap:wrap;justify-content:flex-end}.app-main{padding-top:36px}}
.ticket-carousel{display:grid;grid-template-columns:52px minmax(0,620px) 52px;align-items:center;justify-content:center;gap:12px}.ticket-carousel-card{position:relative;background:#191e2a;border:1px solid #2b3345;border-radius:18px;padding:28px 32px}.ticket-carousel-arrow{width:48px;height:48px;border:1px solid #46516a;border-radius:50%;background:#191e2a;color:#b6ed4c;font-size:2rem;line-height:1;cursor:pointer}.ticket-carousel-arrow:hover:not(:disabled){background:#b6ed4c;color:#10131d}.ticket-carousel-arrow:disabled{opacity:.3;cursor:not-allowed}.ticket-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.ticket-actions .primary-button,.ticket-actions .secondary-button{margin-top:8px;font-size:.85rem}.ticket-counter{color:#9ba5ba;font-size:.9rem}@media(max-width:640px){.ticket-carousel{grid-template-columns:40px minmax(0,1fr) 40px;gap:4px}.ticket-carousel-arrow{width:38px;height:38px;font-size:1.6rem}.ticket-carousel-card{padding:22px 14px}.ticket-actions{display:grid}.ticket-actions .primary-button,.ticket-actions .secondary-button{width:100%}}
.supplier-page{max-width:1240px}.supplier-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:32px}.supplier-heading h1{font-size:clamp(2rem,4vw,3.3rem);margin:.2em 0 .1em}.supplier-intro{color:#9ba5ba;max-width:650px;margin:0}.dossier-button{margin:0;white-space:nowrap}.supplier-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:30px}.supplier-metrics article{background:#191e2a;border:1px solid #2b3345;border-radius:14px;padding:18px}.supplier-metrics span,.supplier-metrics small{display:block;color:#9ba5ba;font-size:.8rem}.supplier-metrics strong{display:block;font-size:1.7rem;margin:6px 0}.supplier-metrics small{color:#b6ed4c}.supplier-metrics .metric-warning{color:#f2bb61}.supplier-metrics .metric-success{color:#75d6a0}.supplier-toolbar{display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #2b3345;margin-bottom:18px}.supplier-tabs{display:flex;gap:22px;overflow:auto}.supplier-tabs button{border:0;border-bottom:2px solid transparent;background:none;color:#9ba5ba;padding:12px 0;white-space:nowrap;cursor:pointer}.supplier-tabs button.is-active{color:#b6ed4c;border-bottom-color:#b6ed4c;font-weight:700}.supplier-search{display:flex;align-items:center;gap:8px;color:#9ba5ba;border:1px solid #2b3345;border-radius:8px;padding:7px 10px;min-width:210px}.supplier-search input{border:0;outline:0;background:none;color:#fff;width:100%}.supplier-layout{display:grid;grid-template-columns:380px minmax(0,1fr);gap:18px}.supplier-list,.supplier-detail,.detail-card{background:#191e2a;border:1px solid #2b3345;border-radius:14px}.list-heading{display:flex;justify-content:space-between;padding:18px;border-bottom:1px solid #2b3345}.list-heading span{color:#9ba5ba;font-size:.8rem}.supplier-list-item{display:flex;align-items:center;gap:11px;width:100%;padding:16px;border:0;border-bottom:1px solid #252b3b;background:none;color:#fff;text-align:left;cursor:pointer}.supplier-list-item:last-child{border-bottom:0}.supplier-list-item:hover,.supplier-list-item.is-selected{background:#202738}.supplier-avatar{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:10px;background:#33455e;color:#b6ed4c;font-size:.75rem;font-weight:800}.supplier-avatar.large{width:48px;height:48px;border-radius:13px;font-size:.9rem}.supplier-list-copy{display:grid;gap:3px;min-width:0;flex:1}.supplier-list-copy strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.supplier-list-copy small{color:#9ba5ba;font-size:.72rem}.supplier-list-copy em,.detail-top>span{width:max-content;padding:3px 7px;border-radius:5px;font-style:normal;font-size:.65rem;font-weight:700}.supplier-value{color:#cfd6e5;font-size:.75rem;white-space:nowrap}.status-new{background:#303b59;color:#a9c5ff}.status-review{background:#493f25;color:#f2d077}.status-warning{background:#4b302e;color:#ff9b86}.status-approved{background:#214536;color:#7ce0a7}.supplier-detail{padding:22px}.detail-top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.detail-top>div{display:flex;align-items:center;gap:12px}.detail-top h2{font-size:1.2rem;margin:0}.detail-top p{color:#9ba5ba;font-size:.8rem;margin:3px 0}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.detail-card{padding:18px}.card-title{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid #2b3345;padding-bottom:13px}.card-title h3{margin:0;font-size:.95rem}.card-title p{color:#9ba5ba;font-size:.75rem;margin:4px 0 0}.card-title>span{color:#b6ed4c;font-weight:700;font-size:.8rem;white-space:nowrap}.online-dot{color:#75d6a0!important;font-weight:400!important}.document-list{display:grid}.document-row{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #252b3b}.document-row:last-child{border-bottom:0}.document-icon{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#4b302e;color:#ff9b86;font-weight:800}.document-icon.is-valid{background:#214536;color:#7ce0a7}.document-row>div{display:grid;gap:2px;min-width:0;flex:1}.document-row strong{font-size:.78rem}.document-row small{color:#9ba5ba;font-size:.68rem}.upload-button{color:#b6ed4c;font-size:.72rem;cursor:pointer}.upload-button input{display:none}.chat-messages{height:210px;overflow:auto;padding:14px 0;display:grid;align-content:start;gap:10px}.chat-message{position:relative;background:#232b3c;border-radius:9px;padding:8px 10px;max-width:88%;font-size:.75rem}.chat-message.mine{margin-left:auto;background:#334622}.chat-message strong{font-size:.68rem;color:#b6ed4c}.chat-message p{margin:3px 0}.chat-message small{color:#9ba5ba;font-size:.62rem}.chat-form{display:flex;gap:7px;border-top:1px solid #2b3345;padding-top:12px}.chat-form input{flex:1;min-width:0;border:1px solid #46516a;border-radius:7px;background:#141925;padding:9px;color:#fff;outline:0}.chat-form button{width:36px;border:0;border-radius:7px;background:#b6ed4c;color:#10131d;font-weight:800;cursor:pointer}.supplier-skeleton{display:grid;gap:12px}.supplier-skeleton span{height:58px;border-radius:12px;background:linear-gradient(90deg,#191e2a 25%,#252d3d 50%,#191e2a 75%);background-size:200% 100%;animation:skeleton-pulse 1.2s infinite}.supplier-empty{padding:20px;color:#9ba5ba}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}@keyframes skeleton-pulse{to{background-position:-200% 0}}@media(max-width:900px){.supplier-metrics{grid-template-columns:repeat(2,1fr)}.supplier-layout{grid-template-columns:1fr}.supplier-list{display:grid;grid-template-columns:repeat(2,1fr)}.list-heading{grid-column:1/-1}.supplier-list-item{border-right:1px solid #252b3b}}@media(max-width:640px){.supplier-heading{display:block}.dossier-button{margin-top:20px}.supplier-metrics{gap:8px}.supplier-metrics article{padding:13px}.supplier-metrics strong{font-size:1.3rem}.supplier-toolbar{display:block;padding-bottom:10px}.supplier-search{margin-top:10px}.supplier-tabs{gap:15px}.supplier-list{display:block}.detail-grid{grid-template-columns:1fr}.detail-top{align-items:flex-start;flex-direction:column}.detail-top>span{margin-left:60px;margin-top:-14px}}

```


### Entrega 2/Desenvolvimento Webfull Stack/Trocaticket/frontend/vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: {
    outDir: '../public/app',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/public': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/imagens': 'http://localhost:3000'
    }
  }
});

```
