import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
          res.status(500).send('Failed to read popup.html');
        } else {
          res.send(data);
        }
      });
    } else {
      // 쿠키가 있으면 팝업을 보여주지 않음
      res.send('No popup');
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
