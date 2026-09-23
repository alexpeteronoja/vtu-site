import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { useInitializePayment, useVerifyPayment } from '../../datahooks/paymentHooks';

const FundWallet = () => {
  const [amount, setAmount] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const { initializePaymentMutate, initializePaymentPending } = useInitializePayment();
  const { verifyLoading, verificationData } = useVerifyPayment(reference);

  const handleFund = (e) => {
    e.preventDefault();
    // Assuming API expects { amount: Number }
    initializePaymentMutate({ amount: Number(amount) });
  };

  // If a reference exists in the URL, we show a verifying state
  if (reference) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-20">
        {verifyLoading ? (
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <h2 className="text-xl font-bold text-secondary">Verifying Payment...</h2>
              <p className="text-gray-500">Please wait while we verify your transaction and credit your wallet.</p>
           </div>
        ) : (
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mb-2">✓</div>
              <h2 className="text-2xl font-bold text-secondary">Payment Successful!</h2>
              <p className="text-gray-500 mb-6">Your wallet has been credited.</p>
              <button 
                 onClick={() => {
                   searchParams.delete('reference');
                   setSearchParams(searchParams);
                 }}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
              >
                Fund Again
              </button>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Fund Wallet</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
         <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-50 text-primary rounded-xl flex items-center justify-center">
               <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary">Card / Bank Transfer</h2>
              <p className="text-sm text-gray-500">Fund your wallet instantly using Paystack</p>
            </div>
         </div>

         <form onSubmit={handleFund} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Fund (₦)</label>
               <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className="w-full pl-10 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium"
                   placeholder="0.00"
                   required
                   min="100"
                 />
               </div>
               <p className="text-sm text-gray-500 mt-2">Minimum amount is ₦100.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={initializePaymentPending || !amount}
              className={`w-full bg-primary text-white p-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 ${initializePaymentPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {initializePaymentPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
               {initializePaymentPending ? 'Initializing...' : 'Proceed to Pay'}
            </button>
         </form>
      </div>
    </div>
  );
};

export default FundWallet;
