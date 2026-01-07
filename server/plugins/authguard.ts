import { FastifyReply, FastifyRequest } from 'fastify';

export const authGuard = (role?: 'Student' | 'Teacher' | 'Admin') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. JWT Verificatie
      await request.jwtVerify();
      
      // We casten de user naar het juiste type zodat TS niet klaagt
      const user = request.user as { id: number; role: string; status: string };

      // 2. Rol-gebaseerde toegang (Admin mag overal bij)
      if (role && user.role !== role && user.role !== 'Admin') {
        return reply.code(403).send({ 
          error: `Forbidden: Only ${role}s can access this resource.` 
        });
      }

      // 3. Status Check voor Docenten (SRS FR-04)
      // Alleen blokkeren als ze expliciet 'Pending' zijn.
      if (user.role === 'Teacher' && user.status === 'Pending') {
        return reply.code(403).send({ 
          error: 'Access Denied: Your account is awaiting admin approval.' 
        });
      }

    } catch (err) {
      // FIX voor S2486: Log de fout zodat deze 'gebruikt' wordt en je kunt debuggen
      request.log.error(err); 
      
      return reply.code(401).send({ 
        error: 'Unauthorized: Invalid or missing token' 
      });
    }
  };
};