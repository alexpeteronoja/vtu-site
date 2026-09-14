import { Router } from 'express';
import { getAllTransaction, getWalletBalance } from './walletController.js';
import { protect } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/get-transaction', getAllTransaction);

router.route('/').get(getWalletBalance);

export { router as walletRouter };
