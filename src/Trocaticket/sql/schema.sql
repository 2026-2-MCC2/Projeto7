-- Schema do TrocaTicket. As tabelas de exemplo do DDL original não fazem parte deste arquivo.
-- dbo.cancelamentos e opcional; o servidor so a consulta se ela existir.

CREATE TABLE [dbo].[auditoria_admin] (
    [id] bigint IDENTITY(1,1) NOT NULL,
    [ator_id] int NULL,
    [ator_nome] varchar(160) NOT NULL,
    [ator_tipo] varchar(30) NOT NULL,
    [acao] varchar(80) NOT NULL,
    [descricao] varchar(MAX) NOT NULL,
    [item_tipo] varchar(40) NULL,
    [item_id] varchar(80) NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_auditoria_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_auditoria_admin] PRIMARY KEY CLUSTERED ([id] ASC)
);
GO

CREATE TABLE [dbo].[trocaticket_chat_migrations] (
    [chave] varchar(120) NOT NULL,
    [executada_em] datetime2(0) NOT NULL CONSTRAINT [df_trocaticket_chat_migrations_executada] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_trocaticket_chat_migrations] PRIMARY KEY CLUSTERED ([chave] ASC)
);
GO

CREATE TABLE [dbo].[usuarios] (
    [id] int IDENTITY(1,1) NOT NULL,
    [nome] varchar(120) NOT NULL,
    [email] varchar(160) NOT NULL,
    [senha_hash] varchar(100) NOT NULL,
    [tipo] varchar(30) NOT NULL CONSTRAINT [df_usuarios_tipo] DEFAULT ('comprador'),
    [cpf] varchar(11) NULL,
    [telefone] varchar(30) NULL,
    [data_nascimento] date NULL,
    [genero] varchar(30) NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_usuarios_status] DEFAULT ('aprovado'),
    [foto_perfil] varchar(500) NULL,
    [codigo_verificacao] varchar(20) NULL,
    [email_verificado] bit NOT NULL CONSTRAINT [df_usuarios_email_verificado] DEFAULT ((1)),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_usuarios_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_usuarios] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_usuarios_email] UNIQUE NONCLUSTERED ([email] ASC)
);
GO

CREATE TABLE [dbo].[eventos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [organizador_id] int NULL,
    [nome] varchar(150) NOT NULL,
    [artista] varchar(150) NULL,
    [local] varchar(200) NULL,
    [data_evento] datetime2(0) NOT NULL,
    [ticket_calculado] decimal(10,2) NOT NULL CONSTRAINT [df_eventos_ticket] DEFAULT ((0)),
    [publico_minimo] int NOT NULL CONSTRAINT [df_eventos_publico_minimo] DEFAULT ((0)),
    [publico_maximo] int NOT NULL CONSTRAINT [df_eventos_publico_maximo] DEFAULT ((0)),
    [margem_lucro] decimal(5,2) NOT NULL CONSTRAINT [df_eventos_margem] DEFAULT ((0)),
    [status] varchar(30) NOT NULL CONSTRAINT [df_eventos_status] DEFAULT ('publicado'),
    [destaque] bit NOT NULL CONSTRAINT [df_eventos_destaque] DEFAULT ((0)),
    [imagem] varchar(MAX) NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_eventos_criado] DEFAULT (sysutcdatetime()),
    [classificacao_etaria] varchar(10) NULL,
    [data_fim] datetime2(0) NULL,
    [nome_local] varchar(200) NULL,
    [descricao] nvarchar(MAX) NULL,
    [banner_mobile] varchar(MAX) NULL,
    [banner_desktop] varchar(MAX) NULL,
    [camarotes_quantidade] int NULL,
    [camarote_capacidade] int NULL,
    [camarote_preco] decimal(10,2) NULL,
    [mapa_evento] varchar(MAX) NULL,
    CONSTRAINT [pk_eventos] PRIMARY KEY CLUSTERED ([id] ASC)
);
GO

