import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

// 1. Load the .env file immediately
dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register the Database Connection
fastify.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

// Original route
fastify.get('/', async (request, reply) => {
  return { wrld: 'wrld' };
});

// New Route: Test Database Connection
fastify.get('/db-check', async (request, reply) => {
  const client = await fastify.pg.connect();
  
  try {
    const { rows } = await client.query('SELECT NOW() as time, version()');
    return { 
      status: 'Database Connected!', 
      time: rows[0].time,
      version: rows[0].version 
    };
  } finally {
    client.release();
  }
});

// Runs the server
const start = async () => {
  try {
    // Note: host: '0.0.0.0' is important for Docker/VPS later
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();