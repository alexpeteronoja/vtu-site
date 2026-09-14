import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  getAllPaymentService,
  getPaymentService,
  initializePaystackPaymentService,
  paystackWebhookService,
  verifyAndCreditPaystackService,
} from './paymentService.js';

export const getAllPayment = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const userRole = req.user.role;

  const { payment, meta } = await getAllPaymentService({
    userId,
    userRole,
    requestQuery: req.query,
  });

  successResponse(
    res,
    200,
    { data: { meta, payment } },
    'Payment Retrieved Success',
  );
});

export const getPayment = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { paymentId } = req.params;

  const { payment } = await getPaymentService({
    userId,
    userRole,
    paymentId,
  });

  successResponse(res, 200, { data: { payment } }, 'Payment Retrieved Success');
});

export const initializePaystackPayment = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const userEmail = req.user.email;
  const { amount } = req.body;

  const { payment, paystackData } = await initializePaystackPaymentService({
    userId,
    userEmail,
    amount,
  });

  successResponse(
    res,
    200,
    { data: { payment, paystackData } },
    'payment initialize',
  );
});

export const verifyAndCreditPaystackPayment = catchAsync(
  async (req, res, next) => {
    const { reference } = req.params;

    const { paymentTxn } = await verifyAndCreditPaystackService({ reference });

    successResponse(
      res,
      200,
      { data: { paymentTxn } },
      'payment verification data',
    );
  },
);

export const paystackWebhook = catchAsync(async (req, res, next) => {
  const signature = req.headers['x-paystack-signature'];
  const requestRawBody = req.rawBody;
  const requestBody = req.body;

  // console.log('🔥 PAYSTACK WEBHOOK RECEIVED');
  // console.log('Event:', req.body.event);
  // console.log('Body:', req.body);

  await paystackWebhookService({ signature, requestBody, requestRawBody });

  res.sendStatus(200);
});
