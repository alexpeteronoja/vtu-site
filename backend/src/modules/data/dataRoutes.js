import { Router } from 'express';
import {
  createDataPlan,
  deleteDataPlan,
  getAllDataOrder,
  getAllDataPlan,
  getDataOrder,
  purchaseData,
  updateDataPlan,
} from './dataController.js';
import { protect, restrictTo } from '../../common/middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/data-purchase/:dataPlanId', restrictTo('user'), purchaseData);

router.get('/data-order', getAllDataOrder);
router.get('/data-order/:dataOrderId', getDataOrder);

router.route('/').get(getAllDataPlan).post(restrictTo('admin'), createDataPlan);

router
  .route('/:id')
  .delete(restrictTo('admin'), deleteDataPlan)
  .patch(restrictTo('admin'), updateDataPlan);

export { router as dataRouter };
