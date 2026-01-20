import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../plugins/auth.js';

const emprendimientosRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const createEmprendimientoSchema = {
        description: 'Registrar nuevo emprendimiento',
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
                description: 'Emprendimiento registrado',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    nombre: { type: 'string' },
                    estado: { type: 'string' }
                }
            }
        }
    };

    fastify.post('/', {
        schema: createEmprendimientoSchema,
        preHandler: [authenticate, authorize(['EMPRENDEDOR', 'ADMIN'])]
    }, async (request, reply) => {
        const { nombre, descripcion, usuarioId, categoriaId } = request.body as any;

        const emprendimiento = await fastify.prisma.emprendimiento.create({
            data: {
                nombre,
                descripcion,
                usuarioId,
                categoriaId,
                estado: 'EN_REVISION'
            }
        });

        return reply.code(201).send(emprendimiento);
    });

    const getEmprendimientosSchema = {
        description: 'Obtener emprendimientos',
        tags: ['Emprendimientos'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' },
                        descripcion: { type: 'string' },
                        estado: { type: 'string' },
                        usuario: {
                            type: 'object',
                            properties: {
                                nombre: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getEmprendimientosSchema }, async (request, reply) => {
        const emprendimientos = await fastify.prisma.emprendimiento.findMany({
            include: {
                usuario: {
                    select: { nombre: true, email: true }
                },
                categoria: true
            }
        });
        return emprendimientos;
    });

    fastify.delete('/:id', {
        schema: {
            description: 'Eliminar emprendimiento',
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
                        message: { type: 'string' }
                    }
                }
            }
        },
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { id } = request.params as any;
        await fastify.prisma.emprendimiento.delete({
            where: { id: Number(id) }
        });
        return { message: 'Emprendimiento eliminado' };
    });
};

export default emprendimientosRoutes;
