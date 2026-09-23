\restrict Rpl965wfxPbVYVlYyoDAH9yfGt5iVRyWyTxccJXNfb1fRhd7eR2xBKvE9UhDGeD

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = heap;

SELECT pg_catalog.set_config('search_path', '', false);

CREATE TABLE public.categorias (
    id integer CONSTRAINT categoria_id_not_null NOT NULL,
    nombre character varying(50) CONSTRAINT categoria_nombre_not_null NOT NULL,
    descr character varying(100) DEFAULT NULL::character varying
);

ALTER TABLE public.categorias OWNER TO postgres;

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.categoria_id_seq OWNER TO postgres;
ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categorias.id;

CREATE TABLE public.estados (
    id integer CONSTRAINT estado_id_not_null NOT NULL,
    valor character varying(20) DEFAULT 'Sin resolver'::character varying CONSTRAINT estado_estado_not_null NOT NULL,
    CONSTRAINT estado_estado_check CHECK (((valor)::text = ANY ((ARRAY['Sin resolver'::character varying, 'En proceso'::character varying, 'Resuelto'::character varying])::text[])))
);

ALTER TABLE public.estados OWNER TO postgres;

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.estado_id_seq OWNER TO postgres;

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estados.id;

CREATE TABLE public.historial_estados (
    id integer CONSTRAINT historial_estado_id_not_null NOT NULL,
    fecha_cambio timestamp without time zone CONSTRAINT historial_estado_fecha_cambio_not_null NOT NULL,
    comentario character varying(100) CONSTRAINT historial_estado_comentario_not_null NOT NULL,
    id_usuario integer CONSTRAINT historial_estado_id_usuario_not_null NOT NULL,
    id_estado integer CONSTRAINT historial_estado_id_estado_not_null NOT NULL,
    id_incidencia integer CONSTRAINT historial_estado_id_incidencia_not_null NOT NULL
);

ALTER TABLE public.historial_estados OWNER TO postgres;

CREATE SEQUENCE public.historial_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.historial_estado_id_seq OWNER TO postgres;

ALTER SEQUENCE public.historial_estado_id_seq OWNED BY public.historial_estados.id;

CREATE TABLE public.incidencias (
    id integer CONSTRAINT incidencia_id_not_null NOT NULL,
    direccion character varying(100) CONSTRAINT incidencia_direccion_not_null NOT NULL,
    foto_url character varying(999) DEFAULT NULL::character varying,
    titulo character varying(75) CONSTRAINT incidencia_titulo_not_null NOT NULL,
    descr character varying(150) CONSTRAINT incidencia_descr_not_null NOT NULL,
    fecha_creacion timestamp without time zone CONSTRAINT incidencia_fecha_creacion_not_null NOT NULL,
    fecha_actualizacion timestamp without time zone CONSTRAINT incidencia_fecha_actualizacion_not_null NOT NULL,
    id_estado integer CONSTRAINT incidencia_id_estado_not_null NOT NULL,
    id_categoria integer CONSTRAINT incidencia_id_categoria_not_null NOT NULL,
    id_usuario integer CONSTRAINT incidencia_id_usuario_not_null NOT NULL
);

ALTER TABLE public.incidencias OWNER TO postgres;

CREATE SEQUENCE public.incidencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.incidencia_id_seq OWNER TO postgres;

ALTER SEQUENCE public.incidencia_id_seq OWNED BY public.incidencias.id;

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    permisos character varying(999) DEFAULT NULL::character varying
);

ALTER TABLE public.roles OWNER TO postgres;

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;
ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;

CREATE TABLE public.usuarios (
    id integer CONSTRAINT usuario_id_not_null NOT NULL,
    nombre character varying(50) CONSTRAINT usuario_nombre_not_null NOT NULL,
    apellido character varying(50) CONSTRAINT usuario_apellido_not_null NOT NULL,
    email character varying(100) CONSTRAINT usuario_email_not_null NOT NULL,
    fecha_creacion timestamp without time zone CONSTRAINT usuario_fecha_creacion_not_null NOT NULL,
    password character varying(999) CONSTRAINT usuario_password_not_null NOT NULL,
    id_rol integer CONSTRAINT usuario_id_rol_not_null NOT NULL
);

ALTER TABLE public.usuarios OWNER TO postgres;

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;
ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuarios.id;

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);
ALTER TABLE ONLY public.estados ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);
ALTER TABLE ONLY public.historial_estados ALTER COLUMN id SET DEFAULT nextval('public.historial_estado_id_seq'::regclass);
ALTER TABLE ONLY public.incidencias ALTER COLUMN id SET DEFAULT nextval('public.incidencia_id_seq'::regclass);
ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);

COPY public.categorias (id, nombre, descr) FROM stdin;
\.

COPY public.estados (id, valor) FROM stdin;
\.

COPY public.historial_estados (id, fecha_cambio, comentario, id_usuario, id_estado, id_incidencia) FROM stdin;
\.

COPY public.incidencias (id, direccion, foto_url, titulo, descr, fecha_creacion, fecha_actualizacion, id_estado, id_categoria, id_usuario) FROM stdin;
\.

COPY public.roles (id, nombre, permisos) FROM stdin;
1	Admin	
2	User	
\.

COPY public.usuarios (id, nombre, apellido, email, fecha_creacion, password, id_rol) FROM stdin;
1	Test	User	test@test.com	2026-09-23 02:00:46.195013	AQAAAAIAAYagAAAAEBXxZHAwSSA/mbFghlpFQ0/gu2qfeUoHF+5c62PT2OTBRvJYQwKYtYBrlcSEY/IuUQ==	2
\.


SELECT pg_catalog.setval('public.categoria_id_seq', 1, false);
SELECT pg_catalog.setval('public.estado_id_seq', 1, false);
SELECT pg_catalog.setval('public.historial_estado_id_seq', 1, false);
SELECT pg_catalog.setval('public.incidencia_id_seq', 1, false);
SELECT pg_catalog.setval('public.roles_id_seq', 2, true);
SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);

CREATE INDEX idx_historial_estado_estado ON public.historial_estados USING btree (id_estado);
CREATE INDEX idx_historial_estado_incidencia ON public.historial_estados USING btree (id_incidencia);
CREATE INDEX idx_historial_estado_usuario ON public.historial_estados USING btree (id_usuario);
CREATE INDEX idx_incidencia_categoria ON public.incidencias USING btree (id_categoria);
CREATE INDEX idx_incidencia_estado ON public.incidencias USING btree (id_estado);
CREATE INDEX idx_incidencia_usuario ON public.incidencias USING btree (id_usuario);
CREATE INDEX idx_usuario_rol ON public.usuarios USING btree (id_rol);

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_2 FOREIGN KEY (id_estado) REFERENCES public.estados(id);

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_3 FOREIGN KEY (id_incidencia) REFERENCES public.incidencias(id);

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_1 FOREIGN KEY (id_estado) REFERENCES public.estados(id);

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_2 FOREIGN KEY (id_categoria) REFERENCES public.categorias(id);

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_3 FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuario_ibfk_1 FOREIGN KEY (id_rol) REFERENCES public.roles(id);

\unrestrict Rpl965wfxPbVYVlYyoDAH9yfGt5iVRyWyTxccJXNfb1fRhd7eR2xBKvE9UhDGeD
