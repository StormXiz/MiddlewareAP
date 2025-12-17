import Fastify from "fastify";
import { calculatorRoutes } from "./routes/calculator.routes";
import { setupSwagger } from "./swagger";

const fastify = Fastify({
  logger: true,
});

// Ruta base
fastify.get("/", async () => {
  return { message: "MCP Server corriendo" };
});

// Rutas del calculator
fastify.register(calculatorRoutes);

// Iniciar servidor
const start = async () => {
  try {
    await setupSwagger(fastify); // ✅ aquí sí se puede usar await

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Servidor corriendo en http://localhost:3000");
    console.log("Swagger UI en http://localhost:3000/docs");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
