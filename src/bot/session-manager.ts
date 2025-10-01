import { WhatsAppSession } from './session.js';

export class SessionManager {
    private sessions: Map<string, WhatsAppSession> = new Map();

    public async createSession(sessionId: string): Promise<WhatsAppSession> {
        if (this.sessions.has(sessionId)) {
            return this.sessions.get(sessionId)!;
        }

        const session = new WhatsAppSession(sessionId);
        await session.initialize();
        this.sessions.set(sessionId, session);

        return session;
    }

    public getSession(sessionId: string): WhatsAppSession | undefined {
        return this.sessions.get(sessionId);
    }

    public getAllSessions(): WhatsAppSession[] {
        return Array.from(this.sessions.values());
    }

    public async deleteSession(sessionId: string): Promise<boolean> {
        const session = this.sessions.get(sessionId);
        if (session) {
            await session.disconnect();
            this.sessions.delete(sessionId);
            return true;
        }
        return false;
    }

    public hasSession(sessionId: string): boolean {
        return this.sessions.has(sessionId);
    }
}
