import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

// Load the .env file 
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

//Test Database Connection
fastify.get('/db-check', async (request, reply) => {
  let client;

  try {
    client = await fastify.pg.connect();
    const { rows } = await client.query('SELECT NOW() as time, version()');

    return { 
      status: 'Database Connected!', 
      time: rows[0].time,
      version: rows[0].version 
    };

} catch (err) {
    request.log.error(err);
    
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

    return reply.code(500).send({ 
      status: 'Database Connection Failed', 
      error: errorMessage
    });

  } finally {
    if (client) {
      client.release();
    }
  }
});

// Runs the server
const start = async () => {
  try {
    //host: '0.0.0.0' is important for Docker/VPS
    //this tells the server to listen on all available network interfaces.
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();