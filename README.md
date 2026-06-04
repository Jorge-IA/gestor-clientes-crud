# Gestor de Clientes

Aplicación web full-stack para administrar un CRUD completo de clientes, con autenticación JWT y control de acceso por roles.

**Stack:** Vue 3 + TypeScript · Express + TypeScript · SQLite + Prisma · Vite

---

## Requisitos previos

- Node.js 18 o superior
- npm

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd gestor-clientes
```

### 2. Configurar e iniciar el Backend

```bash
cd backend
npm install
```

Aplicar las migraciones (crea la base de datos SQLite con las tablas `Cliente` y `Usuario`):

```bash
npx prisma migrate dev
```

Crear el usuario administrador inicial:

```bash
npx ts-node prisma/seed.ts
```

Iniciar el servidor en el puerto **3000**:

```bash
npm run dev
```

### 3. Configurar e iniciar el Frontend

Abrir una **nueva terminal**:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

---

## Variables de entorno

El archivo `backend/.env` ya está incluido y listo para usar:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="gestor_clientes_secret_2024"
```

No se requiere ninguna configuración adicional.

---

## Credenciales de acceso

### Administrador (creado por el seed)

| Campo | Valor |
|-------|-------|
| Email | `admin@gestor.com` |
| Contraseña | `admin123` |
| Rol | ADMIN |

### Usuarios normales

Pueden registrarse desde la pantalla **"Crear cuenta"** en `/registro`. Los nuevos registros reciben el rol `USUARIO` por defecto.

---

## Funcionalidades

### CRUD de Clientes (requisito principal)

- **Listar** — tabla con todos los clientes registrados
- **Crear** — formulario con validación de campos requeridos y formato de email (frontend y backend)
- **Editar** — seleccionar un cliente y modificar sus datos
- **Eliminar** — eliminar con confirmación; un administrador no puede eliminar su propio registro de cliente

### Autenticación y roles

- **Registro** — cualquier persona puede crear una cuenta (`/registro`)
- **Login** — acceso con email y contraseña (`/login`); token JWT con 24 h de vigencia
- **Admin** — accede al panel completo: CRUD de clientes + gestión de usuarios del sistema
- **Usuario normal** — solo puede ver y editar su propio perfil (`/perfil`)
- Un administrador no puede eliminar su propia cuenta ni cambiar su propio rol

### Extras

- Modo oscuro / claro con persistencia en `localStorage`
- Fondo animado interactivo con Vanta.js en las pantallas de autenticación
- Toggle para mostrar / ocultar contraseña en los formularios de acceso

---

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/registro` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión, devuelve JWT |

### Clientes _(requieren token JWT)_

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| GET | `/clientes` | Cualquiera | Listar todos los clientes |
| POST | `/clientes` | Admin | Crear cliente |
| PUT | `/clientes/:id` | Admin | Actualizar cliente |
| DELETE | `/clientes/:id` | Admin | Eliminar cliente |

### Usuarios _(requieren token JWT)_

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| GET | `/usuarios` | Admin | Listar todos los usuarios |
| GET | `/usuarios/me` | Cualquiera | Ver perfil propio |
| PUT | `/usuarios/me` | Cualquiera | Editar perfil propio |
| PATCH | `/usuarios/:id/rol` | Admin | Cambiar rol de un usuario |
| DELETE | `/usuarios/:id` | Admin | Eliminar usuario |

---

## Estructura del proyecto

```
gestor-clientes/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos Cliente y Usuario
│   │   ├── seed.ts             # Crea el admin inicial
│   │   └── migrations/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── clientes.controller.ts
│       │   └── usuarios.controller.ts
│       ├── middlewares/
│       │   └── auth.middleware.ts  # verificarToken, soloAdmin
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── clientes.routes.ts
│       │   └── usuarios.routes.ts
│       ├── prisma/
│       │   └── prisma.ts
│       ├── app.ts
│       └── server.ts
└── frontend/
    └── src/
        ├── components/
        │   └── ClienteForm.vue     # Formulario crear/editar cliente
        ├── composables/
        │   ├── useAuth.ts          # Estado de sesión
        │   └── useTheme.ts         # Modo oscuro/claro
        ├── router/
        │   └── index.ts            # Guards por rol
        ├── services/
        │   └── clientes.service.ts # Axios + interceptor JWT
        ├── types/
        │   ├── cliente.ts
        │   └── usuario.ts
        ├── views/
        │   ├── LoginView.vue
        │   ├── RegisterView.vue
        │   ├── AdminView.vue       # Panel admin (clientes + usuarios)
        │   └── PerfilView.vue      # Perfil de usuario normal
        ├── App.vue                 # Navbar + router-view
        └── main.ts
```

---

## Modelo de datos

### Cliente

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| nombre_completo | String | Requerido |
| email | String | Requerido, único, formato email |
| telefono | String | Opcional |
| empresa | String | Requerido |

### Usuario

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | Int | PK, autoincrement |
| nombre | String | Requerido |
| email | String | Requerido, único |
| password | String | Hash bcrypt |
| rol | String | `ADMIN` \| `USUARIO` (default: USUARIO) |
