import { Server, Socket } from 'socket.io';
import prisma from '@config/database';
import logger from '@config/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@/types/socket.types';

export const chatHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const user = socket.data.user!;

  // チャットメッセージ送信
  socket.on('chat:send', async (data) => {
    try {
      const { content, roomId, userName, userId } = data;
      
      // メッセージをDBに保存
      const message = await prisma.chatMessage.create({
        data: {
          userId: userId || user.userId,
          content,
          roomId: roomId || null,
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
      io.to(destination).emit('chat:message', {
        id: message.id,
        userId: message.userId,
        userName: message.user.name,
        content: message.content,
        timestamp: message.createdAt.toISOString(),
        roomId: message.roomId,
      });
      
      logger.debug(`Chat message from ${userName || user.userName} to ${destination}`);
    } catch (error) {
      logger.error('Chat message error:', error);
      socket.emit('error', {
        message: 'メッセージの送信に失敗しました',
        code: 'CHAT_MESSAGE_ERROR',
      });
    }
  });

  // チャット履歴取得
  socket.on('chat:history', async (data) => {
    try {
      const { roomId, limit = 50 } = data || {};
      
      const messages = await prisma.chatMessage.findMany({
        where: roomId ? { roomId } : { roomId: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });
      
      const formattedMessages = messages.reverse().map(msg => ({
        id: msg.id,
        userId: msg.userId,
        userName: msg.user.name,
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
        roomId: msg.roomId,
      }));
      
      socket.emit('chat:history', formattedMessages);
    } catch (error) {
      logger.error('Chat history error:', error);
      socket.emit('error', {
        message: 'チャット履歴の取得に失敗しました',
        code: 'CHAT_HISTORY_ERROR',
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
  
  // 接続時にグローバルチャットルームに参加
  socket.join('global');
  logger.info(`User ${user.userName} joined global chat`);
  
  // 初回接続時に履歴を送信
  socket.emit('chat:request_history', {});
};
