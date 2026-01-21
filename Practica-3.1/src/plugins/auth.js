import fp from '@fastify/plugin';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
dotenv.config();

async function authPlugin(fastify, options) {
    fastify.register(jwt, {
        secret: process.env.JWT_SECRET
    });

    // AUTHENTICAR

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.status(401).send({
                error: 'Unauthorized',
                message: 'Token invalido'
            });
        }
    })

    // DEPURADOR PARA SABER SI EL USUARIO ES ADMIN VE

        FastifyError.decorate('requireAdmin', async function (request, reply) {
            try {
                const user = request.user;
                if (user.role !== 'admin') {
                    reply.status(403).send({
                        error: 'Forbidden',
                        message: 'No tienes permiso para acceder a este recurso'
                    });
                }
            } catch (error) {
                reply.status(401).send({
                    error: 'Unauthorized',
                    message: 'Token invalido'
                });
            }
        })
}

export default fp(authPlugin);