type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

export class Logger {
  private minLevel: LogLevel = 'info'

  constructor(minLevel?: LogLevel) {
    if (minLevel) {
      this.minLevel = minLevel
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel]
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    }
  }

  private logToConsole(entry: LogEntry) {
    const style = {
      debug: 'color: #999',
      info: 'color: #0066cc',
      warn: 'color: #ff8800',
      error: 'color: #cc0000'
    }

    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`
    console.log(
      `%c${prefix} %c${entry.message}`,
      style[entry.level],
      'color: inherit'
    )

    if (entry.data) {
      console.log(entry.data)
    }
  }

  debug(message: string, data?: unknown) {
    const entry = this.formatLog('debug', message, data)
    if (this.shouldLog('debug')) {
      this.logToConsole(entry)
    }
  }

  info(message: string, data?: unknown) {
    const entry = this.formatLog('info', message, data)
    if (this.shouldLog('info')) {
      this.logToConsole(entry)
    }
  }

  warn(message: string, data?: unknown) {
    const entry = this.formatLog('warn', message, data)
    if (this.shouldLog('warn')) {
      this.logToConsole(entry)
    }
  }

  error(message: string, data?: unknown) {
    const entry = this.formatLog('error', message, data)
    if (this.shouldLog('error')) {
      this.logToConsole(entry)
    }
  }
}

export const logger = new Logger('debug')
