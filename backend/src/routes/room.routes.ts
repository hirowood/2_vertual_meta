import { Router } from 'express';
import { roomController } from '@controllers/room.controller';
import { authenticate, requireTeacherOrAdmin } from '@middleware/auth.middleware';
import { handleValidationErrors } from '@middleware/validation.middleware';
import { validateIdParam, validatePagination } from '@validators/auth.validator';
import { body } from 'express-validator';

const router = Router();

// 認証必要
router.use(authenticate);

// ルーム一覧
router.get('/', validatePagination, handleValidationErrors, roomController.getRooms);

// ルーム詳細
router.get('/:id', validateIdParam, handleValidationErrors, roomController.getRoomById);

// ルーム作成（教師・管理者のみ）
router.post(
  '/',
  requireTeacherOrAdmin,
  [
    body('name').notEmpty().withMessage('ルーム名は必須です'),
    body('capacity').optional().isInt({ min: 1, max: 100 }).withMessage('定員は1〜100の間で設定してください'),
    body('type').optional().isIn(['PUBLIC', 'PRIVATE', 'LESSON', 'EVENT']).withMessage('無効なルームタイプです'),
  ],
  handleValidationErrors,
  roomController.createRoom
);

// ルーム更新（権限チェックはサービス内で実施）
router.put('/:id', validateIdParam, handleValidationErrors, roomController.updateRoom);

// ルーム削除（権限チェックはサービス内で実施）
router.delete('/:id', validateIdParam, handleValidationErrors, roomController.deleteRoom);

// ルーム参加・退出
router.post('/:id/join', validateIdParam, handleValidationErrors, roomController.joinRoom);
router.post('/:id/leave', validateIdParam, handleValidationErrors, roomController.leaveRoom);

// メンバー権限変更
router.put(
  '/:id/members/:userId/role',
  [
    ...validateIdParam,
    body('role').isIn(['MEMBER', 'MODERATOR']).withMessage('無効な権限です'),
  ],
  handleValidationErrors,
  roomController.updateMemberRole
);

export default router;
