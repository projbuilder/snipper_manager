import { Router } from 'express';
import authRoutes from './authRoutes';
import snippetRoutes from './snippetRoutes';
import collectionRoutes from './collectionRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Health check
router.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/snippets', snippetRoutes);
router.use('/collections', collectionRoutes);
router.use('/users', userRoutes);

export default router;
