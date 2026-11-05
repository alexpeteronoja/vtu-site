import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  Wallet,
} from "lucide-react";
import { useVerifyPayment } from "../../datahooks/paymentHooks";
import { toast } from "react-toastify";

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toastFiredRef = useRef(false);

  // Paystack redirects with ?reference=xxx or ?trxref=xxx
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const { verificationData, verifyLoading, verifyError, errorDetails } =
    useVerifyPayment(reference ?? "");

  const paymentTxn = verificationData?.data?.paymentTxn;
  const isSuccessful = paymentTxn?.status === "successful";
  const isFailed =
    verifyError || (paymentTxn && paymentTxn.status !== "successful");

  // Show a one-time toast notification when verification resolves
  useEffect(() => {
    if (toastFiredRef.current) return;

    if (isSuccessful) {
      toastFiredRef.current = true;
      toast.success("Payment verified and wallet credited successfully!");
    } else if (isFailed) {
      toastFiredRef.current = true;
      const errorMsg =
        errorDetails?.response?.data?.message ||
        "Payment verification failed. If your account was debited, please contact support.";
      toast.error(errorMsg);
    }
  }, [isSuccessful, isFailed, errorDetails]);

  // 1. Missing Reference State
  if (!reference) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">
          Invalid Payment Request
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          No transaction reference was detected. We cannot verify your payment
          without a reference.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard/fund-wallet")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            <Wallet className="w-4 h-4" />
            Fund Wallet
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading / Verifying State
  if (verifyLoading) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 text-primary rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">
          Verifying Payment...
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Please wait while we confirm your transaction with Paystack and credit
          your wallet.
        </p>
        <span className="inline-block text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          Ref: {reference}
        </span>
      </div>
    );
  }

  // 3. Successful State
  if (isSuccessful) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-1">
          Payment Successful!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your payment has been verified and your wallet has been credited.
        </p>

        {/* Transaction Summary Card */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-left space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-secondary text-base">
              ₦
              {paymentTxn?.amount
                ? Number(paymentTxn.amount).toLocaleString()
                : "0"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
              {paymentTxn?.status || "successful"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Channel</span>
            <span className="font-medium text-gray-700 uppercase text-xs">
              {paymentTxn?.paymentMethod || "Paystack"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Reference</span>
            <span
              className="font-mono text-xs text-gray-600 truncate max-w-45"
              title={reference}
            >
              {reference}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/dashboard/fund-wallet")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            Fund Again
          </button>
        </div>
      </div>
    );
  }

  // 4. Failed / Error State
  const errorMessage =
    errorDetails?.response?.data?.message ||
    "We could not verify your transaction. If your account was debited, it will be automatically reversed or resolved shortly.";

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
        <XCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-secondary mb-1">Payment Failed</h2>
      <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>

      {/* Reference details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-left space-y-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 capitalize">
            {paymentTxn?.status || "failed"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Reference</span>
          <span
            className="font-mono text-xs text-gray-600 truncate max-w-45"
            title={reference}
          >
            {reference}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Check
        </button>
        <button
          onClick={() => navigate("/dashboard/fund-wallet")}
          className="w-full cursor-pointer sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Need help? Contact support or check your{" "}
        <Link to="/dashboard/transactions" className="text-primary underline">
          transaction history
        </Link>
        .
      </p>
    </div>
  );
}

export default PaymentCallback;
