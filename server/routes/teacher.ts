import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  getTeacherDashboard,
  getTeacherHelpRequests,
  getSuggestedMatches,
  updateHelpRequestStatus,
  acceptSuggestedMatch,
  removeStudent,
} from '../db/teacher.ts';

export async function teacherRoutes(fastify: FastifyInstance) {
  
// Only accessed by authenticated teachers
  fastify.addHook('onRequest', authGuard('Teacher'));

  // Dashboard
  fastify.get('/teacher/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const dashboard = await getTeacherDashboard(client, teacherId);
      return reply.send(dashboard);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to load teacher dashboard' });
    } finally {
      client.release();
    }
  });

  // Help requests assigned to this teacher
  fastify.get('/teacher/help-requests', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const requests = await getTeacherHelpRequests(client, teacherId);
      return reply.send(requests);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch help requests' });
    } finally {
      client.release();
    }
  });

  // Suggested matches
  fastify.get('/teacher/suggested-matches', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const suggestions = await getSuggestedMatches(client, teacherId);
      return reply.send(suggestions);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch suggestions' });
    } finally {
      client.release();
    }
  });

  // Accept/Reject a help request
  fastify.put('/teacher/help-requests/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const requestId = Number((request.params as any).id);
    const { status } = request.body as { status: 'Accepted' | 'Rejected' };

    const client = await fastify.pg.connect();
    try {
      const updated = await updateHelpRequestStatus(client, teacherId, requestId, status);
      if (!updated) {
        return reply.code(400).send({ error: 'Could not update status (check if request is still pending)' });
      }
      return reply.send(updated);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Update failed' });
    } finally {
      client.release();
    }
  });

  // Accept a suggested match
  fastify.post('/teacher/suggested-matches/:id/accept', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const requestId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const accepted = await acceptSuggestedMatch(client, teacherId, requestId);
      if (!accepted) return reply.code(400).send({ error: 'Could not accept match' });
      return reply.send(accepted);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to accept match' });
    } finally {
      client.release();
    }
  });

  // Remove a student
  fastify.delete('/teacher/students/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const teacherId = request.user.id;
    const studentId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const removed = await removeStudent(client, teacherId, studentId);
      if (!removed) return reply.code(400).send({ error: 'Could not remove connection' });
      return reply.send({ success: true });
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Removal failed' });
    } finally {
      client.release();
    }
  });
}