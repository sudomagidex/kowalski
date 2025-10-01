import { Router, Request, Response } from 'express';

import { SessionManager } from '../../bot/index.js';
import { ApiResponse, SendMessageRequest, SessionInfo } from '../../shared/types/index.js';
import { logger } from '../../shared/utils/logger.js';


export const createSessionRoutes = (sessionManager: SessionManager): Router => {
    const router = Router();

    // Get all sessions
    router.get('/', (_req: Request, res: Response<ApiResponse<SessionInfo[]>>) => {
        try {
            const sessions = sessionManager.getAllSessions();
            const sessionsInfo: SessionInfo[] = sessions.map((session) => ({
                id: session.getSessionId(),
                status: session.isConnected() ? 'connected' : 'disconnected',
            }));

            res.json({
                success: true,
                data: sessionsInfo,
            });
        } catch (error) {
            logger.error({ error }, 'Failed to get sessions');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Create new session
    router.post('/', async (req: Request, res: Response<ApiResponse<SessionInfo>>) => {
        try {
            const { sessionId } = req.body as { sessionId: string };

            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'sessionId is required',
                });
                return;
            }

            if (sessionManager.hasSession(sessionId)) {
                res.status(409).json({
                    success: false,
                    error: 'Session already exists',
                });
                return;
            }

            const session = await sessionManager.createSession(sessionId);

            res.status(201).json({
                success: true,
                data: {
                    id: session.getSessionId(),
                    status: session.isConnected() ? 'connected' : 'qr',
                },
                message: 'Session created successfully',
            });
        } catch (error) {
            logger.error({ error }, 'Failed to create session');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Get session status
    router.get('/:sessionId', (req: Request, res: Response<ApiResponse<SessionInfo>>) => {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'sessionId is required',
                });
                return;
            }

            const session = sessionManager.getSession(sessionId);

            if (!session) {
                res.status(404).json({
                    success: false,
                    error: 'Session not found',
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: session.getSessionId(),
                    status: session.isConnected() ? 'connected' : 'disconnected',
                },
            });
        } catch (error) {
            logger.error({ error }, 'Failed to get session status');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Delete session
    router.delete('/:sessionId', async (req: Request, res: Response<ApiResponse>) => {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'sessionId is required',
                });
                return;
            }

            const deleted = await sessionManager.deleteSession(sessionId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Session not found',
                });
                return;
            }

            res.json({
                success: true,
                message: 'Session deleted successfully',
            });
        } catch (error) {
            logger.error({ error }, 'Failed to delete session');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    return router;
};

export const createMessageRoutes = (sessionManager: SessionManager): Router => {
    const router = Router();

    // Send message
    router.post('/send', async (req: Request, res: Response<ApiResponse>) => {
        try {
            const {
                sessionId = 'default',
                to,
                text,
                mediaUrl,
                type,
                caption,
            } = req.body as SendMessageRequest & { sessionId?: string };

            if (!to) {
                res.status(400).json({
                    success: false,
                    error: 'Recipient phone number is required',
                });
                return;
            }

            const session = sessionManager.getSession(sessionId);

            if (!session) {
                res.status(404).json({
                    success: false,
                    error: 'Session not found',
                });
                return;
            }

            if (!session.isConnected()) {
                res.status(400).json({
                    success: false,
                    error: 'Session is not connected',
                });
                return;
            }

            if (type === 'image' && mediaUrl) {
                await session.sendImageMessage(to, mediaUrl, caption);
            } else if (text) {
                await session.sendTextMessage(to, text);
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Invalid message data',
                });
                return;
            }

            res.json({
                success: true,
                message: 'Message sent successfully',
            });
        } catch (error) {
            logger.error({ error }, 'Failed to send message');
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    return router;
};
