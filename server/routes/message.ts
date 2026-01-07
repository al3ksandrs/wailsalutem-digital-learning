import { FastifyInstance } from 'fastify';
import {
  sendMessage,
  getConversation,
  getInbox,
} from '../db/message.ts';

export async function messageRoutes(fastify: FastifyInstance) {

  // Inbox
  fastify.get('/messages/inbox', async (request, reply) => {
    await request.jwtVerify();
    const userId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const inbox = await getInbox(client, userId);
      return reply.send(inbox);
    } finally {
      client.release();
    }
  });

  // Conversation between 2 users
  fastify.get('/messages/:userId', async (request, reply) => {
    await request.jwtVerify();
    const userId = request.user.id;
    const otherUserId = Number((request.params as any).userId);
    const client = await fastify.pg.connect();
    try {
      const messages = await getConversation(client, userId, otherUserId);
      return reply.send(messages);
    } finally {
      client.release();
    }
  });

  // Send message
  fastify.post('/messages', async (request, reply) => {
    await request.jwtVerify();
    const senderId = request.user.id;
    const body = request.body as any;
    const client = await fastify.pg.connect();
    try {
      const message = await sendMessage(client, {
        senderId,
        receiverId: body.receiverId,
        content: body.content,
        attachments: body.attachments,
      });
      return reply.code(201).send(message);
    } finally {
      client.release();
    }
  });

}
