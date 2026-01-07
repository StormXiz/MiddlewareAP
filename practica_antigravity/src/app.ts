import Fastify, { FastifyInstance } from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import userRoutes from './routes/usuarios/index.js';
import emprendimientoRoutes from './routes/emprendimientos/index.js';

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: true,
    });

    // Register Plugins
    await app.register(prismaPlugin);

    // Register Swagger
    await app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Centro de Co-creación UID API',
                description: 'API REST para la gestión de emprendimientos y usuarios del centro.',
                version: '1.0.0'
            },
            servers: [
                { url: 'http://localhost:3000' }
            ]
        }
    });

    await app.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        }
    });
    app.get('/health', async () => {
        return { status: 'ok' };
    });

    // API Routes
    await app.register(userRoutes, { prefix: '/api/usuarios' });
    await app.register(emprendimientoRoutes, { prefix: '/api/emprendimientos' });

    return app;
}
