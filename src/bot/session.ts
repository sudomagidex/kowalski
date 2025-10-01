import { Boom } from '@hapi/boom';
import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    WASocket,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';

import { config } from '../config/index.js';
import { logger } from '../shared/utils/logger.js';

export class WhatsAppSession {
    private socket: WASocket | null = null;
    private sessionId: string;
    private qrCallback?: (qr: string) => void;
    private connectedCallback?: () => void;
    private disconnectedCallback?: () => void;

    constructor(sessionId: string = 'default') {
        this.sessionId = sessionId;
    }

    public async initialize(): Promise<void> {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(
                `${config.sessionDir}/${this.sessionId}`,
            );

            this.socket = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: logger.child({ module: 'baileys' }),
            });

            this.setupEventHandlers(saveCreds);

            logger.info({ sessionId: this.sessionId }, 'WhatsApp session initialized');
        } catch (error) {
            logger.error({ error, sessionId: this.sessionId }, 'Failed to initialize session');
            throw error;
        }
    }

    private setupEventHandlers(saveCreds: () => Promise<void>): void {
        if (!this.socket) return;

        this.socket.ev.on('creds.update', saveCreds);

        this.socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                logger.info('QR Code generated');
                qrcode.generate(qr, { small: true });
                this.qrCallback?.(qr);
            }

            if (connection === 'close') {
                const shouldReconnect =
                    (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

                logger.info({ shouldReconnect, sessionId: this.sessionId }, 'Connection closed');

                this.disconnectedCallback?.();

                if (shouldReconnect) {
                    await this.initialize();
                }
            } else if (connection === 'open') {
                logger.info({ sessionId: this.sessionId }, 'WhatsApp connection opened');
                this.connectedCallback?.();
            }
        });

        this.socket.ev.on('messages.upsert', async (m) => {
            logger.debug({ messages: m.messages }, 'Messages received');
        });
    }

    public async sendTextMessage(to: string, text: string): Promise<void> {
        if (!this.socket) {
            throw new Error('Socket not initialized');
        }

        const formattedNumber = this.formatPhoneNumber(to);
        await this.socket.sendMessage(formattedNumber, { text });
        logger.info({ to: formattedNumber }, 'Text message sent');
    }

    public async sendImageMessage(to: string, imageUrl: string, caption?: string): Promise<void> {
        if (!this.socket) {
            throw new Error('Socket not initialized');
        }

        const formattedNumber = this.formatPhoneNumber(to);
        await this.socket.sendMessage(formattedNumber, {
            image: { url: imageUrl },
            caption,
        });
        logger.info({ to: formattedNumber }, 'Image message sent');
    }

    public onQR(callback: (qr: string) => void): void {
        this.qrCallback = callback;
    }

    public onConnected(callback: () => void): void {
        this.connectedCallback = callback;
    }

    public onDisconnected(callback: () => void): void {
        this.disconnectedCallback = callback;
    }

    public isConnected(): boolean {
        return this.socket?.user !== undefined;
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    private formatPhoneNumber(number: string): string {
        const cleaned = number.replace(/\D/g, '');
        return `${cleaned}@s.whatsapp.net`;
    }

    public async disconnect(): Promise<void> {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
            logger.info({ sessionId: this.sessionId }, 'Session disconnected');
        }
    }
}
