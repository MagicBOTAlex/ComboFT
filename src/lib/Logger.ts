export type LogLevel = 'info' | 'warn' | 'debug' | 'error';

export class Logger {
    static log(level: LogLevel, message: string, error?: Error | unknown): void {
        const formattedMessage = error ? `${message} - ${this.formatError(error)}` : message;
        
        switch (level) {
            case 'info':
                console.info(`INFO: ${formattedMessage}`);
                break;
            case 'warn':
                console.warn(`WARN: ${formattedMessage}`);
                break;
            case 'debug':
                console.debug(`DEBUG: ${formattedMessage}`);
                break;
            case 'error':
                console.error(`ERROR: ${formattedMessage}`);
                if (error instanceof Error) {
                    console.error(error.stack);
                }
                break;
            default:
                console.log(`LOG: ${formattedMessage}`);
                break;
        }
    }

    private static formatError(error: Error | unknown): string {
        if (error instanceof Error) {
            return `${error.name}: ${error.message}`;
        }
        return String(error);
    }
}