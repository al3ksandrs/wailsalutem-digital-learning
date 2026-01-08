import { FastifyInstance } from 'fastify';
import { authGuard } from '../plugins/authguard.ts';
import {
  sendMessage,
  getConversation,
  getInbox,
} from '../db/message.ts';

export async function messageRoutes(fastify: FastifyInstance) {
  
  fastify.addHook('onRequest', authGuard());

  // Inbox
  fastify.get('/messages/inbox', async (request, reply) => {
    const userId = request.user.id;
    const client = await fastify.pg.connect();
    try {
      const inbox = await getInbox(client, userId);
      return reply.send(inbox);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch inbox' });
    } finally {
      client.release();
    }
  });

  // Conversation between 2 users
  fastify.get('/messages/:userId', async (request, reply) => {
    const userId = request.user.id;
    const otherUserId = Number((request.params as any).userId);
    const client = await fastify.pg.connect();
    try {
      const messages = await getConversation(client, userId, otherUserId);
      return reply.send(messages);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch conversation' });
    } finally {
      client.release();
    }
  });

  // Send message
  fastify.post('/messages', async (request, reply) => {
    const senderId = request.user.id; 
    const body = request.body as any;
    
    // Basic validation to check if message has content
    if (!body.content || body.content.trim() === '') {
      return reply.code(400).send({ error: 'Message content cannot be empty' });
    }

    const client = await fastify.pg.connect();
    try {
      const message = await sendMessage(client, {
        senderId,
        receiverId: body.receiverId,
        content: body.content,
        attachments: body.attachments,
      });
      return reply.code(201).send(message);
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to send message' });
    } finally {
      client.release();
    }
  });
}