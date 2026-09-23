import { Router } from 'express';
import {
  getAirtimeOrder,
  getAllAirtimeOrder,
  purchaseAirtime,
} from './airtimeController.js';
import { protect, restrictTo } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/airtime-purchase', restrictTo('user'), purchaseAirtime);

router.route('/').get(getAllAirtimeOrder);
router.route('/:airtimeOrderId').get(getAirtimeOrder);

export { router as airtimeRouter };
