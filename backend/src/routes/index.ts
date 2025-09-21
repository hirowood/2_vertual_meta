import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roomRoutes from './room.routes';

const router = Router();

// ヘルスチェック
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// APIルート
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rooms', roomRoutes);

// APIバージョン情報
router.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    api: 'Virtual School Platform API',
  });
});

export default router;
