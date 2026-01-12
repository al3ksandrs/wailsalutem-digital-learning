import { jest, describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

const MOCK_SUBJECT_ID = 1;
const MOCK_SUBJECT_NAME = 'Mathematics';

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
const subjectDB = await import('../db/subject.ts');

describe('Subject Module', () => {
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


  describe('DB Layer (server/db/subject.ts)', () => {
    test('getAllSubjects returns all subjects', async () => {
      const rows = [{ id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME }];
      mockQuery.mockResolvedValueOnce({ rows });

      const result = await subjectDB.getAllSubjects(mockClient);
      expect(result).toEqual(rows);
    });

    test('getSubjectById returns a subject by ID', async () => {
      const row = { id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await subjectDB.getSubjectById(mockClient, MOCK_SUBJECT_ID);
      expect(result).toEqual(row);
    });

    test('getSubjectById returns null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await subjectDB.getSubjectById(mockClient, MOCK_SUBJECT_ID);
      expect(result).toBeNull();
    });

    test('createSubject inserts and returns new subject', async () => {
      const row = { id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await subjectDB.createSubject(mockClient, MOCK_SUBJECT_NAME);
      expect(result).toEqual(row);
    });

    test('deleteSubject returns true if deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await subjectDB.deleteSubject(mockClient, MOCK_SUBJECT_ID);
      expect(result).toBe(true);
    });

    test('deleteSubject returns false if not deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const result = await subjectDB.deleteSubject(mockClient, MOCK_SUBJECT_ID);
      expect(result).toBe(false);
    });
  });

 
  describe('Routes Layer (server/routes/subject.ts)', () => {
    const getAuthCookie = (role: 'Admin' | 'Student' = 'Admin') =>
      app.jwt.sign({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role,
        status: 'Approved',
      });

    test('GET /subjects returns all subjects', async () => {
      const rows = [{ id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME }];
      mockQuery.mockResolvedValueOnce({ rows });

      const response = await app.inject({
        method: 'GET',
        url: '/api/subjects',
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual(rows);
    });

    test('GET /subjects/:id returns subject if found', async () => {
      const row = { id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const response = await app.inject({
        method: 'GET',
        url: `/api/subjects/${MOCK_SUBJECT_ID}`,
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json()).toEqual(row);
    });

    test('GET /subjects/:id returns 404 if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await app.inject({
        method: 'GET',
        url: `/api/subjects/${MOCK_SUBJECT_ID}`,
      });

      expect(response.statusCode).toBe(HTTP_NOT_FOUND);
      expect(response.json().error).toContain('not found');
    });

    test('POST /subjects creates subject (admin only)', async () => {
      const row = { id: MOCK_SUBJECT_ID, name: MOCK_SUBJECT_NAME };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const response = await app.inject({
        method: 'POST',
        url: '/api/subjects',
        cookies: { token: getAuthCookie('Admin') },
        payload: { name: MOCK_SUBJECT_NAME },
      });

      expect(response.statusCode).toBe(HTTP_CREATED);
      expect(response.json()).toEqual(row);
    });

    test('POST /subjects returns 400 if name missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/subjects',
        cookies: { token: getAuthCookie('Admin') },
        payload: {},
      });

      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
      expect(response.json().error).toContain('required');
    });

    test('DELETE /subjects/:id deletes subject (admin only)', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/subjects/${MOCK_SUBJECT_ID}`,
        cookies: { token: getAuthCookie('Admin') },
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().success).toBe(true);
    });

    test('DELETE /subjects/:id returns 400 if subject cannot be deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/subjects/${MOCK_SUBJECT_ID}`,
        cookies: { token: getAuthCookie('Admin') },
      });

      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
      expect(response.json().error).toContain('cannot be deleted');
    });

    test('POST /subjects returns 403 if not admin', async () => {
      const token = getAuthCookie('Student');
      const response = await app.inject({
        method: 'POST',
        url: '/api/subjects',
        cookies: { token },
        payload: { name: MOCK_SUBJECT_NAME },
      });

      expect(response.statusCode).toBe(403);
    });

    test('DELETE /subjects/:id returns 403 if not admin', async () => {
      const token = getAuthCookie('Student');
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/subjects/${MOCK_SUBJECT_ID}`,
        cookies: { token },
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
