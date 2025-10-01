import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { ApiServer } from './api/index.js';
import { SessionManager } from './bot/index.js';
import { config } from './config/index.js';
import { logger } from './shared/utils/logger.js';

function bootstrap(): void {
    try {
        logger.info('Starting Kowalski WhatsApp Bot...');

        // Initialize session manager
        const sessionManager = new SessionManager();

        // Initialize API server
        const apiServer = new ApiServer(config.port, sessionManager);
        apiServer.start();

        // Graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Shutting down gracefully...');
            const sessions = sessionManager.getAllSessions();
            await Promise.all(sessions.map((session) => session.disconnect()));
            process.exit(0);
        });
    } catch (error) {
        logger.error({ error }, 'Failed to start application');
        process.exit(1);
    }
}

bootstrap()
