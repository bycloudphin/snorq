import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface User {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    emailVerified?: boolean;
}

interface Organization {
    id: string;
    name: string;
    slug: string;
    plan: 'FREE' | 'PRO' | 'BUSINESS';
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface AuthContextType {
    user: User | null;
    organizations: Organization[];
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
            fetchCurrentUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchCurrentUser = async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setOrganizations(data.data.organizations || []);
            } else {
                // Token might be expired, try to refresh
                const refreshed = await refreshToken();
                if (!refreshed) {
                    clearAuth();
                }
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            clearAuth();
        } finally {
            setIsLoading(false);
        }
    };

    const clearAuth = () => {
        setUser(null);
        setOrganizations([]);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setAccessToken(data.data.accessToken);
                localStorage.setItem('accessToken', data.data.accessToken);

                // Fetch full user data with organizations
                await fetchCurrentUser(data.data.accessToken);

                return { success: true };
            }

            return { success: false, error: data.error?.message || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const loginWithGoogle = async (credential: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ credential }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setOrganizations(data.data.organizations || []);
                setAccessToken(data.data.accessToken);
                localStorage.setItem('accessToken', data.data.accessToken);
                return { success: true };
            }

            return { success: false, error: data.error?.message || 'Google login failed' };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setAccessToken(data.data.accessToken);
                localStorage.setItem('accessToken', data.data.accessToken);

                // Fetch full user data with organizations
                await fetchCurrentUser(data.data.accessToken);

                return { success: true };
            }

            if (data.error?.details) {
                return { success: false, error: data.error.details[0]?.message || data.error.message };
            }
            return { success: false, error: data.error?.message || 'Registration failed' };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success && data.data?.accessToken) {
                setAccessToken(data.data.accessToken);
                localStorage.setItem('accessToken', data.data.accessToken);
                await fetchCurrentUser(data.data.accessToken);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    };

    const value: AuthContextType = {
        user,
        organizations,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
