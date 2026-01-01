import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthPayload {
    userId: string;
    email: string;
}

export class SocketService {
    private static instance: SocketService;
    private io: Server | null = null;
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(httpServer: HttpServer, corsOrigins: string[]) {
        if (this.io) return;

        this.io = new Server(httpServer, {
            cors: {
                origin: corsOrigins,
                methods: ["GET", "POST"],
                credentials: true
            },
            path: '/socket.io'
        });

        this.io.use(async (socket, next) => {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            try {
                const decoded = jwt.verify(token, this.JWT_SECRET) as AuthPayload;
                socket.data.user = decoded;
                next();
            } catch (err) {
                next(new Error('Authentication error: Invalid token'));
            }
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`🔌 User connected: ${socket.data.user?.userId} (Socket ID: ${socket.id})`);

            socket.on('join_organization', (organizationId: string) => {
                // In a real app, verify user belongs to org here
                socket.join(`org_${organizationId}`);
                logger.info(`User ${socket.data.user?.userId} joined org_${organizationId}`);
            });

            socket.on('disconnect', () => {
                // logger.info(`User disconnected: ${socket.id}`);
            });
        });

        logger.info('🚀 Socket.io initialized');
    }

    public emitToOrganization(organizationId: string, event: string, data: any) {
        if (!this.io) {
            logger.warn('Socket.io not initialized, cannot emit event');
            return;
        }
        this.io.to(`org_${organizationId}`).emit(event, data);
        logger.debug(`📡 Emitted ${event} to org_${organizationId}`);
    }
}
