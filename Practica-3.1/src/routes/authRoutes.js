import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

async function authRoutes(fastify, options) {
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }, async (request, reply) => {
        const { username, password } = request.body;
        try {
            const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (existing.length > 0) {
                return reply.status(400).send({ 
                    error: 'El usuario ya existe' 
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
            reply.status(201).send({ 
                message: 'Usuario registrado exitosamente' 
            });
        } catch (error) {
            reply.status(500).send({ 
                error: 'Error al registrar el usuario',
                message: error.message
            });
        }
    });

    //LOGIN
    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }, async (request, reply) => {
        const { username, password } = request.body;
        try {
            const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (users.length === 0) {
                return reply.status(401).send({ 
                    error: 'Usuario no encontrado' 
                });
            }
            const user = users[0];

            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return reply.status(401).send({ 
                    error: 'Contraseña incorrecta' 
                });
            }
            const token = fastify.jwt.sign({ 
                id: user.id, 
                username: user.username, 
                role: user.role 
            }, {
                expiresIn: '1h'
            });

            reply.status(200).send({
                message: 'Usuario logueado exitosamente',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            })
        } catch (error) {
            reply.status(500).send({ 
                error: 'Error al iniciar sesión',
                message: error.message
            });
        }
    });
}   

export default authRoutes;
