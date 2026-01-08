import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;

const MOCK_TEACHER_ID = 1;
const MOCK_STUDENT_ID = 2;
const MOCK_REQUEST_ID = 99;

const mockRelease = jest.fn();
const mockQuery = jest.fn<(...args: any[]) => Promise<any>>();
const mockConnect = jest.fn<() => Promise<any>>();

jest.unstable_mockModule('@fastify/postgres', () => ({
  default: Object.assign(
    async (fastify: any) => {
      fastify.decorate('pg', { connect: mockConnect });
    },
    { [Symbol.for('skip-override')]: true }
  )
}));

const { buildServer } = await import('../index.ts');
const teacherDB = await import('../db/teacher.ts');

describe('Teacher Module', () => {
  let app: FastifyInstance;

  const mockClient = { query: mockQuery, release: mockRelease } as unknown as PoolClient;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue(mockClient);
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DB Layer (server/db/teacher.ts)', () => {
    test('getTeacherDashboard returns dashboard counts', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ status: 'Pending', count: 2 }] }) // helpRequests
        .mockResolvedValueOnce({ rows: [{ count: 3 }] }) // suggestedMatches
        .mockResolvedValueOnce({ rows: [{ count: 4 }] }); // students

      const result = await teacherDB.getTeacherDashboard(mockClient, MOCK_TEACHER_ID);

      expect(result).toEqual({
        helpRequests: [{ status: 'Pending', count: 2 }],
        suggestedMatches: 3,
        students: 4,
      });
    });

    test('getTeacherHelpRequests returns requests assigned to teacher', async () => {
      const rows = [{ id: MOCK_REQUEST_ID, studentName: 'Student One' }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await teacherDB.getTeacherHelpRequests(mockClient, MOCK_TEACHER_ID);
      expect(result).toEqual(rows);
    });

    test('getSuggestedMatches returns unassigned matching requests', async () => {
      const rows = [{ id: MOCK_REQUEST_ID, studentName: 'Student One' }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await teacherDB.getSuggestedMatches(mockClient, MOCK_TEACHER_ID);
      expect(result).toEqual(rows);
    });

    test('updateHelpRequestStatus returns updated request or null', async () => {
      const row = { id: MOCK_REQUEST_ID, status: 'Accepted' };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await teacherDB.updateHelpRequestStatus(mockClient, MOCK_TEACHER_ID, MOCK_REQUEST_ID, 'Accepted');
      expect(result).toEqual(row);
    });

    test('acceptSuggestedMatch returns updated request or null', async () => {
      const row = { id: MOCK_REQUEST_ID };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await teacherDB.acceptSuggestedMatch(mockClient, MOCK_TEACHER_ID, MOCK_REQUEST_ID);
      expect(result).toEqual(row);
    });

    test('removeStudent returns true if deletion succeeded', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await teacherDB.removeStudent(mockClient, MOCK_TEACHER_ID, MOCK_STUDENT_ID);
      expect(result).toBe(true);
    });
  });

  describe('Routes Layer (server/routes/teacher.ts)', () => {
    const getAuthCookie = (overrides?: any) =>
      app.jwt.sign({ id: MOCK_TEACHER_ID, role: 'Teacher', status: 'Approved', ...overrides });

    test('GET /teacher/dashboard returns dashboard data', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ status: 'Pending', count: 2 }] })
        .mockResolvedValueOnce({ rows: [{ count: 3 }] })
        .mockResolvedValueOnce({ rows: [{ count: 4 }] });

      const response = await app.inject({
        method: 'GET',
        url: '/api/teacher/dashboard',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual({
        helpRequests: [{ status: 'Pending', count: 2 }],
        suggestedMatches: 3,
        students: 4,
      });
    });

    test('GET /teacher/help-requests returns assigned requests', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: MOCK_REQUEST_ID }] });

      const response = await app.inject({
        method: 'GET',
        url: '/api/teacher/help-requests',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual([{ id: MOCK_REQUEST_ID }]);
    });

    test('GET /teacher/suggested-matches returns suggestions', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: MOCK_REQUEST_ID }] });

      const response = await app.inject({
        method: 'GET',
        url: '/api/teacher/suggested-matches',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual([{ id: MOCK_REQUEST_ID }]);
    });

    test('PUT /teacher/help-requests/:id updates status', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: MOCK_REQUEST_ID, status: 'Accepted' }] });

      const response = await app.inject({
        method: 'PUT',
        url: `/api/teacher/help-requests/${MOCK_REQUEST_ID}`,
        cookies: { token: getAuthCookie() },
        payload: { status: 'Accepted' },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().status).toBe('Accepted');
    });

    test('POST /teacher/suggested-matches/:id/accept accepts a match', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: MOCK_REQUEST_ID }] });

      const response = await app.inject({
        method: 'POST',
        url: `/api/teacher/suggested-matches/${MOCK_REQUEST_ID}/accept`,
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().id).toBe(MOCK_REQUEST_ID);
    });

    test('DELETE /teacher/students/:id removes student', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/teacher/students/${MOCK_STUDENT_ID}`,
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().success).toBe(true);
    });

    test('GET /teacher/dashboard returns 401 if no token', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/teacher/dashboard' });
      expect(response.statusCode).toBe(401);
      expect(response.json().error).toContain('Unauthorized');
    });

    test('GET /teacher/dashboard returns 403 if wrong role', async () => {
      const token = getAuthCookie({ role: 'Student' });
      const response = await app.inject({
        method: 'GET',
        url: '/api/teacher/dashboard',
        cookies: { token },
      });

      expect(response.statusCode).toBe(403);
      expect(response.json().error).toContain('Forbidden');
    });

    test('GET /teacher/dashboard returns 403 if pending Teacher', async () => {
      const token = getAuthCookie({ status: 'Pending' });
      const response = await app.inject({
        method: 'GET',
        url: '/api/teacher/dashboard',
        cookies: { token },
      });

      expect(response.statusCode).toBe(403);
      expect(response.json().error).toContain('awaiting admin approval');
    });
  });
});
