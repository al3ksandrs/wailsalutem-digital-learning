// server/routes/admin.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../db/admin.ts';

async function ensureAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    const user = request.user as { role: string };
    if (user.role !== 'Admin') {
      reply.code(403).send({ error: 'Forbidden' });
    }
  } catch (err) {
    request.log.error(err);
    reply.code(401).send({ error: 'Not authenticated' });
  }
}


export async function adminRoutes(fastify: FastifyInstance) {
  // GET all users
  fastify.get('/admin/users', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const role = (request.query as { role?: string })?.role;
      const users = await getAllUsers(client, role);
      return reply.send(users);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch users', details: err.message });
    } finally {
      client.release();
    }
  });

  // GET single user by ID
  fastify.get('/admin/users/:id', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const userId = Number((request.params as { id: string }).id);
      const user = await getUserById(client, userId);
      if (!user) return reply.code(404).send({ error: 'User not found' });
      return reply.send(user);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch user', details: err.message });
    } finally {
      client.release();
    }
  });

  // POST create user
  fastify.post('/admin/users', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const body = request.body as { name: string; email: string; password: string; role: string };
      const newUser = await createUser(client, body);
      return reply.code(201).send(newUser);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to create user', details: err.message });
    } finally {
      client.release();
    }
  });

  // PUT update user
  fastify.put('/admin/users/:id', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const userId = Number((request.params as { id: string }).id);
      const body = request.body as { name?: string; email?: string; role?: string; status?: string };
      const updated = await updateUser(client, userId, body);
      if (!updated) return reply.code(400).send({ error: 'Nothing to update or user not found' });
      return reply.send(updated);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to update user', details: err.message });
    } finally {
      client.release();
    }
  });

  // DELETE user
  fastify.delete('/admin/users/:id', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const userId = Number((request.params as { id: string }).id);
      const success = await deleteUser(client, userId);
      if (!success) return reply.code(400).send({ error: 'User not found or could not be deleted' });
      return reply.send({ success: true });
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to delete user', details: err.message });
    } finally {
      client.release();
    }
  });

  // PATCH update user status
  fastify.patch('/admin/users/:id/status', { preHandler: ensureAdmin }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const userId = Number((request.params as { id: string }).id);
      const { status } = request.body as { status: string };
      const updated = await updateUserStatus(client, userId, status);
      if (!updated) return reply.code(400).send({ error: 'Could not update status' });
      return reply.send(updated);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to update user status', details: err.message });
    } finally {
      client.release();
    }
  });
}
