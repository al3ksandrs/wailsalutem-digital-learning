import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

// 1. Load the .env file immediately
dotenv.config();

const fastify = Fastify({
  logger: true,
});

// 2. Register the Database Connection
// It reads the IP address from your .env file automatically
fastify.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

// Original route
fastify.get('/', async (request, reply) => {
  return { wrld: 'wrld' };
});

// 3. Test Database Connection Route
fastify.get('/db-check', async (request, reply) => {
  let client;

  try {
    // Get a client from the pool
    client = await fastify.pg.connect();
    
    // Run a query (shows Time and DB Version)
    const { rows } = await client.query('SELECT NOW() as time, version()');

    return { 
      status: 'Database Connected! ', 
      host: process.env.DB_HOST, // Shows you which IP it connected to
      time: rows[0].time,
      version: rows[0].version 
    };

  } catch (err) {
    request.log.error(err);
    
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

    return reply.code(500).send({ 
      status: 'Database Connection Failed', 
      error: errorMessage
    })

  } finally {
    // Release the client back to the pool so other requests can use it
    if (client) {
      client.release();
    }
  }
});

// Runs the server
const start = async () => {
  try {
    // host: '0.0.0.0' allows access from outside
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();