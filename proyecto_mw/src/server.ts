import { buildApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
    const app = await buildApp();
    try {
        const port = Number(process.env.PORT) || 3001;
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`ABRE ESTE HOST: http://localhost:${port}/documentation`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
