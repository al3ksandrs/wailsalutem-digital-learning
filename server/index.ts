import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.ts';
import { studentRoutes } from './routes/student.js';

dotenv.config();

const PORT = 3000;
const DB_CHECK_ERROR_CODE = 500;

export const buildServer = () => {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  // Zod validation
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // CORS
  fastify.register(fastifyCors, {
    origin: 'http://localhost:5173', // Frontend localhost URL, will need to add frontend VPS origin here later
    credentials: true,
  });

  // JWT
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret', // will probably need to change this in the future to something more unique?
    cookie: {
      cookieName: 'token',
      signed: false, // JWT is already signed
    },
  });

  // Register Postgres plugin
  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'anothersupersecret', // For signing cookies
    hook: 'onRequest',
  });

  fastify.register(authRoutes, { prefix: '/api/auth' });

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
      return reply.code(DB_CHECK_ERROR_CODE).send({ status: 'Database Connection Failed', error: errorMessage });
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
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
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
