import { Server, Socket } from 'socket.io';
import prisma from '@config/database';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/types/socket.types';

// オンラインユーザーのマップ
const onlineUsers = new Map<string, { x: number; y: number; userName: string }>();

export const positionHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const user = socket.data.user!;

  // プレイヤーの移動
  socket.on('player:move', async (data) => {
    try {
      const { x, y, userName, userId } = data;
      
      // 位置情報を更新
      await prisma.userPosition.upsert({
        where: { userId: userId || user.userId },
        update: { x, y, updatedAt: new Date() },
        create: {
          userId: userId || user.userId,
          x,
          y,
          mapId: 'main',
          direction: 'down',
        },
      });
      
      // オンラインユーザーマップを更新
      onlineUsers.set(userId || user.userId, { x, y, userName: userName || user.userName });
      
      // 他のプレイヤーに位置情報を送信
      socket.broadcast.emit('player:moved', {
        userId: userId || user.userId,
        x,
        y,
        userName: userName || user.userName,
      });
      
      logger.debug(`Player ${userName || user.userName} moved to (${x}, ${y})`);
    } catch (error) {
      logger.error('Position update error:', error);
      socket.emit('error', {
        message: '位置情報の更新に失敗しました',
        code: 'POSITION_UPDATE_ERROR',
      });
    }
  });

  // 接続時の処理
  socket.on('connect', async () => {
    try {
      // 既存のオンラインユーザーリストを送信
      const playersList = Array.from(onlineUsers.entries()).map(([id, pos]) => ({
        userId: id,
        x: pos.x,
        y: pos.y,
        userName: pos.userName,
      }));
      
      socket.emit('players:list', playersList);
      
      // 自分の位置情報を取得または作成
      const position = await prisma.userPosition.upsert({
        where: { userId: user.userId },
        update: {},
        create: {
          userId: user.userId,
          x: 400,
          y: 300,
          mapId: 'main',
          direction: 'down',
        },
      });
      
      // オンラインユーザーマップに追加
      onlineUsers.set(user.userId, {
        x: position.x,
        y: position.y,
        userName: user.userName,
      });
      
      // 他のプレイヤーに新しいプレイヤーの参加を通知
      socket.broadcast.emit('player:connected', {
        userId: user.userId,
        x: position.x,
        y: position.y,
        userName: user.userName,
      });
      
      logger.info(`Player ${user.userName} connected`);
    } catch (error) {
      logger.error('Player connect error:', error);
    }
  });

  // 切断時の処理
  socket.on('disconnect', () => {
    // オンラインユーザーマップから削除
    onlineUsers.delete(user.userId);
    
    // 他のプレイヤーに切断を通知
    socket.broadcast.emit('player:disconnected', user.userId);
    
    logger.info(`Player ${user.userName} disconnected`);
  });
};
