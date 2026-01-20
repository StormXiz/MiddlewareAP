import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { authenticate, authorize } from '../../plugins/auth.js';

const colaboradoresRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // --- GET LIST ---
    const getColaboradoresSchema = {
        description: 'Listar colaboradores (Usuarios con rol COLABORADOR)',
        tags: ['Colaboradores'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' },
                        email: { type: 'string' },
                        roles: { type: 'array', items: { type: 'object', properties: { nombre: { type: 'string' } } } }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getColaboradoresSchema }, async (request, reply) => {
        const colaboradores = await fastify.prisma.usuario.findMany({
            where: {
                roles: {
                    some: {
                        nombre: 'COLABORADOR'
                    }
                }
            },
            include: {
                roles: true
            }
        });
        return colaboradores;
    });

    // --- POST CREATE ---
    const createColaboradorSchema = {
        description: 'Registrar nuevo Colaborador',
        tags: ['Colaboradores'],
        body: {
            type: 'object',
            required: ['nombre', 'email', 'password', 'cedula'],
            properties: {
                nombre: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 },
                cedula: { type: 'string', minLength: 10 }
            }
        },
        response: {
            201: {
                description: 'Colaborador creado',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    nombre: { type: 'string' },
                    email: { type: 'string' }
                }
            },
            400: {
                description: 'Usuario existente',
                type: 'object',
                properties: { message: { type: 'string' } }
            }
        }
    };

    fastify.post('/', {
        schema: createColaboradorSchema,
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { nombre, email, password, cedula } = request.body as any;

        const exists = await fastify.prisma.usuario.findFirst({ where: { OR: [{ email }, { cedula }] } });
        if (exists) return reply.code(400).send({ message: 'Usuario ya existe' });

        let role = await fastify.prisma.rol.findUnique({ where: { nombre: 'COLABORADOR' } });
        if (!role) role = await fastify.prisma.rol.create({ data: { nombre: 'COLABORADOR' } });

        const user = await fastify.prisma.usuario.create({
            data: {
                nombre,
                email,
                cedula,
                apellido: '',
                roles: { connect: { id: role.id } },
                auth: { create: { password: await bcrypt.hash(password, 10) } }
            }
        });

        return reply.code(201).send(user);
    });

    // --- DELETE ---
    fastify.delete('/:id', {
        schema: {
            description: 'Eliminar Colaborador',
            tags: ['Colaboradores'],
            params: { type: 'object', properties: { id: { type: 'number' } } },
            response: { 200: { type: 'object', properties: { message: { type: 'string' } } } }
        },
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { id } = request.params as any;
        await fastify.prisma.usuario.delete({ where: { id: Number(id) } });
        return { message: 'Colaborador eliminado' };
    });
};

export default colaboradoresRoutes;