CREATE TABLE [dbo].[fornecedor_empresas] (
    [id] int IDENTITY(1,1) NOT NULL,
    [usuario_id] int NOT NULL,
    [razao_social] varchar(180) NOT NULL,
    [cnpj] varchar(30) NOT NULL,
    [categoria] varchar(120) NOT NULL,
    [contato] varchar(160) NOT NULL,
    [email_comercial] varchar(180) NOT NULL,
    [telefone] varchar(40) NOT NULL,
    [descricao] varchar(MAX) NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_fornecedor_empresas_status] DEFAULT ('pendente'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_fornecedor_empresas_criado] DEFAULT (sysutcdatetime()),
    [atualizado_em] datetime2(0) NOT NULL CONSTRAINT [df_fornecedor_empresas_atualizado] DEFAULT (sysutcdatetime()),
    [logo_url] varchar(500) NULL,
    CONSTRAINT [pk_fornecedor_empresas] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_fornecedor_empresas_cnpj] UNIQUE NONCLUSTERED ([cnpj] ASC),
    CONSTRAINT [uq_fornecedor_empresas_usuario] UNIQUE NONCLUSTERED ([usuario_id] ASC)
);
GO

CREATE TABLE [dbo].[fornecedor_colaboradores] (
    [id] int IDENTITY(1,1) NOT NULL,
    [empresa_id] int NOT NULL,
    [usuario_id] int NOT NULL,
    [papel] varchar(30) NOT NULL CONSTRAINT [df_fornecedor_colaboradores_papel] DEFAULT ('colaborador'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_fornecedor_colaboradores_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_fornecedor_colaboradores] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_fornecedor_colaboradores_usuario] UNIQUE NONCLUSTERED ([empresa_id] ASC, [usuario_id] ASC)
);
GO

CREATE TABLE [dbo].[fornecedor_documentos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [fornecedor_usuario_id] int NOT NULL,
    [nome] varchar(180) NOT NULL,
    [nome_arquivo] varchar(255) NOT NULL,
    [caminho] varchar(500) NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_fornecedor_documentos_status] DEFAULT ('pendente'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_fornecedor_documentos_criado] DEFAULT (sysutcdatetime()),
    [atualizado_em] datetime2(0) NOT NULL CONSTRAINT [df_fornecedor_documentos_atualizado] DEFAULT (sysutcdatetime()),
    [motivo_recusa] varchar(1000) NULL,
    CONSTRAINT [pk_fornecedor_documentos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_fornecedor_documentos_tipo] UNIQUE NONCLUSTERED ([fornecedor_usuario_id] ASC, [nome] ASC)
);
GO

CREATE TABLE [dbo].[pedidos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [codigo_pedido] varchar(40) NOT NULL,
    [comprador_id] int NOT NULL,
    [valor_total] decimal(10,2) NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_pedidos_status] DEFAULT ('aprovado'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_pedidos_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_pedidos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_pedidos_codigo] UNIQUE NONCLUSTERED ([codigo_pedido] ASC),
    CONSTRAINT [fk_pedidos_comprador] FOREIGN KEY ([comprador_id]) REFERENCES [dbo].[usuarios] ([id])
);
GO

CREATE TABLE [dbo].[ingressos_emitidos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [pedido_id] int NOT NULL,
    [comprador_id] int NOT NULL,
    [evento_id] int NOT NULL,
    [bilheteria_id] int NULL,
    [numero_ingresso] varchar(40) NOT NULL,
    [codigo_original_bilheteria] varchar(40) NOT NULL,
    [qr_code_payload] varchar(500) NOT NULL,
    [versao_titularidade] int NOT NULL CONSTRAINT [df_ingressos_versao] DEFAULT ((1)),
    [status] varchar(40) NOT NULL CONSTRAINT [df_ingressos_status] DEFAULT ('valido'),
    [emitido_em] datetime2(0) NOT NULL CONSTRAINT [df_ingressos_emitido] DEFAULT (sysutcdatetime()),
    [secret_key] varchar(64) NULL,
    [preco_original] decimal(10,2) NULL,
    [revoked] bit NOT NULL CONSTRAINT [df_ingressos_revoked] DEFAULT ((0)),
    [revogado_em] datetime2(0) NULL,
    [setor_nome] varchar(120) NULL,
    [bilheteria_origem] varchar(40) NULL,
    [utilizado_em] datetime2(0) NULL,
    [motivo_checkin] varchar(240) NULL,
    [checkin_operador] varchar(160) NULL,
    [lote_nome] varchar(120) NULL,
    [categoria_ingresso] varchar(120) NULL,
    [convidado_nome] varchar(120) NULL,
    [camarote_numero] int NULL,
    CONSTRAINT [pk_ingressos_emitidos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_ingressos_numero] UNIQUE NONCLUSTERED ([numero_ingresso] ASC),
    CONSTRAINT [fk_ingressos_comprador] FOREIGN KEY ([comprador_id]) REFERENCES [dbo].[usuarios] ([id]),
    CONSTRAINT [fk_ingressos_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]),
    CONSTRAINT [fk_ingressos_pedido] FOREIGN KEY ([pedido_id]) REFERENCES [dbo].[pedidos] ([id])
);
GO

