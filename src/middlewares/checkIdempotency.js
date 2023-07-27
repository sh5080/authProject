import { AppError, CommonError } from './errorHandler.js';
import { dbLoader } from '../index.js';
import { getPreviousRequests } from '../services/services.js';

export async function saveRequestToDB(req, res, next) {
  try {
    const db = await dbLoader();
    const key = req.sessionID;
    const iKey = res.cookie('iKey', key, {
      httpOnly: true,
      maxAge: 3600000, //1시간
    });
    const requestData = {
      method: req.method,
      url: req.url,
      body: JSON.stringify(req.body),
      key: key,
    };

    await db.execute(
      'INSERT INTO requests (method, url, body, `key`) VALUES (?, ?, ?, ?)',
      [requestData.method, requestData.url, requestData.body, requestData.key],

      console.log('Request data saved to DB:', requestData)
    );
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// 라우터 후에 객체에 저장한 req와 현재 req를 비교하는 미들웨어

export async function checkIdempotency(req, res, next) {
  const requestId = `${req.method}-${req.url}`;
  try {
    // 이전 요청 데이터를 DB에서 조회
    const previousRequests = await getPreviousRequests();
    console.log('여기: ', previousRequests);
    const previousRequest = previousRequests.find(
      (request) => request.method === req.method && request.url === req.url
    );

    if (previousRequest) {
      // 이전 요청과 현재 요청을 비교하여 멱등성 검사
      if (JSON.stringify(previousRequest.body) === JSON.stringify(req.body)) {
        // 같은 요청이면 멱등하다고 판단
        console.log('멱등성을 만족합니다.');
      } else {
        // 다른 요청이면 멱등하지 않다고 판단
        console.log('멱등성이 깨졌습니다.');
      }
    } else {
      // 이전 요청이 없는 경우
      console.log('첫 번째 요청입니다.');
    }

    next();
  } catch (error) {
    console.error('Failed to check idempotency:', error);
    next(error);
  }
}
