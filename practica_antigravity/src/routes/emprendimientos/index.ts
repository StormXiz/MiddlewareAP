import { FastifyPluginAsync } from 'fastify';

const emprendimientoRoutes: FastifyPluginAsync = async (fastify, opts) => {

    // List Emprendimientos
    fastify.get('/', {
        schema: {
            description: 'Listar todos los emprendimientos, opcionalmente filtrados por categoría',
            tags: ['Emprendimientos'],
            querystring: {
                type: 'object',
                properties: {
                    categoria: { type: 'string', description: 'Nombre de la categoría' }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            nombre: { type: 'string' },
                            descripcion: { type: 'string' },
                            usuarioId: { type: 'number' },
                            categoriaId: { type: 'number' },
                            categoria: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    nombre: { type: 'string' }
                                }
                            },
                            usuario: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    apellido: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { categoria } = request.query as any;

        const where = categoria ? { categoria: { nombre: categoria } } : {};

        const emprendimientos = await fastify.prisma.emprendimiento.findMany({
            where,
            include: {
                categoria: true,
                usuario: {
                    select: { nombre: true, apellido: true }
                }
            }
        });

        return emprendimientos;
    });

    // Get One
    fastify.get('/:id', {
        schema: {
            description: 'Obtener un emprendimiento por su ID',
            tags: ['Emprendimientos'],
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
                        id: { type: 'number' },
                        nombre: { type: 'string' },
                        descripcion: { type: 'string' },
                        productos: { type: 'array', items: { type: 'object' } },
                        redesSociales: { type: 'object' },
                        categoria: { type: 'object' },
                        usuario: { type: 'object' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as any;

        const emprendimiento = await fastify.prisma.emprendimiento.findUnique({
            where: { id: Number(id) },
            include: {
                categoria: true,
                productos: true,
                redesSociales: true,
                usuario: { select: { nombre: true, apellido: true } }
            }
        });

        if (!emprendimiento) {
            return reply.code(404).send({ error: 'Emprendimiento no encontrado' });
        }

        return emprendimiento;
    });

    // Create New
    fastify.post('/', {
        schema: {
            description: 'Crear un nuevo emprendimiento',
            tags: ['Emprendimientos'],
            body: {
                type: 'object',
                required: ['nombre', 'usuarioId', 'categoriaId'],
                properties: {
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' },
                    usuarioId: { type: 'number' },
                    categoriaId: { type: 'number' }
                }
            },
            response: {
                201: {
                    description: 'Emprendimiento creado exitosamente',
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { nombre, descripcion, usuarioId, categoriaId } = request.body as any;

        try {
            const nuevo = await fastify.prisma.emprendimiento.create({
                data: {
                    nombre,
                    descripcion,
                    usuarioId: Number(usuarioId),
                    categoriaId: Number(categoriaId)
                }
            });
            return reply.code(201).send(nuevo);
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Error al crear emprendimiento' });
        }
    });
};

export default emprendimientoRoutes;
