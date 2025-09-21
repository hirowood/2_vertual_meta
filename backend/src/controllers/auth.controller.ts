import { Request, Response } from 'express';
import { authService } from '@services/auth.service';
import { AuthRequest } from '@/types/auth.types';
import { sendSuccess, sendError } from '@utils/response.utils';
import { asyncHandler } from '@middleware/error.middleware';

export class AuthController {
  // ユーザー登録
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    
    sendSuccess(res, result, 'ユーザー登録が完了しました', 201);
  });

  // ログイン
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    sendSuccess(res, result, 'ログインに成功しました');
  });

  // トークンリフレッシュ
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      sendError(res, 'リフレッシュトークンが必要です', 400);
      return;
    }
    
    const result = await authService.refreshTokens(refreshToken);
    
    sendSuccess(res, result, 'トークンを更新しました');
  });

  // ログアウト
  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    await authService.logout(req.user!.id);
    
    sendSuccess(res, null, 'ログアウトしました');
  });

  // 現在のユーザー情報取得
  getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    sendSuccess(res, req.user);
  });

  // パスワード変更
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    
    await authService.changePassword(
      req.user!.id,
      currentPassword,
      newPassword
    );
    
    sendSuccess(res, null, 'パスワードを変更しました');
  });
}

export const authController = new AuthController();
