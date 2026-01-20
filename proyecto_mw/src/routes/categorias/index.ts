import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../plugins/auth.js';

const categoriasRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Schema for creating a category
    const createCategoriaSchema = {
        description: 'Crear nueva categoría',
        tags: ['Categorias'],
        body: {
            type: 'object',
            required: ['nombre'],
            properties: {
                nombre: { type: 'string' },
                descripcion: { type: 'string' }
            }
        },
        response: {
            201: {
                description: 'Categoría creada',
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' }
                }
            }
        }
    };

    fastify.post('/', {
        schema: createCategoriaSchema,
        preHandler: [authenticate, authorize(['ADMIN'])]
    }, async (request, reply) => {
        const { nombre, descripcion } = request.body as any;
        const categoria = await fastify.prisma.categoria.create({
            data: { nombre, descripcion }
        });
        return reply.code(201).send(categoria);
    });

    // Schema for getting categories
    const getCategoriasSchema = {
        description: 'Obtener lista de categorías',
        tags: ['Categorias'],
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        nombre: { type: 'string' },
                        descripcion: { type: 'string' }
                    }
                }
            }
        }
    };

    fastify.get('/', { schema: getCategoriasSchema }, async (request, reply) => {
        const categorias = await fastify.prisma.categoria.findMany();
        return categorias;
    });
};

export default categoriasRoutes;
