import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

// Get All Users
export const useAllUsers = (params = { limit: 10, page: 1, sort: '-createdAt' }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/user', { params });
      return data.data; // { user: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

// Get All Transactions
export const useAllTransactions = (params = { limit: 10, page: 1, sort: '-createdAt' }) => {
  return useQuery({
    queryKey: ['admin', 'transactions', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/wallet/get-transaction', { params });
      return data.data; // { transactions: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

// Get All Payments (Useful for calculating total revenue/deposits)
export const useAllPayments = (params = { limit: 100, page: 1, sort: '-createdAt' }) => {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/payment', { params });
      return data.data; // { payment: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

// Get All Data Orders
export const useAllDataOrders = (params = { limit: 10, page: 1, sort: '-createdAt' }) => {
  return useQuery({
    queryKey: ['admin', 'data-orders', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/data/data-order', { params });
      return data.data; // { dataOrder: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

// Get All Airtime Orders
export const useAllAirtimeOrders = (params = { limit: 10, page: 1, sort: '-createdAt' }) => {
  return useQuery({
    queryKey: ['admin', 'airtime-orders', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/airtime', { params });
      return data.data; // { airtimeOrder: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

