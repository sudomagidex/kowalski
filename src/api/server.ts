import express, { Express } from 'express';

import { SessionManager } from '../bot/index.js';
import { logger } from '../shared/utils/logger.js';

import { authMiddleware, errorHandler } from './middlewares/index.js';
import { createSessionRoutes, createMessageRoutes } from './routes/index.js';

export class ApiServer {
    private app: Express;
    private sessionManager: SessionManager;
    private port: number;

    constructor(port: number, sessionManager: SessionManager) {
        this.app = express();
        this.port = port;
        this.sessionManager = sessionManager;
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandlers();
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        // Health check
        this.app.get('/health', (_req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        // Protected routes
        this.app.use('/api/sessions', authMiddleware, createSessionRoutes(this.sessionManager));
        this.app.use('/api/messages', authMiddleware, createMessageRoutes(this.sessionManager));

        // 404 handler
        this.app.use((_req, res) => {
            res.status(404).json({
                success: false,
                error: 'Route not found',
            });
        });
    }

    private setupErrorHandlers(): void {
        this.app.use(errorHandler);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            logger.info({ port: this.port }, 'API server started');
        });
    }

    public getApp(): Express {
        return this.app;
    }
}
