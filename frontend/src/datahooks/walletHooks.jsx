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
export const useGetTransactions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => axiosClient.get('/wallet/get-transaction'),
  });

  console.log("Raw transactions data:", data?.data);
  return {
    transactions: data?.data?.data?.transactions || data?.data?.transactions,
    transactionsLoading: isLoading,
    transactionsError: isError,
    errorDetails: error,
  };
};
