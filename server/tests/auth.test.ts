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

// Mock functions with explicit generics to fix TS errors
const mockRelease = jest.fn();
const mockQuery = jest.fn<(...args: any[]) => Promise<any>>(); 
const mockConnect = jest.fn<() => Promise<any>>();
const mockHash = jest.fn<(...args: any[]) => Promise<string>>();
const mockCompare = jest.fn<(...args: any[]) => Promise<boolean>>();

// Mocks fastify-postgres
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

// Mocks bcrypt
jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: mockHash,
    compare: mockCompare
  }
}));

// Imports modules AFTER mocking
const { buildServer } = await import('../index');
const authDB = await import('../db/auth');

describe('Auth Module', () => {
  let app: FastifyInstance;
  
  // Casts the mock client to unknown then PoolClient to satisfy TS types
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
    
    // Default mock behaviors
    mockConnect.mockResolvedValue(mockClient);
    mockHash.mockResolvedValue(MOCK_HASHED_PASSWORD);
    mockCompare.mockResolvedValue(true);
    
    // Default happy path behavior for DB queries
    mockQuery.mockResolvedValue({ rows: [] });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DB Layer (server/db/auth.ts)', () => {
    test('createUser should handle Student creation transaction correctly', async () => {
      // BEGIN
      mockQuery.mockResolvedValueOnce({ rows: [] }); 
      // INSERT users
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, role: STUDENT_ROLE, name: MOCK_NAME, status: 'Pending' }] 
      });
      // INSERT student
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // COMMIT
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await authDB.createUser(mockClient, {
        email: MOCK_EMAIL,
        name: MOCK_NAME,
        role: STUDENT_ROLE,
        password: MOCK_HASHED_PASSWORD,
        education: 'High School',
        schoolYear: 1
      });

      expect(mockQuery).toHaveBeenCalledTimes(4);
      expect(mockQuery).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(mockQuery).toHaveBeenNthCalledWith(4, 'COMMIT');
      expect(result.id).toBe(MOCK_USER_ID);
      expect(result.role).toBe(STUDENT_ROLE);
    });

    test('createUser should rollback on error', async () => {
      // BEGIN
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // INSERT users fails
      mockQuery.mockRejectedValueOnce(new Error('DB Error'));
      // ROLLBACK
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await expect(authDB.createUser(mockClient, {
        email: MOCK_EMAIL,
        name: MOCK_NAME,
        role: STUDENT_ROLE,
        password: MOCK_HASHED_PASSWORD,
        education: 'High School'
      })).rejects.toThrow('DB Error');

      expect(mockQuery).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('Routes Layer (server/routes/auth.ts)', () => {
    
    describe('POST /register', () => {
      test('should register a Student successfully', async () => {
        // Sequence
        // BEGIN
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // INSERT users
        mockQuery.mockResolvedValueOnce({ 
          rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, role: STUDENT_ROLE, name: MOCK_NAME, status: 'Pending' }] 
        });
        // INSERT student
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // COMMIT
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/register',
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
            role: STUDENT_ROLE
          })
        });
        expect(mockHash).toHaveBeenCalledWith(MOCK_PASSWORD, SALT_ROUNDS);
      });

      test('should register a Teacher successfully with subjects', async () => {
        // Sequence
        // BEGIN
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // INSERT users
        mockQuery.mockResolvedValueOnce({ 
          rows: [{ id: MOCK_USER_ID, email: MOCK_EMAIL, role: TEACHER_ROLE, name: MOCK_NAME, status: 'Pending' }] 
        });
        // INSERT teacher
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // SELECT subject (let's say it exists)
        mockQuery.mockResolvedValueOnce({ rows: [{ id: 10 }] });
        // INSERT teacher_subject
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // COMMIT
        mockQuery.mockResolvedValueOnce({ rows: [] });

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
      });

      test('should return 400 if email already exists (Duplicate Key)', async () => {
        // BEGIN
        mockQuery.mockResolvedValueOnce({ rows: [] });
        // INSERT users -> throws unique constraint error
        const duplicateError: any = new Error('Duplicate');
        duplicateError.code = '23505';
        duplicateError.constraint = 'users_email_key';
        mockQuery.mockRejectedValueOnce(duplicateError);
        // ROLLBACK
        mockQuery.mockResolvedValueOnce({ rows: [] });

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
          payload: {
            email: 'not-an-email',
            // missing other fields
          }
        });

        expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
      });
    });

    describe('POST /login', () => {
      test('should login successfully and set cookie', async () => {
        // SELECT user by email
        mockQuery.mockResolvedValueOnce({
          rows: [{ 
            id: MOCK_USER_ID, 
            email: MOCK_EMAIL, 
            password: MOCK_HASHED_PASSWORD, 
            role: STUDENT_ROLE, 
            name: MOCK_NAME 
          }]
        });

        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            email: MOCK_EMAIL,
            password: MOCK_PASSWORD
          }
        });

        expect(response.statusCode).toBe(HTTP_OK);
        expect(response.cookies).toHaveLength(1);
        expect(response.cookies[0].name).toBe('token');
        expect(response.json().user).toEqual({
          id: MOCK_USER_ID,
          name: MOCK_NAME,
          email: MOCK_EMAIL,
          role: STUDENT_ROLE
        });
        expect(mockCompare).toHaveBeenCalledWith(MOCK_PASSWORD, MOCK_HASHED_PASSWORD);
      });

      test('should return 401 on invalid credentials (user not found)', async () => {
        // SELECT user by email -> returns empty
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            email: 'wrong@example.com',
            password: MOCK_PASSWORD
          }
        });

        expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
        expect(response.json().error).toBe('Invalid credentials');
      });

      test('should return 401 on invalid credentials (wrong password)', async () => {
        // SELECT user
        mockQuery.mockResolvedValueOnce({
            rows: [{ 
                id: MOCK_USER_ID, 
                email: MOCK_EMAIL, 
                password: MOCK_HASHED_PASSWORD, 
                role: STUDENT_ROLE 
            }]
        });
        
        mockCompare.mockResolvedValueOnce(false);

        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            email: MOCK_EMAIL,
            password: 'wrongpassword'
          }
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
          name: MOCK_NAME
        });

        const response = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          cookies: {
            token: token
          }
        });

        expect(response.statusCode).toBe(HTTP_OK);
        expect(response.json().user).toEqual(expect.objectContaining({
          id: MOCK_USER_ID,
          email: MOCK_EMAIL
        }));
      });

      test('should return 401 when not authenticated', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/auth/me'
        });

        expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
      });
    });

    describe('POST /logout', () => {
      test('should clear the token cookie', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/logout'
        });

        expect(response.statusCode).toBe(HTTP_OK);
        // Fastify inject cookies handling check
        const setCookie = response.headers['set-cookie'] as string | string[];
        const cookieString = Array.isArray(setCookie) ? setCookie.join('') : setCookie;
        expect(cookieString).toContain('token=;');
      });
    });
  });
});