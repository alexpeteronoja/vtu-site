import { Router } from 'express';
import {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyResetOtp,
} from './authController.js';
import { protect } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.post('/update-password', protect, updatePassword);

export { router as authRouter };
