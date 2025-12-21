import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: number;
      email: string;
      role: string;
      name: string;
    };
    user: {
      id: number;
      email: string;
      role: string;
      name: string;
    };
  }
}