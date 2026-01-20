import Fastify, { FastifyInstance } from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import userRoutes from './routes/usuarios/index.js';
import emprendimientoRoutes from './routes/emprendimientos/index.js';
import rolesRoutes from './routes/roles/index.js';
import categoriasRoutes from './routes/categorias/index.js';
import authRoutes from './routes/auth/index.js';
import mentoriasRoutes from './routes/mentorias/index.js';
import resenasRoutes from './routes/resenas/index.js';
import tutoresRoutes from './routes/tutores/index.js';
import colaboradoresRoutes from './routes/colaboradores/index.js';

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: false,
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
                { url: 'http://localhost:3001' }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [{ bearerAuth: [] }]
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
    await app.register(authRoutes, { prefix: '/api/auth' });
    await app.register(userRoutes, { prefix: '/api/usuarios' });
    await app.register(emprendimientoRoutes, { prefix: '/api/emprendimientos' });
    await app.register(rolesRoutes, { prefix: '/api/roles' });
    await app.register(categoriasRoutes, { prefix: '/api/categorias' });
    await app.register(mentoriasRoutes, { prefix: '/api/mentorias' });
    await app.register(resenasRoutes, { prefix: '/api/resenas' });
    await app.register(tutoresRoutes, { prefix: '/api/tutores' });
    await app.register(colaboradoresRoutes, { prefix: '/api/colaboradores' });

    return app;
}
