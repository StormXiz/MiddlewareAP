import { FastifyPluginAsync } from 'fastify';

const mentoriasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    const createMentoriaSchema = {
        description: 'Solicitar/Programar nueva mentoría',
        tags: ['Mentorias'],
        body: {
            type: 'object',
            required: ['tema', 'fechaProgramada', 'tutorId', 'emprendimientoId'],
            properties: {
                tema: { type: 'string' },
                fechaProgramada: { type: 'string', format: 'date-time' },
                notas: { type: 'string' },
                tutorId: { type: 'number' },
                emprendimientoId: { type: 'number' }
            }
        },
        response: {
            201: {
                description: 'Mentoría programada',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    tema: { type: 'string' },
                    estado: { type: 'string' }
                }
            }
        }
    };

    fastify.post('/', { schema: createMentoriaSchema }, async (request, reply) => {
        const { tema, fechaProgramada, notas, tutorId, emprendimientoId } = request.body as any;

        const mentoria = await fastify.prisma.mentoria.create({
            data: {
                tema,
                fechaProgramada: new Date(fechaProgramada),
                notas,
                tutorId,
                emprendimientoId,
                estado: 'PROGRAMADA'
            }
        });

        return reply.code(201).send(mentoria);
    });

    const getMentoriasSchema = {
        description: 'Obtener lista de mentorías',
        tags: ['Mentorias'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        tema: { type: 'string' },
                        fechaProgramada: { type: 'string' },
                        estado: { type: 'string' },
                        tutor: { type: 'object', properties: { nombre: { type: 'string' } } },
                        emprendimiento: { type: 'object', properties: { nombre: { type: 'string' } } }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getMentoriasSchema }, async (request, reply) => {
        const mentorias = await fastify.prisma.mentoria.findMany({
            include: {
                tutor: { select: { nombre: true } },
                emprendimiento: { select: { nombre: true } }
            }
        });
        return mentorias;
    });
};

export default mentoriasRoutes;
