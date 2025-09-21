import { Request, Response } from 'express';
import { userService } from '@services/user.service';
import { AuthRequest } from '@types/auth.types';
import { sendSuccess } from '@utils/response.utils';
import { asyncHandler } from '@middleware/error.middleware';

export class UserController {
  // ユーザー一覧取得
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, role } = req.query;
    
    const result = await userService.getUsers(
      Number(page),
      Number(limit),
      { role }
    );
    
    sendSuccess(res, result);
  });

  // ユーザー詳細取得
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    sendSuccess(res, user);
  });

  // ユーザー情報更新
  updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    // 自分自身または管理者のみ更新可能
    if (req.user!.id !== id && req.user!.role !== 'ADMIN') {
      sendSuccess(res, null, '権限がありません', 403);
      return;
    }
    
    const user = await userService.updateUser(id, req.body);
    
    sendSuccess(res, user, 'ユーザー情報を更新しました');
  });

  // プロフィール更新
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await userService.updateProfile(req.user!.id, req.body);
    
    sendSuccess(res, profile, 'プロフィールを更新しました');
  });

  // 他ユーザーのプロフィール更新（管理者のみ）
  updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const profile = await userService.updateProfile(id, req.body);
    
    sendSuccess(res, profile, 'プロフィールを更新しました');
  });

  // ユーザー削除（論理削除）
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    
    sendSuccess(res, null, 'ユーザーを削除しました');
  });

  // 位置情報更新
  updatePosition = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { x, y, mapId, direction, isMoving } = req.body;
    
    const position = await userService.updatePosition(
      req.user!.id,
      x,
      y,
      mapId,
      direction,
      isMoving
    );
    
    sendSuccess(res, position);
  });

  // オンラインユーザーの位置取得
  getOnlineUsersPositions = asyncHandler(async (req: Request, res: Response) => {
    const { mapId } = req.query;
    const positions = await userService.getOnlineUsersPositions(mapId as string);
    
    sendSuccess(res, positions);
  });

  // ユーザー統計情報取得
  getUserStatistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    // 自分自身または管理者のみ取得可能
    if (req.user!.id !== id && req.user!.role !== 'ADMIN') {
      sendSuccess(res, null, '権限がありません', 403);
      return;
    }
    
    const statistics = await userService.getUserStatistics(id);
    
    sendSuccess(res, statistics);
  });
}

export const userController = new UserController();
