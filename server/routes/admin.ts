import { FastifyInstance } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../db/admin.ts';

export async function adminRoutes(fastify: FastifyInstance) {
  
  fastify.addHook('onRequest', authGuard('Admin'));

  // Get all users
  fastify.get('/admin/users', async (request, reply) => {
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

  // Get single user by ID
  fastify.get('/admin/users/:id', async (request, reply) => {
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

  // Create user
  fastify.post('/admin/users', async (request, reply) => {
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

  // Update user
  fastify.put('/admin/users/:id', async (request, reply) => {
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

  // Delete user
  fastify.delete('/admin/users/:id', async (request, reply) => {
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

  // Update user status
  fastify.patch('/admin/users/:id/status', async (request, reply) => {
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