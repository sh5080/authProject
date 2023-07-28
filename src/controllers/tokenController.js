import jwt from 'jsonwebtoken';
import { key } from '../index.js';
import { authenticateUser } from '../services/services.js';
import { AppError, CommonError } from '../middlewares/errorHandler.js';
import bcrypt from 'bcrypt';
export function generateToken(username) {
  // 토큰 생성
  const token = jwt.sign({ username }, key, { expiresIn: '1h' });
  return token;
}

export async function login(req, res, next) {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  try {
    // 사용자 인증 성공
    const authenticated = await authenticateUser(username);
    if (!authenticated) {
      throw new AppError(CommonError.INVALID_INPUT, '없는 id이거나 잘못된 비밀번호입니다.', 401);
    }
    const isPasswordMatch = await bcrypt.compare(password, authenticated.password);
    if (!isPasswordMatch) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '없는 id이거나 잘못된 비밀번호입니다.', 401);
    }
    if (authenticated) {
      // 토큰 생성 및 반환
      const token = generateToken(username);
      res.cookie('tokenID', token, { httpOnly: true, maxAge: 3600000 }); //1시간
      // res.send({ message: `${username} 님 환영합니다.`, token });
      res.locals.responseData = { message: `${username} 님 환영합니다.`, token };
      next();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie('tokenID');
  res.send('토큰 로그아웃 성공');
}

export async function checkToken(req, res, next) {
  // res.json(`토큰이 유효합니다. ${req.username} 으로 로그인된 상태입니다.`);
  res.locals.responseData = `토큰이 유효합니다. ${req.username} 으로 로그인된 상태입니다.`;
  next();
}
