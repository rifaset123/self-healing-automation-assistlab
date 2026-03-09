import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test'; // Required for Allure attachments
import { TestStatus } from '../helper/enum';

export class Logger {
  private logFile: string;
  private logs: string[] = []; // Store logs in memory before attaching

  constructor() {
    const logDir = path.join(__dirname, '../logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logFile = path.join(logDir, `Logger.log`);
    fs.writeFileSync(this.logFile, `[START LOG] ${new Date().toISOString()}\n`, { flag: 'w' });
  }

  /** Logs general information */
  log(message: string) {
    this.writeLog(`[INFO] ${message}`);
  }

  /** Logs a warning message */
  warn(message: string) {
    this.writeLog(`[WARN] ${message}`);
  }

  /** Logs an error message */
  error(message: string) {
    this.writeLog(`[ERROR] ${message}`);
  }

  /** Logs test status (PASSED, FAILED, TIMEDOUT) */
  testStatus(status: TestStatus) {
    this.writeLog(`[TEST STATUS] ${status}`);
  }

  /** Writes the log entry to file, console, and stores it for Allure */
  private writeLog(entry: string) {
    try {
      const logMessage = `${new Date().toISOString()} - ${entry}`;
      console.log(logMessage);
      fs.appendFileSync(this.logFile, logMessage + '\n');
      this.logs.push(logMessage); // Store log in memory
    } catch (error) {
      console.error(`❌ Failed to write log: ${error}`);
    }
  }

  /** Attach logs to Allure at the end of the test */
  attachLogsToAllure(testName: string) {
    try {
      const logContent = this.logs.join('\n'); // Convert logs to string
      test.info().attach(`📝 Logs - ${testName}`, { body: logContent, contentType: 'text/plain' });
      this.logs = []; // Clear logs after attaching
    } catch (error) {
      console.error(`❌ Failed to attach logs to Allure: ${error}`);
    }
  }
}
