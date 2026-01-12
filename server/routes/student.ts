import { FastifyInstance } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  getStudentDashboard,
  getPendingRequests,
  getMatches,
  getConnections,
  getMyRequests,
  createHelpRequest,
  updateHelpRequest,
  deleteHelpRequest,
} from '../db/student.ts';

export async function studentRoutes(fastify: FastifyInstance) {

  fastify.addHook('onRequest', authGuard('Student'));

  // Dashboard
  fastify.get('/student/dashboard', async (request, reply) => {
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getStudentDashboard(client, studentId);
      return reply.send(data);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to load dashboard' });
    } finally {
      client.release();
    }
  });

  // Pending requests
  fastify.get('/student/pending-requests', async (request, reply) => {
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getPendingRequests(client, studentId);
      return reply.send(data);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch pending requests' });
    } finally {
      client.release();
    }
  });

  // Matches
  fastify.get('/student/matches', async (request, reply) => {
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getMatches(client, studentId);
      return reply.send(data);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch matches' });
    } finally {
      client.release();
    }
  });

  // Connections = unique teachers from accepted help requests
  fastify.get('/student/connections', async (request, reply) => {
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getConnections(client, studentId);
      return reply.send(data);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch connections' });
    } finally {
      client.release();
    }
  });

  // My requests, optionally filtered by subject
  fastify.get('/student/my-requests', async (request, reply) => {
    const studentId = request.user.id;
    const subjectId = (request.query as any)?.subjectId
      ? Number((request.query as any).subjectId)
      : undefined;
    const client = await fastify.pg.connect();
    try {
      const data = await getMyRequests(client, studentId, subjectId);
      return reply.send(data);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch requests' });
    } finally {
      client.release();
    }
  });

  // Create a new help request
  fastify.post('/student/help-requests', async (request, reply) => {
    const studentId = request.user.id;
    const body = request.body as any;

    if (!body.subjectId || !body.description) {
      return reply.code(400).send({ error: 'Subject and description are required' });
    }

    const client = await fastify.pg.connect();
    try {
      const newRequest = await createHelpRequest(client, {
        studentId,
        subjectId: body.subjectId,
        description: body.description,
        location: body.location || 'Online',
        startTime: body.startTime,
        endTime: body.endTime,
      });
      return reply.code(201).send(newRequest);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to create help request' });
    } finally {
      client.release();
    }
  });

  // Update a help request
  fastify.put('/student/help-requests/:id', async (request, reply) => {
    const studentId = request.user.id;
    const requestId = Number((request.params as any).id);
    const body = request.body as any;
    const client = await fastify.pg.connect();
    try {
      const updated = await updateHelpRequest(client, {
        requestId,
        studentId,
        subjectId: body.subjectId,
        description: body.description,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
      });
      if (!updated) return reply.code(404).send({ error: 'Request not found or not editable' });
      return reply.send(updated);
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Update failed' });
    } finally {
      client.release();
    }
  });

  // Delete a help request
  fastify.delete('/student/help-requests/:id', async (request, reply) => {
    const studentId = request.user.id;
    const requestId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const deleted = await deleteHelpRequest(client, studentId, requestId);
      if (!deleted) return reply.code(404).send({ error: 'Request not found' });
      return reply.send({ success: true, message: 'Request deleted' });
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Deletion failed' });
    } finally {
      client.release();
    }
  });
}
