import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

export interface UserPayload {
    id: number;
    email: string;
    roles: string[];
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: UserPayload;
    }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return reply.code(401).send({ message: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me') as UserPayload;
        request.user = decoded;
    } catch (err) {
        return reply.code(401).send({ message: 'Token inválido o expirado' });
    }
};

export const authorize = (allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const userRoles = request.user?.roles || [];
        // Check direct match
        let hasRole = userRoles.some(role => allowedRoles.includes(role));

        // Map synonyms for checking: ESTUDIANTE -> EMPRENDEDOR, TUTOR -> MENTOR
        if (!hasRole) {
            const effectiveRoles = userRoles.map(r => {
                if (r === 'ESTUDIANTE') return 'EMPRENDEDOR';
                if (r === 'TUTOR') return 'MENTOR';
                return r;
            });
            hasRole = effectiveRoles.some(role => allowedRoles.includes(role));
        }

        if (!hasRole) {
            return reply.code(403).send({ message: `Acceso denegado. Requiere uno de los roles: ${allowedRoles.join(', ')}` });
        }
    };
};
