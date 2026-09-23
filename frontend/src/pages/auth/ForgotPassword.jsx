import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useForgotPassword,
  useVerifyResetOtp,
  useResetPassword,
} from "../../datahooks/authHooks";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import withAuth from "../../utils/withAuth";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailToReset, setEmailToReset] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const { forgotPasswordMutate, forgotPasswordPending } = useForgotPassword();
  const { verifyOtpMutate, verifyOtpPending } = useVerifyResetOtp();
  const { resetPasswordMutate, resetPasswordPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch password for Step 3 validation
  const password = watch("newPassword");

  const onSubmit = (data) => {
    setServerError("");

    if (step === 1) {
      forgotPasswordMutate(
        { email: data.email },
        {
          onSuccess: () => {
            setEmailToReset(data.email);
            setStep(2);
          },
          onError: (err) => {
            setServerError(
              err?.response?.data?.message || "Failed to send OTP.",
            );
          },
        },
      );
    } else if (step === 2) {
      verifyOtpMutate(
        { email: emailToReset, resetToken: data.otp },
        {
          onSuccess: (res) => {
            setVerifiedToken(res.data.data.verifiedToken);
            setStep(3);
          },
          onError: (err) => {
            setServerError(
              err?.response?.data?.message || "Invalid or expired OTP.",
            );
          },
        },
      );
    } else if (step === 3) {
      resetPasswordMutate(
        {
          email: emailToReset,
          verifiedToken,
          newPassword: data.newPassword,
          newPasswordConfirm: data.newPasswordConfirm,
        },
        {
          onSuccess: () => {
            const { userRole } = withAuth();
            if (userRole === "admin") {
              navigate("/admin");
            } else {
              navigate("/dashboard");
            }
          },
          onError: (err) => {
            setServerError(
              err?.response?.data?.message || "Failed to reset password.",
            );
          },
        },
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative">
        {step === 1 ? (
          <Link
            to="/login"
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep(step - 1);
              setServerError("");
            }}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <h2 className="text-3xl font-extrabold text-center text-secondary mb-2 mt-4">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "New Password"}
        </h2>

        <p className="text-center text-gray-500 mb-8">
          {step === 1 && "Enter your email to receive a reset code."}
          {step === 2 && `We sent a code to ${emailToReset}`}
          {step === 3 && "Create a secure new password."}
        </p>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            if (serverError) setServerError("");
          }}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your registered email"
                {...register("email", {
                  required: step === 1 ? "Email is required" : false,
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-Digit OTP
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary tracking-widest text-center text-xl font-bold ${errors.otp ? "border-red-500" : "border-gray-300"}`}
                placeholder="••••••"
                maxLength={6}
                {...register("otp", {
                  required: step === 2 ? "OTP is required" : false,
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                })}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter new password"
                    {...register("newPassword", {
                      required: step === 3 ? "Password is required" : false,
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.newPasswordConfirm ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Confirm new password"
                    {...register("newPasswordConfirm", {
                      required: step === 3 ? "Please confirm password" : false,
                      validate: (value) =>
                        step === 3
                          ? value === password || "Passwords do not match"
                          : true,
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPasswordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPasswordConfirm.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={
              forgotPasswordPending || verifyOtpPending || resetPasswordPending
            }
            className={`w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 mt-6 ${forgotPasswordPending || verifyOtpPending || resetPasswordPending ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {step === 1 &&
              (forgotPasswordPending ? "Sending..." : "Send Reset Link")}
            {step === 2 && (verifyOtpPending ? "Verifying..." : "Verify OTP")}
            {step === 3 &&
              (resetPasswordPending ? "Resetting..." : "Reset Password")}
          </button>
        </form>

        {step === 1 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
