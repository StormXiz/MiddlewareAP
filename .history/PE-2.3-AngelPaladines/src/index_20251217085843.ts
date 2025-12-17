import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import { calculatorRoutes } from './routes/calculator.routes.js'
import fastifySwaggerUi from '@fastify/swagger-ui'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { OAuth2Namespace } from '@fastify/oauth2'

// Declaración de tipos
declare module 'fastify' {
  interface FastifyInstance {
    auth0OAuth2: OAuth2Namespace;
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

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

// 2. Configurar Rate Limiting (protección básica DDoS)
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// 3. Configurar cookies (requerido para mantener estado OAuth)
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {}
});

// 4. Configurar JWT (para firmar nuestros propios tokens)
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
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

// Decorador de autenticación
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token JWT inválido o no proporcionado. Por favor, autentícate en /login'
    });
  }
});

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

