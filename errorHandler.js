export function errorHandler(err, req, res, next) {
  console.error('에러 발생:', err.message);

  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send('서버 에러');
  }
}
