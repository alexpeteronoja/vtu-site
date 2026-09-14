import axios from 'axios';
import { AppError } from '../../common/utils/appError.js';

const vtpassApi = axios.create({
  baseURL: process.env.VT_PASS_URL,
  headers: {
    'api-key': process.env.VT_PASS_API_KEY,
    'public-key': process.env.VT_PASS_PUBLIC_KEY,
    'secret-key': process.env.VT_PASS_SECRET_KEY,
  },
});

export const vtPassPurchaseAirtime = async ({
  requestId,
  serviceID,
  amount,
  phone,
}) => {
  try {
    const response = await vtpassApi.post('/pay', {
      request_id: requestId,
      serviceID,
      amount,
      phone,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const vtPassPurchaseData = async ({
  requestId,
  serviceID,
  variationCode,
  phone,
}) => {
  try {
    const response = await vtpassApi.post('/pay', {
      request_id: requestId,
      serviceID,
      variation_code: variationCode,
      phone,
    });

    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    throw new AppError(
      `Provider response: ${err.response?.data?.content?.errors || 'Data purchase provider failed'}`,
      502,
    );
  }
};
