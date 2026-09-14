import mongoose from 'mongoose';
import APIFeatures from '../../common/utils/apiFeatures.js';
import { AppError } from '../../common/utils/appError.js';
import { DataPlan } from './dataPlanModel.js';
import {
  walletCreditService,
  walletdebitService,
} from '../wallet/walletService.js';
import { DataOrder } from './dataOrderModel.js';
import { vtPassPurchaseData } from '../providers/vtpass.js';

export const createDataPlanService = async ({ ...dataPlanEntry }) => {
  const dataPlan = await DataPlan.create(dataPlanEntry);

  return { dataPlan };
};

export const updateDataPlanService = async ({ body, dataPlanId }) => {
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
  };

  const filteredBody = filterObj(
    body,
    'name',
    'network',
    'planCode',
    'size',
    'validity',
    'costPrice',
    'sellingPrice',
    'serviceId',
  );

  const updatedDataPlan = await DataPlan.findByIdAndUpdate(
    dataPlanId,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  return { dataPlan: updatedDataPlan };
};

export const getAllDataPlanService = async ({ requestQuery }) => {
  const features = new APIFeatures(DataPlan.find(), requestQuery, DataPlan)
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const dataPlan = await features.queryModel;
  const meta = await features.getMeta();

  return { meta, dataPlan };
};

export const deleteDataService = async ({ dataPlanId }) => {
  const dataPlan = await DataPlan.findByIdAndDelete(dataPlanId);

  if (!dataPlan) {
    throw new AppError('No data plan found with that ID', 404);
  }

  return { dataPlan };
};

export const getAllDataOrderService = async ({
  userId,
  userRole,
  requestQuery,
}) => {
  let filter = {};

  if (userRole !== 'admin') {
    filter.user = userId;
  }

  const features = new APIFeatures(
    DataOrder.find(filter),
    requestQuery,
    DataOrder,
    filter,
  )
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const dataOrder = await features.queryModel;
  const meta = await features.getMeta();

  return { dataOrder, meta };
};

export const getDataOrderService = async ({
  dataOrderId,
  userId,
  userRole,
}) => {
  const dataOrder = await DataOrder.findById(dataOrderId);

  if (!dataOrder) {
    throw new AppError('Data Order not found', 404);
  }

  if (userRole !== 'admin' && userId.toString() !== dataOrder.user.toString()) {
    throw new AppError(
      'You are not authorized to get another user data order details',
      403,
    );
  }

  return { dataOrder };
};

export const purchaseDataService = async ({
  dataPlanId,
  userId,
  phoneNumber,
}) => {
  const dataPlan = await DataPlan.findById(dataPlanId);

  if (!dataPlan) {
    throw new AppError('Data Plan Not Found', 404);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await walletdebitService({
      userId,
      amount: dataPlan.sellingPrice,
      session,
      transactionType: 'data_purchase',
      status: 'pending',
    });

    const [dataTxn] = await DataOrder.create(
      [
        {
          user: userId,
          planName: dataPlan.name,
          network: dataPlan.network,
          dataPlan: dataPlan._id,
          planCode: dataPlan.planCode,
          phoneNumber,
          amountCharged: dataPlan.sellingPrice,
          status: 'pending',
        },
      ],
      { session },
    );

    await session.commitTransaction();

    // console.log(dataTxn);

    return callAggregatorAndFinalize({
      dataTxn,
      dataPlan,
      phoneNumber,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    throw err;
  } finally {
    session.endSession();
  }
};

// Call Aggregator

const callAggregatorAndFinalize = async ({
  dataTxn,
  dataPlan,
  phoneNumber,
}) => {
  try {
    const response = await vtPassPurchaseData({
      requestId: dataTxn.reference,
      serviceID: dataPlan.serviceId,
      variationCode: dataPlan.planCode,
      phone: phoneNumber,
    });

    const providerStatus = response?.content?.transactions?.status;

    if (providerStatus === 'delivered') {
      return updateDataOrder({
        dataTxn,
        status: 'successful',
        providerResponse: response,
        message: 'Data Purchase Successful',
      });
    } else if (providerStatus === 'pending') {
      return updateDataOrder({
        dataTxn,
        status: 'pending',
        providerResponse: response,
        message: 'Data Purchase Pending',
      });
    } else if (providerStatus === undefined) {
      return updateDataOrder({
        dataTxn,
        status: 'pending',
        providerResponse: 'No Response from the Provider',
        message: 'Data Purchase Pending',
      });
    } else if (providerStatus === 'failed') {
      return refundAndMarkFailed({ dataTxn, providerResponse: response });
    } else {
      return updateDataOrder({
        dataTxn,
        status: 'pending',
        providerResponse: response,
        message: 'Data Purchase Pending',
      });
    }
  } catch (err) {
    console.error('fake error', err);
    await DataOrder.findByIdAndUpdate(dataTxn._id, {
      status: 'pending',
      providerResponse: err?.message,
    });

    throw err;
  }
};

// update Data Order

const updateDataOrder = async ({
  dataTxn,
  status,
  providerResponse,
  message,
}) => {
  const updatedOrder = await DataOrder.findByIdAndUpdate(
    dataTxn._id,
    {
      status,
      providerResponse,
    },
    { new: true },
  );

  return {
    dataTxn: updatedOrder,
    providerResponse,
    message,
  };
};

// Refund if Fail

const refundAndMarkFailed = async ({ dataTxn, providerResponse }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await walletCreditService({
      userId: dataTxn.user,
      amount: dataTxn.amountCharged,
      session,
      transactionType: 'refunded',
      status: 'refunded',
    });

    const updatedOrder = await DataOrder.findByIdAndUpdate(
      dataTxn._id,
      {
        status: 'failed',
        providerResponse: providerResponse,
      },
      { session, new: true },
    );

    await session.commitTransaction();

    return {
      dataTxn: updatedOrder,
      providerResponse,
      message: 'Data Purchase Failed',
    };
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    throw err; // this needs alerting — a failed refund is money stuck
  } finally {
    await session.endSession();
  }
};
