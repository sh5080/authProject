import express from 'express';
import authRoutes from './authRouter.js';
import sessionRoutes from './sessionRouter.js';
import tokenRoutes from './tokenRouter.js';
import popupRoutes from './popupRouter.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/session', sessionRoutes);
router.use('/token', tokenRoutes);
// router.use('/popup', popupRoutes);
export default router;
