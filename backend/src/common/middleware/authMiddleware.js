import { User } from '../../modules/user/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Protect Routes

export const protect = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AppError(
      'You are not logged in! Please Login to get access',
      401,
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The User belonging to this token does not exist', 401);
  }

  if (user.changePasswordAfter(decoded.iat)) {
    throw new AppError(
      'User recently change password! Please login again',
      401,
    );
  }

  req.user = user;

  next();
});

// Restrict

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
