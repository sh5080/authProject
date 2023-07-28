import { signupUser } from '../services/services.js';
import { AppError, CommonError } from '../middlewares/errorHandler.js';

export const signup = async (req, res, next) => {
  const { name, username, password, email } = req.body;
  try {
    if (username.length < 6 || username.length > 20) {
      throw new AppError(CommonError.INVALID_INPUT, '아이디는 6자 이상 20자 이내로 설정해야 합니다.', 400);
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        '비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.',
        400
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, username, hashedPassword, email };
    await signupUser(userData);

    // res.locals.responseData = `${username} 님 환영합니다.`;
  } catch (error) {
    console.error(error);
    next(error);
  }
};
