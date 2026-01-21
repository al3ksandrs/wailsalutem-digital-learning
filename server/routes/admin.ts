import { FastifyInstance } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getDashboardStats,
  getPendingTeachers,
  getOpenHelpRequests,
  assignTeacherToRequest,
  getAcceptedMatches,
  createManualMatch,
  unassignTeacher
} from '../db/admin.ts';

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard('Admin'));

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

  // Gets dashboard stats
  fastify.get('/admin/stats', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const stats = await getDashboardStats(client);
      return reply.send(stats);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch dashboard stats', details: err.message });
    } finally {
      client.release();
    }
  });

  // Gets pending teachers
  fastify.get('/admin/teachers/pending', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const teachers = await getPendingTeachers(client);
      return reply.send(teachers);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch pending teachers', details: err.message });
    } finally {
      client.release();
    }
  });

  // Verifies teacher
  fastify.post('/admin/teachers/:id/verify', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const userId = Number((request.params as { id: string }).id);
      const updated = await updateUserStatus(client, userId, 'Active');
      if (!updated) return reply.code(404).send({ error: 'Teacher not found' });
      return reply.send({ message: 'Teacher verified successfully', user: updated });
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to verify teacher', details: err.message });
    } finally {
      client.release();
    }
  });

  // Gets open help requests
  fastify.get('/admin/requests/open', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const requests = await getOpenHelpRequests(client);
      return reply.send(requests);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch open requests', details: err.message });
    } finally {
      client.release();
    }
  });

  // Assigns teacher to request
  fastify.post('/admin/requests/:id/assign', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const requestId = Number((request.params as { id: string }).id);
      const { teacherId } = request.body as { teacherId: number };

      const updated = await assignTeacherToRequest(client, requestId, teacherId);
      if (!updated) return reply.code(404).send({ error: 'Request not found' });

      return reply.send(updated);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to assign teacher', details: err.message });
    } finally {
      client.release();
    }
  });

  // Gets all accepted matches
  fastify.get('/admin/matches', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const matches = await getAcceptedMatches(client);
      return reply.send(matches);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch matches', details: err.message });
    } finally {
      client.release();
    }
  });

  // Creates a manual match
  fastify.post('/admin/matches', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { studentId, teacherId, subjectId } = request.body as { studentId: number; teacherId: number; subjectId: number };
      
      if (!studentId || !teacherId || !subjectId) {
        return reply.code(400).send({ error: 'Missing required fields (studentId, teacherId, subjectId)' });
      }

      const newMatch = await createManualMatch(client, { studentId, teacherId, subjectId });
      return reply.code(201).send(newMatch);
    } catch (err: any) {
      if (err.message === 'DUPLICATE_MATCH') {
        return reply.code(409).send({ error: 'This match already exists.' });
      }
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to create match', details: err.message });
    } finally {
      client.release();
    }
  });

  // Unassigns teacher (Deletes match)
  fastify.delete('/admin/matches/:id', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const requestId = Number((request.params as { id: string }).id);
      const updated = await unassignTeacher(client, requestId);
      if (!updated) return reply.code(404).send({ error: 'Match not found' });
      return reply.send(updated);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to unassign teacher', details: err.message });
    } finally {
      client.release();
    }
  });
}