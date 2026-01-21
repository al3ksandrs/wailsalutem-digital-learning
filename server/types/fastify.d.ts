import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      email: string;
      role: string;
      name: string;
      status: string;
    };
  }
}