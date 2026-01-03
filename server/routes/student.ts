import { FastifyInstance } from 'fastify';
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

  // Dashboard counts
  fastify.get('/student/dashboard', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getStudentDashboard(client, studentId);
      return reply.send(data);
    } finally {
      client.release();
    }
  });

  // Pending requests
  fastify.get('/student/pending-requests', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getPendingRequests(client, studentId);
      return reply.send(data);
    } finally {
      client.release();
    }
  });

  // Matches (Accepted requests)
  fastify.get('/student/matches', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getMatches(client, studentId);
      return reply.send(data);
    } finally {
      client.release();
    }
  });

  // Connections (unique teachers)
  fastify.get('/student/connections', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const data = await getConnections(client, studentId);
      return reply.send(data);
    } finally {
      client.release();
    }
  });

  // My requests (optional filter by subject)
  fastify.get('/student/my-requests', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const subjectId = (request.query as any)?.subjectId;
    const client = await fastify.pg.connect();
    try {
      const data = await getMyRequests(client, studentId, subjectId ? Number(subjectId) : undefined);
      return reply.send(data);
    } finally {
      client.release();
    }
  });

  // Create a new help request
  fastify.post('/student/help-requests', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const body = request.body as any;
    const client = await fastify.pg.connect();
    try {
      const newRequest = await createHelpRequest(client, {
        studentId,
        subjectId: body.subjectId,
        description: body.description,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
      });
      return reply.code(201).send(newRequest);
    } finally {
      client.release();
    }
  });

  // Update a help request (only if Pending)
  fastify.put('/student/help-requests/:id', async (request, reply) => {
    await request.jwtVerify();
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
      if (!updated) return reply.code(400).send({ error: 'Cannot update request' });
      return reply.send(updated);
    } finally {
      client.release();
    }
  });

  // Delete a help request (only if Pending)
  fastify.delete('/student/help-requests/:id', async (request, reply) => {
    await request.jwtVerify();
    const studentId = request.user.id;
    const requestId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const deleted = await deleteHelpRequest(client, studentId, requestId);
      if (!deleted) return reply.code(400).send({ error: 'Cannot delete request' });
      return reply.send({ success: true });
    } finally {
      client.release();
    }
  });

}
