import { FastifyPluginAsync } from 'fastify';

const resenasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const createResenaSchema = {
        description: 'Crear nueva reseña',
        tags: ['Resenas'],
        body: {
            type: 'object',
            required: ['calificacion', 'usuarioId', 'emprendimientoId'],
            properties: {
                calificacion: { type: 'number', minimum: 1, maximum: 5 },
                comentario: { type: 'string' },
                usuarioId: { type: 'number' },
                emprendimientoId: { type: 'number' }
            }
        },
        response: {
            201: {
                description: 'Reseña creada',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    calificacion: { type: 'number' }
                }
            }
        }
    };

    fastify.post('/', { schema: createResenaSchema }, async (request, reply) => {
        const { calificacion, comentario, usuarioId, emprendimientoId } = request.body as any;

        const resena = await fastify.prisma.resena.create({
            data: {
                calificacion,
                comentario,
                usuarioId,
                emprendimientoId
            }
        });

        return reply.code(201).send(resena);
    });

    const getResenasSchema = {
        description: 'Obtener reseñas',
        tags: ['Resenas'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        calificacion: { type: 'number' },
                        comentario: { type: 'string' },
                        usuario: { type: 'object', properties: { nombre: { type: 'string' } } },
                        emprendimiento: { type: 'object', properties: { nombre: { type: 'string' } } }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getResenasSchema }, async (request, reply) => {
        const resenas = await fastify.prisma.resena.findMany({
            include: {
                usuario: { select: { nombre: true } },
                emprendimiento: { select: { nombre: true } }
            }
        });
        return resenas;
    });
};

export default resenasRoutes;
