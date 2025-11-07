import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

// route
fastify.get('/', async (request, reply) => {
  return { wrld: 'wrld' };
});

// runs the server on port 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();