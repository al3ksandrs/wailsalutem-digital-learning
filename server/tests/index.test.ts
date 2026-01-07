import { jest, describe, test, expect, afterAll, beforeEach } from '@jest/globals';

// 1. Create mock functions with explicit Generics
// This enables .mockResolvedValue() and .mockRejectedValue() to work without errors.
const mockRelease = jest.fn(); 
const mockQuery = jest.fn<() => Promise<any>>();
const mockConnect = jest.fn<() => Promise<any>>();

// 2. Mock fastify-postgres using these hoistable variables
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

// 3. Dynamically import the server
const { buildServer } = await import('../index.js');

describe('Server Routes', () => {
  let app: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default "Happy Path" behavior
    mockQuery.mockResolvedValue({ 
      rows: [{ time: '2025-01-01', version: 'Postgres Mock' }] 
    });
    
    // Connect returns a client object containing release/query
    mockConnect.mockResolvedValue({
      query: mockQuery,
      release: mockRelease,
    });

    app = buildServer();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /db-check should return success', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/db-check'
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('Database Connected!');
    expect(mockConnect).toHaveBeenCalled();
    expect(mockRelease).toHaveBeenCalled(); 
  });

  test('GET /db-check should handle DB errors (500)', async () => {
    // Simulate a DB connection failure
    mockConnect.mockRejectedValueOnce(new Error('Critical DB Failure'));

    const response = await app.inject({
      method: 'GET',
      url: '/db-check'
    });

    expect(response.statusCode).toBe(500);
    const body = response.json();
    expect(body.status).toBe('Database Connection Failed');
    expect(body.error).toBe('Critical DB Failure');
    // Ensure release is not called if connect fails (as client is undefined)
    expect(mockRelease).not.toHaveBeenCalled(); 
  });
});