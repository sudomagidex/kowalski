export interface Config {
    port: number;
    nodeEnv: string;
    apiKey: string;
    sessionDir: string;
    qrTimeout: number;
    logLevel: string;
}

export const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiKey: process.env.API_KEY || 'development-key',
    sessionDir: process.env.SESSION_DIR || './sessions',
    qrTimeout: parseInt(process.env.QR_TIMEOUT || '60000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
