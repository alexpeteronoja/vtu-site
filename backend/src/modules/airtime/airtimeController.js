import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  getAirtimeOrderService,
  getAllAirtimeOrderService,
  purchaseAirtimeService,
} from './airtimeService.js';

export const purchaseAirtime = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { network, phoneNumber, amount } = req.body;

  const { airtimeTxn, message } = await purchaseAirtimeService({
    userId,
    network,
    phoneNumber,
    amount,
  });

  successResponse(res, 200, { data: { airtimeTxn } }, message);
});

export const getAllAirtimeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const userRole = req.user.role;

  const { airtimeOrder, meta } = await getAllAirtimeOrderService({
    userId,
    userRole,
    requestQuery: req.query,
  });

  successResponse(
    res,
    200,
    { data: { meta, airtimeOrder } },
    'Airtime Order Retrieved Success',
  );
});

export const getAirtimeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { airtimeOrderId } = req.params;

  const { airtimeOrder } = await getAirtimeOrderService({
    airtimeOrderId,
    userRole,
    userId,
  });

  successResponse(
    res,
    200,
    { data: { airtimeOrder } },
    'Airtime Order Retrieved Success',
  );
});
