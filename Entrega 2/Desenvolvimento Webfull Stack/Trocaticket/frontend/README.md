# TrocaTicket frontend

O frontend React/Vite é montado em `/app/` e também atende as rotas `/`, `/events`,
`/orders`, `/login` e `/ticket/:id`.

## Desenvolvimento

Na raiz do repositório, instale as dependências e execute:

```powershell
npm install
npm run dev
```

O Vite fica em `http://localhost:5173/app/` e a API Node em `http://localhost:3000`.

## Build

```powershell
npm run build
```

O build é gerado em `../public/app`. O servidor Node publica esses arquivos e mantém
as páginas HTML legadas disponíveis durante a migração.