CREATE TABLE [dbo].[transferencias_pendentes] (
    [id] int IDENTITY(1,1) NOT NULL,
    [ingresso_id] int NOT NULL,
    [remetente_id] int NOT NULL,
    [destinatario_id] int NOT NULL,
    [token] varchar(100) NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_transferencias_status] DEFAULT ('pendente'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_transferencias_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_transferencias_pendentes] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [uq_transferencias_token] UNIQUE NONCLUSTERED ([token] ASC),
    CONSTRAINT [fk_transferencias_destinatario] FOREIGN KEY ([destinatario_id]) REFERENCES [dbo].[usuarios] ([id]),
    CONSTRAINT [fk_transferencias_ingresso] FOREIGN KEY ([ingresso_id]) REFERENCES [dbo].[ingressos_emitidos] ([id]),
    CONSTRAINT [fk_transferencias_remetente] FOREIGN KEY ([remetente_id]) REFERENCES [dbo].[usuarios] ([id])
);
GO

CREATE TABLE [dbo].[cartoes_usuario] (
    [id] int IDENTITY(1,1) NOT NULL,
    [usuario_id] int NOT NULL,
    [nome_titular] varchar(120) NOT NULL,
    [ultimos_digitos] char(4) NOT NULL,
    [validade_mes] varchar(2) NOT NULL,
    [validade_ano] varchar(4) NOT NULL,
    [bandeira] varchar(30) NOT NULL,
    [cartao_hash] varchar(64) NOT NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_cartoes_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_cartoes_usuario] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_cartoes_usuario] FOREIGN KEY ([usuario_id]) REFERENCES [dbo].[usuarios] ([id])
);
GO

CREATE TABLE [dbo].[revendas] (
    [id] int IDENTITY(1,1) NOT NULL CONSTRAINT [pk_revendas] PRIMARY KEY,
    [ingresso_id] int NOT NULL,
    [vendedor_id] int NOT NULL,
    [evento_id] int NOT NULL,
    [preco_original] decimal(10,2) NOT NULL,
    [taxa_percentual] decimal(5,2) NOT NULL,
    [taxa_nome] varchar(20) NOT NULL,
    [prioridade] int NOT NULL,
    [taxa_administracao_percentual] decimal(5,2) NOT NULL CONSTRAINT [df_revendas_taxa_admin] DEFAULT 14,
    [taxa_administracao_valor] decimal(10,2) NOT NULL CONSTRAINT [df_revendas_valor_taxa_admin] DEFAULT 0,
    [status] varchar(20) NOT NULL CONSTRAINT [df_revendas_status] DEFAULT 'disponivel',
    [anunciado_em] datetime2(0) NOT NULL CONSTRAINT [df_revendas_anunciado] DEFAULT SYSUTCDATETIME(),
    [vendido_em] datetime2(0) NULL,
    CONSTRAINT [uq_revendas_ingresso_ativo] UNIQUE ([ingresso_id], [status])
);
GO

