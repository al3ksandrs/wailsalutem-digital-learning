import { FastifyInstance } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
} from '../db/subject.ts';

export async function subjectRoutes(fastify: FastifyInstance) {

  // Get subjects
  fastify.get('/subjects', async (_request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const subjects = await getAllSubjects(client);
      return reply.send(subjects);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch subjects' });
    } finally {
      client.release();
    }
  });

  // Get one subject
  fastify.get('/subjects/:id', async (request, reply) => {
    const subjectId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const subject = await getSubjectById(client, subjectId);
      if (!subject) return reply.code(404).send({ error: 'Subject not found' });
      return reply.send(subject);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch subject' });
    } finally {
      client.release();
    }
  });

  // Add subject by admin
  fastify.post('/subjects', { 
    preHandler: (req, rep, done) => {
      authGuard('Admin')(req, rep)
        .then(() => done())
        .catch((err) => done(err));
    } 
  }, async (request, reply) => {
    const { name } = request.body as any;
    if (!name) return reply.code(400).send({ error: 'Subject name is required' });

    const client = await fastify.pg.connect();
    try {
      const subject = await createSubject(client, name);
      return reply.code(201).send(subject);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create subject' });
    } finally {
      client.release();
    }
  });

  // Delete subject by admin
  fastify.delete('/subjects/:id', { 
    preHandler: (req, rep, done) => {
      authGuard('Admin')(req, rep)
        .then(() => done())
        .catch((err) => done(err));
    } 
  }, async (request, reply) => {
    const subjectId = Number((request.params as any).id);
    const client = await fastify.pg.connect();
    try {
      const success = await deleteSubject(client, subjectId);
      if (!success) {
        return reply.code(400).send({ error: 'Subject not found or cannot be deleted (check dependencies)' });
      }
      return reply.send({ success: true });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Deletion failed. Subject might be linked to help requests.' });
    } finally {
      client.release();
    }
  });
}