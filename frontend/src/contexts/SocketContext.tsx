import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { accessToken, organizations } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const API_URL = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Clean URL to base if needed (remove /api/v1 if present)
        const baseUrl = API_URL.replace(/\/api\/v1$/, '');

        const newSocket = io(baseUrl, {
            path: '/socket.io',
            auth: {
                token: accessToken
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket Connected:', newSocket.id);
            setIsConnected(true);

            // Join Organization Room(s)
            if (organizations && organizations.length > 0) {
                organizations.forEach(org => {
                    console.log('Joining org room:', org.id);
                    newSocket.emit('join_organization', org.id);
                });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket Disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]); // Re-connect only if token changes

    // Handle org changes separately if needed, but usually orgs are loaded on login
    useEffect(() => {
        if (socket && isConnected && organizations && organizations.length > 0) {
            organizations.forEach(org => {
                socket.emit('join_organization', org.id);
            });
        }
    }, [organizations, socket, isConnected]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
