export const NOTION_DATABASE_ID: string | undefined = process.env.NOTION_DATABASE_ID;

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

function getLogLevel(): LogLevel {
  const logLevel = process.env.LOG_LEVEL as LogLevel;
  return Object.values(LogLevel).includes(logLevel) ? logLevel : LogLevel.INFO;
}
export const LOG_LEVEL: LogLevel = getLogLevel();

