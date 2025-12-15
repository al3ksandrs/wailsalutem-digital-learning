import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // Import this helper

dotenv.config();

export const buildServer = () => {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });

  fastify.get('/', async (request, reply) => {
    return { wrld: 'wrld' };
  });

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
      request.log ? request.log.error(err) : console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return reply.code(500).send({ status: 'Database Connection Failed', error: errorMessage });
    } finally {
      if (client) client.release();
    }
  });

  return fastify;
};

const start = async () => {
  const server = buildServer();
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`server listening on port 3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// FIX: This works in "type": "module" projects
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start();
}