import { FastifyPluginAsync } from 'fastify';

const emprendimientoRoutes: FastifyPluginAsync = async (fastify, opts) => {

    // List Emprendimientos
    fastify.get('/', async (request, reply) => {
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
    fastify.get('/:id', async (request, reply) => {
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
    fastify.post('/', async (request, reply) => {
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
