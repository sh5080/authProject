import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError, CommonError } from '../middlewares/errorHandler.js';

export const sendPopup = (req, res, next) => {
  try {
    const reappearCookie = req.cookies.reappear;

    if (!reappearCookie) {
      // popup.html 파일을 읽어서 응답으로 전송
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const popupFilePath = path.join(__dirname, '../../public', 'popup.html');
      fs.readFile(popupFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Failed to read popup.html:', err);
          throw new AppError(CommonError.UNEXPECTED_ERROR, 'popup.html을 불러오는데 실패했습니다.', 500);
        } else {
          res.send(data);
        }
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

export const clearPopup = (req, res, next) => {
  const { toast } = req.body;
  // 쿠키 삭제
  res.clearCookie(toast);
  res.sendStatus(200);
};
