import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '@utils/auth.utils';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SocketUser,
} from '@types/socket.types';
import { chatHandler } from './handlers/chat.handler';
import { positionHandler } from './handlers/position.handler';
import { roomHandler } from './handlers/room.handler';

// 接続ユーザー管理
const connectedUsers = new Map<string, SocketUser>();

export const initializeSocket = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  // 認証ミドルウェア
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('認証トークンが必要です'));
      }

      const payload = verifyAccessToken(token);
      
      // ソケットデータにユーザー情報を追加
      socket.data.user = {
        userId: payload.id,
        userName: payload.name,
        userRole: payload.role,
        socketId: socket.id,
      };
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('認証に失敗しました'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user!;
    logger.info(`User connected: ${user.userName} (${socket.id})`);
    
    // 接続ユーザーを追加
    connectedUsers.set(socket.id, user);
    
    // デフォルトルームに参加
    socket.join('global');
    socket.join(`user:${user.userId}`);
    
    // ハンドラーの登録
    chatHandler(io, socket);
    positionHandler(io, socket);
    roomHandler(io, socket);
    
    // ユーザー参加通知
    socket.on('user:join', async () => {
      // 他のユーザーに参加を通知
      socket.broadcast.emit('user:joined', {
        user,
        position: {
          x: 400,
          y: 300,
          mapId: 'main',
        },
      });
      
      // オンラインユーザー一覧を送信
      const onlineUsers = Array.from(connectedUsers.values());
      socket.emit('users:online', onlineUsers);
    });
    
    // 切断処理
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${user.userName} (${socket.id}) - ${reason}`);
      
      // 接続ユーザーから削除
      connectedUsers.delete(socket.id);
      
      // 他のユーザーに退出を通知
      socket.broadcast.emit('user:left', { userId: user.userId });
    });
    
    // エラーハンドリング
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${user.userName}:`, error);
    });
  });
  
  // 定期的な接続状態チェック
  setInterval(() => {
    logger.debug(`Connected users: ${connectedUsers.size}`);
  }, 30000); // 30秒ごと
};

// ユーザー取得ヘルパー
export const getConnectedUsers = (): Map<string, SocketUser> => {
  return connectedUsers;
};

// 特定ユーザーの取得
export const getUser = (socketId: string): SocketUser | undefined => {
  return connectedUsers.get(socketId);
};

// ユーザーIDからソケットIDを取得
export const getSocketIdByUserId = (userId: string): string | undefined => {
  for (const [socketId, user] of connectedUsers) {
    if (user.userId === userId) {
      return socketId;
    }
  }
  return undefined;
};
