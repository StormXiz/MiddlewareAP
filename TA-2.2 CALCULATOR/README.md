Este proyecto corresponde a la práctica PE-2.2 y consiste en una API sencilla que permite realizar operaciones matemáticas básicas como suma, resta, multiplicación y división usando Fastify.

La documentación del API está hecha con OpenAPI 3.0 y se puede visualizar usando Swagger UI.

Tecnologías usadas

Node.js

TypeScript

Fastify

Swagger UI

OpenAPI (YAML)

Cómo ejecutar el proyecto

Instalar dependencias:

npm install


Ejecutar el servidor:

npm run dev


El servidor se levanta en:

http://localhost:3000

Swagger UI

La documentación del API está en el archivo:

docs/openapi.yaml


Swagger UI se puede ver en:

http://localhost:3000/docs


Ahí se muestran los endpoints, ejemplos de requests y responses, errores y los esquemas de seguridad documentados.

Endpoints

POST /calculator/add

POST /calculator/subtract

POST /calculator/multiply

POST /calculator/divide

Todos reciben un JSON con:

{
  "a": 10,
  "b": 5
}

Seguridad (documentada)

El API documenta dos tipos de autenticación (no implementadas):

API Key usando el header X-API-Key

Bearer Token usando Authorization: Bearer <token>

También se consideran buenas prácticas para evitar Tool Poisoning, como validar bien los datos de entrada y no ejecutar instrucciones provenientes del usuario.

Versionado

Se utiliza Semantic Versioning (SemVer):

Cambios grandes → MAJOR

Nuevas funciones → MINOR

Correcciones → PATCH

La versión actual del API es 1.0.0.

Evidencias y reporte

Capturas de Swagger UI: docs/screenshots/

Mini-reporte en PDF: report/mini-reporte.pdf