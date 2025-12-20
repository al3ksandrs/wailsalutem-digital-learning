import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { studentRoutes } from './routes/student.js'; // Import student routes

dotenv.config();

export const buildServer = () => {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  // Register Postgres plugin
  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });

  // Root endpoint
  fastify.get('/', async (request, reply) => {
    return { wrld: 'wrld' };
  });

  // DB check endpoint
  fastify.get('/db-check', async (request, reply) => {
    let client;
    try {
      client = await fastify.pg.connect();
      const { rows } = await client.query('SELECT NOW() as time, version()');
      return { 
        status: 'Database Connected!', 
        host: process.env.DB_HOST,
        time: rows[0].time,
        version: rows[0].version 
      };
    } catch (err) {
      (request.log || console).error(err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return reply.code(500).send({ status: 'Database Connection Failed', error: errorMessage });
    } finally {
      if (client) client.release();
    }
  });

  // Register Student routes
  studentRoutes(fastify);

  return fastify;
};

/* istanbul ignore next */
const start = async () => {
  const server = buildServer();
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on port 3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// If run directly, start server
/* istanbul ignore next */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start();
}
