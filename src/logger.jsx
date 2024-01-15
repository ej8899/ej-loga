//
// Data logging system
//

const logLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
};

class Logger {
  constructor(name, serverUrl = 'https://erniejohnson.ca/cgi-bin/log.py') {
    this.name = name;
    this.level = logLevels.INFO; // Default log level
    this.consoleOutput = true; // show log messages in console?
    this.serverSend = true; // send logMessage to server for actual logging
    this.serverUrl = serverUrl;
  }

  setLogLevel(level) {
    this.level = logLevels[level.toUpperCase()] || logLevels.INFO;
  }

  toggleConsoleLog(shouldLog) {
    this.consoleOutput = shouldLog;
  }

  getEnvironmentInfo() {
    const userAgent = window.navigator.userAgent;
    const browserData = this.parseUserAgent(userAgent);

    return {
      browser: browserData.browserName,
      version: browserData.browserVersion,
      os: window.navigator.platform,
      device: this.getDeviceType(),
    };
  }

  parseUserAgent(userAgent) {
    const match = userAgent.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    const [, browserName, browserVersion] = match;

    return { browserName, browserVersion };
  }

  getDeviceType() {
    const isMobile = /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    );
    return isMobile ? 'Mobile' : 'Desktop';
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  log(level, message) {
    const logMessage = `[${level}] [${this.name}] ${message}`;
    const formattedLog = `[${new Date().toISOString()}] ${logMessage}`;
    const environment = this.getEnvironmentInfo();
    // console.log(this.consoleOutput)
    if (this.consoleOutput) {
      switch (level) {
        case 'TRACE':
          console.log('\x1b[36m%s\x1b[0m', logMessage); // Cyan
          break;
        case 'DEBUG':
          console.log('\x1b[32m%s\x1b[0m', logMessage); // Green
          break;
        case 'INFO':
          console.log('\x1b[34m%s\x1b[0m', logMessage); // Blue
          break;
        case 'WARN':
          console.log('\x1b[33m%s\x1b[0m', logMessage); // Yellow
          break;
        case 'ERROR':
          console.log('\x1b[31m%s\x1b[0m', logMessage); // Red
          break;
        case 'FATAL':
          console.log('\x1b[41m%s\x1b[0m', logMessage); // Background Red
          break;
        default:
          console.log(logMessage);
      }

      if (this.serverSend) {
        let userId = this.getUserId();
        if (!userId) {
          userId = 'unknown';
        }
        this.sendLogToServer({
          date: new Date().toISOString(),
          log: logMessage,
          environment,
          userId,
        }).catch((error) => {
          console.error('Error while sending log to server:', error);
        });
      }
    }
  }

  async sendLogToServer(logData) {
    try {
      const formData = new FormData();
      formData.append('logData', JSON.stringify(logData));

      const response = await fetch(this.serverUrl, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to send log to server:', response.statusText);
      }
    } catch (error) {
      console.error('Error while sending log to server:', error);
    }
  }

  trace(message) {
    this.log('TRACE', message);
  }

  debug(message) {
    this.log('DEBUG', message);
  }

  info(message) {
    this.log('INFO', message);
  }

  warn(message) {
    this.log('WARN', message);
  }

  error(message) {
    this.log('ERROR', message);
  }

  fatal(message) {
    this.log('FATAL', message);
  }
}

const logger = new Logger('LOGA');
logger.toggleConsoleLog(true);

export default logger;
