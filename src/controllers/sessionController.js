import { AppError, CommonError } from '../middlewares/errorHandler.js';
import { authenticateUser, getAllSessionData } from '../services/services.js';
import bcrypt from 'bcrypt';
// 로그인
export const login = async (req, res, next) => {
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
      const now = new Date();
      const koreanTime = 9 * 60 * 60 * 1000;
      const koreanNow = new Date(now.getTime() + koreanTime);

      req.session.data = {
        authenticateUser: true,
        user: username,
        createdAt: koreanNow.toISOString().slice(0, 19).replace('T', ' '),
      };
      // res.send(`${username} 님 환영합니다.`);
      res.locals.responseData = `${username} 님 환영합니다.`;
      next();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 로그아웃
export const logout = async (req, res) => {
  await req.session.destroy(); // 세션 제거
  res.clearCookie('sessionID'); // 쿠키 제거
  res.send('세션 로그아웃 성공');
};

// 세션 검증 API
export const checkSession = async (req, res, next) => {
  try {
    const sessions = await getAllSessionData();
    if (!sessions[0] && req.cookies.sessionID === undefined) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '조회할 세션이 없습니다.', 400);
    }
    if (!sessions[0]) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        '서버에서 조회되는 세션이 없습니다. 유효하지 않은 쿠키입니다.',
        404
      );
    }
    if (req.cookies.sessionID === undefined) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '클라이언트에서 조회되는 세션이 없습니다.', 404);
    }
    const sessionID = req.cookies.sessionID.split('.')[0].slice(2);
    const matchedSession = sessions.find((session) => session.session_id === sessionID);

    if (matchedSession) {
      // 세션이 존재
      return res.send(`세션이 유효합니다. ${req.session.data.user} 으로 로그인된 상태입니다.`);
    } else {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '유효하지 않은 세션입니다.', 400);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const extendSession = async (req, res, next) => {
  try {
    if (req.session.data) {
      // 세션이 존재하면 세션 만료 시간을 연장
      const now = new Date();
      const koreanTime = 9 * 60 * 60 * 1000;
      const koreanNow = new Date(now.getTime() + koreanTime);
      req.session.data.createdAt = koreanNow.toISOString().slice(0, 19).replace('T', ' ');
      return res.status(200).json('세션 연장 성공');
    } else {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '연장할 세션이 없습니다.', 400);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 세션 데이터 조회
export const getSessionData = async (req, res, next) => {
  try {
    const sessionData = await getAllSessionData();
    if (!sessionData[0]) {
      sessionData.push({
        session_id: 'null',
        data: 'null',
        expires: 'null',
      });
    }
    res.send(sessionData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
