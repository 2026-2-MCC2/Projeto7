-- Migration idempotente do módulo de revenda P2P.
IF COL_LENGTH('dbo.ingressos_emitidos', 'preco_original') IS NULL
  ALTER TABLE dbo.ingressos_emitidos ADD preco_original decimal(10,2) NULL;
IF COL_LENGTH('dbo.ingressos_emitidos', 'revoked') IS NULL
  ALTER TABLE dbo.ingressos_emitidos ADD revoked bit NOT NULL CONSTRAINT df_ingressos_revoked DEFAULT 0;
IF COL_LENGTH('dbo.ingressos_emitidos', 'revogado_em') IS NULL
  ALTER TABLE dbo.ingressos_emitidos ADD revogado_em datetime2(0) NULL;
UPDATE i SET i.preco_original = COALESCE(i.preco_original, e.ticket_calculado)
FROM dbo.ingressos_emitidos i JOIN dbo.eventos e ON e.id = i.evento_id;

IF OBJECT_ID('dbo.revendas', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.revendas (
    id int IDENTITY(1,1) PRIMARY KEY,
    ingresso_id int NOT NULL,
    vendedor_id int NOT NULL,
    evento_id int NOT NULL,
    preco_original decimal(10,2) NOT NULL,
    taxa_percentual decimal(5,2) NOT NULL,
    taxa_nome varchar(20) NOT NULL,
    prioridade int NOT NULL,
    taxa_administracao_percentual decimal(5,2) NOT NULL DEFAULT 14,
    taxa_administracao_valor decimal(10,2) NOT NULL DEFAULT 0,
    status varchar(20) NOT NULL DEFAULT 'disponivel',
    anunciado_em datetime2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    vendido_em datetime2(0) NULL
  );
  CREATE INDEX idx_revendas_fila ON dbo.revendas(evento_id, status, prioridade DESC, preco_original ASC, anunciado_em ASC, id ASC);
END;

IF OBJECT_ID('dbo.repasse_revendas', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.repasse_revendas (
    id int IDENTITY(1,1) PRIMARY KEY,
    revenda_id int NOT NULL,
    vendedor_id int NOT NULL,
    comprador_id int NOT NULL,
    ingresso_antigo_id int NOT NULL,
    ingresso_novo_id int NOT NULL,
    valor_bruto decimal(10,2) NOT NULL,
    taxa_percentual decimal(5,2) NOT NULL,
    valor_taxa decimal(10,2) NOT NULL,
    valor_taxa_administracao decimal(10,2) NOT NULL DEFAULT 0,
    valor_liquido decimal(10,2) NOT NULL,
    valor_cobranca decimal(10,2) NULL,
    lucro_empresa decimal(10,2) NULL,
    criado_em datetime2(0) NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE object_id = OBJECT_ID('dbo.revendas')
    AND name = 'ux_revendas_ingresso_disponivel'
)
  CREATE UNIQUE INDEX ux_revendas_ingresso_disponivel
    ON dbo.revendas (ingresso_id)
    WHERE status = 'disponivel';

IF COL_LENGTH('dbo.repasse_revendas', 'valor_cobranca') IS NULL
  ALTER TABLE dbo.repasse_revendas ADD valor_cobranca decimal(10,2) NULL;
IF COL_LENGTH('dbo.repasse_revendas', 'lucro_empresa') IS NULL
  ALTER TABLE dbo.repasse_revendas ADD lucro_empresa decimal(10,2) NULL;
IF COL_LENGTH('dbo.revendas', 'taxa_administracao_percentual') IS NULL
  ALTER TABLE dbo.revendas ADD taxa_administracao_percentual decimal(5,2) NOT NULL CONSTRAINT df_revendas_taxa_admin_migrated DEFAULT 14;
IF COL_LENGTH('dbo.revendas', 'taxa_administracao_valor') IS NULL
  ALTER TABLE dbo.revendas ADD taxa_administracao_valor decimal(10,2) NOT NULL CONSTRAINT df_revendas_valor_taxa_admin_migrated DEFAULT 0;
IF COL_LENGTH('dbo.repasse_revendas', 'valor_taxa_administracao') IS NULL
  ALTER TABLE dbo.repasse_revendas ADD valor_taxa_administracao decimal(10,2) NOT NULL CONSTRAINT df_repasse_taxa_admin_migrated DEFAULT 0;

UPDATE r
SET r.preco_original = lot.preco_lote,
    r.taxa_administracao_percentual = CASE WHEN i.bilheteria_origem IS NULL OR i.bilheteria_origem = 'Troca Ticket' THEN 14 ELSE 0 END,
    r.taxa_administracao_valor = lot.preco_lote
      * CASE WHEN i.bilheteria_origem IS NULL OR i.bilheteria_origem = 'Troca Ticket' THEN 14 ELSE 0 END / 100
FROM dbo.revendas r
JOIN dbo.ingressos_emitidos i ON i.id = r.ingresso_id
OUTER APPLY (
  SELECT TOP (1)
    CASE
      WHEN LOWER(COALESCE(i.categoria_ingresso, '')) LIKE '%meia%' THEN COALESCE(el.preco_meia, el.preco / 2)
      ELSE COALESCE(el.preco_inteira, el.preco)
    END AS preco_lote
  FROM dbo.evento_lotes el
  WHERE el.evento_id = i.evento_id
    AND (LEFT(LTRIM(RTRIM(el.nome)), 1) = LEFT(LTRIM(RTRIM(i.lote_nome)), 1) OR i.lote_nome IS NULL)
    AND (NULLIF(TRIM(el.setor_nome), '') = NULLIF(TRIM(i.setor_nome), '')
      OR NULLIF(TRIM(i.setor_nome), '') IS NULL)
  ORDER BY CASE WHEN NULLIF(TRIM(el.nome), '') = NULLIF(TRIM(i.lote_nome), '') THEN 0 ELSE 1 END, el.id
) lot
WHERE lot.preco_lote IS NOT NULL;

IF OBJECT_ID('dbo.wallet_lancamentos', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.wallet_lancamentos (
    id int IDENTITY(1,1) PRIMARY KEY,
    usuario_id int NOT NULL,
    tipo varchar(20) NOT NULL,
    status varchar(20) NOT NULL,
    valor decimal(10,2) NOT NULL,
    repasse_id int NULL,
    referencia varchar(80) NULL,
    criado_em datetime2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    disponibilizado_em datetime2(0) NULL,
    CONSTRAINT uq_wallet_lancamento_repasse UNIQUE (repasse_id, tipo)
  );
  CREATE INDEX idx_wallet_usuario_status ON dbo.wallet_lancamentos(usuario_id, status, criado_em DESC);
END;

IF OBJECT_ID('dbo.saques_pix', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.saques_pix (
    id int IDENTITY(1,1) PRIMARY KEY,
    usuario_id int NOT NULL,
    valor decimal(10,2) NOT NULL,
    chave_cpf varchar(11) NOT NULL,
    status varchar(20) NOT NULL DEFAULT 'solicitado',
    solicitado_em datetime2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    processado_em datetime2(0) NULL
  );
END;
