import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const fileTransports = [
  new winston.transports.DailyRotateFile({
    filename: path.resolve(__dirname, '../../', 'logs', `%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    handleExceptions: true,
    maxFiles: process.env.LOG_FILE_MAX_SPAN || '30d',
    maxSize: process.env.LOG_FILE_MAX_SIZE || '5m'
  })
];

const { combine, timestamp, printf, prettyPrint, json } = winston.format;

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    prettyPrint(),
    json(),
    timestamp(),
    printf(info => {
      return JSON.stringify({
        level: info.level,
        message: info.message,
        meta: info.meta || null,
        timestamp: info.timestamp
      });
    })
  ),
  transports: [...fileTransports],
  exitOnError: false
});

export default logger;
