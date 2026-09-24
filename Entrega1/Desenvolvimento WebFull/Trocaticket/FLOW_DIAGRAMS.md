# 🔐 Fluxo Completo de Acesso ao Painel Administrativo

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          TROCATICKET ADMIN SYSTEM                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


                         ┏━━━━━━━━━━━━━━━━━━━━━━━┓
                         ┃   DESENVOLVEDOR      ┃
                         ┃  (Você na máquina)   ┃
                         ┗━━━━━━━━━┬━━━━━━━━━━━┛
                                   │
                                   │ "node server.js"
                                   │
                         ┌─────────▼──────────┐
                         │  HTTP Server       │
                         │  localhost:3000    │
                         │                    │
                         │ Rotas de API:      │
                         │ /api/admin/*       │
                         └─────────┬──────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │  admin.html    │ │  admin.css     │ │  admin.js      │
        │ (Painel UI)    │ │  (Estilos)     │ │ (Autenticação) │
        └────────────────┘ └────────────────┘ └────────────────┘
                                   │
                                   │ Validação de Token
                                   │
                         ┌─────────▼──────────┐
                         │ data/              │
                         │ admin_tokens.json  │
                         │                    │
                         │ Armazena tokens    │
                         │ com hash SHA-256   │
                         └────────────────────┘


```


## Fluxo de Geração de Token (Dia 1)

```
┌──────────────────────────────────────────────────────────────┐
│ DESENVOLVEDOR                                                │
│ (Você na máquina)                                            │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ Terminal:
                 │ node generate-admin-token.js
                 │
                 ▼
        ┌────────────────────┐
        │ Script de Geração  │
        │ Solicita senha     │
        │ (padrão: admin123) │
        └────────┬───────────┘
                 │
                 │ Senha validada? ✅
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ Gera token aleatório (32 bytes)    │
        │                                     │
        │ Exemplo:                            │
        │ a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9... │
        └────────┬───────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ Calcula hash SHA-256 do token      │
        │ (para armazenamento seguro)        │
        └────────┬───────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ Armazena em                        │
        │ data/admin_tokens.json:            │
        │ {                                  │
        │   token: "hash do token",          │
        │   createdAt: "2026-09-01T...",    │
        │   expiresAt: "2026-09-08T...",    │
        │   email: "admin@empresa.com",      │
        │   used: false                      │
        │ }                                  │
        └────────┬───────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ Exibe no terminal:                 │
        │                                     │
        │ 🔗 Link de Acesso:                 │
        │ http://localhost:3000/admin.html   │
        │ ?token=a7f3c2d9e5b1f8a4c6e2d1b9... │
        └────────┬───────────────────────────┘
                 │
                 │ Desenvolvedor copia link
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ ✅ Link copiado para área de       │
        │    transferência                   │
        └────────────────────────────────────┘

```


## Fluxo de Compartilhamento (Dia 1-2)

```
┌──────────────────────────────────────────────────────────────┐
│ DESENVOLVEDOR                                                │
│ (Você)                                                       │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ Envia via:
                 │ ✅ WhatsApp
                 │ ✅ Email (criptografado)
                 │ ✅ Telegram
                 │ ❌ Slack público
                 │
                 ▼
        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        ┃  Rede/Internet Segura            ┃
        ┃  (WhatsApp, Email, etc)          ┃
        ┗━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━┛
                 │
                 │ Link enviado
                 │ http://localhost:3000/admin.html?token=...
                 │
                 ▼
        ┌──────────────────────────────────────────────┐
        │ ADMINISTRADOR                                │
        │ (Pessoa autorizada - outro computador)      │
        │                                              │
        │ Recebe mensagem com o link                  │
        │ Copia o link da mensagem                    │
        │ Cola na barra de endereço do navegador      │
        └──────────┬───────────────────────────────────┘
                   │
                   │ Acessa o link
                   │ http://localhost:3000/admin.html?token=...
                   │
                   ▼
        ┌────────────────────────────────────┐
        │ Navegador carrega admin.html       │
        │ (página em branco no início)       │
        └─────────┬──────────────────────────┘
                  │
                  │ Scripts carregam
                  │ admin.js lê URL
                  │ Extrai token: a7f3c2d9...
                  │
                  ▼
        ┌────────────────────────────────────┐
        │ admin.js envia POST request:       │
        │ /api/admin/verify-token            │
        │ Body: { "token": "..." }           │
        └─────────┬──────────────────────────┘
                  │
                  │ Servidor recebe requisição
                  │
                  ▼
        ┌────────────────────────────────────┐
        │ server.js processa:                │
        │ 1. Calcula hash do token           │
        │ 2. Procura em admin_tokens.json    │
        │ 3. Verifica se existe              │
        │ 4. Verifica se expirou             │
        │ 5. Verifica se já foi usado        │
        └─────────┬──────────────────────────┘
                  │
          ┌───────┴─────────┐
          │                 │
         ✅ Válido        ❌ Inválido
          │                 │
          ▼                 ▼
    Marca como      Retorna erro
    "usado":true    { ok: false }
    Retorna:
    { ok: true }     └────────────────┐
          │                           │
          ▼                           ▼
    ┌─────────────────┐    ┌──────────────────────┐
    │ admin.js cria   │    │ Página mostra:       │
    │ sessão no       │    │ "Acesso Negado"      │
    │ localStorage    │    │                      │
    │ (válida 24h)    │    │ Redirecionado para   │
    │                 │    │ index.html           │
    └────────┬────────┘    └──────────────────────┘
             │
             │ Remove token da URL
             │ (por segurança)
             │
             ▼
    ┌─────────────────────────────────┐
    │ Painel administrativo carrega!  │
    │                                 │
    │ ✅ Dashboard                    │
    │ ✅ Eventos                      │
    │ ✅ Usuários                     │
    │ ✅ Ingressos                    │
    │ ✅ Relatórios                   │
    │ ✅ Botão "Sair"                 │
    └─────────────────────────────────┘

```


## Fluxo de Uso do Painel (Dia 2 onwards)

```
┌──────────────────────────────────────┐
│ ADMINISTRADOR                        │
│ (Usando o painel)                   │
└──────────────┬───────────────────────┘
               │
      ┌────────┴────────┬──────────┬───────────┬──────────┐
      │                 │          │           │          │
      ▼                 ▼          ▼           ▼          ▼
   Dashboard         Eventos    Usuários    Ingressos   Relatórios
   
   ┌──────────────┐  ┌─────────────────────┐  ┌──────────┐
   │ Estatísticas │  │ Criar novo evento   │  │ Ver      │
   │ - Usuários   │  │ Editar evento       │  │ vendas   │
   │ - Ingressos  │  │ Deletar evento      │  │ Gerar    │
   │ - Eventos    │  │ Filtrar por status  │  │ PDF      │
   │ - Receita    │  └─────────────────────┘  └──────────┘
   │              │
   │ Atividades   │
   │ - Novos reg  │
   │ - Vendas     │
   │ - Deletions  │
   │              │
   │ Eventos Top  │
   └──────────────┘


    Se a sessão expira (24h):
    ↓
    ┌─────────────────────────┐
    │ Aviso de timeout        │
    │ Botão "Sair" ativo      │
    │                         │
    │ Necessário novo token   │
    │ para continuar          │
    └────────┬────────────────┘
             │
             ▼
    Desenvolvedor gera novo token:
    node generate-admin-token.js

```


## Fluxo de Logout (Qualquer momento)

```
┌──────────────────────────────────┐
│ ADMINISTRADOR                    │
│ Clica em "Sair"                 │
└────────────┬─────────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Confirmação de saída:  │
    │ "Tem certeza?"         │
    │ Sim  |  Não           │
    └──────┬─────┬──────────┘
           │     │
         Sim    Não
           │     │
           │     └─── Retorna ao painel
           │
           ▼
    ┌────────────────────────────────┐
    │ admin.js limpa:                 │
    │ - localStorage                  │
    │ - sessão                        │
    │ - dados em memória              │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Redirecionado para:            │
    │ index.html (página inicial)    │
    │                                 │
    │ Para acessar novamente:        │
    │ Necessário novo token          │
    └────────────────────────────────┘

```


## Segurança em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  CAMADA 1: Sem Acesso Direto                            │
│  ─────────────────────────────────────────────          │
│  ❌ Não existe admin.html no menu                       │
│  ❌ Sem botão "Painel Admin"                            │
│  ❌ Sem link público                                    │
│  └─→ Só por token via URL                              │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  CAMADA 2: Validação de Token                           │
│  ─────────────────────────────────────────────          │
│  ✅ Token único por acesso                              │
│  ✅ Hash SHA-256 no servidor                            │
│  ✅ Comparação segura                                   │
│  ✅ Expiração (7 dias)                                  │
│  └─→ Token inválido = acesso negado                     │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  CAMADA 3: Sessão Segura                                │
│  ─────────────────────────────────────────────          │
│  ✅ localStorage no navegador                           │
│  ✅ Sessão expira 24h                                   │
│  ✅ Necessário novo token após expiração                │
│  └─→ Proteção contra acesso prolongado                 │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  CAMADA 4: URL Segura                                   │
│  ─────────────────────────────────────────────          │
│  ✅ Token removido da URL após acesso                   │
│  ✅ Não aparece no histórico                            │
│  ✅ Não compartilhado em logs HTTP                      │
│  └─→ Proteção após autenticação                        │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  CAMADA 5: Armazenamento Seguro                         │
│  ─────────────────────────────────────────────          │
│  ✅ Tokens em hash SHA-256                              │
│  ✅ Arquivo data/admin_tokens.json protegido            │
│  ✅ Log de acesso completo                              │
│  └─→ Tokens nunca armazenados em plain text            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```


## Checklist de Implementação

```
✅ admin.html criado e funcionando
✅ admin.css estilos completos
✅ admin.js autenticação e gerenciamento
✅ server.js rotas de API para admin
✅ generate-admin-token.js script de geração
✅ data/admin_tokens.json criado
✅ Documentação completa (MD)
✅ Exemplos de HTTP (MD)
✅ Guias de setup (MD)
✅ Segurança em 5 camadas
✅ Testes de fluxo

🎉 PRONTO PARA USAR!
```

