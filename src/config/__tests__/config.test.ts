import { config } from '../index';

describe('Config', () => {
    describe('Environment Variables', () => {
        it('should have default port value', () => {
            expect(config.port).toBeDefined();
            expect(typeof config.port).toBe('number');
        });

        it('should have default node environment', () => {
            expect(config.nodeEnv).toBeDefined();
            expect(typeof config.nodeEnv).toBe('string');
        });

        it('should have API key', () => {
            expect(config.apiKey).toBeDefined();
            expect(typeof config.apiKey).toBe('string');
        });

        it('should have session directory', () => {
            expect(config.sessionDir).toBeDefined();
            expect(typeof config.sessionDir).toBe('string');
        });

        it('should have QR timeout', () => {
            expect(config.qrTimeout).toBeDefined();
            expect(typeof config.qrTimeout).toBe('number');
        });

        it('should have log level', () => {
            expect(config.logLevel).toBeDefined();
            expect(typeof config.logLevel).toBe('string');
        });
    });

    describe('Type Safety', () => {
        it('should return number for port', () => {
            expect(config.port).toBeGreaterThan(0);
            expect(config.port).toBeLessThan(65536);
        });

        it('should return valid log level', () => {
            const validLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
            expect(validLevels).toContain(config.logLevel);
        });

        it('should have positive QR timeout', () => {
            expect(config.qrTimeout).toBeGreaterThan(0);
        });
    });
});
