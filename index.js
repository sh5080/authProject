import express from 'express';
import session from 'express-session';
import cors from 'cors';
import sessionRoutes from './sessionRouter.js';
import tokenRoutes from './tokenRouter.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import MySQLStore from 'express-mysql-session';
const app = express();
// env
dotenv.config();
const port = process.env.PORT || 3000;
export const key = process.env.KEY;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
//db 연결
export let db;
export const dbLoader = async () => {
  if (db) {
    return db;
  }
  try {
    db = await mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      // port: DB_PORT,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log('Cloud SQL server connection successful');
    return db;
  } catch (error) {
    console.error('Failed to establish connection to the Cloud SQL server:', error);
    throw error;
  }
};
async function startServer() {
  try {
    await dbLoader();

    // session 설정
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

    app.use(
      session({
        secret: key,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          // 쿠키의 만료 시간을 설정합니다.
          // 예: 24시간 (밀리초 단위)
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),

          // 쿠키의 최대 수명을 설정합니다.
          // 예: 24시간 (초 단위)
          maxAge: 24 * 60 * 60,
        },
      })
    );
    // 미들웨어 및 라우터 설정

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cors({
        origin: 'http://127.0.0.1:55597',
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
      })
    );

    // 라우터 연결
    app.use('/session', sessionRoutes);
    app.use('/token', tokenRoutes);
    app.set(db);

    // 서버 시작
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}
startServer();
