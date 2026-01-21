import { authGuard } from '../plugins/authguard.ts';
import { jest, describe, test, expect } from '@jest/globals';
import type { FastifyReply, FastifyRequest } from 'fastify';

describe('authGuard', () => {
  const mockReply = (): FastifyReply => {
    return {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as FastifyReply;
  };

  const mockRequest = (user?: any, jwtResolve: boolean | Error = true): FastifyRequest => {
    return {
      jwtVerify: jest.fn().mockImplementation(() => {
        if (jwtResolve instanceof Error) return Promise.reject(jwtResolve);
        return Promise.resolve(jwtResolve);
      }),
      user,
      log: { error: jest.fn(), warn: jest.fn() },
      cookies: { token: 'mock_token' }
    } as unknown as FastifyRequest;
  };

  test('returns 401 if jwtVerify fails', async () => {
    const request = mockRequest(undefined, new Error('fail'));
    const reply = mockReply();

    await authGuard('Student')(request, reply);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Unauthorized') })
    );
  });

  test('returns 403 if role does not match', async () => {
    const request = mockRequest({ id: 1, role: 'Teacher', status: 'Approved' });
    const reply = mockReply();

    await authGuard('Student')(request, reply);

    expect(reply.code).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Forbidden') })
    );
  });

  test('returns 403 if teacher is pending', async () => {
    const request = mockRequest({ id: 1, role: 'Teacher', status: 'Pending' });
    const reply = mockReply();

    await authGuard('Teacher')(request, reply);

    expect(reply.code).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('awaiting admin approval') })
    );
  });

  test('does nothing if role matches', async () => {
    const request = mockRequest({ id: 1, role: 'Student', status: 'Approved' });
    const reply = mockReply();

    const result = await authGuard('Student')(request, reply);

    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('admin overrides role', async () => {
    const request = mockRequest({ id: 1, role: 'Admin', status: 'Approved' });
    const reply = mockReply();

    const result = await authGuard('Student')(request, reply);

    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
