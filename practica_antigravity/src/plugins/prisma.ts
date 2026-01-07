import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

// Declare augmentation for fastify instance
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = async (fastify, options) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    // Make prisma available through fastify.prisma
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
};

export default fp(prismaPlugin);
