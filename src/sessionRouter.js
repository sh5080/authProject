import express from 'express';
import { login, logout, checkSession, getSessionData } from './sessionController.js';

const router = express.Router();

// 로그인
router.post('/login', login);

// 로그아웃
router.get('/logout', logout);

// 세션 검증 API
router.get('/check', checkSession);

// 세션 데이터 조회
router.get('/data', getSessionData);

export default router;
