import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Esquema para registro de usuarios
    const registerBodySchema = {
        type: 'object',
        required: ['nombre', 'email', 'password', 'role', 'cedula'],
        properties: {
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            email: { type: 'string', format: 'email' },
            cedula: { type: 'string', minLength: 10 },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string' }
        }
    };

    const registerResponseSchema = {
        201: {
            description: 'Usuario creado exitosamente',
            type: 'object',
            properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                nombre: { type: 'string' },
                role: { type: 'string' },
                token: { type: 'string' }
            }
        },
        400: {
            description: 'Error de validación o usuario existente',
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    };

    fastify.post('/register', {
        schema: {
            description: 'Registrar un nuevo usuario',
            tags: ['Usuarios'],
            body: registerBodySchema,
            response: registerResponseSchema
        }
    }, async (request, reply) => {
        const { nombre, apellido, email, password, role, cedula } = request.body as any;

        // Verificar si el usuario ya existe
        const existingUser = await fastify.prisma.usuario.findFirst({
            where: {
                OR: [
                    { email },
                    { cedula }
                ]
            }
        });

        if (existingUser) {
            return reply.code(400).send({ message: 'El usuario ya existe (email o cédula duplicada)' });
        }

        // Buscar o crear el rol
        let roleRecord = await fastify.prisma.rol.findUnique({ where: { nombre: role } });
        if (!roleRecord) {
            // En un sistema real, los roles deberían preexistir (seed), pero aquí los creamos on-demand si no existen
            roleRecord = await fastify.prisma.rol.create({ data: { nombre: role } });
        }

        // Crear usuario
        const usage = await fastify.prisma.usuario.create({
            data: {
                nombre,
                apellido: apellido || '',
                email,
                cedula,
                roles: {
                    connect: { id: roleRecord.id }
                },
                auth: {
                    create: {
                        password: await bcrypt.hash(password, 10) // Hash password
                    }
                }
            },
            include: {
                roles: true
            }
        });

        const token = jwt.sign(
            { id: usage.id, email: usage.email, roles: usage.roles.map(r => r.nombre) },
            process.env.JWT_SECRET || 'secret_key_change_me',
            { expiresIn: '24h' }
        );

        return reply.code(201).send({
            id: usage.id,
            email: usage.email,
            nombre: usage.nombre,
            role: roleRecord.nombre,
            token
        });
    });

    // Get users example
    fastify.get('/', {
        schema: {
            description: 'Obtener lista de usuarios',
            tags: ['Usuarios'],
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            email: { type: 'string' },
                            nombre: { type: 'string' }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const users = await fastify.prisma.usuario.findMany();
        return users;
    });

    fastify.delete('/:id', {
        schema: {
            description: 'Eliminar usuario',
            tags: ['Usuarios'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as any;
        await fastify.prisma.usuario.delete({
            where: { id: Number(id) }
        });
        return { message: 'Usuario eliminado' };
    });
};

export default userRoutes;
