import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

// Get All Data Plans
export const useGetAllDataPlans = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dataPlans'],
    queryFn: () => axiosClient.get('/data/'),
  });

  return {
    dataPlans: data?.data?.data?.data, // Check backend exact response structure
    dataPlansLoading: isLoading,
    dataPlansError: isError,
    errorDetails: error,
  };
};

// Purchase Data
export const usePurchaseData = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ dataPlanId, payload }) => axiosClient.post(`/data/data-purchase/${dataPlanId}`, payload),
    onSuccess: () => {
      toast.success('Data purchased successfully!');
      // Invalidate wallet balance and data orders
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['dataOrders'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to purchase data';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    purchaseDataMutate: mutate,
    purchaseDataMutateAsync: mutateAsync,
    purchaseDataPending: isPending,
    dataPurchaseError: isError,
    dataPurchaseSuccess: isSuccess,
  };
};

// ==========================================
// ADMIN DATA PLAN CRUD HOOKS
// ==========================================

export const useAllDataPlans = (params = { limit: 100, page: 1, sort: 'network' }) => {
  return useQuery({
    queryKey: ['admin', 'data-plans', params],
    queryFn: async () => {
      const { data } = await axiosClient.get('/data', { params });
      return data.data; // { dataPlan: [...], meta: {...} }
    },
    staleTime: 60 * 1000,
  });
};

export const useCreateDataPlan = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => axiosClient.post('/data', data),
    onSuccess: () => {
      toast.success('Data plan created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'data-plans'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create data plan');
    },
  });
  return { createPlanMutate: mutate, isPending };
};

export const useUpdateDataPlan = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }) => axiosClient.patch(`/data/${id}`, data),
    onSuccess: () => {
      toast.success('Data plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'data-plans'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update data plan');
    },
  });
  return { updatePlanMutate: mutate, isPending };
};

export const useDeleteDataPlan = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id) => axiosClient.delete(`/data/${id}`),
    onSuccess: () => {
      toast.success('Data plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'data-plans'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete data plan');
    },
  });
  return { deletePlanMutate: mutate, isPending };
};

// Get Data Orders
export const useGetDataOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dataOrders'],
    queryFn: () => axiosClient.get('/data/data-order'),
  });

  return {
    dataOrders: data?.data?.data?.data,
    dataOrdersLoading: isLoading,
    dataOrdersError: isError,
    errorDetails: error,
  };
};
