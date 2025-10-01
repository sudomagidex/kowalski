export interface MessagePayload {
    from: string;
    to?: string;
    text?: string;
    timestamp: number;
    messageId: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker';
    mediaUrl?: string;
    caption?: string;
}

export interface SendMessageRequest {
    to: string;
    text?: string;
    mediaUrl?: string;
    type?: 'text' | 'image' | 'audio' | 'document' | 'sticker';
    caption?: string;
}

export interface SessionInfo {
    id: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'qr';
    qr?: string;
    connectedAt?: Date;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
