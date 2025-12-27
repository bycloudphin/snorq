import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data = await response.json();

                    if (data.success && data.data) {
                        return {
                            id: data.data.user.id,
                            email: data.data.user.email,
                            name: data.data.user.name,
                            image: data.data.user.avatarUrl,
                            accessToken: data.data.accessToken,
                        };
                    }
                    return null;
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // For Google sign-in, verify with our backend
            if (account?.provider === 'google' && account.id_token) {
                try {
                    const response = await fetch(`${API_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential: account.id_token }),
                    });

                    const data = await response.json();

                    if (data.success && data.data) {
                        // Store backend user data in the user object
                        user.id = data.data.user.id;
                        user.accessToken = data.data.accessToken;
                        user.organizations = data.data.organizations;
                        user.isNewUser = data.data.isNewUser;
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Google auth error:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.organizations = user.organizations;
                token.isNewUser = user.isNewUser;
            }

            // For credentials provider, get access token from user
            if (account?.provider === 'credentials' && user) {
                token.accessToken = user.accessToken;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.accessToken = token.accessToken as string;
                session.organizations = token.organizations as Array<{
                    id: string;
                    name: string;
                    slug: string;
                    plan: string;
                    role: string;
                }>;
                session.isNewUser = token.isNewUser as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
});

// Type declarations for NextAuth
declare module 'next-auth' {
    interface User {
        accessToken?: string;
        organizations?: Array<{
            id: string;
            name: string;
            slug: string;
            plan: string;
            role: string;
        }>;
        isNewUser?: boolean;
    }

    interface Session {
        accessToken?: string;
        organizations?: Array<{
            id: string;
            name: string;
            slug: string;
            plan: string;
            role: string;
        }>;
        isNewUser?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        accessToken?: string;
        organizations?: Array<{
            id: string;
            name: string;
            slug: string;
            plan: string;
            role: string;
        }>;
        isNewUser?: boolean;
    }
}
