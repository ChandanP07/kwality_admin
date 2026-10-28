type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, you would send this to a logging service
    // For now, we'll just use console with proper formatting
    console[level === 'debug' ? 'log' : level](
      JSON.stringify(logObject, null, 2)
    );
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();