import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Logger } from '../../src/logger'

describe('Logger', () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  describe('shouldLog', () => {
    it('should filter messages by log level', () => {
      const logger = new Logger('warn')

      logger.debug('debug message')
      logger.info('info message')
      logger.warn('warn message')
      logger.error('error message')

      // Only warn and error should be logged
      expect(logSpy).toHaveBeenCalledTimes(2)
    })

    it('should log all levels when minLevel is debug', () => {
      const logger = new Logger('debug')

      logger.debug('debug message')
      logger.info('info message')
      logger.warn('warn message')
      logger.error('error message')

      expect(logSpy).toHaveBeenCalledTimes(4)
    })
  })

  describe('formatLog', () => {
    it('should format log entries with timestamp and level', () => {
      const logger = new Logger('debug')

      logger.info('test message', { userId: 123 })

      expect(logSpy).toHaveBeenCalled()
      const call = logSpy.mock.calls[0]
      // First argument contains the message with level and timestamp
      expect(call[0]).toContain('[INFO]')
      expect(call[0]).toContain('test message')
    })
  })

  describe('log methods', () => {
    it('should call logToConsole via debug method', () => {
      const logger = new Logger('debug')
      logger.debug('debug test')
      expect(logSpy).toHaveBeenCalled()
    })

    it('should call logToConsole via info method', () => {
      const logger = new Logger('info')
      logger.info('info test')
      expect(logSpy).toHaveBeenCalled()
    })

    it('should call logToConsole via warn method', () => {
      const logger = new Logger('debug')
      logger.warn('warn test')
      expect(logSpy).toHaveBeenCalled()
    })

    it('should call logToConsole via error method', () => {
      const logger = new Logger('debug')
      logger.error('error test')
      expect(logSpy).toHaveBeenCalled()
    })
  })
})
