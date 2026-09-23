import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSignup } from '../../datahooks/authHooks';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import withAuth from '../../utils/withAuth';

const Register = () => {
  const navigate = useNavigate();
  const { signupMutate, signupPending } = useSignup();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();

  const onSubmit = (data) => {
    setServerError('');
    signupMutate(data, {
      onSuccess: () => {
        const { userRole } = withAuth();
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      },
      onError: (err) => {
        const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
        setServerError(message);
      }
    });
  };

  // Watch password to validate passwordConfirm
  const password = watch('password');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-secondary mb-6">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join the fastest VTU platform today.</p>
        
        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form 
          className="space-y-4" 
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => { if (serverError) setServerError(''); }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullname ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your full name"
              {...register('fullname', { required: 'Full name is required' })}
            />
            {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your phone number"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: { value: /^[0-9]+$/, message: 'Must contain only numbers' }
              })}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Create a password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
              />
              <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Confirm your password"
                {...register('passwordConfirm', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <button
                 type="button"
                 onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
               >
                 {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
            </div>
            {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={signupPending}
            className={`w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 mt-4 ${signupPending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {signupPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
