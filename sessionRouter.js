import express from 'express';
import { authenticateUser } from './services.js';
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
      req.session.authenticateUser = true; // 세션에 인증 정보 저장
      req.session.user = { username }; // 세션에 사용자 정보 저장
      const now = new Date();
      const expires = new Date(now.getTime() + 86400000).toISOString().slice(0, 22).replace('T', ' ');
      console.log('expires: ', expires);
      req.session.expires = expires;

      console.log('session: ', req.session);
      res.send('세션 로그인 성공');
    } else throw error;
  } catch (error) {
    res.status(401).send('세션 로그인 실패');
    console.error('error message : ', error);
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy(); // 세션 제거
  res.send('세션 로그아웃 성공');
});

// 세션 검증 API
router.get('/check', (req, res) => {
  if (req.session.loggedIn) {
    // 세션이 존재하고 로그인된 상태일 때
    res.send({ loggedIn: true, message: '세션검증성공' });
  } else {
    // 세션이 존재하지 않거나 로그인되지 않은 상태일 때
    res.send({ loggedIn: false });
  }
});

export default router;
