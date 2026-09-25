# Back-end

Estrutura dedicada à API, acesso ao banco e scripts de suporte do TrocaTicket.

## Organização

- `src/`: servidor e integrações com banco.
- `sql/`: scripts de banco e migrações.
- `.env.example`: exemplo de variáveis de ambiente.

## Envio de e-mail

O envio do código de verificação funciona via SMTP. Você não precisa me mandar um e-mail existente para eu automatizar isso; basta configurar as credenciais do provedor que vai enviar as mensagens.

Se você não tiver domínio próprio, use uma conta dedicada de Gmail ou Outlook para o projeto. Isso é suficiente para disparar os códigos e mantém o remetente com aparência profissional.

### Gmail

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=seu_email@gmail.com`
- `SMTP_PASS=sua_senha_de_app`
- `SMTP_FROM=TrocaTicket <seu_email@gmail.com>`

Observação: no Gmail, use uma senha de app, não a senha normal da conta.

Se quiser, pode usar uma conta separada só para o TrocaTicket, como `trocaticket.projeto@gmail.com`, e exibir o remetente como `TrocaTicket <trocaticket.projeto@gmail.com>`.

### Outlook

- `SMTP_HOST=smtp-mail.outlook.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=seu_email@outlook.com`
- `SMTP_PASS=sua_senha_de_app`
- `SMTP_FROM=TrocaTicket <seu_email@outlook.com>`

Observação: dependendo da conta, pode ser necessário habilitar autenticação SMTP ou usar senha de app.

Se quiser, pode usar uma conta separada só para o TrocaTicket, como `trocaticket.projeto@outlook.com`, e exibir o remetente como `TrocaTicket <trocaticket.projeto@outlook.com>`.
