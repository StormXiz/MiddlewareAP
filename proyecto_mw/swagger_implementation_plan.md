# Plan de Implementación: Swagger (OpenAPI)

Este plan detalla los pasos para integrar documentación automática via Swagger/OpenAPI en el API existente de Fastify.

## Objetivos
- Generar documentación interactiva automática en `/documentation`.
- Exponer especificación OpenAPI v3.
- Documentar esquemas de request/response para los endpoints existentes (`/usuarios`, `/emprendimientos`).

## Pasos de Implementación

### 1. Instalación de Dependencias
Instalar los paquetes oficiales de Fastify para Swagger.
- `@fastify/swagger`: Generador de la especificación OpenAPI.
- `@fastify/swagger-ui`: Interfaz gráfica (HTML) para visualizar la documentación.

```bash
npm install @fastify/swagger @fastify/swagger-ui
```

### 2. Configuración de Plugins (`src/app.ts`)
Registrar los plugins **antes** de las rutas para que Fastify pueda recolectar los esquemas.

#### Configuración `@fastify/swagger`
- Definir `openapi` info (Título, Versión, Descripción).
- Configurar servidores (Localhost).

#### Configuración `@fastify/swagger-ui`
- Definir ruta (ej: `/documentation`).

### 3. Documentación de Rutas
Agregar esquemas JSON Schema a las rutas existentes para que aparezcan detalladas en Swagger.

#### Ejemplo en `usuarios/index.ts`
```typescript
fastify.post('/register', {
  schema: {
    description: 'Registrar nuevo usuario',
    tags: ['Usuarios'],
    body: {
      type: 'object',
      required: ['nombre', 'email', 'password'],
      properties: {
        nombre: { type: 'string' },
        email: { type: 'string', format: 'email' },
        // ...
      }
    },
    response: {
      201: {
        description: 'Usuario creado',
        type: 'object',
        properties: {
          id: { type: 'number' },
          // ...
        }
      }
    }
  }
}, handler);
```

### 4. Verificación
- Acceder a `http://localhost:3000/documentation`.
- Probar un endpoint desde la UI.
