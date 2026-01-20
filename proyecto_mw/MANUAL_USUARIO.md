# Manual de Usuario - API Centro de Co-creación

Este documento explica cómo utilizar las funciones protegidas y gestionar tutores y colaboradores.

## 1. Autenticación y Tokens

Muchas acciones (como crear roles, tutores, o borrar cosas) requieren permisos de **ADMIN**.

### ¿Cómo obtener un Token?
1.  **Regístrate** como usuario:
    *   Endpoint: `POST /api/usuarios/register`
    *   Body:
        ```json
        {
          "nombre": "Admin User",
          "email": "admin@example.com",
          "password": "securepassword",
          "cedula": "1234567890",
          "role": "ADMIN"
        }
        ```
    *   **Respuesta**: Recibirás un `token` inmediatamente.

2.  **Login** (si ya tienes cuenta):
    *   Endpoint: `POST /api/auth/login`
    *   Recibirás el `token`.

### ¿Cómo usar el Token?
En Swagger, haz clic en el botón **Authorize** (candado) e ingresa:
`Bearer <TU_TOKEN_AQUI>`
(Nota: Swagger UI a veces lo maneja automático si tiene la config, si no, asegúrate de poner "Bearer " antes del token).

---

## 2. Gestión de Tutores y Colaboradores

Hemos creado endpoints específicos para facilitarte la vida. Estos endpoints requieren que tengas un Token de **ADMIN**.

### Tutores (Mentores)
*   **Crear Tutor**: 
    *   `POST /api/tutores`
    *   Solo envía nombre, email, password, cedula. El sistema le asigna el rol `MENTOR` automáticamente.
*   **Listar Tutores**: `GET /api/tutores`
*   **Eliminar Tutor**: `DELETE /api/tutores/:id`

### Colaboradores
*   **Crear Colaborador**: 
    *   `POST /api/colaboradores`
    *   Solo envía nombre, email, password, cedula. El sistema le asigna el rol `COLABORADOR` automáticamente.
*   **Listar Colaboradores**: `GET /api/colaboradores`
*   **Eliminar Colaborador**: `DELETE /api/colaboradores/:id`

---

## 3. Gestión de Roles

### ¿Por qué no me dejaba crear roles?
La ruta `POST /api/roles` está protegida. **Solo un usuario con rol "ADMIN" puede crear nuevos roles**.

**Pasos para crear un rol:**
1.  Obtén tu token de ADMIN (ver paso 1).
2.  Autorízate en Swagger.
3.  Usa `POST /api/roles` con el nombre del nuevo rol (ej: "SUPERVISOR").

---

## 4. Solución de Errores Comunes

*   **Error 401 Unauthorized**: No enviaste el token o expiró. Haz login de nuevo.
*   **Error 403 Forbidden**: Tienes un token, pero tu usuario NO tiene permisos (ej: intentaste borrar algo siendo ESTUDIANTE). Necesitas ser ADMIN.
*   **Error de Clave Foránea al Eliminar**: Solucionado. Ahora el sistema borra todo en cascada (si borras un usuario, se borran sus emprendimientos).
