import { AppError, CommonError } from '../middlewares/errorHandler.js';
import { login, logout, checkSession, extendSession, getSessionData } from './sessionController.js';
import { authenticateUser, getAllSessionData } from '../services/services.js';

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

describe('login', () => {
  test('로그인 성공', async () => {
    const req = {
      body: {
        username: 'admin',
        password: 'password',
      },
      session: { data: {} },
    };
    const res = { send: jest.fn() };
    const next = jest.fn();

    // login 함수를 모의 함수로 사용
    login.mockImplementation(async (req, res, next) => {
      const { username, password } = req.body;

      const authenticated = await authenticateUser(username, password);
      if (authenticated) {
        const now = new Date();
        const koreanTime = 9 * 60 * 60 * 1000;
        const koreanNow = new Date(now.getTime() + koreanTime);

        req.session.data = {
          authenticateUser: true,
          user: username,
          createdAt: koreanNow.toISOString().slice(0, 19).replace('T', ' '),
        };
        res.send(`${username} 님 환영합니다.`);
      } else {
        next(new AppError(CommonError.INVALID_INPUT, '없는 id이거나 잘못된 비밀번호입니다.', 401));
      }
    });

    await login(req, res, next);

    expect(res.send).toHaveBeenCalledWith('admin 님 환영합니다.');
    expect(next).not.toHaveBeenCalled();
  });

  test('로그인 실패', async () => {
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

describe('logout', () => {
  test('로그아웃 성공', async () => {
    const req = {
      session: {
        destroy: jest.fn((callback) => callback(null)),
      },
      cookies: {
        sessionID: 'test-session-id',
      },
    };
    const res = {
      clearCookie: jest.fn(),
      send: jest.fn(),
    };

    logout(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith('sessionID');
    expect(res.send).toHaveBeenCalledWith('세션 로그아웃 성공');
  });
});
