import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

const MOCK_USER_ID = 1;
const MOCK_USER = {
  id: MOCK_USER_ID,
  name: 'Test User',
  email: 'test@example.com',
  role: 'Admin',
  status: 'Approved',
};

const mockQuery = jest.fn<(...args: any[]) => Promise<any>>();
const mockRelease = jest.fn();
const mockConnect = jest.fn<() => Promise<any>>();

jest.unstable_mockModule('@fastify/postgres', () => ({
  default: Object.assign(
    async (fastify: any) => {
      fastify.decorate('pg', { connect: mockConnect });
    },
    { [Symbol.for('skip-override')]: true }
  )
}));

// authGuard to bypass authentication
jest.unstable_mockModule('../plugins/authguard.ts', () => ({
  authGuard: jest.fn(() => async (request: any, reply: any) => {
    // continue, dont block
  }),
}));

// Import routes and server after mocking
const { buildServer } = await import('../index.ts');
const adminDB = await import('../db/admin.ts');

describe('Admin Module', () => {
  let app: FastifyInstance;

  const mockClient = {
    query: mockQuery,
    release: mockRelease,
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

  describe('Routes Layer', () => {
    test('GET /admin/users returns users', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/users',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual([MOCK_USER]);
    });

    test('GET /admin/users/:id returns user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });

      const res = await app.inject({
        method: 'GET',
        url: `/api/admin/users/${MOCK_USER_ID}`,
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_USER);
    });

    test('GET /admin/users/:id returns 404 if user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await app.inject({
        method: 'GET',
        url: `/api/admin/users/999`,
      });

      expect(res.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('POST /admin/users creates user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/users',
        payload: { ...MOCK_USER, password: 'pass' },
      });

      expect(res.statusCode).toBe(HTTP_CREATED);
      expect(res.json()).toEqual(MOCK_USER);
    });

    test('PUT /admin/users/:id updates user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });

      const res = await app.inject({
        method: 'PUT',
        url: `/api/admin/users/${MOCK_USER_ID}`,
        payload: { name: 'New Name' },
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_USER);
    });

    test('PUT /admin/users/:id returns 400 if nothing to update', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await app.inject({
        method: 'PUT',
        url: `/api/admin/users/${MOCK_USER_ID}`,
        payload: {},
      });

      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('PATCH /admin/users/:id/status returns 400 if failed', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // user not found
        .mockResolvedValueOnce({});          // defensive padding

      const res = await app.inject({
        method: 'PATCH',
        url: `/api/admin/users/${MOCK_USER_ID}/status`,
        payload: { status: 'Pending' },
      });

      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });
  });
});
