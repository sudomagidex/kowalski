import { WhatsAppSession } from '../session';
import { SessionManager } from '../session-manager';

// Mock WhatsAppSession
jest.mock('../session');

describe('SessionManager', () => {
    let sessionManager: SessionManager;

    beforeEach(() => {
        sessionManager = new SessionManager();
        jest.clearAllMocks();
    });

    describe('createSession', () => {
        it('should create a new session', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            const session = await sessionManager.createSession('test-session');

            expect(session).toBeDefined();
            expect(mockSession.initialize).toHaveBeenCalled();
        });

        it('should return existing session if already created', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            const session1 = await sessionManager.createSession('test-session');
            const session2 = await sessionManager.createSession('test-session');

            expect(session1).toBe(session2);
            expect(mockSession.initialize).toHaveBeenCalledTimes(1);
        });
    });

    describe('getSession', () => {
        it('should return undefined for non-existent session', () => {
            const session = sessionManager.getSession('non-existent');
            expect(session).toBeUndefined();
        });

        it('should return session if it exists', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            await sessionManager.createSession('test-session');
            const session = sessionManager.getSession('test-session');

            expect(session).toBeDefined();
        });
    });

    describe('getAllSessions', () => {
        it('should return empty array when no sessions exist', () => {
            const sessions = sessionManager.getAllSessions();
            expect(sessions).toEqual([]);
        });

        it('should return all created sessions', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            await sessionManager.createSession('session-1');
            await sessionManager.createSession('session-2');

            const sessions = sessionManager.getAllSessions();
            expect(sessions).toHaveLength(2);
        });
    });

    describe('deleteSession', () => {
        it('should return false for non-existent session', async () => {
            const result = await sessionManager.deleteSession('non-existent');
            expect(result).toBe(false);
        });

        it('should delete existing session', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
                disconnect: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            await sessionManager.createSession('test-session');
            const result = await sessionManager.deleteSession('test-session');

            expect(result).toBe(true);
            expect(mockSession.disconnect).toHaveBeenCalled();
            expect(sessionManager.getSession('test-session')).toBeUndefined();
        });
    });

    describe('hasSession', () => {
        it('should return false for non-existent session', () => {
            expect(sessionManager.hasSession('non-existent')).toBe(false);
        });

        it('should return true for existing session', async () => {
            const mockSession = {
                getSessionId: jest.fn().mockReturnValue('test-session'),
                initialize: jest.fn().mockResolvedValue(undefined),
            };

            (WhatsAppSession as jest.MockedClass<typeof WhatsAppSession>).mockImplementation(
                () => mockSession as unknown as WhatsAppSession,
            );

            await sessionManager.createSession('test-session');
            expect(sessionManager.hasSession('test-session')).toBe(true);
        });
    });
});
