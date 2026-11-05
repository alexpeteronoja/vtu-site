import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

// Initialize Paystack Payment
export const useInitializePayment = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (payload) => axiosClient.post('/payment/initialize-paystack', payload),
    onSuccess: (res) => {
      // The backend returns { data: { payment, paystackData: { authorization_url, ... } } }
      const authorizationUrl = res.data?.data?.paystackData?.authorization_url;
      if (authorizationUrl) {
         window.location.href = authorizationUrl; // Redirect to Paystack
      } else {
         toast.success('Payment initialized successfully!');
      }
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to initialize payment';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    initializePaymentMutate: mutate,
    initializePaymentMutateAsync: mutateAsync,
    initializePaymentPending: isPending,
    initializePaymentError: isError,
    initializePaymentSuccess: isSuccess,
  };
};

// Verify Paystack Payment
export const useVerifyPayment = (reference) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['payment', 'verify', reference],
    queryFn: async () => {
      const res = await axiosClient.get(`/payment/verify-paystack/${reference}`);
      // Invalidate wallet queries on successful verification
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      return res.data;
    },
    enabled: !!reference, // Only run if we have a reference
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    verificationData: query.data,
    verifyLoading: query.isLoading,
    verifyError: query.isError,
    errorDetails: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
};

// Get All Payments (Funding History)
export const useGetPayments = (queryParams = '') => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['payment', 'all', queryParams],
    queryFn: () => axiosClient.get(`/payment${queryParams}`),
  });

  return {
    payments: data?.data?.data?.payment || [],
    meta: data?.data?.meta || data?.data?.data?.meta,
    paymentsLoading: isLoading,
    paymentsError: isError,
    errorDetails: error,
  };
};
