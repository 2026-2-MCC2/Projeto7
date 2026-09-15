#!/usr/bin/env node

/**
 * Script auxiliar para gerar tokens de acesso administrativo
 * 
 * Uso:
 *   node generate-admin-token.js
 *   node generate-admin-token.js --password sua-senha --email admin@exemplo.com
 */

const http = require('http');
const path = require('path');

// Configurações
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const adminTokensPath = path.join(__dirname, 'data', 'admin_tokens.json');

// Argumentos da linha de comando
const args = process.argv.slice(2);
let email = 'admin';
let password = ADMIN_PASSWORD;

// Parser simples de argumentos
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--password' && args[i + 1]) {
    password = args[i + 1];
    i++;
  }
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  }
}

console.log('🔐 Gerando token de acesso administrativo...\n');
console.log(`📁 Arquivo de tokens: ${adminTokensPath}`);

// Fazer requisição para gerar token
const url = new URL('/api/admin/generate-token', SERVER_URL);
const requestOptions = {
  hostname: url.hostname,
  port: url.port || 3000,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const payload = JSON.stringify({
  adminPassword: password,
  email: email
});

const request = http.request(requestOptions, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.ok) {
        console.log('✅ Token gerado com sucesso!\n');
        console.log('📋 Informações do Token:');
        console.log('─'.repeat(60));
        console.log(`Email: ${email}`);
        console.log(`Token: ${result.token}`);
        console.log(`Criado em: ${new Date().toLocaleString('pt-BR')}`);
        console.log(`Válido por: 7 dias`);
        console.log('\n🔗 Link de Acesso Direto:');
        console.log('─'.repeat(60));
        console.log(result.link);
        console.log('\n📌 Instruções:');
        console.log('─'.repeat(60));
        console.log('1. Copie o link acima');
        console.log('2. Envie de forma segura ao administrador');
        console.log('3. O administrador clica no link para acessar o painel');
        console.log('4. O token é automaticamente validado');
        console.log('5. A sessão expira após 24 horas de inatividade');
        console.log('\n⚠️  IMPORTANTE:');
        console.log('─'.repeat(60));
        console.log('- Este token será válido por 7 dias');
        console.log('- Compartilhe apenas com o administrador autorizado');
        console.log('- Use canais seguros (WhatsApp, Email criptografado, etc)');
        console.log('- Após uso, gere um novo token para próximos acessos\n');
      } else {
          console.error(`❌ Servidor rejeitou a geração do token (HTTP ${response.statusCode}).`);
        console.error('❌ Erro ao gerar token:');
        console.error(`Mensagem: ${result.message}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Resposta inválida do servidor (HTTP ${response.statusCode}).`);
      console.error('❌ Erro ao processar resposta:');
      console.error(error.message);
      process.exit(1);
    }
  });
});

request.on('error', (error) => {
  console.error('❌ Erro de conexão:');
  console.error(`Não foi possível conectar a ${SERVER_URL}`);
  console.error('Certifique-se de que o servidor está rodando.\n');
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});

request.write(payload);
request.end();
