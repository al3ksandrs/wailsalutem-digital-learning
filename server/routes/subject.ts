import { FastifyInstance } from 'fastify';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
} from '../db/subject.ts';

export async function subjectRoutes(fastify: FastifyInstance) {

  // all subjects
  fastify.get('/subjects', async (_request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const subjects = await getAllSubjects(client);
      return reply.send(subjects);
    } finally {
      client.release();
    }
  });

  // one subject
  fastify.get('/subjects/:id', async (request, reply) => {
    const subjectId = Number((request.params as any).id);
    const client = await fastify.pg.connect();

    try {
      const subject = await getSubjectById(client, subjectId);
      if (!subject) return reply.code(404).send({ error: 'Subject not found' });
      return reply.send(subject);
    } finally {
      client.release();
    }
  });

  // add subject
  fastify.post('/subjects', async (request, reply) => {
    const { name } = request.body as any;
    const client = await fastify.pg.connect();

    try {
      const subject = await createSubject(client, name);
      return reply.code(201).send(subject);
    } finally {
      client.release();
    }
  });

  // delete subject 
  fastify.delete('/subjects/:id', async (request, reply) => {
    const subjectId = Number((request.params as any).id);
    const client = await fastify.pg.connect();

    try {
      const success = await deleteSubject(client, subjectId);
      if (!success) {
        return reply.code(400).send({ error: 'Could not delete subject' });
      }
      return reply.send({ success: true });
    } finally {
      client.release();
    }
  });
}
