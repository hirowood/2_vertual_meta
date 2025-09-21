import { Room, RoomMember, ChatMessage } from '@prisma/client';
import prisma from '@config/database';
import { CreateRoomDto, UpdateRoomDto } from '@/types';
import { AppError } from '@middleware/error.middleware';
import { getPaginationParams, createPaginatedResponse } from '@utils/response.utils';
import logger from '@config/logger';
import bcrypt from 'bcryptjs';

export class RoomService {
  // ルーム一覧取得
  async getRooms(page = 1, limit = 20, userId?: string) {
    const { skip } = getPaginationParams(page, limit);

    const where: any = {
      isActive: true,
      OR: [
        { type: 'PUBLIC' },
        ...(userId ? [{ members: { some: { userId } } }] : []),
      ],
    };

    const [rooms, total] = await prisma.$transaction([
      prisma.room.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.room.count({ where }),
    ]);

    return createPaginatedResponse(rooms, total, page, limit);
  }

  // ルーム詳細取得
  async getRoomById(roomId: string, userId?: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        messages: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
      },
    });

    if (!room) {
      throw new AppError('ルームが見つかりません', 404);
    }

    // プライベートルームの場合、メンバーチェック
    if (room.type === 'PRIVATE' && userId) {
      const isMember = room.members.some(m => m.userId === userId);
      if (!isMember) {
        throw new AppError('このルームへのアクセス権限がありません', 403);
      }
    }

    // メッセージを古い順に並び替え
    room.messages.reverse();

    return room;
  }

  // ルーム作成
  async createRoom(userId: string, data: CreateRoomDto) {
    const { name, description, type = 'PUBLIC', capacity = 10, password } = data;

    // パスワードのハッシュ化（プライベートルームの場合）
    let hashedPassword: string | null = null;
    if (type === 'PRIVATE' && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const room = await prisma.$transaction(async (tx) => {
      // ルーム作成
      const newRoom = await tx.room.create({
        data: {
          name,
          description,
          type: type as any,
          capacity,
          password: hashedPassword,
          createdBy: userId,
        },
      });

      // 作成者をメンバーとして追加
      await tx.roomMember.create({
        data: {
          roomId: newRoom.id,
          userId,
          role: 'OWNER',
        },
      });

      return newRoom;
    });

    logger.info(`Room created: ${room.name} by ${userId}`);
    return room;
  }

  // ルーム更新
  async updateRoom(roomId: string, userId: string, data: UpdateRoomDto) {
    // 権限チェック
    const member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'MODERATOR')) {
      throw new AppError('このルームを編集する権限がありません', 403);
    }

    const room = await prisma.room.update({
      where: { id: roomId },
      data,
    });

    logger.info(`Room updated: ${roomId} by ${userId}`);
    return room;
  }

  // ルーム削除（論理削除）
  async deleteRoom(roomId: string, userId: string) {
    // 権限チェック
    const member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!member || member.role !== 'OWNER') {
      throw new AppError('このルームを削除する権限がありません', 403);
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { isActive: false },
    });

    logger.info(`Room deleted: ${roomId} by ${userId}`);
  }

  // ルーム参加
  async joinRoom(roomId: string, userId: string, password?: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!room) {
      throw new AppError('ルームが見つかりません', 404);
    }

    if (!room.isActive) {
      throw new AppError('このルームは利用できません', 403);
    }

    // 容量チェック
    if (room._count.members >= room.capacity) {
      throw new AppError('ルームが満員です', 403);
    }

    // パスワードチェック（プライベートルーム）
    if (room.type === 'PRIVATE' && room.password) {
      if (!password) {
        throw new AppError('パスワードが必要です', 401);
      }
      const isValid = await bcrypt.compare(password, room.password);
      if (!isValid) {
        throw new AppError('パスワードが正しくありません', 401);
      }
    }

    // 既存メンバーチェック
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new AppError('既にこのルームのメンバーです', 400);
    }

    // メンバー追加
    const member = await prisma.roomMember.create({
      data: {
        roomId,
        userId,
        role: 'MEMBER',
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

    logger.info(`User ${userId} joined room ${roomId}`);
    return member;
  }

  // ルーム退出
  async leaveRoom(roomId: string, userId: string) {
    const member = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!member) {
      throw new AppError('このルームのメンバーではありません', 404);
    }

    // オーナーは退出できない
    if (member.role === 'OWNER') {
      throw new AppError('ルームオーナーは退出できません', 403);
    }

    await prisma.roomMember.delete({
      where: {
        id: member.id,
      },
    });

    logger.info(`User ${userId} left room ${roomId}`);
  }

  // メンバー権限変更
  async updateMemberRole(
    roomId: string,
    targetUserId: string,
    newRole: string,
    requestUserId: string
  ) {
    // リクエストユーザーの権限チェック
    const requester = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: requestUserId,
        },
      },
    });

    if (!requester || requester.role !== 'OWNER') {
      throw new AppError('メンバーの権限を変更する権限がありません', 403);
    }

    // ターゲットメンバーの更新
    const member = await prisma.roomMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId: targetUserId,
        },
      },
      data: {
        role: newRole as any,
      },
    });

    logger.info(`Member role updated in room ${roomId}: ${targetUserId} -> ${newRole}`);
    return member;
  }
}

export const roomService = new RoomService();
