# Contribuindo

## Fluxo recomendado

1. Atualize sua cópia do repositório.
2. Crie uma branch de trabalho quando isso facilitar a revisão; nenhuma branch
   específica é obrigatória.
3. Faça uma alteração focada e atualize a documentação diretamente relacionada.
4. Execute `npm run build` e `npm test`.
5. Abra um pull request descrevendo o problema, a solução e a validação.

## Commits

Use o formato:

```text
CÓDIGO: o que foi feito
```

Exemplos: `INFRA-07: bloqueia arquivos de teste` e
`FIX-01: corrige redirecionamento`.

## Nunca commitar

- `.env`, tokens, senhas, chaves privadas ou credenciais;
- `node_modules/`;
- uploads locais de chat, avatares e documentos de fornecedor;
- dados reais de usuários, pedidos ou ingressos;
- arquivos temporários e configurações específicas da máquina.

Imagens de evento referenciadas pelo banco só devem ser adicionadas
explicitamente quando fizerem parte da entrega.

## Antes de enviar

```powershell
npm run build
npm test
```

Para mudanças no banco, valide primeiro com:

```powershell
npm run db:setup -- --dry-run
```
