import { jest, describe, test, expect, afterAll } from '@jest/globals';

// 1. Mock fastify-postgres BEFORE importing the server
jest.unstable_mockModule('@fastify/postgres', () => ({
  default: Object.assign(
    async (fastify: any) => {
      fastify.decorate('pg', {
        // Explicitly tell TS this returns a Promise resolving to 'any'
        connect: jest.fn<() => Promise<any>>().mockResolvedValue({
          query: jest.fn<() => Promise<any>>().mockResolvedValue({ 
              rows: [{ time: '2025-01-01', version: 'Postgres Mock' }] 
          }),
          release: jest.fn(),
        }),
      });
    },
    { [Symbol.for('skip-override')]: true }
  )
}));

// 2. Dynamically import the server
const { buildServer } = await import('../index');

describe('Server Routes', () => {
  const app = buildServer();

  afterAll(async () => {
    await app.close();
  });

  test('GET / should return { wrld: "wrld" }', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ wrld: 'wrld' });
  });

  test('GET /db-check should return success', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/db-check'
    });

    if (response.statusCode !== 200) {
      console.error('TEST FAILED. Server Response:', JSON.stringify(response.json(), null, 2));
    }

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('Database Connected!');
    expect(body.version).toBe('Postgres Mock');
  });
});
