import jwt from 'jsonwebtoken';
import { key } from './index.js';
import { authenticateUser } from './services.js';

export function generateToken(username) {
  // 토큰 생성
  const token = jwt.sign({ username }, key, { expiresIn: '1h' });
  return token;
}

export async function login(req, res) {
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
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      res.send({ message: '토큰 로그인 성공', token });
    } else {
      throw new Error('인증 실패');
    }
  } catch (error) {
    res.status(401).send('토큰 로그인 실패');
    console.error(error);
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.send('토큰 로그아웃 성공');
}
