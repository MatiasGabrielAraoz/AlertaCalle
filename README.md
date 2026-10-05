# AlertaCalle

AlertaCalle es una aplicación web para registrar y consultar incidencias de la vía pública, como baches, problemas de alumbrado, residuos y daños en espacios verdes. El repositorio está organizado en tres partes:

- **Base de datos:** PostgreSQL, con el esquema y datos iniciales en archivos SQL.
- **API:** backend REST desarrollado con ASP.NET Core y .NET 8.
- **Web:** frontend estático compuesto por HTML, CSS y JavaScript nativo.

## Arquitectura

```text
Navegador
   │
   └── AlertaCalle.Web ── HTTP/JSON ── AlertaCalle.API ── Entity Framework Core ── PostgreSQL
```

La web utiliza `http://localhost:5208` como URL base de la API durante el desarrollo. La API expone sus recursos sin un prefijo `/api`, por ejemplo, `GET /incidencias` y `POST /auth/login`.

## Base de datos

La aplicación utiliza **PostgreSQL 17**. El modelo se encuentra en `alertacalle.sql` y se mapea desde `ApplicationDbContext` mediante Entity Framework Core y `Npgsql`.

### Tablas principales

| Tabla | Propósito |
| --- | --- |
| `usuarios` | Usuarios registrados, credenciales y rol asignado. |
| `roles` | Roles de acceso y permisos. Incluye `Admin` y `User`. |
| `categorias` | Tipos de incidencia, como baches o alumbrado público. |
| `estados` | Estados posibles: `Sin resolver`, `En proceso` y `Resuelto`. |
| `incidencias` | Reportes realizados por los usuarios, con dirección, título, descripción, foto y fechas. |
| `historial_estados` | Cambios de estado de cada incidencia, con usuario, comentario y fecha. |

Las relaciones principales son:

- Cada usuario pertenece a un rol y puede crear incidencias.
- Cada incidencia pertenece a una categoría, un estado y un usuario.
- El historial relaciona una incidencia con el usuario y el estado involucrados en cada cambio.


### Inicialización

`compose.yml` monta automáticamente estos archivos en el contenedor de PostgreSQL:

1. `alertacalle.sql`: crea tablas, secuencias, índices, claves primarias y claves foráneas.
2. `seed.sql`: carga estados, categorías, usuarios de demostración e incidencias de ejemplo.

El volumen `alertacalle-postgres-data` conserva los datos entre reinicios. Para volver a ejecutar los scripts de inicialización desde cero, es necesario detener los servicios y eliminar ese volumen:

```bash
docker compose down -v
```

Las credenciales de demostración definidas en `seed.sql` son:

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin@alertacalle.test` | `Admin123!` |
| Vecino | `vecino@alertacalle.test` | `Vecino123!` |

No utilices estas credenciales ni la clave JWT incluida en los archivos de ejemplo en un entorno productivo.

## API

La API está en `AlertaCalle.API/AlertaCalle.API` y utiliza:

- **.NET 8 / ASP.NET Core Web API**
- **Entity Framework Core 8**
- **Npgsql** para PostgreSQL
- **JWT Bearer** para autenticación
- **Swagger/OpenAPI** mediante Swashbuckle
- **Microsoft Identity Core** para el hash de contraseñas
- Convenciones de nombres `snake_case` con `EFCore.NamingConventions`

### Autenticación

Los endpoints públicos de autenticación son:

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/login` | Inicia sesión y devuelve un token JWT. |
| `POST` | `/auth/refresh` | Renueva el token de acceso usando el refresh token de la sesión. |
| `POST` | `/auth/register` | Registra un usuario. |
| `GET` | `/auth/me` | Devuelve los datos del usuario autenticado. |
| `POST` | `/auth/change-password` | Cambia la contraseña del usuario autenticado. |

Los endpoints protegidos requieren el encabezado:

```http
Authorization: Bearer <token>
```

El frontend renueva el token de acceso unos minutos antes de que expire mientras la aplicación está abierta y al volver a ella. El refresh token tiene una vigencia máxima de 30 días; al vencer, hay que iniciar sesión nuevamente. La opción «Recordarme» conserva el par de tokens en el dispositivo hasta ese límite.

### Recursos

Los controladores REST disponibles son:

- `/incidencias`: consulta, detalle, alta, actualización y eliminación de reportes.
- `/categorias`: consulta y administración de categorías.
- `/estados` y `/accidentes/estados`: consulta y administración de estados.
- `/historial-estados`: consulta y administración del historial de estados.
- `/roles`: consulta y administración de roles.
- `/usuarios`: consulta y administración de usuarios.

