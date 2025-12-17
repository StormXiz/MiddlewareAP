import type { FastifyInstance } from "fastify";
import path from "path";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export async function setupSwagger(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    mode: "static",
    specification: {
      path: path.join(process.cwd(), "docs", "openapi.yaml"),
      baseDir: process.cwd(),
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
  });
}
