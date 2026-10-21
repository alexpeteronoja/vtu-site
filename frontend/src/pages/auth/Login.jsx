import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../datahooks/authHooks";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import withAuth from "../../utils/withAuth";

const MOCK_ACCOUNTS = [
  {
    role: "Admin Account",
    type: "admin",
    email: "admin@demo.com",
    password: "Password123",
    icon: ShieldCheck,
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    role: "User Account",
    type: "user",
    email: "user@demo.com",
    password: "Password123",
    icon: UserCheck,
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const navigate = useNavigate();

  const { loginMutate, loginPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey("");
    }, 2000);
  };

  const onSubmit = (data) => {
    setServerError(""); // Clear previous errors
    loginMutate(data, {
      onSuccess: () => {
        // Redirect based on user role from cookies
        const { userRole } = withAuth();
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      },
      onError: (err) => {
        // Capture error message from backend and display it inline
        const message =
          err?.response?.data?.message ||
          "Invalid email or password. Please try again.";
        setServerError(message);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-secondary mb-2">
          Log In
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Please enter your details.
        </p>

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
          onChange={() => {
            if (serverError) setServerError("");
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginPending}
            className={`w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 mt-4 cursor-pointer ${loginPending ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loginPending ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Mock Test Accounts Section Under Form */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Testing / Mock Accounts
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const emailKey = `${account.type}-email`;
              const passKey = `${account.type}-password`;

              return (
                <div
                  key={account.type}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold border text-[11px] ${account.badgeColor}`}
                    >
                      {account.role}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Email Row */}
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200/60">
                      <span className="text-gray-500 font-medium">Email:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.email, emailKey)}
                        className="inline-flex items-center gap-1.5 font-mono text-gray-800 hover:text-primary transition-colors cursor-pointer"
                        title="Click to copy email"
                      >
                        <span>{account.email}</span>
                        {copiedKey === emailKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Password Row */}
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200/60">
                      <span className="text-gray-500 font-medium">
                        Password:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.password, passKey)}
                        className="inline-flex items-center gap-1.5 font-mono text-gray-800 hover:text-primary transition-colors cursor-pointer"
                        title="Click to copy password"
                      >
                        <span>{account.password}</span>
                        {copiedKey === passKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
