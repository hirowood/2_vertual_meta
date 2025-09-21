import { User, Profile } from '@prisma/client';
import prisma from '@config/database';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, getTokenExpiration } from '@utils/auth.utils';
import { CreateUserDto, JwtPayload } from '@/types';
import { AppError } from '@middleware/error.middleware';
import logger from '@config/logger';
import config from '@config/config';

export class AuthService {
  // ユーザー登録
  async register(data: CreateUserDto) {
    const { email, password, name, role = 'STUDENT' } = data;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('このメールアドレスは既に使用されています', 400);
    }

    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(password);

    // トランザクションでユーザーとプロフィールを作成
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role as any,
          profile: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });

      return newUser;
    });

    // トークンの生成
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id, tokenId: '' });

    // リフレッシュトークンをDBに保存
    const refreshTokenRecord = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
      },
    });

    logger.info(`New user registered: ${user.email}`);

    // パスワードを除外して返す
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  // ログイン
  async login(email: string, password: string) {
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError('メールアドレスまたはパスワードが正しくありません', 401);
    }

    // パスワードの検証
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('メールアドレスまたはパスワードが正しくありません', 401);
    }

    // アカウントの有効性チェック
    if (!user.isActive) {
      throw new AppError('アカウントが無効になっています', 403);
    }

    // 最終ログイン時刻を更新
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // トークンの生成
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id, tokenId: '' });

    // 既存のリフレッシュトークンを削除
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    // 新しいリフレッシュトークンを保存
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
      },
    });

    logger.info(`User logged in: ${user.email}`);

    // パスワードを除外して返す
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  // トークンリフレッシュ
  async refreshTokens(refreshToken: string) {
    // トークンをDBから検索
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AppError('無効なリフレッシュトークンです', 401);
    }

    // 有効期限チェック
    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new AppError('リフレッシュトークンの有効期限が切れています', 401);
    }

    // 新しいトークンを生成
    const payload: JwtPayload = {
      id: tokenRecord.user.id,
      email: tokenRecord.user.email,
      name: tokenRecord.user.name,
      role: tokenRecord.user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: tokenRecord.user.id, tokenId: '' });

    // 古いトークンを削除して新しいトークンを保存
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      }),
      prisma.refreshToken.create({
        data: {
          userId: tokenRecord.user.id,
          token: newRefreshToken,
          expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ログアウト
  async logout(userId: string) {
    // リフレッシュトークンを削除
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info(`User logged out: ${userId}`);
  }

  // パスワード変更
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    // 現在のパスワードを検証
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('現在のパスワードが正しくありません', 401);
    }

    // 新しいパスワードをハッシュ化
    const hashedPassword = await hashPassword(newPassword);

    // パスワードを更新
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // セキュリティのため、すべてのリフレッシュトークンを削除
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info(`Password changed for user: ${userId}`);
  }
}

export const authService = new AuthService();
