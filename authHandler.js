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
  expires: new Date(Date.now() + 3600000),
});

export function initializeToken(req, res, next) {
  const token = req.cookies.tokenID || '';

  if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }

    // 토큰이 유효하다면, 디코딩된 username 확인가능
    req.username = decoded.username;
    next();
  });
}
