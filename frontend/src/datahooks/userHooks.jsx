import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// Get Me
export const useGetMe = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => axiosClient.get('/user/me'),
  });

  return {
    me: data?.data?.data?.data, // assuming { status: 'success', data: { data: user } }
    meLoading: isLoading,
    meError: isError,
    errorDetails: error,
  };
};

// Update Me
export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.patch('/user/me', data),
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      // Update the cookie store
      const updatedUser = res.data.data.user;
      if (updatedUser) {
        Cookies.set('userData', JSON.stringify(updatedUser), { secure: true, sameSite: 'None' });
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to update profile';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    updateMeMutate: mutate,
    updateMeMutateAsync: mutateAsync,
    updateMePending: isPending,
    updateMeError: isError,
    updateMeSuccess: isSuccess,
  };
};

// Get All Users (Admin)
export const useGetAllUsers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => axiosClient.get('/user'),
  });

  return {
    users: data?.data?.data?.data,
    usersLoading: isLoading,
    usersError: isError,
    errorDetails: error,
  };
};

// ==========================================
// ADMIN USER MANAGEMENT HOOKS
// ==========================================

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }) => axiosClient.patch(`/user/${id}`, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      // Invalidate the admin users list query (from adminHooks)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      // Invalidate the standard users list query (if used anywhere)
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update user');
    },
  });
  return { updateUserMutate: mutate, isPending };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id) => axiosClient.delete(`/user/${id}`),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    },
  });
  return { deleteUserMutate: mutate, isPending };
};
