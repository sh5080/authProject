import express from 'express';
import cors from 'cors';
import sessionRoutes from './sessionRouter.js';
import tokenRoutes from './tokenRouter.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import { initializeSession } from './middlewares/authHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

    // 미들웨어 및 라우터 설정
    // session 설정
    app.use(cookieParser());
    app.use(initializeSession);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cors({
        origin: ['http://localhost:5500', 'https://sh5080.github.io/authProject'],
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
      })
    );

    app.set(db);

    app.use('/session', sessionRoutes);
    app.use('/token', tokenRoutes);

    app.use(errorHandler);

    // 서버 시작
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}
startServer();
