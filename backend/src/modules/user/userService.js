import APIFeatures from '../../common/utils/apiFeatures.js';
import { AppError } from '../../common/utils/appError.js';
import { User } from './userModel.js';

export const getAllUserService = async ({ requestQuery }) => {
  const features = new APIFeatures(User.find(), requestQuery.query, User)
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const user = await features.queryModel;
  const meta = await features.getMeta();

  return { meta, user };
};

// Get user

export const getUserService = async ({
  userId,
  loginUserId,
  loginUserRole,
}) => {
  if (userId !== loginUserId && loginUserRole !== 'admin') {
    throw new AppError(
      'You are not authorized to get another user details',
      403,
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }
  return { user };
};

// Delete User Service

export const deleteUserService = async ({ userId }) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError('No document found with that ID', 404);
  }

  return { user };
};

// Update Service

export const updateUserService = async ({ userId, userRole, body, file }) => {
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
  };

  // 1) Create Error if User post password data.

  if (body.password || body.passwordConfirm) {
    throw new AppError(
      'This route is not for password update. Please use the password update route',
      403,
    );
  }

  if (body.role && userRole !== 'admin') {
    throw new AppError('You are not authorised to perform this action', 403);
  }

  // 2) Update User Document (self)

  // Filtered out unwanted field name that are not allowed to be updated
  const filteredBody = filterObj(body, 'fullname', 'phone', 'role');
  if (file) filteredBody.photo = file.filename;

  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  return { user: updatedUser };
};
