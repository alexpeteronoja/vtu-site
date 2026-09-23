import { Wifi, Loader2, Wallet, History, AlertCircle, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useGetAllDataPlans, usePurchaseData, useGetDataOrders } from '../../datahooks/dataHooks';
import { useGetWalletBalance } from '../../datahooks/walletHooks';
import { Link } from 'react-router-dom';

const BuyData = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  
  const selectedNetwork = watch("network");
  const selectedPlanId = watch("planId");

  const { dataPlans, dataPlansLoading } = useGetAllDataPlans();
  const { purchaseDataMutate, purchaseDataPending } = usePurchaseData();
  const { walletBalance, walletBalanceLoading } = useGetWalletBalance();
  const { dataOrders, dataOrdersLoading } = useGetDataOrders('?limit=5');

  // Filter plans based on selected network
  const filteredPlans = dataPlans?.filter(p => p.network.toUpperCase() === selectedNetwork?.toUpperCase()) || [];

  const onSubmit = (data) => {
    purchaseDataMutate({ 
      dataPlanId: data.planId, 
      payload: { phoneNumber: data.phone } 
    }, {
      onSuccess: () => {
        reset();
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary">Buy Data Bundle</h1>
        
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 min-w-[250px]">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Wallet Balance</p>
            {walletBalanceLoading ? (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <h3 className="text-xl font-bold text-secondary">
                ₦{walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h3>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 h-fit">
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
                 <select 
                   {...register("network", { 
                     required: "Please select a network",
                     onChange: () => setValue('planId', '') // reset plan when network changes
                   })}
                   className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                   defaultValue=""
                 >
                   <option value="" disabled>Choose Network</option>
                   <option value="MTN">MTN</option>
                   <option value="AIRTEL">Airtel</option>
                   <option value="GLO">Glo</option>
                   <option value="9MOBILE">9Mobile</option>
                 </select>
                 {errors.network && <span className="text-red-500 text-sm mt-1">{errors.network.message}</span>}
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Data Plan</label>
                 <select 
                   {...register("planId", { required: "Please select a data plan" })}
                   className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                   defaultValue=""
                   disabled={!selectedNetwork || dataPlansLoading}
                 >
                   <option value="" disabled>
                     {dataPlansLoading ? 'Loading plans...' : 'Choose Data Plan'}
                   </option>
                   {filteredPlans.map(plan => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name} - ₦{plan.sellingPrice} ({plan.validity})
                      </option>
                   ))}
                 </select>
                 {errors.planId && <span className="text-red-500 text-sm mt-1">{errors.planId.message}</span>}
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                 <input 
                   type="tel" 
                   {...register("phone", { 
                     required: "Phone number is required",
                     pattern: {
                       value: /^[0-9]{11}$/,
                       message: "Phone number must be exactly 11 digits"
                     }
                   })}
                   className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                   placeholder="08012345678"
                 />
                 {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
              </div>
              
              <button 
                type="submit" 
                disabled={purchaseDataPending || !selectedPlanId}
                className={`w-full bg-primary text-white flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 ${(purchaseDataPending || !selectedPlanId) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                 {purchaseDataPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
                 {purchaseDataPending ? 'Processing...' : 'Buy Data'}
              </button>
           </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-secondary">Recent Orders</h2>
            </div>
            <Link to="/dashboard/transactions?tab=data" className="text-sm text-primary hover:text-orange-600 font-medium flex items-center gap-1 group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {dataOrdersLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : dataOrders && dataOrders.length > 0 ? (
              <div className="space-y-4">
                {dataOrders.map((order) => (
                  <div key={order._id} className="p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.network === 'MTN' ? 'bg-yellow-100 text-yellow-800' :
                          order.network === 'AIRTEL' ? 'bg-red-100 text-red-800' :
                          order.network === 'GLO' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.network}
                        </span>
                        <span className="font-semibold text-secondary">₦{order.amount}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.status === 'success' || order.status === 'successful' ? 'bg-green-100 text-green-700' :
                        order.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end text-sm text-gray-500">
                      <div>
                        <p>{order.phoneNumber}</p>
                        <p className="text-xs mt-1 text-primary/80 font-medium">{order.planName}</p>
                      </div>
                      <span className="text-xs">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                <AlertCircle className="w-12 h-12 opacity-20" />
                <p>No recent data orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyData;
