-- Convertido de phpMyAdmin (MySQL/MariaDB) a PostgreSQL
-- Base: alertacalle

BEGIN;

-- --------------------------------------------------------
-- Tabla: categoria
-- --------------------------------------------------------
CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descr VARCHAR(100) DEFAULT NULL
);

-- --------------------------------------------------------
-- Tabla: estado
-- (el ENUM de MySQL se reemplaza por VARCHAR + CHECK constraint)
-- --------------------------------------------------------
CREATE TABLE estado (
  id SERIAL PRIMARY KEY,
  estado VARCHAR(20) NOT NULL DEFAULT 'Sin resolver'
    CHECK (estado IN ('Sin resolver', 'En proceso', 'Resuelto'))
);

-- --------------------------------------------------------
-- Tabla: roles
-- --------------------------------------------------------
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  permisos VARCHAR(999) DEFAULT NULL
);

-- --------------------------------------------------------
-- Tabla: usuario
-- --------------------------------------------------------
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  password VARCHAR(50) NOT NULL,
  id_rol INT NOT NULL,
  CONSTRAINT usuario_ibfk_1 FOREIGN KEY (id_rol) REFERENCES roles (id)
);

-- --------------------------------------------------------
-- Tabla: incidencia
-- --------------------------------------------------------
CREATE TABLE incidencia (
  id SERIAL PRIMARY KEY,
  direccion VARCHAR(100) NOT NULL,
  foto_url VARCHAR(999) DEFAULT NULL,
  titulo VARCHAR(75) NOT NULL,
  descr VARCHAR(150) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  fecha_actualizacion TIMESTAMP NOT NULL,
  id_estado INT NOT NULL,
  id_categoria INT NOT NULL,
  id_usuario INT NOT NULL,
  CONSTRAINT incidencia_ibfk_1 FOREIGN KEY (id_estado) REFERENCES estado (id),
  CONSTRAINT incidencia_ibfk_2 FOREIGN KEY (id_categoria) REFERENCES categoria (id),
  CONSTRAINT incidencia_ibfk_3 FOREIGN KEY (id_usuario) REFERENCES usuario (id)
);

-- --------------------------------------------------------
-- Tabla: historial_estado
-- --------------------------------------------------------
CREATE TABLE historial_estado (
  id SERIAL PRIMARY KEY,
  fecha_cambio TIMESTAMP NOT NULL,
  comentario VARCHAR(100) NOT NULL,
  id_usuario INT NOT NULL,
  id_estado INT NOT NULL,
  id_incidencia INT NOT NULL,
  CONSTRAINT historial_estado_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuario (id),
  CONSTRAINT historial_estado_ibfk_2 FOREIGN KEY (id_estado) REFERENCES estado (id),
  CONSTRAINT historial_estado_ibfk_3 FOREIGN KEY (id_incidencia) REFERENCES incidencia (id)
);

-- --------------------------------------------------------
-- Índices adicionales (equivalentes a los "KEY" del dump original,
-- que sirven para acelerar los JOIN por las foreign keys)
-- --------------------------------------------------------
CREATE INDEX idx_historial_estado_usuario ON historial_estado (id_usuario);
CREATE INDEX idx_historial_estado_estado ON historial_estado (id_estado);
CREATE INDEX idx_historial_estado_incidencia ON historial_estado (id_incidencia);

CREATE INDEX idx_incidencia_estado ON incidencia (id_estado);
CREATE INDEX idx_incidencia_categoria ON incidencia (id_categoria);
CREATE INDEX idx_incidencia_usuario ON incidencia (id_usuario);

CREATE INDEX idx_usuario_rol ON usuario (id_rol);

COMMIT;
