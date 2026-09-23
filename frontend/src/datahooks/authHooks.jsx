import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Signup
export const useSignup = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.post('/auth/signup', data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      
      Cookies.set('userAccessToken', accessToken, { secure: true, sameSite: 'None' });
      Cookies.set('userRole', user.role || 'user', { secure: true, sameSite: 'None' });
      Cookies.set('userData', JSON.stringify(user), { secure: true, sameSite: 'None' });
      
      toast.success('Account created successfully!');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Something went wrong during signup';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    signupMutate: mutate,
    signupMutateAsync: mutateAsync,
    signupPending: isPending,
    signupError: isError,
    signupSuccess: isSuccess,
  };
};

// Login
export const useLogin = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.post('/auth/login', data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      
      Cookies.remove('userAccessToken');
      Cookies.remove('userRole');
      Cookies.remove('userData');

      Cookies.set('userAccessToken', accessToken, { secure: true, sameSite: 'None' });
      Cookies.set('userRole', user.role || 'user', { secure: true, sameSite: 'None' });
      Cookies.set('userData', JSON.stringify(user), { secure: true, sameSite: 'None' });

      toast.success('Logged in successfully!');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Invalid email or password';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    loginMutate: mutate,
    loginMutateAsync: mutateAsync,
    loginPending: isPending,
    loginError: isError,
    loginSuccess: isSuccess,
  };
};

// Logout
export const useLogout = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    // If backend has a logout route, use it here. Otherwise just simulate a promise.
    mutationFn: async () => {
       // Optional: await axiosClient.post('/auth/logout');
       return Promise.resolve();
    },
    onSuccess: () => {
      Cookies.remove('userAccessToken');
      Cookies.remove('userRole');
      Cookies.remove('userData');
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    },
  });

  return {
    logoutMutate: mutate,
    logoutPending: isPending,
  };
};

// Forgot Password
export const useForgotPassword = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.post('/auth/forgot-password', data),
    onSuccess: () => {
      toast.success('OTP sent to your email!');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to send OTP';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    forgotPasswordMutate: mutate,
    forgotPasswordMutateAsync: mutateAsync,
    forgotPasswordPending: isPending,
    forgotPasswordError: isError,
    forgotPasswordSuccess: isSuccess,
  };
};

// Verify Reset OTP
export const useVerifyResetOtp = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.post('/auth/verify-otp', data),
    onSuccess: () => {
      toast.success('OTP verified successfully!');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Invalid or expired OTP';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    verifyOtpMutate: mutate,
    verifyOtpMutateAsync: mutateAsync,
    verifyOtpPending: isPending,
    verifyOtpError: isError,
    verifyOtpSuccess: isSuccess,
  };
};

// Reset Password
export const useResetPassword = () => {
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data) => axiosClient.post('/auth/reset-password', data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      
      Cookies.remove('userAccessToken');
      Cookies.remove('userRole');
      Cookies.remove('userData');

      if (accessToken && user) {
        Cookies.set('userAccessToken', accessToken, { secure: true, sameSite: 'None' });
        Cookies.set('userRole', user.role || 'user', { secure: true, sameSite: 'None' });
        Cookies.set('userData', JSON.stringify(user), { secure: true, sameSite: 'None' });
      }
      
      toast.success('Password reset successfully!');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to reset password';
      console.error('error', err?.response?.data);
      toast.error(message);
    },
  });

  return {
    resetPasswordMutate: mutate,
    resetPasswordMutateAsync: mutateAsync,
    resetPasswordPending: isPending,
    resetPasswordError: isError,
    resetPasswordSuccess: isSuccess,
  };
};
