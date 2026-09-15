# Exemplos de Requisições HTTP para Gerar Tokens de Admin

## 📌 Resumo Rápido

Escolha o método que preferir para gerar tokens de acesso ao painel administrativo.

---

## 1️⃣ Node.js Script (RECOMENDADO)

Melhor opção: fácil, visual e seguro.

```bash
# Terminal/PowerShell na pasta do projeto
node generate-admin-token.js
```

**Com parâmetros:**
```bash
node generate-admin-token.js --email admin@empresa.com --password SenhaForte123
```

---

## 2️⃣ cURL (Terminal/PowerShell)

Se tiver cURL instalado:

### Windows PowerShell

```powershell
$body = @{
    adminPassword = "admin123"
    email = "admin@empresa.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/generate-token" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json | Format-List
```

### Linux/Mac (bash)

```bash
curl -X POST http://localhost:3000/api/admin/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "admin123",
    "email": "admin@empresa.com"
  }' | jq
```

---

## 3️⃣ Postman

Se usar Postman:

**1. Criar nova requisição POST**
- URL: `http://localhost:3000/api/admin/generate-token`
- Método: `POST`

**2. Aba Headers**
```
Content-Type: application/json
```

**3. Aba Body (raw JSON)**
```json
{
  "adminPassword": "admin123",
  "email": "admin@empresa.com"
}
```

**4. Clique em Send**

**Resposta esperada:**
```json
{
  "ok": true,
  "message": "Token gerado com sucesso. Este token só será exibido uma vez.",
  "token": "a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1",
  "link": "http://localhost:3000/admin.html?token=a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1"
}
```

---

## 4️⃣ Insomnia

Se usar Insomnia:

**Configurar igual ao Postman:**
- URL: `http://localhost:3000/api/admin/generate-token`
- Método: POST
- Body: JSON

---

## 5️⃣ JavaScript/Fetch (em navegador)

Abra o console do navegador (F12) e execute:

```javascript
const token = await fetch('http://localhost:3000/api/admin/generate-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    adminPassword: 'admin123',
    email: 'admin@empresa.com'
  })
}).then(r => r.json());

console.log('Link:', token.link);
```

---

## 6️⃣ Python

```python
import requests
import json

url = "http://localhost:3000/api/admin/generate-token"
payload = {
    "adminPassword": "admin123",
    "email": "admin@empresa.com"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print("Token:", data.get('token'))
print("Link:", data.get('link'))
```

---

## 7️⃣ C# / .NET

```csharp
using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, 
    "http://localhost:3000/api/admin/generate-token");

var payload = new {
    adminPassword = "admin123",
    email = "admin@empresa.com"
};

var content = new StringContent(
    JsonConvert.SerializeObject(payload),
    Encoding.UTF8,
    "application/json");

request.Content = content;
var response = await client.SendAsync(request);
var responseBody = await response.Content.ReadAsStringAsync();

Console.WriteLine(responseBody);
```

---

## 8️⃣ PHP

```php
<?php
$url = "http://localhost:3000/api/admin/generate-token";
$data = array(
    "adminPassword" => "admin123",
    "email" => "admin@empresa.com"
);

$options = array(
    'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/json',
        'content' => json_encode($data)
    )
);

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$result = json_decode($response, true);

echo "Token: " . $result['token'] . "\n";
echo "Link: " . $result['link'] . "\n";
```

---

## 9️⃣ Thunder Client (VS Code Extension)

**1. Instale a extensão Thunder Client no VS Code**

**2. Crie nova requisição**
```
POST http://localhost:3000/api/admin/generate-token
```

**3. Selecione Body > JSON**
```json
{
  "adminPassword": "admin123",
  "email": "admin@empresa.com"
}
```

**4. Clique em Send**

---

## 🔟 REST Client (VS Code Extension)

Crie um arquivo `admin-requests.http`:

```http
### Gerar Token de Admin
POST http://localhost:3000/api/admin/generate-token HTTP/1.1
Content-Type: application/json

{
  "adminPassword": "admin123",
  "email": "admin@empresa.com"
}

### Verificar Token
POST http://localhost:3000/api/admin/verify-token HTTP/1.1
Content-Type: application/json

{
  "token": "COLE_O_TOKEN_AQUI"
}

### Obter Estatísticas
GET http://localhost:3000/api/admin/stats HTTP/1.1

### Listar Usuários
GET http://localhost:3000/api/admin/users HTTP/1.1

### Listar Ingressos
GET http://localhost:3000/api/admin/tickets HTTP/1.1
```

Depois clique em "Send Request" acima de cada bloco.

---

## ✅ Resposta de Sucesso

```json
{
  "ok": true,
  "message": "Token gerado com sucesso. Este token só será exibido uma vez.",
  "token": "a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1",
  "link": "http://localhost:3000/admin.html?token=a7f3c2d9e5b1f8a4c6e2d1b9f3a5c7e9d1b3f5a7c9e2d4b6f8a1c3e5d7f9b1"
}
```

---

## ❌ Erros Comuns

### Erro: Senha inválida
```json
{
  "ok": false,
  "message": "Senha de administrador inválida."
}
```

**Solução:** Verifique se está usando a senha correta (padrão: `admin123`)

### Erro: Servidor não responde
```
Error: ECONNREFUSED - Connection refused
```

**Solução:** Certifique-se de que o servidor está rodando:
```bash
node server.js
```

### Erro: JSON inválido
```json
{
  "ok": false,
  "message": "JSON inválido"
}
```

**Solução:** Verifique a formatação do JSON enviado

---

## 💡 Dicas

1. **Salve o token** em um lugar seguro
2. **O token só é exibido uma vez** - se perder, gere um novo
3. **Token é válido por 7 dias** - regenere antes se necessário
4. **Use em variáveis de ambiente** para automatizar

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- Nunca compartilhe a senha admin em públicos
- Use `ADMIN_PASSWORD` como variável de ambiente em produção
- Regenere tokens regularmente
- Revise `data/admin_tokens.json` periodicamente

---

**Qual método preferir?** 
👉 Use `node generate-admin-token.js` - é o mais fácil!
