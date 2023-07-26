const idempotencyCache = {};

export function checkIdempotency(req, res, next) {
  const { url, method, body } = req;

  // 멱등성 검사 대상이 되는 API 호출 (예: POST, PUT, DELETE)만을 대상으로 합니다.
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const key = `${method}:${url}:${JSON.stringify(body)}`;

    if (idempotencyCache[key] !== undefined) {
      console.log(`멱등성이 깨짐: ${method} ${url}`);
    } else {
      console.log(`멱등성을 보장함: ${method} ${url}`);
    }

    // 이전 결과를 삭제하여, 새로운 요청 결과만을 기록합니다.
    idempotencyCache[key] = true;
  }

  console.log('현재 캐시: ', idempotencyCache);
  next();
}
