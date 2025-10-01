// Mock do Baileys para testes
const mockWASocket = {};

const makeWASocket = jest.fn(() => ({
    ev: {
        on: jest.fn(),
    },
    sendMessage: jest.fn(),
    logout: jest.fn(),
    user: undefined,
}));

const useMultiFileAuthState = jest.fn(() => ({
    state: {},
    saveCreds: jest.fn(),
}));

export default makeWASocket;
export { makeWASocket, useMultiFileAuthState, mockWASocket as WASocket };

export const DisconnectReason = {
    connectionClosed: 428,
    connectionLost: 408,
    connectionReplaced: 440,
    timedOut: 408,
    loggedOut: 401,
    badSession: 500,
    restartRequired: 515,
    multideviceMismatch: 411,
};
