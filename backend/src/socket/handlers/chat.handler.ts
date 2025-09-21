import { Server, Socket } from 'socket.io';
import prisma from '@config/database';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@types/socket.types';

export const chatHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const user = socket.data.user!;

  // チャットメッセージ送信
  socket.on('chat:message', async (data) => {
    try {
      const { content, roomId } = data;
      
      // メッセージをDBに保存
      const message = await prisma.chatMessage.create({
        data: {
          userId: user.userId,
          content,
          roomId,
          type: 'TEXT',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      
      // 送信先を決定
      const destination = roomId ? `room:${roomId}` : 'global';
      
      // メッセージを配信
      io.to(destination).emit('chat:message', message);
      
      logger.debug(`Chat message from ${user.userName} to ${destination}`);
    } catch (error) {
      logger.error('Chat message error:', error);
      socket.emit('error', {
        message: 'メッセージの送信に失敗しました',
        code: 'CHAT_MESSAGE_ERROR',
      });
    }
  });

  // タイピング通知
  socket.on('chat:typing', async (data) => {
    try {
      const { roomId, isTyping } = data;
      
      // 送信先を決定
      const destination = roomId ? `room:${roomId}` : 'global';
      
      // タイピング通知を配信（送信者以外）
      socket.to(destination).emit('chat:user_typing', {
        userId: user.userId,
        userName: user.userName,
        isTyping,
      });
      
      logger.debug(`Typing notification from ${user.userName}: ${isTyping}`);
    } catch (error) {
      logger.error('Typing notification error:', error);
    }
  });
};
