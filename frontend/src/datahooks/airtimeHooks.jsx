import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

// Purchase Airtime
export const usePurchaseAirtime = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (payload) => axiosClient.post('/airtime/airtime-purchase', payload),
    onSuccess: () => {
      toast.success('Airtime purchased successfully!');
      // Invalidate wallet balance and airtime orders
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['airtimeOrders'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to purchase airtime';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    purchaseAirtimeMutate: mutate,
    purchaseAirtimeMutateAsync: mutateAsync,
    purchaseAirtimePending: isPending,
    purchaseAirtimeError: isError,
    purchaseAirtimeSuccess: isSuccess,
  };
};

// Get Airtime Orders
export const useGetAirtimeOrders = (queryParams = '') => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['airtimeOrders', queryParams],
    queryFn: () => axiosClient.get(`/airtime/${queryParams}`),
  });

  return {
    airtimeOrders: data?.data?.data?.airtimeOrder,
    meta: data?.data?.data?.meta,
    airtimeOrdersLoading: isLoading,
    airtimeOrdersError: isError,
    errorDetails: error,
  };
};
