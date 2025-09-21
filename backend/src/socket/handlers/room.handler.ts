import { Server, Socket } from 'socket.io';
import prisma from '@config/database';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@types/socket.types';

export const roomHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const user = socket.data.user!;

  // ルーム参加
  socket.on('room:enter', async (data) => {
    try {
      const { roomId } = data;
      
      // ルームの存在確認
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });
      
      if (!room) {
        socket.emit('error', {
          message: 'ルームが見つかりません',
          code: 'ROOM_NOT_FOUND',
        });
        return;
      }
      
      // Socket.ioルームに参加
      socket.join(`room:${roomId}`);
      
      // 他のメンバーに通知
      socket.to(`room:${roomId}`).emit('room:user_entered', {
        userId: user.userId,
        userName: user.userName,
        roomId,
      });
      
      logger.info(`User ${user.userName} entered room ${roomId}`);
    } catch (error) {
      logger.error('Room enter error:', error);
      socket.emit('error', {
        message: 'ルームへの参加に失敗しました',
        code: 'ROOM_ENTER_ERROR',
      });
    }
  });

  // ルーム退出
  socket.on('room:leave', async (data) => {
    try {
      const { roomId } = data;
      
      // Socket.ioルームから退出
      socket.leave(`room:${roomId}`);
      
      // 他のメンバーに通知
      socket.to(`room:${roomId}`).emit('room:user_left', {
        userId: user.userId,
        userName: user.userName,
        roomId,
      });
      
      logger.info(`User ${user.userName} left room ${roomId}`);
    } catch (error) {
      logger.error('Room leave error:', error);
      socket.emit('error', {
        message: 'ルームからの退出に失敗しました',
        code: 'ROOM_LEAVE_ERROR',
      });
    }
  });
};
