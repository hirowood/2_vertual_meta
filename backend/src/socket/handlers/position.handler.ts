import { Server, Socket } from 'socket.io';
import prisma from '@config/database';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@types/socket.types';

export const positionHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const user = socket.data.user!;

  // 位置更新
  socket.on('user:move', async (data) => {
    try {
      const { position } = data;
      
      // 位置情報をDBに保存
      await prisma.userPosition.upsert({
        where: { userId: user.userId },
        update: {
          x: position.x,
          y: position.y,
          mapId: position.mapId,
          direction: position.direction,
          isMoving: position.isMoving,
        },
        create: {
          userId: user.userId,
          x: position.x,
          y: position.y,
          mapId: position.mapId,
          direction: position.direction || 'down',
          isMoving: position.isMoving || false,
        },
      });
      
      // 同じマップの他のユーザーに位置更新を通知
      socket.to(`map:${position.mapId}`).emit('user:moved', {
        userId: user.userId,
        position,
      });
      
      logger.debug(`Position update from ${user.userName}: ${position.x}, ${position.y}`);
    } catch (error) {
      logger.error('Position update error:', error);
      socket.emit('error', {
        message: '位置情報の更新に失敗しました',
        code: 'POSITION_UPDATE_ERROR',
      });
    }
  });
};