CREATE TABLE [dbo].[repasse_revendas] (
    [id] int IDENTITY(1,1) NOT NULL CONSTRAINT [pk_repasse_revendas] PRIMARY KEY,
    [revenda_id] int NOT NULL,
    [vendedor_id] int NOT NULL,
    [comprador_id] int NOT NULL,
    [ingresso_antigo_id] int NOT NULL,
    [ingresso_novo_id] int NOT NULL,
    [valor_bruto] decimal(10,2) NOT NULL,
    [taxa_percentual] decimal(5,2) NOT NULL,
    [valor_taxa] decimal(10,2) NOT NULL,
    [valor_taxa_administracao] decimal(10,2) NOT NULL CONSTRAINT [df_repasse_taxa_admin] DEFAULT 0,
    [valor_liquido] decimal(10,2) NOT NULL,
    [valor_cobranca] decimal(10,2) NULL,
    [lucro_empresa] decimal(10,2) NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_repasse_revendas_criado] DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE [dbo].[wallet_lancamentos] (
    [id] int IDENTITY(1,1) NOT NULL CONSTRAINT [pk_wallet_lancamentos] PRIMARY KEY,
    [usuario_id] int NOT NULL,
    [tipo] varchar(20) NOT NULL,
    [status] varchar(20) NOT NULL,
    [valor] decimal(10,2) NOT NULL,
    [repasse_id] int NULL,
    [referencia] varchar(80) NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_wallet_lancamentos_criado] DEFAULT SYSUTCDATETIME(),
    [disponibilizado_em] datetime2(0) NULL,
    CONSTRAINT [uq_wallet_lancamento_repasse] UNIQUE ([repasse_id], [tipo])
);
GO

CREATE TABLE [dbo].[saques_pix] (
    [id] int IDENTITY(1,1) NOT NULL CONSTRAINT [pk_saques_pix] PRIMARY KEY,
    [usuario_id] int NOT NULL,
    [valor] decimal(10,2) NOT NULL,
    [chave_cpf] varchar(11) NOT NULL,
    [status] varchar(20) NOT NULL CONSTRAINT [df_saques_pix_status] DEFAULT 'solicitado',
    [solicitado_em] datetime2(0) NOT NULL CONSTRAINT [df_saques_pix_solicitado] DEFAULT SYSUTCDATETIME(),
    [processado_em] datetime2(0) NULL
);
GO

