import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import '@fastify/cookie';
import * as authDB from '../db/auth.ts';
import bcrypt from 'bcrypt';

// Constants
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_UNAUTHORIZED = 401;
const HTTP_SERVER_ERROR = 500;
const COOKIE_MAX_AGE_SEC = 604800; // 1 week, we can change this later
const SALT_ROUNDS = 10;
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;

// Validation schemas
const registerSchema = z.object({
    email: z.email(),
    name: z.string().min(MIN_NAME_LENGTH),
    // Users can only sign up as Student or Teacher
    role: z.enum(['Student', 'Teacher']),
    password: z.string().min(MIN_PASSWORD_LENGTH),
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {

    // Registers user
    fastify.withTypeProvider<ZodTypeProvider>().post('/register', {
        schema: {
            body: registerSchema
        }
    }, async (request, reply) => {
        const { email, name, role, password } = request.body;

        const client = await fastify.pg.connect();

        try {
            // Hashes the password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Saves to DB
            const newUser = await authDB.createUser(client, {
                email,
                name,
                role,
                password: hashedPassword
            });

            return reply.code(HTTP_CREATED).send({
                status: 'success',
                user: newUser
            });

        } catch (err) {
            request.log.error(err);
            return reply.code(HTTP_SERVER_ERROR).send({ error: 'Registration failed' });
        } finally {
            client.release();
        }
    });

    // Login user
    fastify.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: loginSchema
        }
    }, async (request, reply) => {
        const { email, password } = request.body;

        const client = await fastify.pg.connect();

        try {
            // Gets user from DB
            const user = await authDB.findUserByEmail(client, email);

            // Validates credentials
            const isMatch = user ? await bcrypt.compare(password, user.password) : false;

            if (!user || !isMatch) {
                return reply.code(HTTP_UNAUTHORIZED).send({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = fastify.jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            });

            // Sets session cookie
            reply.setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: COOKIE_MAX_AGE_SEC
            });

            return reply.code(HTTP_OK).send({
                status: 'success',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (err) {
            request.log.error(err);
            return reply.code(HTTP_SERVER_ERROR).send({ error: 'Login failed' });
        } finally {
            client.release();
        }
    });

    // Logout user
    fastify.post('/logout', async (request, reply) => {
        reply.clearCookie('token', { path: '/' });
        return reply.code(HTTP_OK).send({ status: 'logged out' });
    });

    // Session check (shows some basic user data of the authenticated user)
    fastify.get('/me', async (request, reply) => {
        try {
            await request.jwtVerify();
            return reply.code(HTTP_OK).send({
                status: 'authenticated',
                user: request.user
            });
        } catch (err) {
            request.log.debug(err);
            return reply.code(HTTP_UNAUTHORIZED).send({ error: 'Not authenticated' });
        }
    });
}