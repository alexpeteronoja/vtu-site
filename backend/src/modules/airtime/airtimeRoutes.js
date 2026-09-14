import { Router } from 'express';
import {
  getAirtimeOrder,
  getAllAirtimeOrder,
  purchaseAirtime,
} from './airtimeController.js';
import { protect } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/airtime-purchase', purchaseAirtime);

router.route('/').get(getAllAirtimeOrder);
router.route('/:airtimeOrderId').get(getAirtimeOrder);

export { router as airtimeRouter };
