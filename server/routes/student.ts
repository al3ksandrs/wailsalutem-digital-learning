import { FastifyInstance } from 'fastify';
import {
  getStudentDashboard,
  createHelpRequest,
  getStudentHelpRequests,
  updateHelpRequest,
  deleteHelpRequest,
} from '../db/student.js';

export async function studentRoutes(fastify: FastifyInstance) {
  // Dashboard counts
  fastify.get('/student/dashboard', async (request, reply) => {
    const studentId = Number((request.query as any).studentId);
    const client = await fastify.pg.connect();
    try {
      const data = await getStudentDashboard(client, studentId);
      reply.send(data);
    } finally {
      client.release();
    }
  });

  // Get all help requests
  fastify.get('/student/help-requests', async (request, reply) => {
    const studentId = Number((request.query as any).studentId);
    const client = await fastify.pg.connect();
    try {
      const data = await getStudentHelpRequests(client, studentId);
      reply.send(data);
    } finally {
      client.release();
    }
  });

  // Create a new help request
  fastify.post('/student/help-requests', async (request, reply) => {
    const body = request.body as any;
    const client = await fastify.pg.connect();
    try {
      const newRequest = await createHelpRequest(client, {
        studentId: body.studentId,
        subjectId: body.subjectId,
        description: body.description,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
      });
      reply.code(201).send(newRequest);
    } finally {
      client.release();
    }
  });

  // Update a help request
  fastify.put('/student/help-requests/:id', async (request, reply) => {
    const body = request.body as any;
    const requestId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const updated = await updateHelpRequest(client, {
        requestId,
        studentId: body.studentId,
        subjectId: body.subjectId,
        description: body.description,
        location: body.location,
        startTime: body.startTime,
        endTime: body.endTime,
      });
      if (!updated) {
        reply.code(400).send({ error: 'Cannot update request' });
        return;
      }
      reply.send(updated);
    } finally {
      client.release();
    }
  });

  // Delete a help request
  fastify.delete('/student/help-requests/:id', async (request, reply) => {
    const studentId = Number((request.query as any).studentId);
    const requestId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const deleted = await deleteHelpRequest(client, studentId, requestId);
      if (!deleted) {
        reply.code(400).send({ error: 'Cannot delete request' });
        return;
      }
      reply.send({ success: true });
    } finally {
      client.release();
    }
  });
}
