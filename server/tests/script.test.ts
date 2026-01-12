import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const mockConnect = jest.fn<() => Promise<void>>();
const mockQuery = jest.fn<() => Promise<{ rows: any[] }>>();
const mockEnd = jest.fn<() => Promise<void>>();

jest.unstable_mockModule('pg', () => ({
  Client: jest.fn(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: mockEnd,
  })),
}));

// 3. Dynamically import the script AFTER mocking
const { runConnectionTest } = await import('../scripts/test-db-connection.js');

describe('Connection Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns true on success', async () => {
    // Setup success behavior
    mockConnect.mockResolvedValue(undefined);
    mockQuery.mockResolvedValue({ 
        rows: [{ time: 'now', version: 'mock-version' }] 
    });

    const result = await runConnectionTest();

    expect(result).toBe(true);
    expect(mockConnect).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
  });

  test('returns false on error', async () => {
    // Setup failure behavior
    mockConnect.mockRejectedValue(new Error('Connection Failed'));

    const result = await runConnectionTest();

    expect(result).toBe(false);
    expect(mockConnect).toHaveBeenCalled();
    // query should not run if connect fails
    expect(mockQuery).not.toHaveBeenCalled(); 
  });
});