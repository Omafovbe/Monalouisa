import fs from 'fs'
import path from 'path'

class Logger {
  private logFile: string

  constructor() {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir)
    }

    // Create a new log file for each day
    const date = new Date().toISOString().split('T')[0]
    this.logFile = path.join(logsDir, `${date}.log`)
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
    return `[${timestamp}] ${level}: ${message}${dataString}\n${'='.repeat(
      80
    )}\n`
  }

  private writeLog(message: string) {
    fs.appendFileSync(this.logFile, message)
  }

  private async logToAPI(level: string, message: string, data?: any) {
    try {
      const logEntry = {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
      }

      // In development, just console log
      if (process.env.NODE_ENV === 'development') {
        const formattedMessage = this.formatMessage(level, message, data)
        switch (level.toLowerCase()) {
          case 'info':
            console.info(formattedMessage)
            break
          case 'error':
            console.error(formattedMessage)
            break
          case 'warn':
            console.warn(formattedMessage)
            break
          case 'debug':
            console.debug(formattedMessage)
            break
          default:
            console.log(formattedMessage)
        }
        return
      }

      // In production, you could send to a logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   body: JSON.stringify(logEntry),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
    } catch (error) {
      // Fallback to console in case of error
      console.error('Logging failed:', error)
      switch (level.toLowerCase()) {
        case 'info':
          console.info(message, data)
          break
        case 'error':
          console.error(message, data)
          break
        case 'warn':
          console.warn(message, data)
          break
        case 'debug':
          console.debug(message, data)
          break
        default:
          console.log(message, data)
      }
    }
  }

  async info(message: string, data?: any) {
    await this.logToAPI('INFO', message, data)
  }

  async error(message: string, data?: any) {
    await this.logToAPI('ERROR', message, data)
  }

  async warn(message: string, data?: any) {
    await this.logToAPI('WARN', message, data)
  }

  async debug(message: string, data?: any) {
    await this.logToAPI('DEBUG', message, data)
  }
}

// Export a singleton instance
export const logger = new Logger()
