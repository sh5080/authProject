import express from 'express';
import { login, logout, checkSession, extendSession, getSessionData } from './sessionController.js';
import { checkSessionExpiration } from './middlewares/authHandler.js';
const router = express.Router();

// 로그인
router.post('/login', login);

// 로그아웃
router.get('/logout', logout);

// 세션 검증
router.get('/check', checkSessionExpiration, checkSession);

//세션 연장
router.post('/extend', extendSession);

// 세션 데이터 조회
router.get('/data', getSessionData);

export default router;
