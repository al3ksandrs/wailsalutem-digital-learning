import { jest, describe, test, expect, afterAll, beforeEach, beforeAll } from '@jest/globals';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const SALT_ROUNDS = 10;
const MOCK_USER_ID = 1;
const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = 'password123';
const MOCK_HASHED_PASSWORD = 'hashed_password_123';
const MOCK_NAME = 'Test User';
const STUDENT_ROLE = 'Student';
const TEACHER_ROLE = 'Teacher';

// Mock functions
const mockRelease = jest.fn();
const mockQuery = jest.fn<(...args: any[]) => Promise<any>>();
const mockConnect = jest.fn<() => Promise<any>>();
const mockHash = jest.fn<(...args: any[]) => Promise<string>>();
const mockCompare = jest.fn<(...args: any[]) => Promise<boolean>>();

// Mock fastify-postgres
jest.unstable_mockModule('@fastify/postgres', () => ({
  default: Object.assign(async (fastify: any) => {
    fastify.decorate('pg', { connect: mockConnect });
  }, { [Symbol.for('skip-override')]: true })
}));

// Mock bcrypt
jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: mockHash, compare: mockCompare }
}));

// Imports modules AFTER mocking
const { buildServer } = await import('../index.js');
const authDB = await import('../db/auth.js');

describe('Auth Module', () => {
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
    mockHash.mockResolvedValue(MOCK_HASHED_PASSWORD);
    mockCompare.mockResolvedValue(true);
    mockQuery.mockResolvedValue({ rows: [] });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /register', () => {
    test('should register a Student successfully', async () => {
      // BEGIN
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, role: STUDENT_ROLE, name: MOCK_NAME, status: 'Approved' }]
      });
      mockQuery.mockResolvedValueOnce({ rows: [] }); // insert student
      mockQuery.mockResolvedValueOnce({ rows: [] }); // commit

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register', // ✅ fixed prefix
        payload: {
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          password: MOCK_PASSWORD,
          role: STUDENT_ROLE,
          education: 'University',
          schoolYear: 2
        }
      });

      expect(response.statusCode).toBe(HTTP_CREATED);
      expect(response.json()).toEqual({
        status: 'success',
        user: expect.objectContaining({
          email: MOCK_EMAIL,
          role: STUDENT_ROLE,
          status: 'Approved'
        })
      });
      expect(mockHash).toHaveBeenCalledWith(MOCK_PASSWORD, SALT_ROUNDS);
    });

    test('should register a Teacher successfully with subjects', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, role: TEACHER_ROLE, name: MOCK_NAME, status: 'Pending' }]
      });
      mockQuery.mockResolvedValueOnce({ rows: [] }); // insert teacher
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 10 }] }); // select subject
      mockQuery.mockResolvedValueOnce({ rows: [] }); // insert teacher_subject
      mockQuery.mockResolvedValueOnce({ rows: [] }); // commit

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          password: MOCK_PASSWORD,
          role: TEACHER_ROLE,
          expertise: 'Math',
          subjects: ['Math']
        }
      });

      expect(response.statusCode).toBe(HTTP_CREATED);
      expect(response.json().user.status).toBe('Pending');
    });

    test('should return 400 if email already exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const duplicateError: any = new Error('Duplicate');
      duplicateError.code = '23505';
      duplicateError.constraint = 'users_email_key';
      mockQuery.mockRejectedValueOnce(duplicateError);
      mockQuery.mockResolvedValueOnce({ rows: [] }); // rollback

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: MOCK_EMAIL,
          name: MOCK_NAME,
          password: MOCK_PASSWORD,
          role: STUDENT_ROLE,
          education: 'N/A'
        }
      });

      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
      expect(response.json().error).toBe('Email already exists');
    });

    test('should return 400 on Zod validation failure', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { email: 'not-an-email' }
      });
      expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
    });
  });

  describe('POST /login', () => {
    test('should login successfully and set cookie', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ 
          id: MOCK_USER_ID, email: MOCK_EMAIL, password: MOCK_HASHED_PASSWORD, role: STUDENT_ROLE,
          name: MOCK_NAME, status: 'Approved'
        }]
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: MOCK_EMAIL, password: MOCK_PASSWORD }
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.cookies).toHaveLength(1);
      expect(response.cookies[0].name).toBe('token');
      expect(response.json().user).toEqual(expect.objectContaining({ id: MOCK_USER_ID, status: 'Approved' }));
    });

    test('should return 401 on invalid credentials (user not found)', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'wrong@example.com', password: MOCK_PASSWORD }
      });

      expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
      expect(response.json().error).toBe('Invalid credentials');
    });

    test('should return 401 on invalid credentials (wrong password)', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, password: MOCK_HASHED_PASSWORD, role: STUDENT_ROLE }]
      });
      mockCompare.mockResolvedValueOnce(false);

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: MOCK_EMAIL, password: 'wrongpassword' }
      });

      expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
    });
  });

  describe('GET /me', () => {
    test('should return user info when authenticated', async () => {
      const token = app.jwt.sign({
        id: MOCK_USER_ID,
        email: MOCK_EMAIL,
        role: STUDENT_ROLE,
        name: MOCK_NAME,
        status: 'Approved'
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        cookies: { token }
      });

      expect(response.statusCode).toBe(HTTP_OK);
      expect(response.json().user).toEqual(expect.objectContaining({ id: MOCK_USER_ID, status: 'Approved' }));
    });
  });

  describe('POST /logout', () => {
    test('should clear the token cookie', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/logout'
      });

      expect(response.statusCode).toBe(HTTP_OK);
      const setCookie = response.headers['set-cookie'] as string | string[];
      const cookieString = Array.isArray(setCookie) ? setCookie.join('') : setCookie;
      expect(cookieString).toContain('token=;');
    });
  });
});
