import express from 'express';
import { authenticateUser, getAllSessionData, getMySessionData } from './services.js';
const router = express.Router();

// 로그인
router.post('/login', async (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  try {
    // 사용자 인증 성공
    const authenticated = await authenticateUser(username, password);

    if (authenticated) {
      const now = new Date();
      const koreanTime = 9 * 60 * 60 * 1000;
      const koreanNow = new Date(now.getTime() + koreanTime);
      const expires = new Date(koreanNow.getTime() + 24 * 60 * 60 * 1000);

      req.session.data = {
        authenticateUser: true,
        user: { username },
        createdAt: koreanNow.toISOString().slice(0, 19).replace('T', ' '),
        expires: expires.toISOString().slice(0, 19).replace('T', ' '),
      };
      res.cookie('sessionID', req.sessionID, { expires: expires, httpOnly: true });
      res.send('세션 로그인 성공');
    } else throw error;
  } catch (error) {
    res.status(401).send('세션 로그인 실패');
    console.error('error message : ', error);
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  console.log('1: ', req.session);
  req.session.destroy(); // 세션 제거
  res.clearCookie('sessionID'); // 쿠키 제거
  console.log('2: ', req.session);
  res.send('세션 로그아웃 성공');
});

// 세션 검증 API
router.get('/check', async (req, res) => {
  console.log('세션검증시 쿠키:', req.cookies);
  console.log('3:', req.session);
  const loggedUsername = await getMySessionData();
  try {
    if (req.sessionID) {
      // 세션이 존재
      res.send('세션이 유효합니다. 로그인상태입니다.');
    }
  } catch (error) {
    res.send('검증 실패');
    console.error(error);
  }
});
router.get('/data', async (req, res) => {
  try {
    const sessionData = await getAllSessionData();
    res.send(sessionData);
  } catch (error) {
    console.error(error);
  }
});

export default router;
