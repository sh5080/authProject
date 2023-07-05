import express from 'express';
import session from 'express-session';
import cors from 'cors';
import routes from './routes';

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
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
app.use('/', routes);

const port = 5500;
// 서버 시작
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
