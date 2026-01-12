import 'fastify';
import { PoolClient } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    pg: {
      connect(): Promise<PoolClient>;
    };
  }
}