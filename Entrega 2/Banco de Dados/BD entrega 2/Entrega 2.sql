CREATE DATABASE IF NOT EXISTS trocaticket;
USE trocaticket;

-- ============================================================
-- 1. GESTÃO DE USUÁRIOS E PERFIS
-- ============================================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(20),
    tipo_perfil ENUM('ADMIN', 'ORGANIZADOR', 'FORNECEDOR', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    status ENUM('PENDENTE', 'ATIVO', 'BLOQUEADO') NOT NULL DEFAULT 'ATIVO',
    foto_perfil VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE administradores (
    id INT PRIMARY KEY,
    nivel_acesso VARCHAR(30) DEFAULT 'SUPERADMIN',
    CONSTRAINT fk_admin_usuario FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE organizadores (
    id INT PRIMARY KEY,
    instituicao_vinculo VARCHAR(100),
    chave_pix VARCHAR(100),
    CONSTRAINT fk_organizador_usuario FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE fornecedores (
    id INT PRIMARY KEY,
    razao_social VARCHAR(150) NOT NULL,
    categoria_servico VARCHAR(50) NOT NULL,
    descricao_servico TEXT,
    portfolio_url VARCHAR(500),
    CONSTRAINT fk_fornecedor_usuario FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 2. PLANEJAMENTO E GESTÃO DE EVENTOS
-- ============================================================

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizador_id INT NOT NULL,
    nome_evento VARCHAR(120) NOT NULL,
    descricao TEXT,
    local_nome VARCHAR(150),
    local_endereco VARCHAR(255),
    data_prevista DATETIME NOT NULL,
    meta_publico INT NOT NULL DEFAULT 0,
    valor_ingresso_estimado DECIMAL(10,2),
    status ENUM('RASCUNHO', 'EM_PLANEJAMENTO', 'PUBLICADO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'EM_PLANEJAMENTO',
    banner_url VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evento_organizador FOREIGN KEY (organizador_id) REFERENCES organizadores(id) ON DELETE CASCADE
);

CREATE TABLE evento_custos_estimados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    descricao VARCHAR(180) NOT NULL,
    valor_estimado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_final DECIMAL(10,2) DEFAULT 0.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_custo_evento FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. COTAÇÕES E PROPOSTAS DE FORNECEDORES (ETAPA DE PLANEJAMENTO)
-- ============================================================

CREATE TABLE demandas_cotacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    categoria_servico VARCHAR(50) NOT NULL,
    escopo TEXT NOT NULL,
    valor_maximo_estimado DECIMAL(10,2),
    prazo_resposta DATE NOT NULL,
    status ENUM('ABERTA', 'EM_ANALISE', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ABERTA',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_demanda_evento FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE propostas_fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demanda_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    valor_proposto DECIMAL(10,2) NOT NULL,
    detalhes_proposta TEXT NOT NULL,
    prazo_execucao VARCHAR(80),
    status ENUM('PENDENTE', 'ACEITA', 'RECUSADA') NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proposta_demanda FOREIGN KEY (demanda_id) REFERENCES demandas_cotacao(id) ON DELETE CASCADE,
    CONSTRAINT fk_proposta_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. VENDAS, LOTES, PEDIDOS E INGRESSOS
-- ============================================================

CREATE TABLE lotes_ingressos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    nome_lote VARCHAR(80) NOT NULL, -- Ex: 1º Lote, Pista VIP, Camarote
    quantidade_total INT NOT NULL,
    quantidade_disponivel INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    data_inicio DATETIME,
    data_fim DATETIME,
    status ENUM('INATIVO', 'ATIVO', 'ESGOTADO') NOT NULL DEFAULT 'INATIVO',
    CONSTRAINT fk_lote_evento FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprador_id INT NOT NULL,
    codigo_pedido VARCHAR(40) NOT NULL UNIQUE,
    valor_total DECIMAL(10,2) NOT NULL,
    metodo_pagamento ENUM('PIX', 'CARTAO_CREDITO', 'BOLETO') NOT NULL,
    status_pagamento ENUM('PENDENTE', 'APROVADO', 'RECUSADO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDENTE',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
);

CREATE TABLE ingressos_emitidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    lote_id INT NOT NULL,
    comprador_id INT NOT NULL,
    codigo_ingresso VARCHAR(50) NOT NULL UNIQUE,
    qr_code_payload VARCHAR(255) NOT NULL,
    status ENUM('VALIDO', 'UTILIZADO', 'CANCELADO', 'TRANSFERIDO') NOT NULL DEFAULT 'VALIDO',
    utilizado_em DATETIME NULL,
    emitido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ingresso_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    CONSTRAINT fk_ingresso_lote FOREIGN KEY (lote_id) REFERENCES lotes_ingressos(id),
    CONSTRAINT fk_ingresso_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
);

-- ============================================================
-- 5. REVENDA / TROCA DE INGRESSOS (FOCO DA TROCATICKET)
-- ============================================================

CREATE TABLE transacoes_revenda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingresso_id INT NOT NULL,
    vendedor_id INT NOT NULL,
    comprador_id INT NULL,
    valor_revenda DECIMAL(10,2) NOT NULL,
    status ENUM('ANUNCIADO', 'EM_PROCESSAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'ANUNCIADO',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_revenda_ingresso FOREIGN KEY (ingresso_id) REFERENCES ingressos_emitidos(id),
    CONSTRAINT fk_revenda_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    CONSTRAINT fk_revenda_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
);