CREATE TABLE [dbo].[evento_demandas] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [titulo] varchar(180) NOT NULL,
    [servico] varchar(120) NOT NULL,
    [escopo] varchar(MAX) NOT NULL,
    [prazo] date NOT NULL,
    [valor_estimado] decimal(12,2) NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_evento_demandas_status] DEFAULT ('em cotacao'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_demandas_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_evento_demandas] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_demandas_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_demanda_documentos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [demanda_id] int NOT NULL,
    [nome] varchar(180) NOT NULL,
    [nome_arquivo] varchar(255) NOT NULL,
    [caminho] varchar(500) NOT NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_demanda_documentos_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_evento_demanda_documentos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_demanda_documentos_demanda] FOREIGN KEY ([demanda_id]) REFERENCES [dbo].[evento_demandas] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_documentos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [nome] varchar(180) NOT NULL,
    [prazo] date NOT NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_evento_documentos_status] DEFAULT ('pendente'),
    [anexo_url] varchar(500) NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_documentos_criado] DEFAULT (sysutcdatetime()),
    [categoria] varchar(120) NULL,
    CONSTRAINT [pk_evento_documentos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_documentos_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_itens_custo] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [categoria] varchar(80) NOT NULL,
    [nome_item] varchar(500) NOT NULL,
    [custo_estimado] decimal(12,2) NOT NULL CONSTRAINT [df_evento_custo_estimado] DEFAULT ((0)),
    [custo_contratado] decimal(12,2) NULL,
    [fornecedor] varchar(160) NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_evento_custo_status] DEFAULT ('pendente'),
    [demanda_id] int NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_custo_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_evento_itens_custo] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_itens_custo_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_lotes] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [nome] varchar(120) NOT NULL,
    [quantidade] int NOT NULL CONSTRAINT [df_evento_lotes_quantidade] DEFAULT ((0)),
    [preco] decimal(10,2) NOT NULL CONSTRAINT [df_evento_lotes_preco] DEFAULT ((0)),
    [regra] varchar(30) NOT NULL CONSTRAINT [df_evento_lotes_regra] DEFAULT ('Esgotamento'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_lotes_criado] DEFAULT (sysutcdatetime()),
    [data_virada] date NULL,
    [setor_nome] varchar(120) NULL,
    [setor_capacidade] int NULL,
    [tipo_ingresso] varchar(40) NULL,
    [data_inicio] datetime2(0) NULL,
    [data_fim] datetime2(0) NULL,
    [quantidade_total] int NULL,
    [quantidade_meia] int NULL,
    [quantidade_inteira] int NULL,
    [quantidade_solidaria] int NULL,
    [preco_inteira] decimal(10,2) NULL,
    [preco_meia] decimal(10,2) NULL,
    [modalidades_json] nvarchar(MAX) NULL,
    CONSTRAINT [pk_evento_lotes] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_lotes_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_setores] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [nome] varchar(120) NOT NULL,
    [capacidade] int NOT NULL CONSTRAINT [DF__evento_se__capac__19AACF41] DEFAULT ((0)),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [DF__evento_se__criad__1A9EF37A] DEFAULT (sysutcdatetime()),
    CONSTRAINT [PK__evento_s__3213E83FA934DFFA] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_setores_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_tarefas] (
    [id] int IDENTITY(1,1) NOT NULL,
    [evento_id] int NOT NULL,
    [horario] varchar(15) NOT NULL,
    [atividade] varchar(180) NOT NULL,
    [responsavel] varchar(120) NOT NULL,
    [concluida] bit NOT NULL CONSTRAINT [df_evento_tarefas_concluida] DEFAULT ((0)),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_tarefas_criado] DEFAULT (sysutcdatetime()),
    [status] varchar(30) NOT NULL CONSTRAINT [df_evento_tarefas_status] DEFAULT ('pendente'),
    CONSTRAINT [pk_evento_tarefas] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_tarefas_evento] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[eventos] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_propostas_fornecedor] (
    [id] int IDENTITY(1,1) NOT NULL,
    [demanda_id] int NOT NULL,
    [empresa] varchar(180) NOT NULL,
    [valor] decimal(12,2) NOT NULL,
    [escopo] varchar(MAX) NOT NULL,
    [prazo] varchar(80) NOT NULL,
    [anexos] varchar(500) NULL,
    [status] varchar(30) NOT NULL CONSTRAINT [df_evento_propostas_status] DEFAULT ('em analise'),
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_propostas_criado] DEFAULT (sysutcdatetime()),
    [fornecedor_usuario_id] int NULL,
    CONSTRAINT [pk_evento_propostas_fornecedor] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_propostas_demanda] FOREIGN KEY ([demanda_id]) REFERENCES [dbo].[evento_demandas] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_proposta_documentos] (
    [id] int IDENTITY(1,1) NOT NULL,
    [proposta_id] int NOT NULL,
    [nome_arquivo] varchar(255) NOT NULL,
    [caminho] varchar(500) NOT NULL,
    [criado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_proposta_documentos_criado] DEFAULT (sysutcdatetime()),
    CONSTRAINT [pk_evento_proposta_documentos] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_proposta_documentos_proposta] FOREIGN KEY ([proposta_id]) REFERENCES [dbo].[evento_propostas_fornecedor] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_mensagens_chat] (
    [id] int IDENTITY(1,1) NOT NULL,
    [demanda_id] int NOT NULL,
    [remetente] varchar(30) NOT NULL CONSTRAINT [df_evento_msg_remetente] DEFAULT ('organizador'),
    [texto] varchar(MAX) NOT NULL,
    [enviado_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_msg_enviado] DEFAULT (sysutcdatetime()),
    [anexo_url] varchar(500) NULL,
    [anexo_nome] varchar(255) NULL,
    [anexo_tipo] varchar(120) NULL,
    [lida_organizador] bit NOT NULL CONSTRAINT [df_evento_mensagens_chat_lida_organizador] DEFAULT ((0)),
    [lida_fornecedor] bit NOT NULL CONSTRAINT [df_evento_mensagens_chat_lida_fornecedor] DEFAULT ((0)),
    [fornecedor_usuario_id] int NULL,
    CONSTRAINT [pk_evento_mensagens_chat] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_evento_mensagens_demanda] FOREIGN KEY ([demanda_id]) REFERENCES [dbo].[evento_demandas] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[evento_chat_leituras] (
    [usuario_id] int NOT NULL,
    [demanda_id] int NOT NULL,
    [lida_em] datetime2(0) NOT NULL CONSTRAINT [df_evento_chat_leituras_lida] DEFAULT (sysutcdatetime()),
    [ultima_mensagem_id] int NOT NULL CONSTRAINT [df_evento_chat_leituras_mensagem_mig] DEFAULT ((0)),
    CONSTRAINT [pk_evento_chat_leituras] PRIMARY KEY CLUSTERED ([usuario_id] ASC, [demanda_id] ASC)
);
GO
