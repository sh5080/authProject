import express from 'express';
import session from 'express-session';
import cors from 'cors';

const app = express();

// session 설정
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// 미들웨어 및 라우터 설정

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//로그인
app.post('/session_login', (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  //     사용자 인증 성공
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true; // 세션에 인증 정보 저장
    req.session.user = { username }; // 세션에 사용자 정보 저장
    res.send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});
app.post('/token_login', (req, res) => {
  // 사용자 인증 로직 구현
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  console.log(req);

  // 사용자 인증 성공
  if (username === 'admin' && password === 'password') {
    // 인증 성공 처리
    res.send('Token login successful');
  } else {
    // 인증 실패 처리
    res.status(401).send('Token login failed');
  }
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// 로그아웃
app.get('/logout', (req, res) => {
  req.session.destroy(); // 세션 제거
  res.send('Logged out successfully');
});

const port = 5500;
// 서버 시작
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
