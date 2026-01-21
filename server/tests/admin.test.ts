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

    test('DELETE /admin/users/:id deletes user', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/admin/users/${MOCK_USER_ID}`,
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual({ success: true });
    });

    test('DELETE /admin/users/:id returns 400 if user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const res = await app.inject({
        method: 'DELETE',
        url: `/api/admin/users/${MOCK_USER_ID}`,
      });

      expect(res.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('GET /admin/stats returns dashboard stats', async () => {
      const MOCK_STATS = { totalStudents: 10, totalTeachers: 5 };
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_STATS] });

      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/stats',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_STATS);
    });

    test('GET /admin/teachers/pending returns pending list', async () => {
      const MOCK_TEACHERS = [{ id: 2, name: 'Pending Teacher' }];
      mockQuery.mockResolvedValueOnce({ rows: MOCK_TEACHERS });

      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/teachers/pending',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_TEACHERS);
    });

    test('POST /admin/teachers/:id/verify verifies teacher', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ ...MOCK_USER, status: 'Active' }] });

      const res = await app.inject({
        method: 'POST',
        url: `/api/admin/teachers/${MOCK_USER_ID}/verify`,
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json().user.status).toBe('Active');
    });

    test('GET /admin/requests/open returns open requests', async () => {
      const MOCK_REQUESTS = [{ id: 10, description: 'Help' }];
      mockQuery.mockResolvedValueOnce({ rows: MOCK_REQUESTS });

      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/requests/open',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_REQUESTS);
    });

    test('POST /admin/requests/:id/assign assigns teacher', async () => {
      const MOCK_UPDATED_REQUEST = { id: 10, assignedTeacher: 5, status: 'Accepted' };
      mockQuery.mockResolvedValueOnce({ rows: [MOCK_UPDATED_REQUEST] });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/requests/10/assign',
        payload: { teacherId: 5 },
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_UPDATED_REQUEST);
    });

    test('GET /admin/matches returns matches', async () => {
      const MOCK_MATCHES = [{ id: 100, student_name: 'S', teacher_name: 'T' }];
      mockQuery.mockResolvedValueOnce({ rows: MOCK_MATCHES });

      const res = await app.inject({
        method: 'GET',
        url: '/api/admin/matches',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json()).toEqual(MOCK_MATCHES);
    });

    test('POST /admin/matches creates manual match', async () => {
      const MATCH_PAYLOAD = { studentId: 1, teacherId: 2, subjectId: 3 };
      
      // First query checks for duplicates
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Second query inserts
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 200, status: 'Accepted' }] });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: MATCH_PAYLOAD,
      });

      expect(res.statusCode).toBe(HTTP_CREATED);
      expect(res.json().id).toBe(200);
    });

    test('POST /admin/matches returns 409 on duplicate', async () => {
      const MATCH_PAYLOAD = { studentId: 1, teacherId: 2, subjectId: 3 };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 200 }] }); // Duplicate found

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/matches',
        payload: MATCH_PAYLOAD,
      });

      expect(res.statusCode).toBe(409);
    });

    test('DELETE /admin/matches/:id unassigns/deletes match', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 200, assignedTeacher: null }] });

      const res = await app.inject({
        method: 'DELETE',
        url: '/api/admin/matches/200',
      });

      expect(res.statusCode).toBe(HTTP_OK);
      expect(res.json().assignedTeacher).toBeNull();
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
