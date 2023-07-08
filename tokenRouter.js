import express from 'express';
import jwt from 'jsonwebtoken';
import { key } from './index.js';
import { authenticateUser } from './services.js';

const router = express.Router();

router.post('/token', async (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  try {
    // 사용자 인증 성공
    const authenticated = await authenticateUser(username, password);
    if (authenticated) {
      // 토큰 생성 및 반환
      const token = generateToken(username);
      res.send({ message: '토큰 로그인 성공', token });
    } else throw error;
  } catch (error) {
    res.status(401).send('토큰 로그인 실패');
    console.error('error message: ', error);
  }
});

router.get('/token_logout', (req, res) => {
  // 토큰 로그아웃 로직을 추가하세요
  // 예: 토큰을 무효화하거나 저장소에서 제거하는 등의 작업 수행
  res.send('토큰 로그아웃 성공');
});

// 토큰 생성 함수
function generateToken(username) {
  // 토큰 생성
  const token = jwt.sign({ username }, key, { expiresIn: '1h' });
  return token;
}

export default router;
