import express from 'express';
import jwt from 'jsonwebtoken';
import { key } from './index.js';

const router = express.Router();

// 로그인
router.post('/session_login', (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  // 사용자 인증 성공
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true; // 세션에 인증 정보 저장
    req.session.user = { username }; // 세션에 사용자 정보 저장
    res.send('로그인 성공');
  } else {
    res.status(401).send('로그인 실패');
  }
});

router.post('/token_login', (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  // 사용자 인증 성공
  if (username === 'admin' && password === 'password') {
    // 토큰 생성 및 반환
    const token = generateToken(username);
    res.send({ token });
  } else {
    // 인증 실패 처리
    res.status(401).send('토큰 로그인 실패');
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy(); // 세션 제거
  res.send('로그아웃 성공');
});

// 토큰 생성 함수
function generateToken(username) {
  // 토큰 생성
  const token = jwt.sign({ username }, key, { expiresIn: '1h' });
  return token;
}

export default router;
