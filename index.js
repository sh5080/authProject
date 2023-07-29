import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dbLoader, db } from './src/dbLoader.js';
import { checkSessionExpiration, initializeSession } from './src/middlewares/authHandler.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { saveRequestToDB, checkIdempotency } from './src/middlewares/checkIdempotency.js';
import router from './src/routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
// env
dotenv.config();
const port = process.env.PORT || 3000;
export const key = process.env.KEY;

async function startServer() {
  try {
    await dbLoader();

    // 미들웨어 및 라우터 설정
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //정적 파일 설정
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const publicPath = path.join(__dirname, 'public');

    app.use(express.static(publicPath));

    //cors 설정
    app.use(
      cors({
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://sh5080.github.io/authProject'],
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH'],
        credentials: true,
      })
    );
    app.use(initializeSession);
    app.use(saveRequestToDB);
    app.use(checkSessionExpiration);

    app.set('db', db);
    app.use(router);
    app.use(checkIdempotency);
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
