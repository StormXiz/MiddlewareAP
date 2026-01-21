import dotenv from 'dotenv';
import fastify from 'fastify';
dotenv.config();

//habilita los logs automaticamnete
const app = fastify({
    logger: true
});

//plugins


//Rutas

//Configuracion a la base de datos
import testConnection from './config/database.js';

async function startServer() {
    try {
        await testConnection();
        await app.listen({
            port: process.env.PORT || 3000,
            host: '0.0.0.0'
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
