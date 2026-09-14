import { Router } from 'express';
import {
  initializePaystackPayment,
  paystackWebhook,
  verifyAndCreditPaystackPayment,
} from './paymentController.js';
import { protect } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/initialize-paystack', initializePaystackPayment);
router.get('/verify-paystack/:reference', verifyAndCreditPaystackPayment);

router.post('/webhook-paystack', paystackWebhook);

export { router as paymentRouter };
