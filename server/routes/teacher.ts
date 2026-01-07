import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  getTeacherDashboard,
  getTeacherHelpRequests,
  getSuggestedMatches,
  updateHelpRequestStatus,
  acceptSuggestedMatch,
  removeStudent,
} from '../db/teacher.ts';

export async function teacherRoutes(fastify: FastifyInstance) {
  const TEST_TEACHER_ID = 2;

  // Dashboard
  fastify.get('/teacher/dashboard', async (_request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const dashboard = await getTeacherDashboard(client, TEST_TEACHER_ID);
      return reply.send(dashboard);
    } finally {
      client.release();
    }
  });

  // Help requests assigned to this teacher
  fastify.get('/teacher/help-requests', async (_request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const requests = await getTeacherHelpRequests(client, TEST_TEACHER_ID);
      return reply.send(requests);
    } finally {
      client.release();
    }
  });

  // Suggested matches for this teacher
  fastify.get('/teacher/suggested-matches', async (_request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const suggestions = await getSuggestedMatches(client, TEST_TEACHER_ID);
      return reply.send(suggestions);
    } finally {
      client.release();
    }
  });

  // Update status of a help request (Accept / Reject)
  fastify.put('/teacher/help-requests/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const requestId = Number((request.params as any).id);
      const { status } = request.body as { status: 'Accepted' | 'Rejected' };
      const updated = await updateHelpRequestStatus(client, TEST_TEACHER_ID, requestId, status);

      if (!updated) return reply.code(400).send({ error: 'Cannot update help request' });
      return reply.send(updated);
    } finally {
      client.release();
    }
  });

  // Accept a suggested match
  fastify.post('/teacher/suggested-matches/:id/accept', async (request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const requestId = Number((request.params as any).id);
      const accepted = await acceptSuggestedMatch(client, TEST_TEACHER_ID, requestId);

      if (!accepted) return reply.code(400).send({ error: 'Cannot accept suggested match' });
      return reply.send(accepted);
    } finally {
      client.release();
    }
  });

  // Remove a student from teacher’s accepted requests
  fastify.delete('/teacher/students/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const studentId = Number((request.params as any).id);
      const removed = await removeStudent(client, TEST_TEACHER_ID, studentId);

      if (!removed) return reply.code(400).send({ error: 'Cannot remove student' });
      return reply.send({ success: true });
    } finally {
      client.release();
    }
  });
}
