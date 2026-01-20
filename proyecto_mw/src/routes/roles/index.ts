import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../plugins/auth.js';

const rolesRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Schema for creating a role
    const createRoleSchema = {
        description: 'Crear un nuevo rol',
        tags: ['Roles'],
        body: {
            type: 'object',
            required: ['nombre'],
            properties: {
                nombre: { type: 'string', enum: ['ADMIN', 'EMPRENDEDOR', 'MENTOR', 'CLIENTE', 'ESTUDIANTE', 'TUTOR', 'COLABORADOR'] }
            }
        },
        response: {
            201: {
                description: 'Rol creado',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    nombre: { type: 'string' }
                }
            }
        }
    };

    fastify.post('/', {
        schema: createRoleSchema,
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { nombre } = request.body as any;
        const role = await fastify.prisma.rol.create({
            data: { nombre }
        });
        return reply.code(201).send(role);
    });

    // Schema for getting roles
    const getRolesSchema = {
        description: 'Obtener lista de roles',
        tags: ['Roles'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getRolesSchema }, async (request, reply) => {
        const roles = await fastify.prisma.rol.findMany();
        return roles;
    });
};

export default rolesRoutes;
