import mongoose from 'mongoose';
import {
  walletCreditService,
  walletdebitService,
} from '../wallet/walletService.js';
import { AirtimeOrder } from './airtimeOrderModel.js';
import { vtPassPurchaseAirtime } from '../providers/vtpass.js';
import APIFeatures from '../../common/utils/apiFeatures.js';
import { AppError } from '../../common/utils/appError.js';

export const purchaseAirtimeService = async ({
  userId,
  network,
  phoneNumber,
  amount,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await walletdebitService({
      userId,
      amount,
      session,
      transactionType: 'airtime_purchase',
      status: 'pending',
    });

    const [airtimeTxn] = await AirtimeOrder.create(
      [
        {
          user: userId,
          network,
          phoneNumber,
          amount,
          status: 'pending',
        },
      ],
      { session },
    );

    await session.commitTransaction();

    const serviceID = network.toLowerCase();

    // console.log(airtimeTxn);

    return callAggregatorAndFinalize({
      airtimeTxn,
      serviceID,
      amount,
      phone: phoneNumber,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Airtime Purchase failed', err);
    throw err;
  } finally {
    session.endSession();
  }
};

// Call Aggregator

export const callAggregatorAndFinalize = async ({
  airtimeTxn,
  serviceID,
  amount,
  phone,
}) => {
  try {
    const response = await vtPassPurchaseAirtime({
      requestId: airtimeTxn.reference,
      serviceID,
      amount,
      phone,
    });

    const providerStatus = response?.content?.transactions?.status;

    if (providerStatus === 'delivered') {
      return updateAirtimeOrder({
        airtimeTxn,
        status: 'successful',
        providerResponse: response,
        message: 'Airtime Purchase Successful',
      });
    } else if (providerStatus === 'failed') {
      return refundAndMarkFailed({ airtimeTxn, providerResponse: response });
    } else if (providerStatus === 'pending') {
      return updateAirtimeOrder({
        airtimeTxn,
        status: 'pending',
        providerResponse: response,
        message: 'Airtime Purchase Pending',
      });
    } else if (providerStatus === undefined) {
      return updateAirtimeOrder({
        airtimeTxn,
        status: 'pending',
        providerResponse: 'No Response from the Provider',
        message: 'Airtime Purchase Pending',
      });
    } else {
      return updateAirtimeOrder({
        airtimeTxn,
        status: 'pending',
        providerResponse: response,
        message: 'Airtime Purchase Pending',
      });
    }
  } catch (err) {
    console.error(err);
    await AirtimeOrder.findByIdAndUpdate(airtimeTxn._id, {
      status: 'pending',
      providerResponse: err?.message,
    });
    throw err;
  }
};

// update Airtime Order

const updateAirtimeOrder = async ({
  airtimeTxn,
  status,
  providerResponse,
  message,
}) => {
  const updatedOrder = await AirtimeOrder.findByIdAndUpdate(
    airtimeTxn._id,
    {
      status,
      providerResponse,
    },
    { new: true },
  );

  return {
    airtimeTxn: updatedOrder,
    providerResponse,
    message,
  };
};

// Refund Airtime

const refundAndMarkFailed = async ({ airtimeTxn, providerResponse }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await walletCreditService({
      userId: airtimeTxn.user,
      amount: airtimeTxn.amount,
      session,
      transactionType: 'refunded',
      status: 'refunded',
    });

    const updatedOrder = await AirtimeOrder.findByIdAndUpdate(
      { _id: airtimeTxn._id },
      {
        status: 'failed',
        providerResponse: providerResponse,
      },
      { session, new: true },
    );

    await session.commitTransaction();

    return {
      airtimeTxn: updatedOrder,
      providerResponse,
      message: 'Airtime Purchase Failed',
    };
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    throw err; // this needs alerting — a failed refund is money stuck
  } finally {
    session.endSession();
  }
};

export const getAllAirtimeOrderService = async ({
  userId,
  userRole,
  requestQuery,
}) => {
  let filter = {};

  if (userRole !== 'admin') {
    filter.user = userId;
  }

  const features = new APIFeatures(
    AirtimeOrder.find(filter),
    requestQuery,
    AirtimeOrder,
    filter,
  )
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const airtimeOrder = await features.queryModel;
  let meta = await features.getMeta();

  return { airtimeOrder, meta };
};

export const getAirtimeOrderService = async ({
  airtimeOrderId,
  userId,
  userRole,
}) => {
  const airtimeOrder = await AirtimeOrder.findById(airtimeOrderId);

  if (!airtimeOrder) {
    throw new AppError('Airtime Order not found', 404);
  }

  if (
    userRole !== 'admin' &&
    userId.toString() !== airtimeOrder.user.toString()
  ) {
    throw new AppError(
      'You are not authorized to get another user airtime order details',
      403,
    );
  }

  return { airtimeOrder };
};