Las operaciones de escritura y las operaciones administrativas que corresponden requieren autenticación JWT. La implementación completa de cada endpoint se encuentra en `AlertaCalle.API/AlertaCalle.API/Controllers`.

En desarrollo, Swagger se habilita desde `Program.cs` y permite explorar y probar el contrato de la API. La configuración de conexión y JWT se encuentra en `appsettings.json`; para Docker se sobreescribe mediante variables de entorno en `compose.yml`.

## Diagramas UML

Los 32 diagramas fuente de PlantUML están en [`uml/`](uml/), organizados por proyecto y carpeta (`Controllers`, `Models`, `Services`, etc.). Cada archivo `.puml` tiene su imagen `.png` generada en el mismo directorio, por lo que se pueden consultar las fuentes y las imágenes lado a lado.

- [Diagrama general de clases (PNG)](uml/include.png) y [fuente PlantUML](uml/include.puml).
- [Diagramas de controladores](uml/AlertaCalle.API/Controllers/), [modelos](uml/AlertaCalle.API/Models/) y [servicios](uml/AlertaCalle.API/Services/).
- [Diagramas de pruebas](uml/AlertaCalle.API.Tests/).

Para regenerar todas las imágenes, con Java y Graphviz instalados, ejecutá PlantUML sobre las fuentes:

```bash
find uml -type f -name '*.puml' -print0 | xargs -0 plantuml -tpng -charset UTF-8
```

## DER

<img width="604" height="472" alt="imagen" src="https://github.com/user-attachments/assets/0e07937c-d586-4744-9032-de4bcd23aa1d" />


## Aplicación web

`AlertaCalle.Web` es un frontend estático sin framework ni gestor de dependencias. Sus tecnologías son:

- **HTML5** para las páginas y formularios.
- **CSS3** en `css/styles.css` para estilos y diseño responsive.
- **JavaScript moderno** con módulos ES (`import`/`export`) para la interacción.
- **Fetch API** para consumir el backend.
- `localStorage`, `sessionStorage` y cookies para conservar la sesión del usuario.

Las páginas principales son:

- `inicio.html`: pantalla principal y consulta de incidencias.
- `reportes.html`: listado de reportes.
- `login.html` y `register.html`: autenticación y registro.
- `cuenta.html`: información de la cuenta.
- `noticias.html` y `ayuda.html`: contenido informativo y ayuda.

La integración con la API está centralizada en `AlertaCalle.Web/js/client.js`. Si la API se publica en otra dirección, actualiza `API_BASE_URL` en ese archivo.

## Ejecución con Docker Compose

Requisitos:

- Docker Engine o Docker Desktop
- Docker Compose

Inicia PostgreSQL y la API con:

```bash
docker compose up --build
```

La API quedará disponible en `http://localhost:5208`. Para detener los contenedores:

```bash
docker compose down
```

El frontend no requiere compilación. Puede abrirse directamente desde `AlertaCalle.Web`, aunque para evitar restricciones del navegador al cargar módulos ES se recomienda servir esa carpeta con un servidor HTTP local, por ejemplo:

```bash
cd AlertaCalle.Web
python3 -m http.server 5500
```

Después, abre `http://localhost:5500/inicio.html`.

## Ejecución local de la API

Para ejecutar la API fuera de Docker se necesita .NET 8 y una instancia de PostgreSQL accesible con la cadena configurada en `appsettings.json`:

```bash
cd AlertaCalle.API
dotnet restore
dotnet run --project AlertaCalle.API
```

La URL efectiva puede variar según `launchSettings.json` y el entorno seleccionado. En el entorno de desarrollo, la documentación Swagger se sirve desde la ruta configurada por ASP.NET Core.

## Pruebas

El proyecto de pruebas utiliza xUnit y el proveedor `Microsoft.EntityFrameworkCore.InMemory`:

```bash
dotnet test AlertaCalle.API/AlertaCalle.API.Tests/AlertaCalle.API.Tests.csproj
```

## Estructura del repositorio

```text
.
├── AlertaCalle.API/
│   ├── AlertaCalle.API/        # API, modelos, controladores y servicios
│   └── AlertaCalle.API.Tests/  # pruebas automatizadas
├── AlertaCalle.Web/            # frontend estático
├── uml/                        # fuentes PlantUML e imágenes PNG generadas
├── alertacalle.sql             # esquema PostgreSQL
├── seed.sql                    # datos iniciales
└── compose.yml                 # PostgreSQL + API
```
