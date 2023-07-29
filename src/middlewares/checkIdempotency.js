import { dbLoader } from '../dbLoader.js';
import { getRequestsFromDB } from '../services/services.js';

export const saveRequestToDB = async (req, res, next) => {
  try {
    const db = await dbLoader();
    const key = req.sessionID;
    res.cookie('iKey', key, {
      httpOnly: true,
      maxAge: 3600000, //1시간
    });
    const exceptPassword = { ...req.body };
    delete exceptPassword.password;
    const requestData = {
      method: req.method,
      url: req.url,
      body: JSON.stringify(exceptPassword) || null,
      cookie: JSON.stringify(req.cookies) || null,
      key: key,
    };
    // console.log('1: ', req.cookies[0]);
    // console.log('2: ', req.cookies);
    await db.execute(
      'INSERT INTO requests (method, url, body, cookie,`key`) VALUES (?, ?, ?, ?, ?)',
      [requestData.method, requestData.url, requestData.body, requestData.cookie, requestData.key],

      console.log('Request data saved to DB:', requestData)
    );
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 라우터 후에 DB에 저장한 req와 현재 req를 비교하는 미들웨어
export const checkIdempotency = async (req, res, next) => {
  const sessionID = req.sessionID;

  try {
    // 이전 요청 데이터를 DB에서 조회
    const previousRequests = await getRequestsFromDB(sessionID);
    const previousRequest = previousRequests.find(
      (request) => request.method === req.method && request.url === req.url && request.key === req.sessionID
    );
    const { request_id, ...previous } = previousRequest;
    const previousData = {
      ...previous,
      body: JSON.stringify(previous.body),
    };

    const exceptPassword = { ...req.body };
    delete exceptPassword.password;
    const token = res.locals.responseData.token;
    if (token) {
      req.cookies.tokenID = token;
    }
    const current = {
      method: req.method,
      url: req.url,
      body: JSON.stringify(exceptPassword),
      cookie: JSON.stringify(req.cookies),
      key: req.sessionID,
    };
    // console.log('1!: ', previousRequest);
    const previousJSON = JSON.stringify(previousData);
    const currentJSON = JSON.stringify(current);
    if (previousRequest) {
      // 이전 요청과 현재 요청을 비교하여 멱등성 검사
      if (previousJSON === currentJSON) {
        // 같은 요청이면 멱등하다고 판단
        console.log('멱등성을 만족합니다.');
        console.log('이전 요청: ', previousJSON);
        console.log('현재 요청: ', currentJSON);
        console.log('쿠키?: ', req.cookies);
      } else {
        // 다른 요청이면 멱등하지 않다고 판단
        console.log('멱등성이 깨졌습니다.');
        console.log('이전 요청: ', previousJSON);
        console.log('현재 요청: ', currentJSON);
      }
    } else {
      // 이전 요청이 없는 경우
      console.log('첫 번째 요청입니다.');
    }

    res.send(res.locals.responseData);
  } catch (error) {
    console.error('Failed to check idempotency:', error);
    next(error);
  }
};
