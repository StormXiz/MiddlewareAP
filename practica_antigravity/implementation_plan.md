# Plan de Implementación del API REST (UID Center)

Este plan detalla la creación de un API REST moderno utilizando las tecnologías solicitadas: **Fastify v5**, **Node.js (v20+)**, **Prisma ORM**, y **MySQL 8.0**.

El API servirá como backend para el sistema del Centro de Apoyo y Co-creación, implementando los requisitos definidos en el SRS y el reporte de análisis.

## User Review Required

> [!IMPORTANT]
> **Esquema de Base de Datos**: Este plan asume que convertiremos el diseño SQL original (`grupo2.sql`) a un esquema Prisma (`schema.prisma`), incorporando las mejoras detectadas en el análisis (Tablas de Marketing, Redes Sociales, etc.). El archivo SQL original quedará obsoleto a favor de las migraciones de Prisma.

## Proposed Changes

### 1. Inicialización y Configuración del Proyecto

#### [NEW] `package.json`
- Inicializar proyecto Node.js (`npm init -y`).
- **Configuración ES2025**: Agregar `"type": "module"` para activar ESM nativo.
- Dependencias Principales:
    - `fastify`: Framework web (v5).
    - `@prisma/client`: Cliente de base de datos generado.
    - `dotenv`: Manejo de variables de entorno.
- Dependencias de Desarrollo:
    - `prisma`: CLI para migraciones.
    - `typescript` & `@types/node`: Soporte de tipado.
    - `tsx`: Ejecución directa de TypeScript (reemplazo moderno de `ts-node` compatible con ESM).

#### [NEW] `tsconfig.json`
- **Target**: `ESNext` (para soportar características de ES2025).
- **Module**: `NodeNext` (para integración correcta con "type": "module").
- **Strict**: true.

### 2. Capa de Datos (Prisma & MySQL)

#### [NEW] `prisma/schema.prisma`
Definición del modelo de datos optimizado. Incluirá:
- **User management**: `Usuario`, `Rol`, `Auth`.
- **Core Business**: `Emprendimiento`, `Categoria`, `Producto` (Nueva tabla).
- **Features**: `Mentoria`, `RedesSociales` (Nueva tabla), `Resena` (Nueva tabla), `Promocion` (Nueva tabla).

#### [NEW] `src/plugins/prisma.ts`
- Plugin de Fastify para instanciar y desconectar correctamente el `PrismaClient` (Singleton pattern).

### 3. Estructura del Servidor (Fastify)

#### [NEW] `src/app.ts`
- Configuración de la instancia de Fastify.
- Registro de plugins (CORS, Prisma).
- Registro de rutas.

#### [NEW] `src/server.ts`
- Punto de entrada (Entry point) que levanta el servidor en el puerto especificado (ej. 3000).

### 4. Rutas y Controladores (Endpoints)
Creación de rutas RESTful bajo `src/routes/`:

#### [NEW] `src/routes/emprendimientos/`
- `GET /emprendimientos`: Listar (con filtros por categoría).
- `POST /emprendimientos`: Crear nuevo.
- `GET /emprendimientos/:id`: Detalle completo (incluyendo productos y redes).

#### [NEW] `src/routes/usuarios/`
- `POST /usuarios/register`: Registro de usuario.
- `POST /usuarios/login`: Login simple (puedo agregar JWT si se requiere, aunque no fue explícitamente pedido en el stack básico).

## Verification Plan

### Automated Tests
Se utilizará un script de prueba manual (o tests unitarios con `node --test` si se desea) para verificar los endpoints principales.

1.  **Levantar Base de Datos**: Asegurar que MySQL 8.0 esté corriendo (Docker o Local).
2.  **Migraciones**: Ejecutar `npx prisma migrate dev --name init`.
3.  **Start Server**: `npm run dev`.
4.  **Endpoint Check**:
    - `curl http://localhost:3000/health` (Healthcheck)
    - `curl -X POST http://localhost:3000/usuarios/register ...`
    - `curl http://localhost:3000/emprendimientos`

### Manual Verification
- El usuario podrá probar los endpoints utilizando **Postman** o **VS Code REST Client** con un archivo `api.http` que proveeré.
