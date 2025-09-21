import { User, Profile, UserPosition } from '@prisma/client';
import prisma from '@config/database';
import { UpdateUserDto, UpdateProfileDto } from '@/types';
import { AppError } from '@middleware/error.middleware';
import { getPaginationParams, createPaginatedResponse } from '@utils/response.utils';
import logger from '@config/logger';

export class UserService {
  // ユーザー一覧取得
  async getUsers(page = 1, limit = 20, filter?: any) {
    const { skip } = getPaginationParams(page, limit);

    const where: any = {
      isActive: true,
    };

    if (filter?.role) {
      where.role = filter.role;
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
          profile: {
            select: {
              bio: true,
              status: true,
              interests: true,
              grade: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return createPaginatedResponse(users, total, page, limit);
  }

  // ユーザー詳細取得
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        position: true,
      },
    });

    if (!user) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    return user;
  }

  // ユーザー情報更新
  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isActive: true,
      },
    });

    logger.info(`User updated: ${userId}`);
    return user;
  }

  // プロフィール更新
  async updateProfile(userId: string, data: UpdateProfileDto) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    logger.info(`Profile updated for user: ${userId}`);
    return profile;
  }

  // ユーザー削除（論理削除）
  async deleteUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    logger.info(`User deactivated: ${userId}`);
  }

  // 位置情報更新
  async updatePosition(
    userId: string,
    x: number,
    y: number,
    mapId: string = 'main',
    direction?: string,
    isMoving?: boolean
  ) {
    const position = await prisma.userPosition.upsert({
      where: { userId },
      update: {
        x,
        y,
        mapId,
        direction: direction || 'down',
        isMoving: isMoving || false,
      },
      create: {
        userId,
        x,
        y,
        mapId,
        direction: direction || 'down',
        isMoving: isMoving || false,
      },
    });

    return position;
  }

  // オンラインユーザーの位置取得
  async getOnlineUsersPositions(mapId?: string) {
    const where: any = {};
    if (mapId) {
      where.mapId = mapId;
    }

    const positions = await prisma.userPosition.findMany({
      where,
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
    });

    return positions;
  }

  // ユーザー統計情報取得
  async getUserStatistics(userId: string) {
    const [
      totalMessages,
      totalReports,
      attendanceRate,
      recentActivity,
    ] = await prisma.$transaction([
      // メッセージ数
      prisma.chatMessage.count({
        where: { userId },
      }),
      // 日報数
      prisma.dailyReport.count({
        where: { userId },
      }),
      // 出席率計算
      prisma.attendance.findMany({
        where: {
          userId,
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 過去30日
          },
        },
        select: { status: true },
      }),
      // 最近のアクティビティ
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          lastLoginAt: true,
          messages: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    // 出席率計算
    const presentDays = attendanceRate.filter(a => a.status === 'PRESENT').length;
    const totalDays = attendanceRate.length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalMessages,
      totalReports,
      attendanceRate: {
        percentage: Math.round(attendancePercentage),
        presentDays,
        totalDays,
      },
      lastLoginAt: recentActivity?.lastLoginAt,
      recentMessages: recentActivity?.messages || [],
    };
  }
}

export const userService = new UserService();
