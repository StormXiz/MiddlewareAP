import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod'; // Assuming we might want validation later, but for now just basic

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {

    // Register User
    fastify.post('/register', {
        schema: {
            description: 'Registrar un nuevo usuario en la plataforma',
            tags: ['Usuarios'],
            body: {
                type: 'object',
                required: ['nombre', 'apellido', 'email', 'password'],
                properties: {
                    nombre: { type: 'string' },
                    apellido: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    rol_nombre: { type: 'string', enum: ['ADMIN', 'EMPRENDEDOR', 'MENTOR', 'CLIENTE'] }
                }
            },
            response: {
                201: {
                    description: 'Usuario creado exitosamente',
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' },
                        email: { type: 'string' }
                    }
                },
                500: {
                    description: 'Error en el servidor',
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { nombre, apellido, email, password, rol_nombre } = request.body as any;

        try {
            // 1. Create User
            // Note: Transaction helps ensure Auth and User are created together
            const result = await fastify.prisma.$transaction(async (prisma) => {
                // Find Role
                const rol = await prisma.rol.findUnique({ where: { nombre: rol_nombre || 'EMPRENDEDOR' } });
                if (!rol) throw new Error('Rol no encontrado');

                const newUser = await prisma.usuario.create({
                    data: {
                        nombre,
                        apellido,
                        email,
                        roles: {
                            connect: { id: rol.id }
                        }
                    }
                });

                // 2. Create Auth Record (Hash password in real app!)
                await prisma.auth.create({
                    data: {
                        usuarioId: newUser.id,
                        password: password // TODO: Hash this!
                    }
                });

                return newUser;
            });

            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'No se pudo registrar el usuario' });
        }
    });

    // Login
    fastify.post('/login', {
        schema: {
            description: 'Iniciar sesión en la plataforma',
            tags: ['Usuarios'],
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
                    description: 'Inicio de sesión exitoso',
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                email: { type: 'string' },
                                roles: {
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
                        }
                    }
                },
                401: {
                    description: 'Credenciales inválidas',
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body as any;

        const user = await fastify.prisma.usuario.findUnique({
            where: { email },
            include: { auth: true, roles: true }
        });

        if (!user || !user.auth || user.auth.password !== password) {
            return reply.code(401).send({ error: 'Credenciales inválidas' });
        }

        // In a real app, generate JWT here
        return { token: 'dummy-jwt-token', user: { id: user.id, email: user.email, roles: user.roles } };
    });
};

export default userRoutes;
