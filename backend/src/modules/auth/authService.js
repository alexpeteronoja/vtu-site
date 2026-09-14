import { User } from '../user/userModel.js';
import crypto from 'crypto';
import { AppError } from '../../common/utils/appError.js';
import { signAccessToken } from '../../common/utils/jwt.js';
import mongoose from 'mongoose';
import { createWalletService } from '../wallet/walletService.js';

export const signUpService = async ({
  fullname,
  email,
  phone,
  password,
  passwordConfirm,
  role,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newUser] = await User.create(
      [
        {
          fullname,
          email,
          phone,
          password,
          passwordConfirm,
          role,
        },
      ],
      { session },
    );

    await createWalletService({
      userId: newUser._id,
      session,
    });

    await session.commitTransaction();
    // session.endSession();

    const accessToken = signAccessToken(newUser._id);

    // Remove password from output
    newUser.password = undefined;

    return { user: newUser, accessToken };
  } catch (err) {
    await session.abortTransaction();

    console.error('Transaction failed', err);
    throw err;
  } finally {
    session.endSession();
  }
};

// Login Service

export const loginService = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please Provide email and password!', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 400);
  }

  const accessToken = signAccessToken(user._id);

  user.password = undefined;

  return { user, accessToken };
};

// Forgot Password

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne(email);

  if (!user) {
    throw new AppError('There is no user with that Email address', 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log(resetToken);
};

// verify reset otp

export const verifyResetOtpService = async ({ email, resetToken }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid or Expired OTP', 400);
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  if (
    user.passwordResetToken !== hashedToken ||
    user.passwordResetExpires < Date.now()
  ) {
    throw new AppError('Invalid or Expired OTP', 400);
  }

  // OTP is valid
  // Generate a temporary token proving OTP verification
  const verifiedToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetVerifiedToken = crypto
    .createHash('sha256')
    .update(verifiedToken)
    .digest('hex');

  user.passwordResetVerifiedExpires = Date.now() + 5 * 60 * 1000;

  // OTP should no longer be usable
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateBeforeSave: false });

  return { verifiedToken };
};

// reset password service

export const resetPasswordService = async ({
  email,
  verifiedToken,
  newPassword,
  newPasswordConfirm,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid or Expired Reset Token', 400);
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(verifiedToken)
    .digest('hex');

  if (
    user.passwordResetVerifiedToken !== hashedToken ||
    user.passwordResetVerifiedExpires < Date.now()
  ) {
    throw new AppError('Invalid or Expired Verified Token', 400);
  }

  if (newPassword !== newPasswordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  // Invalidate reset token
  user.passwordResetVerifiedToken = undefined;
  user.passwordResetVerifiedExpires = undefined;

  await user.save();

  const accessToken = signAccessToken(user._id);

  return { accessToken };
};

// export const resetPasswordService = async ({
//   email,
//   resetToken,
//   newPassword,
//   newPasswordConfirm,
// }) => {
//   const user = await User.findOne({ email });

//   if (!user) throw new AppError('Invalid User or OTP', 400);

//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   if (
//     user.passwordResetToken !== hashedToken ||
//     user.passwordResetExpires < Date.now()
//   ) {
//     throw new AppError('Invalid or Expired OTP', 400);
//   }

//   if (newPassword !== newPasswordConfirm) {
//     throw new AppError('Passwords do not match', 400);
//   }

//   user.password = newPassword;
//   user.passwordConfirm = newPasswordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;

//   await user.save();

//   const accessToken = signAccessToken(user._id);

//   return { accessToken };
// };

export const updateUserPasswordService = async ({
  currentPassword,
  newPassword,
  newPasswordConfirm,
  userId,
}) => {
  const user = await User.findById(userId).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError('Current password is Incorrect', 400);
  }

  if (newPassword !== newPasswordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  return { user };
};
