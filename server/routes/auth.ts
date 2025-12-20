import { FastifyInstance } from 'fastify';
import '@fastify/cookie';
import * as authDB from '../db/auth.ts';
import bcrypt from 'bcrypt';

// Constants
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_UNAUTHORIZED = 401;
const HTTP_SERVER_ERROR = 500;
const COOKIE_MAX_AGE_SEC = 3600; // 1 hour, we can change this later
const SALT_ROUNDS = 10;

export async function authRoutes(fastify: FastifyInstance) {

    // Registers user
    fastify.post('/register', async (request, reply) => {
        const { email, name, role, password } = request.body as any;

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
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as any;

        const client = await fastify.pg.connect();

        try {
            // Gets user from DB
            const user = await authDB.findUserByEmail(client, email);

            // Validates credentials
            const isMatch = user ? await bcrypt.compare(password, user.password) : false;

            if (!user || !isMatch) {
                return reply.code(HTTP_UNAUTHORIZED).send({ error: 'Invalid credentials' });
            }

            // Sets session cookie
            reply.setCookie('token', `user-${user.id}`, {
                path: '/',
                httpOnly: true,
                secure: false, // we must set this to true later for CORS (HTTPS)
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
        const token = request.cookies.token;

        if (!token) {
            return reply.code(HTTP_UNAUTHORIZED).send({ error: 'Not authenticated' });
        }

        return reply.code(HTTP_OK).send({
            status: 'authenticated',
            token_preview: token
        });
    });
}