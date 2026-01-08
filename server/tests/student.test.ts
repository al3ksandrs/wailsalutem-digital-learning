import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

const MOCK_STUDENT_ID = 1;
const MOCK_TEACHER_ID = 10;
const MOCK_SUBJECT_ID = 5;

const mockRelease = jest.fn();
const mockQuery = jest.fn<(...args: any[]) => Promise<any>>();
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

const { buildServer } = await import('../index.ts');
const studentDB = await import('../db/student.ts');

describe('Student Module', () => {
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
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
  });

  afterAll(async () => {
    await app.close();
  });


  describe('DB Layer (server/db/student.ts)', () => {
    test('getStudentDashboard returns status counts', async () => {
      const rows = [{ status: 'Pending', count: 2 }, { status: 'Accepted', count: 1 }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await studentDB.getStudentDashboard(mockClient, MOCK_STUDENT_ID);

      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [MOCK_STUDENT_ID]);
      expect(result).toEqual(rows);
    });

    test('getPendingRequests returns pending requests', async () => {
      const rows = [{ id: 1, description: 'Need help', status: 'Pending', subject: 'Math' }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await studentDB.getPendingRequests(mockClient, MOCK_STUDENT_ID);

      expect(result).toEqual(rows);
    });

    test('getMatches returns accepted matches', async () => {
      const rows = [{ id: 1, teacher_id: MOCK_TEACHER_ID, teacher_name: 'Teacher One' }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await studentDB.getMatches(mockClient, MOCK_STUDENT_ID);

      expect(result).toEqual(rows);
    });

    test('createHelpRequest inserts and returns request', async () => {
      const row = { id: 99, student_id: MOCK_STUDENT_ID, subject_id: MOCK_SUBJECT_ID };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await studentDB.createHelpRequest(mockClient, {
        studentId: MOCK_STUDENT_ID,
        subjectId: MOCK_SUBJECT_ID,
        description: 'Help needed',
        location: 'Online',
        startTime: '10:00',
        endTime: '11:00',
      });

      expect(result).toEqual(row);
    });

    test('updateHelpRequest returns null if not editable', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await studentDB.updateHelpRequest(mockClient, {
        requestId: 1,
        studentId: MOCK_STUDENT_ID,
        subjectId: MOCK_SUBJECT_ID,
        description: 'Updated',
        location: 'Online',
        startTime: '10:00',
        endTime: '11:00',
      });

      expect(result).toBeNull();
    });

    test('deleteHelpRequest returns true when deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await studentDB.deleteHelpRequest(mockClient, MOCK_STUDENT_ID, 1);

      expect(result).toBe(true);
    });
  });

  describe('Routes Layer (server/routes/student.ts)', () => {
    const getAuthCookie = (overrides?: any) =>
      app.jwt.sign({
        id: MOCK_STUDENT_ID,
        role: 'Student',
        status: 'Approved',
        ...overrides,
      });

    test('GET /student/dashboard returns dashboard data', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ status: 'Pending', count: 3 }] });

      const response = await app.inject({
        method: 'GET',
        url: '/api/student/dashboard',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual([{ status: 'Pending', count: 3 }]);
    });

    test('GET /student/pending-requests returns pending requests', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, status: 'Pending' }] });

      const response = await app.inject({
        method: 'GET',
        url: '/api/student/pending-requests',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().length).toBe(1);
    });

    test('POST /student/help-requests creates request', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, description: 'Help needed' }] });

      const response = await app.inject({
        method: 'POST',
        url: '/api/student/help-requests',
        cookies: { token: getAuthCookie() },
        payload: { subjectId: MOCK_SUBJECT_ID, description: 'Help needed' },
      });

      expect(response.statusCode).toBe(HTTP_CREATED);
      expect(response.json().description).toBe('Help needed');
    });

    test('POST /student/help-requests returns 400 on missing fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/student/help-requests',
        cookies: { token: getAuthCookie() },
        payload: {},
      });

      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
    });

    test('PUT /student/help-requests/:id returns 404 if not editable', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await app.inject({
        method: 'PUT',
        url: '/api/student/help-requests/1',
        cookies: { token: getAuthCookie() },
        payload: { subjectId: MOCK_SUBJECT_ID, description: 'Update' },
      });

      expect(response.statusCode).toBe(HTTP_NOT_FOUND);
    });

    test('DELETE /student/help-requests/:id deletes request', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/student/help-requests/1',
        cookies: { token: getAuthCookie() },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().success).toBe(true);
    });


    test('GET /student/dashboard returns 401 if no token', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/student/dashboard' });
      expect(response.statusCode).toBe(401);
      expect(response.json().error).toContain('Unauthorized');
    });

    test('GET /student/dashboard returns 403 if wrong role', async () => {
      const token = getAuthCookie({ role: 'Teacher' });
      const response = await app.inject({
        method: 'GET',
        url: '/api/student/dashboard',
        cookies: { token },
      });

      expect(response.statusCode).toBe(403);
      expect(response.json().error).toContain('Forbidden');
    });
  });
});
