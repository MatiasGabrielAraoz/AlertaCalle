INSERT INTO public.estados (id, valor)
VALUES
  (1, 'Sin resolver'),
  (2, 'En proceso'),
  (3, 'Resuelto')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias (id, nombre, descr)
VALUES
  (1, 'Baches', 'Baches y daños en la calzada'),
  (2, 'Alumbrado público', 'Luminarias apagadas o dañadas'),
  (3, 'Higiene y residuos', 'Basura y residuos en la vía pública'),
  (4, 'Arbolado y plazas', 'Árboles caídos o daños en plazas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.usuarios
  (id, nombre, apellido, email, fecha_creacion, password, id_rol)
SELECT
  2,
  'Admin',
  'AlertaCalle',
  'admin@alertacalle.test',
  CURRENT_TIMESTAMP,
  'AQAAAAIAAYagAAAAEHRTID7ZhwUk/3uYrvJGo/8fxfC1I/Ct7KHHHse6Q7c+s9YZ0IOQrb1ge/eYKZJnEg==',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios WHERE email = 'admin@alertacalle.test'
);
-- Usuario: admin@alertacalle.test
-- Contraseña: Admin123!

INSERT INTO public.usuarios
  (id, nombre, apellido, email, fecha_creacion, password, id_rol)
SELECT
  3,
  'Vecino',
  'Demo',
  'vecino@alertacalle.test',
  CURRENT_TIMESTAMP,
  'AQAAAAIAAYagAAAAEBc3JdLlPxwkGY+pGLc2Vc8FJwWC/vli2EG8ogFhUKH5DcTCsIypgGlR0/zs1PSDaw==',
  2
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios WHERE email = 'vecino@alertacalle.test'
);
-- Usuario: vecino@alertacalle.test
-- Contraseña: Vecino123!

INSERT INTO public.incidencias
  (direccion, foto_url, titulo, descr, fecha_creacion, fecha_actualizacion,
   id_estado, id_categoria, id_usuario)
SELECT
  'Av. San Martín 850',
  '',
  'Bache junto a la parada',
  'Bache profundo que dificulta el tránsito.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  1,
  1,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.incidencias WHERE titulo = 'Bache junto a la parada'
);

INSERT INTO public.incidencias
  (direccion, foto_url, titulo, descr, fecha_creacion, fecha_actualizacion,
   id_estado, id_categoria, id_usuario)
SELECT
  'Calle Belgrano 420',
  '',
  'Luminaria apagada',
  'La cuadra permanece sin iluminación durante la noche.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  2,
  2,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.incidencias WHERE titulo = 'Luminaria apagada'
);

INSERT INTO public.incidencias
  (direccion, foto_url, titulo, descr, fecha_creacion, fecha_actualizacion,
   id_estado, id_categoria, id_usuario)
SELECT
  'Plaza del Centro',
  '',
  'Residuos acumulados',
  'Hay bolsas y residuos acumulados junto a los juegos.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  3,
  3,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.incidencias WHERE titulo = 'Residuos acumulados'
);

SELECT setval(
  'public.estado_id_seq',
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.estados), 1),
  true
);
SELECT setval(
  'public.categoria_id_seq',
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.categorias), 1),
  true
);
SELECT setval(
  'public.incidencia_id_seq',
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.incidencias), 1),
  true
);
SELECT setval(
  'public.usuario_id_seq',
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.usuarios), 1),
  true
);
