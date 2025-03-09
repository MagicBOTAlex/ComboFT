// Idk, ChatGPT'd this

export type LogLevel = 'info' | 'warn' | 'debug' | 'error';

export class Logger {
    static log(level: LogLevel, message: string): void {
        switch (level) {
            case 'info':
                console.info(`INFO: ${message}`);
                break;
            case 'warn':
                console.warn(`WARN: ${message}`);
                break;
            case 'debug':
                console.debug(`DEBUG: ${message}`);
                break;
            case 'error':
                console.error(`ERROR: ${message}`);
                break;
            default:
                console.log(`LOG: ${message}`);
                break;
        }
    }
}