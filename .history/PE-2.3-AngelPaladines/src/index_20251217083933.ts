import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import { calculatorRoutes } from './routes/calculator.routes.js'
import fastifySwaggerUi from '@fastify/swagger-ui'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'

// Validación rápida de variables de entorno
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID) {
  console.error("ERROR CRÍTICO: Variables de entorno faltantes.");
  console.error("Asegúrate de tener el archivo .env y de ejecutar con: node --env-file=.env ... o usar 'dotenv'");
  process.exit(1);
}

const fastify = Fastify({
  logger: true
})

// 1. Configurar Helmet (headers de seguridad)
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
});

//almacenar las sesiones de nuestra autentificación
fastify.register(cookie, {
  secret: 'process.env.COOKIE_SECRET',
  parseOptions: {}
})

// Swagger
fastify.register(swagger, {
  openapi: {
    info: {
      title: "Server MCP para calcular operaciones básicas",
      description: "API para operaciones aritméticas básicas usando MCP",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ],
    tags: [{ name: 'calculator', description: "calculadora de operaciones" }]
  }
})

fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  }
})

// Ruta base
fastify.get('/', async () => {
  return { message: 'MCP Server corriendo' }
})

fastify.register(calculatorRoutes)

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
    console.log("Servidor corriendo en http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

