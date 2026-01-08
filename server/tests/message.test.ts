import { describe, test, expect, beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;

const mockQuery = jest.fn<(...args: any[]) => Promise<any>>();
const mockRelease = jest.fn();
const mockConnect = jest.fn<() => Promise<any>>();

jest.unstable_mockModule('@fastify/postgres', () => ({
  default: Object.assign(
    async (fastify: any) => {
      fastify.decorate('pg', {
        connect: mockConnect,
      });
    },
    { [Symbol.for('skip-override')]: true }
  )
}));

// Mock authGuard to always authenticated user
jest.unstable_mockModule('../plugins/authguard.ts', () => ({
  authGuard: () => async (request: any) => {
    request.user = {
      id: 1,
      email: 'user@test.com',
      role: 'Student',
      name: 'Test User',
      status: 'Approved'
    };
  }
}));

const { buildServer } = await import('../index.ts');
const messageDB = await import('../db/message.ts');

describe('Message Module', () => {
  let app: FastifyInstance;

  const mockClient = {
    query: mockQuery,
    release: mockRelease
  } as unknown as PoolClient;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue(mockClient);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DB Layer (server/db/message.ts)', () => {
    test('sendMessage inserts and returns message', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 1,
          content: 'Hello',
          sender_id: 1,
          receiver_id: 2
        }]
      });

      const result = await messageDB.sendMessage(mockClient, {
        senderId: 1,
        receiverId: 2,
        content: 'Hello'
      });

      expect(result.content).toBe('Hello');
      expect(mockQuery).toHaveBeenCalled();
    });

    test('getConversation returns messages ordered by timestamp', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { content: 'Hi' },
          { content: 'Hello' }
        ]
      });

      const result = await messageDB.getConversation(mockClient, 1, 2);
      expect(result).toHaveLength(2);
    });

    test('getInbox returns inbox list', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: 2, name: 'Other User' }]
      });

      const result = await messageDB.getInbox(mockClient, 1);
      expect(result[0].user_id).toBe(2);
    });
  });

  describe('Routes Layer (server/routes/message.ts)', () => {
    test('GET /messages/inbox', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: 2, name: 'Other User' }]
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/messages/inbox'
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toHaveLength(1);
    });

    test('GET /messages/:userId', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ content: 'Hi' }]
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/messages/2'
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()[0].content).toBe('Hi');
    });

    test('POST /messages sends message', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ content: 'Hello', receiver_id: 2 }]
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/messages',
        payload: {
          receiverId: 2,
          content: 'Hello'
        }
      });

      expect(response.statusCode).toBe(HTTP_CREATED);
      expect(response.json().content).toBe('Hello');
    });

    test('POST /messages fails on empty content', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/messages',
        payload: {
          receiverId: 2,
          content: '   '
        }
      });

      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
      expect(response.json().error).toBe('Message content cannot be empty');
    });
  });
});
