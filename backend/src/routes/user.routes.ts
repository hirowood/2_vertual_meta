import { Router } from 'express';
import { userController } from '@controllers/user.controller';
import { authenticate, requireAdmin } from '@middleware/auth.middleware';
import { handleValidationErrors } from '@middleware/validation.middleware';
import {
  validateProfileUpdate,
  validateIdParam,
  validatePagination,
} from '@validators/auth.validator';

const router = Router();

// 認証必要
router.use(authenticate);

// ユーザー一覧（ページネーション対応）
router.get('/', validatePagination, handleValidationErrors, userController.getUsers);

// 自分のプロフィール更新
router.put(
  '/profile',
  validateProfileUpdate,
  handleValidationErrors,
  userController.updateProfile
);

// 位置情報更新
router.put('/position', userController.updatePosition);

// オンラインユーザーの位置取得
router.get('/positions', userController.getOnlineUsersPositions);

// 特定ユーザー関連
router.get('/:id', validateIdParam, handleValidationErrors, userController.getUserById);
router.put('/:id', validateIdParam, handleValidationErrors, userController.updateUser);
router.get('/:id/statistics', validateIdParam, handleValidationErrors, userController.getUserStatistics);

// 管理者のみ
router.delete('/:id', requireAdmin, validateIdParam, handleValidationErrors, userController.deleteUser);
router.put(
  '/:id/profile',
  requireAdmin,
  validateIdParam,
  validateProfileUpdate,
  handleValidationErrors,
  userController.updateUserProfile
);

export default router;
