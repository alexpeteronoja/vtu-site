import { Router } from 'express';
import {
  deleteUser,
  getAllUser,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from './userController.js';
import { protect, restrictTo } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/me').get(getMe).patch(updateMe);

router.route('/').get(getAllUser);

router
  .route('/:id')
  .get(getUser)
  .patch(restrictTo('admin'), updateUser)
  .delete(restrictTo('admin'), deleteUser);

export { router as userRouter };
