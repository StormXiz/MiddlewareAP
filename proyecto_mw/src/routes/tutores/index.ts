import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { authenticate, authorize } from '../../plugins/auth.js';

const tutoresRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // --- GET LIST ---
    const getTutoresSchema = {
        description: 'Listar tutores (Usuarios con rol MENTOR)',
        tags: ['Tutores'],
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

    fastify.get('/', { schema: getTutoresSchema }, async (request, reply) => {
        const tutores = await fastify.prisma.usuario.findMany({
            where: {
                roles: {
                    some: {
                        nombre: 'MENTOR'
                    }
                }
            },
            include: {
                roles: true
            }
        });
        return tutores;
    });

    // --- POST CREATE ---
    const createTutorSchema = {
        description: 'Registrar nuevo Tutor (MENTOR)',
        tags: ['Tutores'],
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
                description: 'Tutor creado',
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
        schema: createTutorSchema,
        preHandler: [authenticate, authorize(['ADMIN'])] // Only Admin can create Tutors directly here
    }, async (request, reply) => {
        const { nombre, email, password, cedula } = request.body as any;

        // Check exists
        const exists = await fastify.prisma.usuario.findFirst({ where: { OR: [{ email }, { cedula }] } });
        if (exists) return reply.code(400).send({ message: 'Usuario ya existe' });

        // Ensure role exists
        let role = await fastify.prisma.rol.findUnique({ where: { nombre: 'MENTOR' } });
        if (!role) role = await fastify.prisma.rol.create({ data: { nombre: 'MENTOR' } });

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
            description: 'Eliminar Tutor',
            tags: ['Tutores'],
            params: { type: 'object', properties: { id: { type: 'number' } } },
            response: { 200: { type: 'object', properties: { message: { type: 'string' } } } }
        },
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { id } = request.params as any;
        await fastify.prisma.usuario.delete({ where: { id: Number(id) } }); // Cascade delete handles relations
        return { message: 'Tutor eliminado' };
    });
};

export default tutoresRoutes;
