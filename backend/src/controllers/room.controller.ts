import { Request, Response } from 'express';
import { roomService } from '@services/room.service';
import { AuthRequest } from '@/types/auth.types';
import { sendSuccess } from '@utils/response.utils';
import { asyncHandler } from '@middleware/error.middleware';

export class RoomController {
  // ルーム一覧取得
  getRooms = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    
    const result = await roomService.getRooms(
      Number(page),
      Number(limit),
      req.user?.id
    );
    
    sendSuccess(res, result);
  });

  // ルーム詳細取得
  getRoomById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const room = await roomService.getRoomById(id, req.user?.id);
    
    sendSuccess(res, room);
  });

  // ルーム作成
  createRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const room = await roomService.createRoom(req.user!.id, req.body);
    
    sendSuccess(res, room, 'ルームを作成しました', 201);
  });

  // ルーム更新
  updateRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const room = await roomService.updateRoom(id, req.user!.id, req.body);
    
    sendSuccess(res, room, 'ルームを更新しました');
  });

  // ルーム削除
  deleteRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await roomService.deleteRoom(id, req.user!.id);
    
    sendSuccess(res, null, 'ルームを削除しました');
  });

  // ルーム参加
  joinRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    
    const member = await roomService.joinRoom(id, req.user!.id, password);
    
    sendSuccess(res, member, 'ルームに参加しました');
  });

  // ルーム退出
  leaveRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await roomService.leaveRoom(id, req.user!.id);
    
    sendSuccess(res, null, 'ルームから退出しました');
  });

  // メンバー権限変更
  updateMemberRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id, userId } = req.params;
    const { role } = req.body;
    
    const member = await roomService.updateMemberRole(
      id,
      userId,
      role,
      req.user!.id
    );
    
    sendSuccess(res, member, 'メンバーの権限を更新しました');
  });
}

export const roomController = new RoomController();
