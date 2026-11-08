-- Seed de desenvolvimento. Os hashes são apenas valores de teste; nenhuma senha real é armazenada.
-- O login de produção deve ser criado e configurado separadamente.

DECLARE @senha_hash varchar(100) = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
DECLARE @admin_id int;
DECLARE @organizador_id int;
DECLARE @fornecedor_id int;
DECLARE @comprador_id int;
DECLARE @evento_id int;

IF NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'seed-admin@trocaticket.local')
    INSERT INTO dbo.usuarios (nome, email, senha_hash, tipo, status, email_verificado)
    VALUES ('Administrador Seed', 'seed-admin@trocaticket.local', @senha_hash, 'admin', 'aprovado', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'seed-organizador@trocaticket.local')
    INSERT INTO dbo.usuarios (nome, email, senha_hash, tipo, status, email_verificado)
    VALUES ('Organizador Seed', 'seed-organizador@trocaticket.local', @senha_hash, 'organizador', 'aprovado', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'seed-fornecedor@trocaticket.local')
    INSERT INTO dbo.usuarios (nome, email, senha_hash, tipo, status, email_verificado)
    VALUES ('Fornecedor Seed', 'seed-fornecedor@trocaticket.local', @senha_hash, 'fornecedor', 'aprovado', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'seed-comprador@trocaticket.local')
    INSERT INTO dbo.usuarios (nome, email, senha_hash, tipo, status, email_verificado)
    VALUES ('Comprador Seed', 'seed-comprador@trocaticket.local', @senha_hash, 'comprador', 'aprovado', 1);

SELECT @admin_id = id FROM dbo.usuarios WHERE email = 'seed-admin@trocaticket.local';
SELECT @organizador_id = id FROM dbo.usuarios WHERE email = 'seed-organizador@trocaticket.local';
SELECT @fornecedor_id = id FROM dbo.usuarios WHERE email = 'seed-fornecedor@trocaticket.local';
SELECT @comprador_id = id FROM dbo.usuarios WHERE email = 'seed-comprador@trocaticket.local';

IF NOT EXISTS (SELECT 1 FROM dbo.fornecedor_empresas WHERE usuario_id = @fornecedor_id)
    INSERT INTO dbo.fornecedor_empresas (
        usuario_id, razao_social, cnpj, categoria, contato, email_comercial,
        telefone, descricao, status
    )
    VALUES (
        @fornecedor_id, 'Empresa Seed Eventos', '00.000.000/0001-00',
        'Produção', 'Contato Seed', 'fornecedor@trocaticket.local',
        '0000000000', 'Empresa criada apenas para desenvolvimento.', 'aprovado'
    );

IF NOT EXISTS (SELECT 1 FROM dbo.eventos WHERE nome = 'Evento Seed Principal')
    INSERT INTO dbo.eventos (
        organizador_id, nome, artista, local, data_evento, ticket_calculado,
        publico_minimo, publico_maximo, margem_lucro, status, destaque, descricao
    )
    VALUES (
        @organizador_id, 'Evento Seed Principal', 'Artista Seed',
        'Local de Desenvolvimento', '2030-01-15T20:00:00',
        100.00, 1, 1000, 0.00, 'publicado', 1,
        N'Evento criado exclusivamente para desenvolvimento.'
    );

IF NOT EXISTS (SELECT 1 FROM dbo.eventos WHERE nome = 'Evento Seed Secundario')
    INSERT INTO dbo.eventos (
        organizador_id, nome, artista, local, data_evento, ticket_calculado,
        publico_minimo, publico_maximo, margem_lucro, status, destaque, descricao
    )
    VALUES (
        @organizador_id, 'Evento Seed Secundario', 'Artista Seed 2',
        'Local de Desenvolvimento', '2030-02-15T20:00:00',
        80.00, 1, 500, 0.00, 'publicado', 0,
        N'Evento criado exclusivamente para desenvolvimento.'
    );
