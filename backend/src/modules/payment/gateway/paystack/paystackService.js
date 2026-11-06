import axios from 'axios';

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// initialize paystack payment

export const initializePaystackTransaction = async ({
  email,
  amount,
  reference,
  metadata,
}) => {
  const payload = {
    email,
    amount: amount * 100, // in kobo
    reference,
    metadata,
    callback_url: `${process.env.NODE_ENV === 'production' ? 'https://vtu-site-sooty.vercel.app' : 'http://localhost:5173'}/payment/callback`,
  };

  const response = await paystackApi.post('/transaction/initialize', payload);

  return response.data;
};

// verify paystack payment

export const verifyPaystackTransaction = async ({ paystackReference }) => {
  const response = await paystackApi.get(
    `/transaction/verify/${paystackReference}`,
  );

  return response.data;
};
