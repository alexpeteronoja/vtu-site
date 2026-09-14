import { Router } from 'express';
import {
  getAllPayment,
  getPayment,
  initializePaystackPayment,
  paystackWebhook,
  verifyAndCreditPaystackPayment,
} from './paymentController.js';
import { protect } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.post('/webhook-paystack', paystackWebhook);

router.use(protect);

router.post('/initialize-paystack', initializePaystackPayment);
router.get('/verify-paystack/:reference', verifyAndCreditPaystackPayment);

router.route('/').get(getAllPayment);
router.route('/:paymentId').get(getPayment);

export { router as paymentRouter };
