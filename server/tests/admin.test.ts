import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const MOCK_USER_ID = 1;
const MOCK_USER = {
  id: MOCK_USER_ID,
  name: 'Test User',
  email: 'test@example.com',
  role: 'Admin',
  status: 'Approved',
};

const MOCK_STATS = { totalUsers: 10 };
const MOCK_REQUEST = { id: 100, status: 'Pending' };
const MOCK_MATCH = { id: 50, student_id: 1, teacher_id: 2 };

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

describe('Admin Module Routes', () => {
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

  describe('User Management Routes', () => {
    // GET /admin/users
    test('GET /admin/users returns users', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/users' });
      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual([MOCK_USER]);
    });

    test('GET /admin/users handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: '/api/admin/users' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // GET /admin/users/:id
    test('GET /admin/users/:id returns user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({ method: 'GET', url: `/api/admin/users/${MOCK_USER_ID}` });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('GET /admin/users/:id returns 404 if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/users/999' });
      expect(res.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('GET /admin/users/:id handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: `/api/admin/users/${MOCK_USER_ID}` });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // POST /admin/users
    test('POST /admin/users creates user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/users',
        payload: { ...MOCK_USER, password: 'pass' },
      });
      expect(res.statusCode).toBe(HTTP_CREATED);
    });

    test('POST /admin/users handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/users',
        payload: { ...MOCK_USER, password: 'pass' },
      });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // PUT /admin/users/:id
    test('PUT /admin/users/:id updates user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({
        method: 'PUT',
        url: `/api/admin/users/${MOCK_USER_ID}`,
        payload: { name: 'New Name' },
      });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('PUT /admin/users/:id returns 400 if not found/no update', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({
        method: 'PUT',
        url: `/api/admin/users/${MOCK_USER_ID}`,
        payload: { name: 'New Name' },
      });
      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('PUT /admin/users/:id handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({
        method: 'PUT',
        url: `/api/admin/users/${MOCK_USER_ID}`,
        payload: { name: 'New Name' },
      });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // DELETE /admin/users/:id
    test('DELETE /admin/users/:id returns success', async () => {
      // deleteUser checks rowCount
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const res = await app.inject({ method: 'DELETE', url: `/api/admin/users/${MOCK_USER_ID}` });
      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual({ success: true });
    });

    test('DELETE /admin/users/:id returns 400 if user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const res = await app.inject({ method: 'DELETE', url: `/api/admin/users/${MOCK_USER_ID}` });
      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('DELETE /admin/users/:id handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'DELETE', url: `/api/admin/users/${MOCK_USER_ID}` });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // PATCH /admin/users/:id/status
    test('PATCH /admin/users/:id/status updates status', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/admin/users/${MOCK_USER_ID}/status`,
        payload: { status: 'Blocked' },
      });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('PATCH /admin/users/:id/status returns 400 if failed', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/admin/users/${MOCK_USER_ID}/status`,
        payload: { status: 'Blocked' },
      });
      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('PATCH /admin/users/:id/status handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/admin/users/${MOCK_USER_ID}/status`,
        payload: { status: 'Blocked' },
      });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });
  });

  describe('Dashboard & Stats', () => {
    test('GET /admin/stats returns stats', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_STATS] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/stats' });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('GET /admin/stats handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: '/api/admin/stats' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });
  });

  describe('Teacher Management', () => {
    test('GET /admin/teachers/pending returns teachers', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_USER] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/teachers/pending' });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('GET /admin/teachers/pending handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: '/api/admin/teachers/pending' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    test('POST /admin/teachers/:id/verify verifies teacher', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ ...MOCK_USER, status: 'Active' }] });
      const res = await app.inject({ method: 'POST', url: `/api/admin/teachers/${MOCK_USER_ID}/verify` });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('POST /admin/teachers/:id/verify returns 404 if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({ method: 'POST', url: `/api/admin/teachers/${MOCK_USER_ID}/verify` });
      expect(res.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('POST /admin/teachers/:id/verify handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'POST', url: `/api/admin/teachers/${MOCK_USER_ID}/verify` });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });
  });

  describe('Request Management', () => {
    test('GET /admin/requests/open returns requests', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_REQUEST] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/requests/open' });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('GET /admin/requests/open handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: '/api/admin/requests/open' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    test('POST /admin/requests/:id/assign assigns teacher', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_REQUEST] });
      const res = await app.inject({
        method: 'POST',
        url: `/api/admin/requests/100/assign`,
        payload: { teacherId: 2 },
      });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('POST /admin/requests/:id/assign returns 404 if request not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({
        method: 'POST',
        url: `/api/admin/requests/100/assign`,
        payload: { teacherId: 2 },
      });
      expect(res.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('POST /admin/requests/:id/assign handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({
        method: 'POST',
        url: `/api/admin/requests/100/assign`,
        payload: { teacherId: 2 },
      });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });
  });

  describe('Match Management', () => {
    // GET
    test('GET /admin/matches returns matches', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_MATCH] });
      const res = await app.inject({ method: 'GET', url: '/api/admin/matches' });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('GET /admin/matches handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'GET', url: '/api/admin/matches' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // POST
    test('POST /admin/matches creates match', async () => {
      // Step 1: Check query returns EMPTY (no duplicate)
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Step 2: Insert query returns the match
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_MATCH] });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: { studentId: 1, teacherId: 2, subjectId: 3 },
      });
      expect(res.statusCode).toBe(HTTP_CREATED);
    });

    test('POST /admin/matches returns 400 for missing fields', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: { studentId: 1 }, // missing teacherId, subjectId
      });
      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
      expect(res.json().error).toMatch(/Missing required fields/);
    });

    test('POST /admin/matches returns 409 for duplicate match', async () => {
      // Step 1: Check query returns a ROW (duplicate exists)
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 99 }] });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: { studentId: 1, teacherId: 2, subjectId: 3 },
      });
      expect(res.statusCode).toBe(HTTP_CONFLICT);
      expect(res.json().error).toMatch(/match already exists/);
    });

    test('POST /admin/matches handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: { studentId: 1, teacherId: 2, subjectId: 3 },
      });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });

    // DELETE
    test('DELETE /admin/matches/:id unassigns/deletes match', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_MATCH] });
      const res = await app.inject({ method: 'DELETE', url: '/api/admin/matches/50' });
      expect(res.statusCode).toBe(HTTP_OK);
    });

    test('DELETE /admin/matches/:id returns 404 if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await app.inject({ method: 'DELETE', url: '/api/admin/matches/50' });
      expect(res.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('DELETE /admin/matches/:id handles DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      const res = await app.inject({ method: 'DELETE', url: '/api/admin/matches/50' });
      expect(res.statusCode).toBe(HTTP_INTERNAL_SERVER_ERROR);
    });
  });
});