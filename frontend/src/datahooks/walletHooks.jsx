import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

// Get Wallet Balance
export const useGetWalletBalance = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => axiosClient.get('/wallet/'),
  });

  return {
    walletBalance: data?.data?.data?.wallet?.balance, 
    walletBalanceLoading: isLoading,
    walletBalanceError: isError,
    errorDetails: error,
  };
};

// Get Wallet Transactions
export const useGetTransactions = (queryParams = '') => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wallet', 'transactions', queryParams],
    queryFn: () => axiosClient.get(`/wallet/get-transaction${queryParams}`),
  });

  return {
    transactions: data?.data?.data?.transactions || data?.data?.transactions,
    meta: data?.data?.meta || data?.data?.data?.meta,
    transactionsLoading: isLoading,
    transactionsError: isError,
    errorDetails: error,
  };
};
