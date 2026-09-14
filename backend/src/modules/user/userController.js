import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  deleteUserService,
  getAllUserService,
  getUserService,
  updateUserService,
} from './userService.js';

export const getAllUser = catchAsync(async (req, res, next) => {
  const requestQuery = req.query;
  const { user, meta } = await getAllUserService({ requestQuery });

  successResponse(res, 200, { data: { meta, user } }, 'sucess');
});

export const getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const loginUserId = req.user._id.toString();
  const loginUserRole = req.user.role;
  const { user } = await getUserService({ userId, loginUserId, loginUserRole });

  successResponse(res, 200, { data: { user } }, 'success');
});

export const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const userRole = req.user.role;
  const { body } = req;
  const { file } = req;

  const { user } = await updateUserService({ userId, userRole, body, file });

  successResponse(res, 200, { data: { user } }, 'user updated success');
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await deleteUserService({ userId });
  successResponse(res, 204, {}, 'user deleted');
});

export const getMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const loginUserId = req.user._id.toString();
  const loginUserRole = req.user.role;
  const { user } = await getUserService({ userId, loginUserId, loginUserRole });

  successResponse(res, 200, { data: { user } }, 'success');
});

export const updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { body } = req;
  const { file } = req;

  const { user } = await updateUserService({ userId, userRole, body, file });

  successResponse(res, 200, { data: { user } }, 'user updated success');
});
