import mongoose from 'mongoose';
import crypto from 'crypto';
import { AppError } from '../../common/utils/appError.js';
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from './gateway/paystack/paystackService.js';
import { Payment } from './paymentModel.js';
import { walletCreditService } from '../wallet/walletService.js';
import APIFeatures from '../../common/utils/apiFeatures.js';

// get payment transaction

export const getAllPaymentService = async ({
  userId,
  userRole,
  requestQuery,
}) => {
  let filter = {};

  if (userRole !== 'admin') {
    filter.user = userId;
  }

  const features = new APIFeatures(
    Payment.find(filter),
    requestQuery,
    Payment,
    filter,
  )
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const payment = await features.queryModel;
  const meta = await features.getMeta();

  return { payment, meta };
};

// Get Payment

export const getPaymentService = async ({ paymentId, userId, userRole }) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new AppError('Data Order not found', 404);
  }

  if (userRole !== 'admin' && userId.toString() !== payment.user.toString()) {
    throw new AppError(
      'You are not authorized to get another user data order details',
      403,
    );
  }

  return { payment };
};

// initialize paystack

export const initializePaystackPaymentService = async ({
  userId,
  userEmail,
  amount,
}) => {
  const payment = await Payment.create({
    user: userId,
    amount,
    paymentGateway: 'paystack',
    status: 'pending',
  });

  const paystack = await initializePaystackTransaction({
    email: userEmail,
    amount,
    reference: payment.reference,
    metadata: {
      userId,
      paymentId: payment._id,
    },
  });

  return {
    payment,
    paystackData: paystack?.data,
  };
};

export const verifyAndCreditPaystackService = async ({ reference }) => {
  const paymentTxn = await Payment.findOne({ reference });

  if (!paymentTxn) {
    throw new AppError(
      `No funding transaction found for reference ${reference}`,
    );
  }

  // Idempotency guard: if it is already processed, nothing to do.

  if (paymentTxn.status === 'successful') {
    return { paymentTxn };
  }

  const verification = await verifyPaystackTransaction({
    paystackReference: reference,
  });
  const paymentStatus = verification?.data?.status;

  // if payment is successfull

  if (paymentStatus === 'success') {
    const amountPaid = Number(verification.data.amount / 100);
    const expectedAmount = Number(paymentTxn.amount);

    // check if the amount paid matches what is expected

    if (amountPaid !== expectedAmount) {
      await Payment.findByIdAndUpdate(paymentTxn._id, {
        status: 'failed',
        gatewayResponse: {
          ...verification,
          mismatch: true,
          expectedAmount: paymentTxn.amount,
          amountPaid: amountPaid,
        },
      });

      throw new AppError('Amount Paid is not Equal to what is expected', 400);
    }

    // credit wallet and update Payment Model

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedPaymentTxn = await Payment.findOneAndUpdate(
        { _id: paymentTxn._id, status: { $ne: 'successful' } },
        {
          status: 'successful',
          gatewayResponse: verification?.data,
        },
        { session, new: true },
      );

      if (!updatedPaymentTxn) {
        await session.abortTransaction();
        await session.endSession();
        return { paymentTxn };
      }

      await walletCreditService({
        userId: paymentTxn.user,
        amount: paymentTxn.amount,
        session,
        transactionType: 'funding',
        status: 'successful',
      });

      await session.commitTransaction();

      return { paymentTxn: updatedPaymentTxn };
    } catch (err) {
      await session.abortTransaction();
      console.log(err);
      throw err;
    } finally {
      await session.endSession();
    }
  } else {
    const updatedPaymentTxn = await Payment.findByIdAndUpdate(
      paymentTxn._id,
      {
        status: paymentStatus || 'pending',
        gatewayResponse: verification,
      },
      { new: true },
    );

    return { paymentTxn: updatedPaymentTxn };
  }
};

// paystack webhook

export const paystackWebhookService = async ({
  signature,
  requestRawBody,
  requestBody,
}) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(requestRawBody)
    .digest('hex');

  if (!signature || hash !== signature) {
    throw new AppError('Invalid signature', 401);
  }

  const event = requestBody;

  if (event.event !== 'charge.success') {
    return;
  }

  if (!event.data?.reference) {
    throw new AppError('Paystack webhook reference is missing', 400);
  }
  await verifyAndCreditPaystackService({ reference: event.data.reference });
};
