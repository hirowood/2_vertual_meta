import { Router } from 'express';
import { authController } from '@controllers/auth.controller';
import { authenticate } from '@middleware/auth.middleware';
import { handleValidationErrors } from '@middleware/validation.middleware';
import {
  validateRegister,
  validateLogin,
  validatePasswordChange,
} from '@validators/auth.validator';

const router = Router();

// 認証不要のルート
router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post('/refresh-token', authController.refreshToken);

// 認証必要なルート
router.use(authenticate);

router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

router.put(
  '/change-password',
  validatePasswordChange,
  handleValidationErrors,
  authController.changePassword
);

export default router;
