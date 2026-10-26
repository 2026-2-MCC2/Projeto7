# TrocaTicket frontend

The frontend is a React/Vite application mounted at `/app/` and exposed through the clean routes `/`, `/events`, `/orders`, `/login`, and `/ticket/:id`.

## Development

```powershell
Set-Location src/Trocaticket/frontend
npm install
npm run dev
```

## Production build

```powershell
Set-Location src/Trocaticket/frontend
npm run build
```

The build is emitted to `../public/app`. The Node server serves the compiled assets and keeps the existing HTML pages available as a compatibility fallback while the remaining operational screens are migrated.
