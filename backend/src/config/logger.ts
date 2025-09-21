import winston from 'winston';
import config from './config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// カスタムフォーマット
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return stack 
    ? `${timestamp} [${level}]: ${message}\n${stack}`
    : `${timestamp} [${level}]: ${message}`;
});

// ロガーの作成
const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    customFormat
  ),
  transports: [
    // コンソール出力
    new winston.transports.Console({
      format: combine(
        colorize(),
        customFormat
      ),
    }),
    // ファイル出力（エラーログ）
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // ファイル出力（全ログ）
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 開発環境では詳細なログを出力
if (config.server.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      customFormat
    ),
  }));
}

export default logger;
