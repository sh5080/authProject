import express from 'express';
import { login, logout, generateToken } from './tokenController.js';

const router = express.Router();

// 로그인
router.post('/login', login);

// 로그아웃
router.get('/logout', logout);

// 토큰 검증 API
router.get('/check', generateToken);

export default router;
