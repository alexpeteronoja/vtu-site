import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  signUpService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  updateUserPasswordService,
  verifyResetOtpService,
} from './authService.js';

export const signUp = catchAsync(async (req, res, next) => {
  const { fullname, email, phone, password, passwordConfirm, role } = req.body;
  const { user, accessToken } = await signUpService({
    fullname,
    email,
    phone,
    password,
    passwordConfirm,
    role,
  });
  successResponse(res, 201, { data: { accessToken, user } }, 'Account Created');
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, accessToken } = await loginService(email, password);
  successResponse(res, 200, { data: { accessToken, user } }, 'Login Success');
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  await forgotPasswordService(email);
  successResponse(res, 200, {}, 'Token sent to email');
});

// verify reset otp

export const verifyResetOtp = catchAsync(async (req, res) => {
  const { email, resetToken } = req.body;

  const { verifiedToken } = await verifyResetOtpService({
    email,
    resetToken,
  });

  successResponse(
    res,
    200,
    { data: { verifiedToken } },
    'OTP verified successfully',
  );
});

// reset password

export const resetPassword = catchAsync(async (req, res) => {
  const { email, verifiedToken, newPassword, newPasswordConfirm } = req.body;

  const { user, accessToken } = await resetPasswordService({
    email,
    verifiedToken,
    newPassword,
    newPasswordConfirm,
  });

  successResponse(
    res,
    200,
    { data: { accessToken, user } },
    'Password Reset Success',
  );
});

// update password

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  const userId = req.user._id;

  const { user } = await updateUserPasswordService({
    currentPassword,
    newPassword,
    newPasswordConfirm,
    userId,
  });

  successResponse(res, 200, { data: { user } }, 'password changed success');
});
