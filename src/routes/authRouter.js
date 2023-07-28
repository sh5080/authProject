import express from 'express';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// 회원가입
router.post('/signup', signup);

export default router;
