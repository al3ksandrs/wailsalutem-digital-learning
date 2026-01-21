import { FastifyReply, FastifyRequest } from 'fastify';

export const authGuard = (role?: 'Student' | 'Teacher' | 'Admin') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Debugging info
      if (!request.cookies) {
         request.log.warn('AuthGuard: request.cookies is UNDEFINED. fastify-cookie might not be loaded properly.');
      } else if (!request.cookies.token) {
         request.log.warn({ cookies: request.cookies }, 'AuthGuard: No token found in cookies.');
      }

      // JWT verification
      await request.jwtVerify();
      
      const user = request.user as { id: number; role: string; status: string };

      // Role based access
      if (role && user.role !== role && user.role !== 'Admin') {
        return reply.code(403).send({ 
          error: `Forbidden: Only ${role}s can access this resource.` 
        });
      }

      // Status check for teacher
      if (user.role === 'Teacher' && user.status === 'Pending') {
        return reply.code(403).send({ 
          error: 'Access Denied: Your account is awaiting admin approval.' 
        });
      }

    } catch (err) {
      request.log.error(err); 
      
      return reply.code(401).send({ 
        error: 'Unauthorized: Invalid or missing token' 
      });
    }
  };
};