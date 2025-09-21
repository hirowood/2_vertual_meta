import { Response, NextFunction } from 'express';
import { AuthRequest, AuthUser } from '@/types/auth.types';
import { verifyAccessToken } from '@utils/auth.utils';
import { sendError } from '@utils/response.utils';
import prisma from '@config/database';
import logger from '@config/logger';

// 認証ミドルウェア
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // トークンの取得
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      sendError(res, '認証トークンが必要です', 401);
      return;
    }

    // トークンの検証
    const payload = verifyAccessToken(token);
    
    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      sendError(res, 'ユーザーが見つかりません', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'アカウントが無効になっています', 403);
      return;
    }

    // リクエストにユーザー情報を追加
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } as AuthUser;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      sendError(res, '無効なトークンです', 401);
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'トークンの有効期限が切れています', 401);
      return;
    }
    
    sendError(res, '認証エラーが発生しました', 500);
  }
};

// オプショナル認証（認証は必須ではないが、トークンがあれば検証）
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      next();
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      } as AuthUser;
    }

    next();
  } catch (error) {
    // トークンが無効でも続行
    next();
  }
};

// ロールベース認証
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, '認証が必要です', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'この操作を実行する権限がありません', 403);
      return;
    }

    next();
  };
};

// 管理者認証
export const requireAdmin = authorize('ADMIN');

// 教師以上の認証
export const requireTeacherOrAdmin = authorize('TEACHER', 'ADMIN');
