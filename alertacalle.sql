--
-- PostgreSQL database dump
--

\restrict m23ixRrqfwXLnpfydmKgfHQiHWdfya4jL0ceCE83V9LO08gm6lJxrxtBdQyJSgr

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-09-23 02:07:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer CONSTRAINT categoria_id_not_null NOT NULL,
    nombre character varying(50) CONSTRAINT categoria_nombre_not_null NOT NULL,
    descr character varying(100) DEFAULT NULL::character varying
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 219
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categorias.id;


--
-- TOC entry 222 (class 1259 OID 16400)
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados (
    id integer CONSTRAINT estado_id_not_null NOT NULL,
    estado character varying(20) DEFAULT 'Sin resolver'::character varying CONSTRAINT estado_estado_not_null NOT NULL,
    CONSTRAINT estado_estado_check CHECK (((estado)::text = ANY ((ARRAY['Sin resolver'::character varying, 'En proceso'::character varying, 'Resuelto'::character varying])::text[])))
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16399)
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 221
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estados.id;


--
-- TOC entry 230 (class 1259 OID 16476)
-- Name: historial_estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estados (
    id integer CONSTRAINT historial_estado_id_not_null NOT NULL,
    fecha_cambio timestamp without time zone CONSTRAINT historial_estado_fecha_cambio_not_null NOT NULL,
    comentario character varying(100) CONSTRAINT historial_estado_comentario_not_null NOT NULL,
    id_usuario integer CONSTRAINT historial_estado_id_usuario_not_null NOT NULL,
    id_estado integer CONSTRAINT historial_estado_id_estado_not_null NOT NULL,
    id_incidencia integer CONSTRAINT historial_estado_id_incidencia_not_null NOT NULL
);


ALTER TABLE public.historial_estados OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16475)
-- Name: historial_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_estado_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_estado_id_seq OWNED BY public.historial_estados.id;


--
-- TOC entry 228 (class 1259 OID 16442)
-- Name: incidencias; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- TOC entry 227 (class 1259 OID 16441)
-- Name: incidencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incidencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidencia_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 227
-- Name: incidencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incidencia_id_seq OWNED BY public.incidencias.id;


--
-- TOC entry 224 (class 1259 OID 16411)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    permisos character varying(999) DEFAULT NULL::character varying
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16410)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 226 (class 1259 OID 16423)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- TOC entry 225 (class 1259 OID 16422)
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4881 (class 2604 OID 16393)
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16403)
-- Name: estados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16479)
-- Name: historial_estados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados ALTER COLUMN id SET DEFAULT nextval('public.historial_estado_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16445)
-- Name: incidencias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidencias ALTER COLUMN id SET DEFAULT nextval('public.incidencia_id_seq'::regclass);


--
-- TOC entry 4885 (class 2604 OID 16414)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 16426)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 5066 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nombre, descr) FROM stdin;
\.


--
-- TOC entry 5068 (class 0 OID 16400)
-- Dependencies: 222
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados (id, estado) FROM stdin;
\.


--
-- TOC entry 5076 (class 0 OID 16476)
-- Dependencies: 230
-- Data for Name: historial_estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_estados (id, fecha_cambio, comentario, id_usuario, id_estado, id_incidencia) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 16442)
-- Dependencies: 228
-- Data for Name: incidencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidencias (id, direccion, foto_url, titulo, descr, fecha_creacion, fecha_actualizacion, id_estado, id_categoria, id_usuario) FROM stdin;
\.


--
-- TOC entry 5070 (class 0 OID 16411)
-- Dependencies: 224
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre, permisos) FROM stdin;
1	Admin	
2	Admin	
\.


--
-- TOC entry 5072 (class 0 OID 16423)
-- Dependencies: 226
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, apellido, email, fecha_creacion, password, id_rol) FROM stdin;
1	Test	User	test@test.com	2026-09-23 02:00:46.195013	AQAAAAIAAYagAAAAEBXxZHAwSSA/mbFghlpFQ0/gu2qfeUoHF+5c62PT2OTBRvJYQwKYtYBrlcSEY/IuUQ==	2
\.


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 219
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 1, false);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 221
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 1, false);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_estado_id_seq', 1, false);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 227
-- Name: incidencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incidencia_id_seq', 1, false);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 225
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);


--
-- TOC entry 4893 (class 2606 OID 16398)
-- Name: categorias categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16409)
-- Name: estados estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 16487)
-- Name: historial_estados historial_estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16459)
-- Name: incidencias incidencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16421)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16435)
-- Name: usuarios usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 1259 OID 16504)
-- Name: idx_historial_estado_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_estado_estado ON public.historial_estados USING btree (id_estado);


--
-- TOC entry 4909 (class 1259 OID 16505)
-- Name: idx_historial_estado_incidencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_estado_incidencia ON public.historial_estados USING btree (id_incidencia);


--
-- TOC entry 4910 (class 1259 OID 16503)
-- Name: idx_historial_estado_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_estado_usuario ON public.historial_estados USING btree (id_usuario);


--
-- TOC entry 4901 (class 1259 OID 16507)
-- Name: idx_incidencia_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidencia_categoria ON public.incidencias USING btree (id_categoria);


--
-- TOC entry 4902 (class 1259 OID 16506)
-- Name: idx_incidencia_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidencia_estado ON public.incidencias USING btree (id_estado);


--
-- TOC entry 4903 (class 1259 OID 16508)
-- Name: idx_incidencia_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidencia_usuario ON public.incidencias USING btree (id_usuario);


--
-- TOC entry 4898 (class 1259 OID 16509)
-- Name: idx_usuario_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_rol ON public.usuarios USING btree (id_rol);


--
-- TOC entry 4915 (class 2606 OID 16488)
-- Name: historial_estados historial_estado_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- TOC entry 4916 (class 2606 OID 16493)
-- Name: historial_estados historial_estado_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_2 FOREIGN KEY (id_estado) REFERENCES public.estados(id);


--
-- TOC entry 4917 (class 2606 OID 16498)
-- Name: historial_estados historial_estado_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados
    ADD CONSTRAINT historial_estado_ibfk_3 FOREIGN KEY (id_incidencia) REFERENCES public.incidencias(id);


--
-- TOC entry 4912 (class 2606 OID 16460)
-- Name: incidencias incidencia_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_1 FOREIGN KEY (id_estado) REFERENCES public.estados(id);


--
-- TOC entry 4913 (class 2606 OID 16465)
-- Name: incidencias incidencia_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_2 FOREIGN KEY (id_categoria) REFERENCES public.categorias(id);


--
-- TOC entry 4914 (class 2606 OID 16470)
-- Name: incidencias incidencia_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidencias
    ADD CONSTRAINT incidencia_ibfk_3 FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- TOC entry 4911 (class 2606 OID 16436)
-- Name: usuarios usuario_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuario_ibfk_1 FOREIGN KEY (id_rol) REFERENCES public.roles(id);


-- Completed on 2026-09-23 02:07:55

--
-- PostgreSQL database dump complete
--

\unrestrict m23ixRrqfwXLnpfydmKgfHQiHWdfya4jL0ceCE83V9LO08gm6lJxrxtBdQyJSgr

