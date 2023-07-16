import express from 'express';
import { login, logout } from './tokenController.js';
import { initializeToken } from './authHandler.js';

const router = express.Router();

// 로그인
router.post('/login', login);

// 로그아웃
router.get('/logout', logout);

// 토큰 검증 API
router.get('/check', initializeToken);

export default router;
