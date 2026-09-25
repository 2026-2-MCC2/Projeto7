-- Azure SQL Server version of the Sakila schema.
-- Run this script in the target database. It creates and uses the sakila schema.

IF SCHEMA_ID(N'sakila') IS NULL
    EXEC(N'CREATE SCHEMA sakila');
GO

IF OBJECT_ID(N'sakila.actor', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.actor (
        actor_id smallint IDENTITY(1,1) NOT NULL,
        first_name varchar(45) NOT NULL,
        last_name varchar(45) NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_actor_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_actor PRIMARY KEY (actor_id)
    );
    CREATE INDEX idx_actor_last_name ON sakila.actor(last_name);
END;
GO

IF OBJECT_ID(N'sakila.country', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.country (
        country_id smallint IDENTITY(1,1) NOT NULL,
        country varchar(50) NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_country_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_country PRIMARY KEY (country_id)
    );
END;
GO

IF OBJECT_ID(N'sakila.city', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.city (
        city_id smallint IDENTITY(1,1) NOT NULL,
        city varchar(50) NOT NULL,
        country_id smallint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_city_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_city PRIMARY KEY (city_id),
        CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES sakila.country(country_id)
    );
    CREATE INDEX idx_fk_country_id ON sakila.city(country_id);
END;
GO

IF OBJECT_ID(N'sakila.address', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.address (
        address_id smallint IDENTITY(1,1) NOT NULL,
        address varchar(50) NOT NULL,
        address2 varchar(50) NULL,
        district varchar(20) NOT NULL,
        city_id smallint NOT NULL,
        postal_code varchar(10) NULL,
        phone varchar(20) NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_address_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_address PRIMARY KEY (address_id),
        CONSTRAINT fk_address_city FOREIGN KEY (city_id) REFERENCES sakila.city(city_id)
    );
    CREATE INDEX idx_fk_city_id ON sakila.address(city_id);
END;
GO

IF OBJECT_ID(N'sakila.category', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.category (
        category_id tinyint IDENTITY(1,1) NOT NULL,
        name varchar(25) NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_category_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_category PRIMARY KEY (category_id)
    );
END;
GO

IF OBJECT_ID(N'sakila.language', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.language (
        language_id tinyint IDENTITY(1,1) NOT NULL,
        name char(20) NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_language_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_language PRIMARY KEY (language_id)
    );
END;
GO

-- staff and store reference each other, so the second foreign key is added later.
IF OBJECT_ID(N'sakila.staff', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.staff (
        staff_id tinyint IDENTITY(1,1) NOT NULL,
        first_name varchar(45) NOT NULL,
        last_name varchar(45) NOT NULL,
        address_id smallint NOT NULL,
        picture varbinary(max) NULL,
        email varchar(50) NULL,
        store_id tinyint NOT NULL,
        active bit NOT NULL CONSTRAINT df_staff_active DEFAULT 1,
        username varchar(16) NOT NULL,
        password varchar(40) NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_staff_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_staff PRIMARY KEY (staff_id),
        CONSTRAINT fk_staff_address FOREIGN KEY (address_id) REFERENCES sakila.address(address_id)
    );
    CREATE INDEX idx_fk_store_id ON sakila.staff(store_id);
    CREATE INDEX idx_fk_address_id ON sakila.staff(address_id);
END;
GO

IF OBJECT_ID(N'sakila.store', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.store (
        store_id tinyint IDENTITY(1,1) NOT NULL,
        manager_staff_id tinyint NOT NULL,
        address_id smallint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_store_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_store PRIMARY KEY (store_id),
        CONSTRAINT uq_store_manager UNIQUE (manager_staff_id),
        CONSTRAINT fk_store_staff FOREIGN KEY (manager_staff_id) REFERENCES sakila.staff(staff_id),
        CONSTRAINT fk_store_address FOREIGN KEY (address_id) REFERENCES sakila.address(address_id)
    );
    CREATE INDEX idx_store_address_id ON sakila.store(address_id);
END;
GO

IF OBJECT_ID(N'sakila.staff', N'U') IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'fk_staff_store')
    ALTER TABLE sakila.staff ADD CONSTRAINT fk_staff_store FOREIGN KEY (store_id) REFERENCES sakila.store(store_id);
GO

IF OBJECT_ID(N'sakila.customer', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.customer (
        customer_id smallint IDENTITY(1,1) NOT NULL,
        store_id tinyint NOT NULL,
        first_name varchar(45) NOT NULL,
        last_name varchar(45) NOT NULL,
        email varchar(50) NULL,
        address_id smallint NOT NULL,
        active bit NOT NULL CONSTRAINT df_customer_active DEFAULT 1,
        create_date datetime2(0) NOT NULL,
        last_update datetime2(0) NULL CONSTRAINT df_customer_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_customer PRIMARY KEY (customer_id),
        CONSTRAINT fk_customer_address FOREIGN KEY (address_id) REFERENCES sakila.address(address_id),
        CONSTRAINT fk_customer_store FOREIGN KEY (store_id) REFERENCES sakila.store(store_id)
    );
    CREATE INDEX idx_customer_store_id ON sakila.customer(store_id);
    CREATE INDEX idx_customer_address_id ON sakila.customer(address_id);
    CREATE INDEX idx_customer_last_name ON sakila.customer(last_name);
END;
GO

IF OBJECT_ID(N'sakila.film', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.film (
        film_id smallint IDENTITY(1,1) NOT NULL,
        title varchar(255) NOT NULL,
        description varchar(max) NULL,
        release_year smallint NULL,
        language_id tinyint NOT NULL,
        original_language_id tinyint NULL,
        rental_duration tinyint NOT NULL CONSTRAINT df_film_rental_duration DEFAULT 3,
        rental_rate decimal(4,2) NOT NULL CONSTRAINT df_film_rental_rate DEFAULT 4.99,
        length smallint NULL,
        replacement_cost decimal(5,2) NOT NULL CONSTRAINT df_film_replacement_cost DEFAULT 19.99,
        rating varchar(5) NULL CONSTRAINT df_film_rating DEFAULT 'G',
        special_features varchar(255) NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_film_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_film PRIMARY KEY (film_id),
        CONSTRAINT fk_film_language FOREIGN KEY (language_id) REFERENCES sakila.language(language_id),
        CONSTRAINT fk_film_original_language FOREIGN KEY (original_language_id) REFERENCES sakila.language(language_id),
        CONSTRAINT ck_film_rating CHECK (rating IN ('G', 'PG', 'PG-13', 'R', 'NC-17') OR rating IS NULL)
    );
    CREATE INDEX idx_film_title ON sakila.film(title);
    CREATE INDEX idx_film_language_id ON sakila.film(language_id);
END;
GO

IF OBJECT_ID(N'sakila.film_actor', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.film_actor (
        actor_id smallint NOT NULL,
        film_id smallint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_film_actor_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_film_actor PRIMARY KEY (actor_id, film_id),
        CONSTRAINT fk_film_actor_actor FOREIGN KEY (actor_id) REFERENCES sakila.actor(actor_id),
        CONSTRAINT fk_film_actor_film FOREIGN KEY (film_id) REFERENCES sakila.film(film_id)
    );
    CREATE INDEX idx_film_actor_film_id ON sakila.film_actor(film_id);
END;
GO

IF OBJECT_ID(N'sakila.film_category', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.film_category (
        film_id smallint NOT NULL,
        category_id tinyint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_film_category_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_film_category PRIMARY KEY (film_id, category_id),
        CONSTRAINT fk_film_category_film FOREIGN KEY (film_id) REFERENCES sakila.film(film_id),
        CONSTRAINT fk_film_category_category FOREIGN KEY (category_id) REFERENCES sakila.category(category_id)
    );
END;
GO

IF OBJECT_ID(N'sakila.film_text', N'U') IS NULL
    CREATE TABLE sakila.film_text (
        film_id smallint NOT NULL CONSTRAINT pk_film_text PRIMARY KEY,
        title varchar(255) NOT NULL,
        description varchar(max) NULL
    );
GO

IF OBJECT_ID(N'sakila.inventory', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.inventory (
        inventory_id int IDENTITY(1,1) NOT NULL,
        film_id smallint NOT NULL,
        store_id tinyint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_inventory_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_inventory PRIMARY KEY (inventory_id),
        CONSTRAINT fk_inventory_store FOREIGN KEY (store_id) REFERENCES sakila.store(store_id),
        CONSTRAINT fk_inventory_film FOREIGN KEY (film_id) REFERENCES sakila.film(film_id)
    );
    CREATE INDEX idx_inventory_film_id ON sakila.inventory(film_id);
    CREATE INDEX idx_inventory_store_film ON sakila.inventory(store_id, film_id);
END;
GO

IF OBJECT_ID(N'sakila.rental', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.rental (
        rental_id int IDENTITY(1,1) NOT NULL,
        rental_date datetime2(0) NOT NULL,
        inventory_id int NOT NULL,
        customer_id smallint NOT NULL,
        return_date datetime2(0) NULL,
        staff_id tinyint NOT NULL,
        last_update datetime2(0) NOT NULL CONSTRAINT df_rental_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_rental PRIMARY KEY (rental_id),
        CONSTRAINT uq_rental UNIQUE (rental_date, inventory_id, customer_id),
        CONSTRAINT fk_rental_staff FOREIGN KEY (staff_id) REFERENCES sakila.staff(staff_id),
        CONSTRAINT fk_rental_inventory FOREIGN KEY (inventory_id) REFERENCES sakila.inventory(inventory_id),
        CONSTRAINT fk_rental_customer FOREIGN KEY (customer_id) REFERENCES sakila.customer(customer_id)
    );
END;
GO

IF OBJECT_ID(N'sakila.payment', N'U') IS NULL
BEGIN
    CREATE TABLE sakila.payment (
        payment_id smallint IDENTITY(1,1) NOT NULL,
        customer_id smallint NOT NULL,
        staff_id tinyint NOT NULL,
        rental_id int NULL,
        amount decimal(5,2) NOT NULL,
        payment_date datetime2(0) NOT NULL,
        last_update datetime2(0) NULL CONSTRAINT df_payment_last_update DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_payment PRIMARY KEY (payment_id),
        CONSTRAINT fk_payment_rental FOREIGN KEY (rental_id) REFERENCES sakila.rental(rental_id) ON DELETE SET NULL,
        CONSTRAINT fk_payment_customer FOREIGN KEY (customer_id) REFERENCES sakila.customer(customer_id),
        CONSTRAINT fk_payment_staff FOREIGN KEY (staff_id) REFERENCES sakila.staff(staff_id)
    );
END;
GO

-- Application events consumed by the TrocaTicket website.
IF OBJECT_ID(N'dbo.eventos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.eventos (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_eventos PRIMARY KEY,
        organizador_id int NULL,
        nome varchar(150) NOT NULL,
        artista varchar(150) NULL,
        [local] varchar(200) NULL,
        data_evento datetime2(0) NOT NULL,
        ticket_calculado decimal(10,2) NOT NULL CONSTRAINT df_eventos_ticket DEFAULT 0,
        publico_minimo int NOT NULL CONSTRAINT df_eventos_publico_minimo DEFAULT 0,
        publico_maximo int NOT NULL CONSTRAINT df_eventos_publico_maximo DEFAULT 0,
        margem_lucro decimal(5,2) NOT NULL CONSTRAINT df_eventos_margem DEFAULT 0,
        status varchar(30) NOT NULL CONSTRAINT df_eventos_status DEFAULT 'publicado',
        destaque bit NOT NULL CONSTRAINT df_eventos_destaque DEFAULT 0,
        imagem varchar(max) NULL,
        criado_em datetime2(0) NOT NULL CONSTRAINT df_eventos_criado DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_eventos_data ON dbo.eventos(data_evento);
    CREATE INDEX idx_eventos_status ON dbo.eventos(status, destaque);
END;
GO

IF OBJECT_ID(N'dbo.eventos', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.eventos', N'imagem') < 2147483647
    ALTER TABLE dbo.eventos ALTER COLUMN imagem varchar(max) NULL;
GO

-- Users consumed by the TrocaTicket authentication and admin panel.
IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.usuarios (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_usuarios PRIMARY KEY,
        nome varchar(120) NOT NULL,
        email varchar(160) NOT NULL,
        senha_hash varchar(100) NOT NULL,
        tipo varchar(30) NOT NULL CONSTRAINT df_usuarios_tipo DEFAULT 'comprador',
        cpf varchar(11) NULL,
        telefone varchar(30) NULL,
        data_nascimento date NULL,
        genero varchar(30) NULL,
        status varchar(30) NOT NULL CONSTRAINT df_usuarios_status DEFAULT 'aprovado',
        foto_perfil varchar(500) NULL,
        codigo_verificacao varchar(20) NULL,
        email_verificado bit NOT NULL CONSTRAINT df_usuarios_email_verificado DEFAULT 1,
        criado_em datetime2(0) NOT NULL CONSTRAINT df_usuarios_criado DEFAULT SYSUTCDATETIME(),
        CONSTRAINT uq_usuarios_email UNIQUE (email)
    );
END;
GO

IF OBJECT_ID(N'dbo.auditoria_admin', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.auditoria_admin (
        id bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_auditoria_admin PRIMARY KEY,
        ator_id int NULL,
        ator_nome varchar(160) NOT NULL,
        ator_tipo varchar(30) NOT NULL,
        acao varchar(80) NOT NULL,
        descricao varchar(max) NOT NULL,
        item_tipo varchar(40) NULL,
        item_id varchar(80) NULL,
        criado_em datetime2(0) NOT NULL CONSTRAINT df_auditoria_criado DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_auditoria_criado ON dbo.auditoria_admin(criado_em DESC);
    CREATE INDEX idx_auditoria_ator ON dbo.auditoria_admin(ator_nome, ator_tipo);
END;
GO

CREATE OR ALTER PROCEDURE sakila.rewards_report
    @min_monthly_purchases tinyint,
    @min_dollar_amount_purchased decimal(10,2),
    @count_rewardees int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF @min_monthly_purchases = 0 OR @min_dollar_amount_purchased = 0
        THROW 50001, 'Minimum purchase parameters must be greater than zero.', 1;

    DECLARE @last_month_start date = DATEADD(month, DATEDIFF(month, 0, GETDATE()) - 1, 0);
    DECLARE @last_month_end date = EOMONTH(@last_month_start);
    CREATE TABLE #tmpCustomer (customer_id smallint NOT NULL PRIMARY KEY);

    INSERT INTO #tmpCustomer (customer_id)
    SELECT p.customer_id FROM sakila.payment AS p
    WHERE CAST(p.payment_date AS date) BETWEEN @last_month_start AND @last_month_end
    GROUP BY p.customer_id
    HAVING SUM(p.amount) > @min_dollar_amount_purchased AND COUNT(*) > @min_monthly_purchases;

    SELECT @count_rewardees = COUNT(*) FROM #tmpCustomer;
    SELECT c.* FROM #tmpCustomer AS t JOIN sakila.customer AS c ON c.customer_id = t.customer_id;
END;
GO

CREATE OR ALTER FUNCTION sakila.get_customer_balance
(
    @p_customer_id int,
    @p_effective_date datetime2(0)
)
RETURNS decimal(5,2)
AS
BEGIN
    DECLARE @rentfees decimal(5,2), @overfees int, @payments decimal(5,2);
    SELECT @rentfees = COALESCE(SUM(f.rental_rate), 0)
    FROM sakila.film AS f JOIN sakila.inventory AS i ON f.film_id = i.film_id
    JOIN sakila.rental AS r ON i.inventory_id = r.inventory_id
    WHERE r.rental_date <= @p_effective_date AND r.customer_id = @p_customer_id;

    SELECT @overfees = COALESCE(SUM(CASE WHEN DATEDIFF(day, r.rental_date, COALESCE(r.return_date, @p_effective_date)) > f.rental_duration
        THEN DATEDIFF(day, r.rental_date, COALESCE(r.return_date, @p_effective_date)) - f.rental_duration ELSE 0 END), 0)
    FROM sakila.rental AS r JOIN sakila.inventory AS i ON i.inventory_id = r.inventory_id
    JOIN sakila.film AS f ON f.film_id = i.film_id
    WHERE r.rental_date <= @p_effective_date AND r.customer_id = @p_customer_id;

    SELECT @payments = COALESCE(SUM(amount), 0) FROM sakila.payment
    WHERE payment_date <= @p_effective_date AND customer_id = @p_customer_id;
    RETURN COALESCE(@rentfees, 0) + COALESCE(@overfees, 0) - COALESCE(@payments, 0);
END;
GO

CREATE OR ALTER FUNCTION sakila.inventory_held_by_customer(@p_inventory_id int)
RETURNS int
AS
BEGIN
    DECLARE @customer_id int;
    SELECT TOP (1) @customer_id = customer_id FROM sakila.rental
    WHERE return_date IS NULL AND inventory_id = @p_inventory_id;
    RETURN @customer_id;
END;
GO

CREATE OR ALTER FUNCTION sakila.inventory_in_stock(@p_inventory_id int)
RETURNS bit
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sakila.rental WHERE inventory_id = @p_inventory_id) RETURN 1;
    IF EXISTS (SELECT 1 FROM sakila.rental WHERE inventory_id = @p_inventory_id AND return_date IS NULL) RETURN 0;
    RETURN 1;
END;
GO

CREATE OR ALTER PROCEDURE sakila.film_in_stock
    @p_film_id int, @p_store_id int, @p_film_count int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT inventory_id FROM sakila.inventory
    WHERE film_id = @p_film_id AND store_id = @p_store_id
      AND sakila.inventory_in_stock(inventory_id) = 1;
    SELECT @p_film_count = @@ROWCOUNT;
END;
GO

CREATE OR ALTER PROCEDURE sakila.film_not_in_stock
    @p_film_id int, @p_store_id int, @p_film_count int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT inventory_id FROM sakila.inventory
    WHERE film_id = @p_film_id AND store_id = @p_store_id
      AND sakila.inventory_in_stock(inventory_id) = 0;
    SELECT @p_film_count = @@ROWCOUNT;
END;
GO

CREATE OR ALTER VIEW sakila.customer_list AS
SELECT c.customer_id AS ID, CONCAT(c.first_name, ' ', c.last_name) AS name, a.address,
       a.postal_code AS [zip code], a.phone, ci.city, co.country,
       CASE WHEN c.active = 1 THEN 'active' ELSE '' END AS notes, c.store_id AS SID
FROM sakila.customer c JOIN sakila.address a ON c.address_id = a.address_id
JOIN sakila.city ci ON a.city_id = ci.city_id JOIN sakila.country co ON ci.country_id = co.country_id;
GO

CREATE OR ALTER VIEW sakila.film_list AS
SELECT f.film_id AS FID, f.title, f.description, c.name AS category, f.rental_rate AS price,
       f.length, f.rating, STRING_AGG(CONCAT(a.first_name, ' ', a.last_name), ', ') AS actors
FROM sakila.category c LEFT JOIN sakila.film_category fc ON c.category_id = fc.category_id
LEFT JOIN sakila.film f ON fc.film_id = f.film_id JOIN sakila.film_actor fa ON f.film_id = fa.film_id
JOIN sakila.actor a ON fa.actor_id = a.actor_id
GROUP BY f.film_id, f.title, f.description, c.name, f.rental_rate, f.length, f.rating;
GO

CREATE OR ALTER VIEW sakila.nicer_but_slower_film_list AS
SELECT f.film_id AS FID, f.title, f.description, c.name AS category, f.rental_rate AS price,
       f.length, f.rating,
       STRING_AGG(CONCAT(UPPER(LEFT(a.first_name, 1)), LOWER(SUBSTRING(a.first_name, 2, 8000)), ' ',
                         UPPER(LEFT(a.last_name, 1)), LOWER(SUBSTRING(a.last_name, 2, 8000))), ', ') AS actors
FROM sakila.category c LEFT JOIN sakila.film_category fc ON c.category_id = fc.category_id
LEFT JOIN sakila.film f ON fc.film_id = f.film_id JOIN sakila.film_actor fa ON f.film_id = fa.film_id
JOIN sakila.actor a ON fa.actor_id = a.actor_id
GROUP BY f.film_id, f.title, f.description, c.name, f.rental_rate, f.length, f.rating;
GO

CREATE OR ALTER VIEW sakila.staff_list AS
SELECT s.staff_id AS ID, CONCAT(s.first_name, ' ', s.last_name) AS name, a.address,
       a.postal_code AS [zip code], a.phone, ci.city, co.country, s.store_id AS SID
FROM sakila.staff s JOIN sakila.address a ON s.address_id = a.address_id
JOIN sakila.city ci ON a.city_id = ci.city_id JOIN sakila.country co ON ci.country_id = co.country_id;
GO

CREATE OR ALTER VIEW sakila.sales_by_store AS
SELECT CONCAT(ci.city, ',', co.country) AS store, CONCAT(m.first_name, ' ', m.last_name) AS manager,
       SUM(p.amount) AS total_sales
FROM sakila.payment p JOIN sakila.rental r ON p.rental_id = r.rental_id
JOIN sakila.inventory i ON r.inventory_id = i.inventory_id JOIN sakila.store s ON i.store_id = s.store_id
JOIN sakila.address a ON s.address_id = a.address_id JOIN sakila.city ci ON a.city_id = ci.city_id
JOIN sakila.country co ON ci.country_id = co.country_id JOIN sakila.staff m ON s.manager_staff_id = m.staff_id
GROUP BY s.store_id, ci.city, co.country, m.first_name, m.last_name;
GO

CREATE OR ALTER VIEW sakila.sales_by_film_category AS
SELECT c.name AS category, SUM(p.amount) AS total_sales
FROM sakila.payment p JOIN sakila.rental r ON p.rental_id = r.rental_id
JOIN sakila.inventory i ON r.inventory_id = i.inventory_id JOIN sakila.film f ON i.film_id = f.film_id
JOIN sakila.film_category fc ON f.film_id = fc.film_id JOIN sakila.category c ON fc.category_id = c.category_id
GROUP BY c.name;
GO

CREATE OR ALTER VIEW sakila.actor_info AS
SELECT a.actor_id, a.first_name, a.last_name,
       STRING_AGG(CONCAT(c.name, ': ', COALESCE(films.film_titles, '')), '; ') AS film_info
FROM sakila.actor a
LEFT JOIN sakila.film_actor fa ON a.actor_id = fa.actor_id
LEFT JOIN sakila.film_category fc ON fa.film_id = fc.film_id
LEFT JOIN sakila.category c ON fc.category_id = c.category_id
OUTER APPLY (
    SELECT STRING_AGG(f.title, ', ') AS film_titles
    FROM sakila.film f
    JOIN sakila.film_category fc2 ON f.film_id = fc2.film_id
    JOIN sakila.film_actor fa2 ON f.film_id = fa2.film_id
    WHERE fc2.category_id = c.category_id AND fa2.actor_id = a.actor_id
) films
GROUP BY a.actor_id, a.first_name, a.last_name;
GO

CREATE OR ALTER TRIGGER sakila.ins_film ON sakila.film AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO sakila.film_text (film_id, title, description)
    SELECT film_id, title, description FROM inserted;
END;
GO

CREATE OR ALTER TRIGGER sakila.upd_film ON sakila.film AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE ft SET ft.title = i.title, ft.description = i.description
    FROM sakila.film_text ft JOIN inserted i ON ft.film_id = i.film_id
    JOIN deleted d ON d.film_id = i.film_id
    WHERE ISNULL(ft.title, '') <> ISNULL(d.title, '') OR ISNULL(ft.description, '') <> ISNULL(d.description, '');
END;
GO

CREATE OR ALTER TRIGGER sakila.del_film ON sakila.film AFTER DELETE AS
BEGIN
    SET NOCOUNT ON;
    DELETE ft FROM sakila.film_text ft JOIN deleted d ON d.film_id = ft.film_id;
END;
GO

-- Sample data. The original MySQL dump contained no INSERT statements.
SET IDENTITY_INSERT sakila.country ON;
INSERT INTO sakila.country (country_id, country, last_update) VALUES
    (1, 'Brazil', SYSUTCDATETIME()),
    (2, 'United States', SYSUTCDATETIME()),
    (3, 'Portugal', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.country OFF;
GO

SET IDENTITY_INSERT sakila.city ON;
INSERT INTO sakila.city (city_id, city, country_id, last_update) VALUES
    (1, 'Sao Paulo', 1, SYSUTCDATETIME()),
    (2, 'Rio de Janeiro', 1, SYSUTCDATETIME()),
    (3, 'Miami', 2, SYSUTCDATETIME()),
    (4, 'Lisbon', 3, SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.city OFF;
GO

SET IDENTITY_INSERT sakila.address ON;
INSERT INTO sakila.address (address_id, address, address2, district, city_id, postal_code, phone, last_update) VALUES
    (1, 'Avenida Paulista, 1000', NULL, 'Sao Paulo', 1, '01310-100', '+55 11 3000-1000', SYSUTCDATETIME()),
    (2, 'Rua Visconde de Piraja, 200', NULL, 'Rio de Janeiro', 2, '22410-000', '+55 21 3000-2000', SYSUTCDATETIME()),
    (3, 'Ocean Drive, 300', NULL, 'Florida', 3, '33139', '+1 305 555-0300', SYSUTCDATETIME()),
    (4, 'Rua Augusta, 400', NULL, 'Lisboa', 4, '1100-048', '+351 210 000 400', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.address OFF;
GO

SET IDENTITY_INSERT sakila.category ON;
INSERT INTO sakila.category (category_id, name, last_update) VALUES
    (1, 'Action', SYSUTCDATETIME()), (2, 'Comedy', SYSUTCDATETIME()),
    (3, 'Drama', SYSUTCDATETIME()), (4, 'Sci-Fi', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.category OFF;
GO

SET IDENTITY_INSERT sakila.language ON;
INSERT INTO sakila.language (language_id, name, last_update) VALUES
    (1, 'English', SYSUTCDATETIME()), (2, 'Portuguese', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.language OFF;
GO

SET IDENTITY_INSERT sakila.actor ON;
INSERT INTO sakila.actor (actor_id, first_name, last_name, last_update) VALUES
    (1, 'Ana', 'Silva', SYSUTCDATETIME()), (2, 'Carlos', 'Santos', SYSUTCDATETIME()),
    (3, 'Julia', 'Costa', SYSUTCDATETIME()), (4, 'Michael', 'Brown', SYSUTCDATETIME()),
    (5, 'Laura', 'Miller', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.actor OFF;
GO

ALTER TABLE sakila.staff NOCHECK CONSTRAINT fk_staff_store;
SET IDENTITY_INSERT sakila.staff ON;
INSERT INTO sakila.staff (staff_id, first_name, last_name, address_id, picture, email, store_id, active, username, password, last_update) VALUES
    (1, 'Marina', 'Oliveira', 1, NULL, 'marina@trocaticket.com', 1, 1, 'marina', 'senha-demo-1', SYSUTCDATETIME()),
    (2, 'Rafael', 'Souza', 2, NULL, 'rafael@trocaticket.com', 2, 1, 'rafael', 'senha-demo-2', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.staff OFF;
GO

SET IDENTITY_INSERT sakila.store ON;
INSERT INTO sakila.store (store_id, manager_staff_id, address_id, last_update) VALUES
    (1, 1, 1, SYSUTCDATETIME()), (2, 2, 2, SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.store OFF;
GO
ALTER TABLE sakila.staff WITH CHECK CHECK CONSTRAINT fk_staff_store;
GO

SET IDENTITY_INSERT sakila.customer ON;
INSERT INTO sakila.customer (customer_id, store_id, first_name, last_name, email, address_id, active, create_date, last_update) VALUES
    (1, 1, 'Beatriz', 'Lima', 'beatriz@example.com', 3, 1, '2026-09-01T10:00:00', SYSUTCDATETIME()),
    (2, 1, 'Joao', 'Pereira', 'joao@example.com', 4, 1, '2026-09-02T11:30:00', SYSUTCDATETIME()),
    (3, 2, 'Camila', 'Mendes', 'camila@example.com', 1, 1, '2026-09-03T09:15:00', SYSUTCDATETIME()),
    (4, 2, 'Lucas', 'Rocha', 'lucas@example.com', 2, 0, '2026-09-04T14:45:00', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.customer OFF;
GO

SET IDENTITY_INSERT sakila.film ON;
INSERT INTO sakila.film (film_id, title, description, release_year, language_id, original_language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, last_update) VALUES
    (1, 'A Cidade Invisivel', 'Uma aventura sobre segredos escondidos em uma grande cidade.', 2024, 2, NULL, 5, 4.99, 110, 19.99, 'PG-13', 'Trailers', SYSUTCDATETIME()),
    (2, 'Horizonte Final', 'Uma equipe enfrenta um desafio inesperado no espaco.', 2023, 1, NULL, 3, 3.99, 98, 17.99, 'PG', 'Trailers,Deleted Scenes', SYSUTCDATETIME()),
    (3, 'Risadas de Domingo', 'Uma comedia sobre familia, amizade e recomeços.', 2025, 2, NULL, 4, 2.99, 92, 14.99, 'G', 'Behind the Scenes', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.film OFF;
GO

INSERT INTO sakila.film_actor (actor_id, film_id, last_update) VALUES
    (1, 1, SYSUTCDATETIME()), (2, 1, SYSUTCDATETIME()), (4, 2, SYSUTCDATETIME()),
    (5, 2, SYSUTCDATETIME()), (1, 3, SYSUTCDATETIME()), (3, 3, SYSUTCDATETIME());
INSERT INTO sakila.film_category (film_id, category_id, last_update) VALUES
    (1, 1, SYSUTCDATETIME()), (1, 3, SYSUTCDATETIME()), (2, 4, SYSUTCDATETIME()), (3, 2, SYSUTCDATETIME());
GO

SET IDENTITY_INSERT sakila.inventory ON;
INSERT INTO sakila.inventory (inventory_id, film_id, store_id, last_update) VALUES
    (1, 1, 1, SYSUTCDATETIME()), (2, 1, 2, SYSUTCDATETIME()), (3, 2, 1, SYSUTCDATETIME()),
    (4, 2, 2, SYSUTCDATETIME()), (5, 3, 1, SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.inventory OFF;
GO

SET IDENTITY_INSERT sakila.rental ON;
INSERT INTO sakila.rental (rental_id, rental_date, inventory_id, customer_id, return_date, staff_id, last_update) VALUES
    (1, '2026-09-10T14:00:00', 1, 1, '2026-09-12T16:30:00', 1, SYSUTCDATETIME()),
    (2, '2026-09-11T15:15:00', 3, 2, NULL, 1, SYSUTCDATETIME()),
    (3, '2026-09-12T10:00:00', 4, 3, '2026-09-14T10:00:00', 2, SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.rental OFF;
GO

SET IDENTITY_INSERT sakila.payment ON;
INSERT INTO sakila.payment (payment_id, customer_id, staff_id, rental_id, amount, payment_date, last_update) VALUES
    (1, 1, 1, 1, 4.99, '2026-09-10T14:05:00', SYSUTCDATETIME()),
    (2, 2, 1, 2, 3.99, '2026-09-11T15:20:00', SYSUTCDATETIME()),
    (3, 3, 2, 3, 3.99, '2026-09-12T10:05:00', SYSUTCDATETIME());
SET IDENTITY_INSERT sakila.payment OFF;
GO

INSERT INTO dbo.eventos
    (organizador_id, nome, artista, [local], data_evento, ticket_calculado, publico_minimo, publico_maximo, margem_lucro, status, destaque, imagem)
VALUES
    (NULL, 'Festival TrocaTicket', 'Artistas Locais', 'Sao Paulo - SP', '2026-12-10T20:00:00', 80.00, 500, 2000, 0.20, 'publicado', 1, NULL),
    (NULL, 'Noite de Comedia', 'Julia Costa', 'Rio de Janeiro - RJ', '2027-01-15T21:00:00', 45.00, 100, 800, 0.20, 'publicado', 0, NULL),
    (NULL, 'Horizonte Musical', 'Michael Brown', 'Lisboa - Portugal', '2027-02-20T19:30:00', 65.00, 300, 1500, 0.20, 'publicado', 1, NULL);
GO

-- Conta administrativa do painel.
-- A senha abaixo e um hash bcrypt, nunca a senha em texto puro.
IF EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'admin@trocaticket.com')
   AND NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'jgabrielramalhocroti@gmail.com')
BEGIN
    UPDATE dbo.usuarios
    SET email = 'jgabrielramalhocroti@gmail.com'
    WHERE email = 'admin@trocaticket.com';
END;

IF EXISTS (SELECT 1 FROM dbo.usuarios WHERE email = 'jgabrielramalhocroti@gmail.com')
BEGIN
    UPDATE dbo.usuarios
    SET nome = 'Administrador TrocaTicket',
        senha_hash = '$2b$10$7LpVZ4FCtYBjbBWdv3Mv/Oy5PB7JFYVhBkm4IieU53b0aLP44cYpm',
        tipo = 'admin',
        status = 'aprovado',
        email_verificado = 1
    WHERE email = 'jgabrielramalhocroti@gmail.com';
END
ELSE
BEGIN
    INSERT INTO dbo.usuarios
        (nome, email, senha_hash, tipo, status, email_verificado)
    VALUES
        ('Administrador TrocaTicket', 'jgabrielramalhocroti@gmail.com',
         '$2b$10$7LpVZ4FCtYBjbBWdv3Mv/Oy5PB7JFYVhBkm4IieU53b0aLP44cYpm',
         'admin', 'aprovado', 1);
END;
GO

-- Cartoes cadastrados pelo usuario. O numero completo nunca e armazenado.
IF OBJECT_ID(N'dbo.cartoes_usuario', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.cartoes_usuario (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_cartoes_usuario PRIMARY KEY,
        usuario_id int NOT NULL,
        nome_titular varchar(120) NOT NULL,
        ultimos_digitos char(4) NOT NULL,
        validade_mes varchar(2) NOT NULL,
        validade_ano varchar(4) NOT NULL,
        bandeira varchar(30) NOT NULL,
        cartao_hash varchar(64) NOT NULL,
        criado_em datetime2(0) NOT NULL CONSTRAINT df_cartoes_criado DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_cartoes_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id)
    );
    CREATE INDEX idx_cartoes_usuario ON dbo.cartoes_usuario(usuario_id, id DESC);
END;
GO

-- Pedidos e ingressos emitidos pelo fluxo de compra do site.
IF OBJECT_ID(N'dbo.pedidos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.pedidos (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_pedidos PRIMARY KEY,
        codigo_pedido varchar(40) NOT NULL,
        comprador_id int NOT NULL,
        valor_total decimal(10,2) NOT NULL,
        status varchar(30) NOT NULL CONSTRAINT df_pedidos_status DEFAULT 'aprovado',
        criado_em datetime2(0) NOT NULL CONSTRAINT df_pedidos_criado DEFAULT SYSUTCDATETIME(),
        CONSTRAINT uq_pedidos_codigo UNIQUE (codigo_pedido),
        CONSTRAINT fk_pedidos_comprador FOREIGN KEY (comprador_id) REFERENCES dbo.usuarios(id)
    );
END;
GO

IF OBJECT_ID(N'dbo.ingressos_emitidos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ingressos_emitidos (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_ingressos_emitidos PRIMARY KEY,
        pedido_id int NOT NULL,
        comprador_id int NOT NULL,
        evento_id int NOT NULL,
        bilheteria_id int NULL,
        numero_ingresso varchar(40) NOT NULL,
        codigo_original_bilheteria varchar(40) NOT NULL,
        qr_code_payload varchar(500) NOT NULL,
        versao_titularidade int NOT NULL CONSTRAINT df_ingressos_versao DEFAULT 1,
        status varchar(40) NOT NULL CONSTRAINT df_ingressos_status DEFAULT 'valido',
        emitido_em datetime2(0) NOT NULL CONSTRAINT df_ingressos_emitido DEFAULT SYSUTCDATETIME(),
        CONSTRAINT uq_ingressos_numero UNIQUE (numero_ingresso),
        CONSTRAINT fk_ingressos_pedido FOREIGN KEY (pedido_id) REFERENCES dbo.pedidos(id),
        CONSTRAINT fk_ingressos_comprador FOREIGN KEY (comprador_id) REFERENCES dbo.usuarios(id),
        CONSTRAINT fk_ingressos_evento FOREIGN KEY (evento_id) REFERENCES dbo.eventos(id)
    );
    CREATE INDEX idx_ingressos_comprador ON dbo.ingressos_emitidos(comprador_id, emitido_em DESC);
END;
GO

IF OBJECT_ID(N'dbo.ingressos_emitidos', N'U') IS NOT NULL
BEGIN
    UPDATE dbo.ingressos_emitidos SET status = 'ativo' WHERE status = 'valido';
    IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'df_ingressos_status')
        ALTER TABLE dbo.ingressos_emitidos DROP CONSTRAINT df_ingressos_status;
    ALTER TABLE dbo.ingressos_emitidos ADD CONSTRAINT df_ingressos_status DEFAULT 'ativo' FOR status;
END;
GO

IF OBJECT_ID(N'dbo.transferencias_pendentes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.transferencias_pendentes (
        id int IDENTITY(1,1) NOT NULL CONSTRAINT pk_transferencias_pendentes PRIMARY KEY,
        ingresso_id int NOT NULL,
        remetente_id int NOT NULL,
        destinatario_id int NOT NULL,
        token varchar(100) NOT NULL,
        status varchar(30) NOT NULL CONSTRAINT df_transferencias_status DEFAULT 'pendente',
        criado_em datetime2(0) NOT NULL CONSTRAINT df_transferencias_criado DEFAULT SYSUTCDATETIME(),
        CONSTRAINT uq_transferencias_token UNIQUE (token),
        CONSTRAINT fk_transferencias_ingresso FOREIGN KEY (ingresso_id) REFERENCES dbo.ingressos_emitidos(id),
        CONSTRAINT fk_transferencias_remetente FOREIGN KEY (remetente_id) REFERENCES dbo.usuarios(id),
        CONSTRAINT fk_transferencias_destinatario FOREIGN KEY (destinatario_id) REFERENCES dbo.usuarios(id)
    );
    CREATE INDEX idx_transferencias_ingresso ON dbo.transferencias_pendentes(ingresso_id, status);
END;
GO

SELECT 'sakila.actor' AS tabela, COUNT(*) AS registros FROM sakila.actor
UNION ALL SELECT 'sakila.customer', COUNT(*) FROM sakila.customer
UNION ALL SELECT 'sakila.film', COUNT(*) FROM sakila.film
UNION ALL SELECT 'sakila.inventory', COUNT(*) FROM sakila.inventory
UNION ALL SELECT 'sakila.rental', COUNT(*) FROM sakila.rental
UNION ALL SELECT 'sakila.payment', COUNT(*) FROM sakila.payment
UNION ALL SELECT 'dbo.usuarios', COUNT(*) FROM dbo.usuarios
UNION ALL SELECT 'dbo.eventos', COUNT(*) FROM dbo.eventos;
GO
