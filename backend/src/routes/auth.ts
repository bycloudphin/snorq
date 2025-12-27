import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required').optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
    credential: z.string(),
});

// Types
interface RegisterBody {
    email: string;
    password: string;
    name?: string;
}

interface LoginBody {
    email: string;
    password: string;
}

interface GoogleAuthBody {
    credential: string;
}

// JWT helpers
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_ACCESS_EXPIRY_SECONDS = 15 * 60; // 15 minutes in seconds

function generateAccessToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY_SECONDS });
}

function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
}

async function saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
    // Register with email/password
    app.post('/auth/register', async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
        try {
            const validation = registerSchema.safeParse(request.body);
            if (!validation.success) {
                return reply.status(400).send({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Validation error',
                        details: validation.error.errors,
                    },
                });
            }

            const { email, password, name } = validation.data;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return reply.status(409).send({
                    success: false,
                    error: {
                        code: 409,
                        message: 'User with this email already exists',
                    },
                });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatarUrl: true,
                    createdAt: true,
                },
            });

            // Generate tokens
            const accessToken = generateAccessToken(user.id, user.email);
            const refreshToken = generateRefreshToken();
            await saveRefreshToken(user.id, refreshToken);

            // Set refresh token as httpOnly cookie
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });

            return reply.status(201).send({
                success: true,
                data: {
                    user,
                    accessToken,
                },
            });
        } catch (error) {
            console.error('Register error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });

    // Login with email/password
    app.post('/auth/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
        try {
            const validation = loginSchema.safeParse(request.body);
            if (!validation.success) {
                return reply.status(400).send({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Validation error',
                        details: validation.error.errors,
                    },
                });
            }

            const { email, password } = validation.data;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user || !user.passwordHash) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPassword) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            // Generate tokens
            const accessToken = generateAccessToken(user.id, user.email);
            const refreshToken = generateRefreshToken();
            await saveRefreshToken(user.id, refreshToken);

            // Set refresh token as httpOnly cookie
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
            });

            return reply.send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                    },
                    accessToken,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });

    // Google OAuth - verify Google credential token and create/login user
    app.post('/auth/google', async (request: FastifyRequest<{ Body: GoogleAuthBody }>, reply: FastifyReply) => {
        try {
            const validation = googleAuthSchema.safeParse(request.body);
            if (!validation.success) {
                return reply.status(400).send({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Invalid Google credential',
                    },
                });
            }

            const { credential } = validation.data;

            // Verify Google token
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid Google token',
                    },
                });
            }

            const { sub: googleId, email, name, picture } = payload;

            if (!email) {
                return reply.status(400).send({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Email not provided by Google',
                    },
                });
            }

            // Find or create user
            let user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { googleId },
                        { email },
                    ],
                },
            });

            if (user) {
                // Update Google ID and avatar if not set
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: googleId || user.googleId,
                        avatarUrl: picture || user.avatarUrl,
                        name: name || user.name,
                        emailVerified: true,
                    },
                });
            } else {
                // Create new user
                user = await prisma.user.create({
                    data: {
                        email,
                        googleId,
                        name,
                        avatarUrl: picture,
                        emailVerified: true,
                    },
                });
            }

            // Generate tokens
            const accessToken = generateAccessToken(user.id, user.email);
            const refreshToken = generateRefreshToken();
            await saveRefreshToken(user.id, refreshToken);

            // Set refresh token as httpOnly cookie
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60,
            });

            return reply.send({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                    },
                    accessToken,
                },
            });
        } catch (error) {
            console.error('Google auth error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Failed to authenticate with Google',
                },
            });
        }
    });

    // Refresh access token
    app.post('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const refreshTokenValue = request.cookies.refreshToken;

            if (!refreshTokenValue) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Refresh token not provided',
                    },
                });
            }

            // Find refresh token
            const refreshToken = await prisma.refreshToken.findUnique({
                where: { token: refreshTokenValue },
                include: { user: true },
            });

            if (!refreshToken || refreshToken.expiresAt < new Date()) {
                // Delete expired token if exists
                if (refreshToken) {
                    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
                }
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid or expired refresh token',
                    },
                });
            }

            // Generate new access token
            const accessToken = generateAccessToken(refreshToken.user.id, refreshToken.user.email);

            return reply.send({
                success: true,
                data: { accessToken },
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });

    // Logout
    app.post('/auth/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const refreshTokenValue = request.cookies.refreshToken;

            if (refreshTokenValue) {
                // Delete refresh token from database
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshTokenValue },
                });
            }

            // Clear cookie
            reply.clearCookie('refreshToken', {
                path: '/',
            });

            return reply.send({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            console.error('Logout error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });

    // Get current user (requires authentication)
    app.get('/auth/me', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Authentication required',
                    },
                });
            }

            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatarUrl: true,
                        emailVerified: true,
                        createdAt: true,
                    },
                });

                if (!user) {
                    return reply.status(404).send({
                        success: false,
                        error: {
                            code: 404,
                            message: 'User not found',
                        },
                    });
                }

                return reply.send({
                    success: true,
                    data: { user },
                });
            } catch {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid or expired token',
                    },
                });
            }
        } catch (error) {
            console.error('Get me error:', error);
            return reply.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                },
            });
        }
    });
}
