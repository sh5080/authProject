const previousResults = {};

export function checkIdempotency(req, res, next) {
  const { url, method, body } = req;
  const key = `${method}:${url}:${JSON.stringify(body)}`;

  // 이전 결과와 현재 요청 결과를 비교
  if (previousResults[key] !== undefined) {
    // 멱등성이 깨짐을 로그로 출력하거나 처리
    console.log(`멱등성이 깨짐: ${method} ${url}`);
  }

  // 현재 요청 결과를 이전 결과에 저장
  previousResults[key] = true;

  next();
}
