import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
export const key = process.env.KEY;
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sessionStore = new MySQLStore({
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      data: 'data',
      expires: 'expires',
    },
  },
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const initializeSession = session({
  name: 'sessionID',
  secret: key,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
  },
});

// 세션 만료 확인 및 삭제 미들웨어
export const checkSessionExpiration = (req, res, next) => {
  //로그인하지 않아 세션이 없을 경우
  if (!req.session.data) {
    return next();
  }
  // 세션 생성시간을 가져와 세션 만료 시간을 설정합니다.
  const sessionCreatedAt = new Date(Date.parse(req.session.data.createdAt));
  const expireTime = 1 * 60 * 60 * 10; // 60*60*10 = 1분
  const sessionExpires = new Date(sessionCreatedAt.getTime() + expireTime);

  // 세션 만료 시간이 설정되어 있고, 현재 시간이 세션 만료 시간을 지났다면
  if (sessionExpires && new Date() > sessionExpires) {
    // 세션 데이터를 만료시킵니다.
    req.session.destroy();
    console.log('만료된 세션 삭제:', req.sessionID);
    return res.status(401).json({ message: '세션이 만료되었습니다. 다시 로그인해주세요.' });
  } else {
    next();
  }
};

export const initializeToken = (req, res, next) => {
  const token = req.cookies.tokenID || '';

  if (!token) {
    return res.status(404).json({ message: '조회할 토큰이 없습니다.' });
  }

  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: '토큰이 유효하지 않습니다.' });
    }

    // 토큰이 유효하다면, 디코딩된 username 확인가능
    req.username = decoded.username;
    next();
  });
};
