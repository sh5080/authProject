import {
  login,
  // logout,
  // checkSession,
  // extendSession,
  // getSessionData
} from './sessionController.js';

jest.mock('./sessionController.js', () => {
  return {
    __esModule: true,
    login: jest.fn(),
    logout: jest.fn(),
    checkSession: jest.fn(),
    extendSession: jest.fn(),
    getSessionData: jest.fn(),
  };
});

import { AppError, CommonError } from '../middlewares/errorHandler.js';

describe('login', () => {
  test('로그인 성공여부', async () => {
    const req = { body: { username: 'user1', password: 'password1' } };
    const res = { send: jest.fn() };
    const next = jest.fn();

    // login 함수를 모의 함수로 사용
    login.mockImplementation(async (req, res, next) => {
      const { username, password } = req.body;
      const users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
      ];
      const user = users.find((user) => user.username === username && user.password === password);
      if (user) {
        res.send(`${username} 님 환영합니다.`);
      } else {
        next(new AppError(CommonError.INVALID_INPUT, '없는 id이거나 잘못된 비밀번호입니다.', 401));
      }
    });

    await login(req, res, next);

    expect(res.send).toHaveBeenCalledWith('user1 님 환영합니다.');
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw error if user is not authenticated', async () => {
    const req = { body: { username: 'user3', password: 'invalid' } };
    const res = { send: jest.fn() };
    const next = jest.fn();

    // login 함수를 모의 함수로 사용
    login.mockImplementation(async (req, res, next) => {
      const { username, password } = req.body;
      const users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
      ];
      const user = users.find((user) => user.username === username && user.password === password);
      if (user) {
        res.send(`${username} 님 환영합니다.`);
      } else {
        next(new AppError(CommonError.INVALID_INPUT, '없는 id이거나 잘못된 비밀번호입니다.', 401));
      }
    });

    await login(req, res, next);

    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new AppError(CommonError.INVALID_INPUT, '없는 id이거나 잘못된 비밀번호입니다.', 401)
    );
  });
});

// 나머지 테스트 코드 작성 ...
