class AppError extends Error {
  constructor(name, message, status) {
    super(message);
    this.name = name;
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

const CommonError = {
  // 인증 관련 오류
  AUTHENTICATION_ERROR: 'Authentication Error',

  // 토큰 만료 오류
  EXPIRED_ERROR: 'Expired Error',

  // 올바르지 않은 입력
  INVALID_INPUT: 'Invalid Input',

  // 요청한 리소스를 찾을 수 없음
  RESOURCE_NOT_FOUND: 'Resource Not Found',

  // 중복된 항목 존재하는 경우
  DUPLICATE_ENTRY: 'Duplicate Entry',

  // 접근권한이 없는 경우
  UNAUTHORIZED_ACCESS: 'Unauthorized Access',

  // 내부 서버 오류가 발생한 경우
  SERVER_ERROR: 'Server Error',

  // 데이터베이스 관련 오류가 발생한 경우
  DB_ERROR: 'DB Error',

  // ... 나머지 에러 이름들 ...
  UNEXPECTED_ERROR: 'Unexpected Error',
};

export { AppError, CommonError };

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const { message, name, status } = err;
    const errorResponse = {
      message,
      name,
      status,
    };
    res.status(status).json(errorResponse);
  } else {
    res.status(500).json({
      error: {
        message: '서버 에러',
        name: err.message,
        status: 500,
      },
    });
  }
};
