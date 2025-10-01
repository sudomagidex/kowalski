jest.mock('../../config', () => ({
    config: {
        apiKey: 'test-api-key',
        logLevel: 'info',
        nodeEnv: 'test',
    },
}));

jest.mock('../../bot');

import express, { Express } from 'express';
import request from 'supertest';

import { SessionManager } from '../../bot';
import { authMiddleware } from '../middlewares/auth';
import { createSessionRoutes, createMessageRoutes } from '../routes';

describe('API Routes', () => {
    let app: Express;
    let sessionManager: jest.Mocked<SessionManager>;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        sessionManager = new SessionManager() as jest.Mocked<SessionManager>;

        app.use('/sessions', authMiddleware, createSessionRoutes(sessionManager));
        app.use('/messages', authMiddleware, createMessageRoutes(sessionManager));
    });

    describe('Authentication', () => {
        it('should reject requests without API key', async () => {
            const response = await request(app).get('/sessions');
            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid API key', async () => {
            const response = await request(app).get('/sessions').set('x-api-key', 'invalid-key');
            expect(response.status).toBe(401);
        });

        it('should accept requests with valid API key', async () => {
            sessionManager.getAllSessions = jest.fn().mockReturnValue([]);

            const response = await request(app).get('/sessions').set('x-api-key', 'test-api-key');

            expect(response.status).toBe(200);
        });
    });

    describe('Session Routes', () => {
        describe('GET /sessions', () => {
            it('should return list of sessions', async () => {
                const mockSessions = [
                    { getSessionId: () => 'session-1', isConnected: () => true },
                    { getSessionId: () => 'session-2', isConnected: () => false },
                ];

                sessionManager.getAllSessions = jest.fn().mockReturnValue(mockSessions);

                const response = await request(app).get('/sessions').set('x-api-key', 'test-api-key');

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveLength(2);
            });
        });

        describe('POST /sessions', () => {
            it('should create new session', async () => {
                const mockSession = {
                    getSessionId: () => 'new-session',
                    isConnected: () => false,
                };

                sessionManager.hasSession = jest.fn().mockReturnValue(false);
                sessionManager.createSession = jest.fn().mockResolvedValue(mockSession);

                const response = await request(app)
                    .post('/sessions')
                    .set('x-api-key', 'test-api-key')
                    .send({ sessionId: 'new-session' });

                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
            });

            it('should return 400 if sessionId is missing', async () => {
                const response = await request(app)
                    .post('/sessions')
                    .set('x-api-key', 'test-api-key')
                    .send({});

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
            });

            it('should return 409 if session already exists', async () => {
                sessionManager.hasSession = jest.fn().mockReturnValue(true);

                const response = await request(app)
                    .post('/sessions')
                    .set('x-api-key', 'test-api-key')
                    .send({ sessionId: 'existing-session' });

                expect(response.status).toBe(409);
                expect(response.body.success).toBe(false);
            });
        });
    });

    describe('Message Routes', () => {
        describe('POST /messages/send', () => {
            it('should send text message', async () => {
                const mockSession = {
                    isConnected: () => true,
                    sendTextMessage: jest.fn().mockResolvedValue(undefined),
                };

                sessionManager.getSession = jest.fn().mockReturnValue(mockSession);

                const response = await request(app)
                    .post('/messages/send')
                    .set('x-api-key', 'test-api-key')
                    .send({
                        to: '5511999999999',
                        text: 'Hello, World!',
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(mockSession.sendTextMessage).toHaveBeenCalledWith('5511999999999', 'Hello, World!');
            });

            it('should return 400 if recipient is missing', async () => {
                const response = await request(app)
                    .post('/messages/send')
                    .set('x-api-key', 'test-api-key')
                    .send({ text: 'Hello' });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
            });

            it('should return 404 if session not found', async () => {
                sessionManager.getSession = jest.fn().mockReturnValue(undefined);

                const response = await request(app)
                    .post('/messages/send')
                    .set('x-api-key', 'test-api-key')
                    .send({
                        to: '5511999999999',
                        text: 'Hello',
                    });

                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
            });

            it('should return 400 if session not connected', async () => {
                const mockSession = {
                    isConnected: () => false,
                };

                sessionManager.getSession = jest.fn().mockReturnValue(mockSession);

                const response = await request(app)
                    .post('/messages/send')
                    .set('x-api-key', 'test-api-key')
                    .send({
                        to: '5511999999999',
                        text: 'Hello',
                    });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
            });
        });
    });
});
