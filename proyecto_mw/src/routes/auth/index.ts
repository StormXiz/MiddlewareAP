import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const loginSchema = {
        description: 'Iniciar sesión y obtener token',
        tags: ['Auth'],
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
            }
        },
        response: {
            200: {
                description: 'Login exitoso',
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            email: { type: 'string' },
                            nombre: { type: 'string' },
                            roles: { type: 'array', items: { type: 'string' } }
                        }
                    }
                }
            },
            401: {
                description: 'Credenciales inválidas',
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    };

    fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
        const { email, password } = request.body as any;

        const user = await fastify.prisma.usuario.findUnique({
            where: { email },
            include: {
                auth: true,
                roles: true
            }
        });

        if (!user || !user.auth) {
            return reply.code(401).send({ message: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, user.auth.password);

        if (!isValid) {
            return reply.code(401).send({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, roles: user.roles.map(r => r.nombre) },
            process.env.JWT_SECRET || 'secret_key_change_me',
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                roles: user.roles.map(r => r.nombre)
            }
        };
    });

    // --- REGISTER ENDPOINT (Added by request) ---
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
            description: 'Registrar un nuevo usuario y obtener token',
            tags: ['Auth'],
            body: registerBodySchema,
            response: registerResponseSchema
        }
    }, async (request, reply) => {
        const { nombre, apellido, email, password, role, cedula } = request.body as any;

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

        let roleRecord = await fastify.prisma.rol.findUnique({ where: { nombre: role } });
        if (!roleRecord) {
            roleRecord = await fastify.prisma.rol.create({ data: { nombre: role } });
        }

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
                        password: await bcrypt.hash(password, 10)
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
};

export default authRoutes;
