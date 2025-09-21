import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import config from '@config/config';
import { connectDatabase, disconnectDatabase } from '@config/database';
import logger from '@config/logger';
import routes from '@routes/index';
import { errorHandler, notFound } from '@middleware/error.middleware';
import { initializeSocket } from '@socket/socketManager';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/types/socket.types';

// Expressアプリの初期化
const app: Application = express();
const httpServer = createServer(app);

// Socket.ioの初期化
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ミドルウェアの設定
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ロギング
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// レート制限
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'リクエストが多すぎます。しばらく待ってから再度お試しください。',
});
app.use('/api', limiter);

// APIルート
app.use('/api', routes);

// Socket.ioの初期化
initializeSocket(io);

// エラーハンドリング
app.use(notFound);
app.use(errorHandler);

// グレースフルシャットダウン
const gracefulShutdown = async () => {
  logger.info('Starting graceful shutdown...');
  
  // 新しい接続を拒否
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Socket.io接続を閉じる
  io.disconnectSockets(true);
  logger.info('Socket connections closed');
  
  // データベース接続を閉じる
  await disconnectDatabase();
  
  process.exit(0);
};

// シグナルハンドリング
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 未処理のエラーハンドリング
process.on('unhandledRejection', (reason: Error | any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// サーバーの起動
const startServer = async () => {
  try {
    // データベース接続
    await connectDatabase();
    
    // サーバー起動
    const PORT = config.server.port;
    httpServer.listen(PORT, () => {
      logger.info(`
        ################################################
        🚀 Server is running on port ${PORT}
        🌍 Environment: ${config.server.env}
        📦 API: http://localhost:${PORT}/api
        🔌 WebSocket: ws://localhost:${PORT}
        ################################################
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// サーバー起動
startServer();

export { app, httpServer, io };
