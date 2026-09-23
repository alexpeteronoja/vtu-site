import { useState } from 'react';
import { Wifi, Loader2 } from 'lucide-react';
import { useGetAllDataPlans, usePurchaseData } from '../../datahooks/dataHooks';

const BuyData = () => {
  const [network, setNetwork] = useState('');
  const [planId, setPlanId] = useState('');
  const [phone, setPhone] = useState('');

  const { dataPlans, dataPlansLoading } = useGetAllDataPlans();
  const { purchaseDataMutate, purchaseDataPending } = usePurchaseData();

  // Filter plans based on selected network
  // Assumes backend returns dataPlans as an array of objects: { _id, network, planName, price, validity }
  const filteredPlans = dataPlans?.filter(p => p.network.toUpperCase() === network.toUpperCase()) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planId) return;
    
    purchaseDataMutate({ 
      dataPlanId: planId, 
      payload: { phone, network } 
    }, {
      onSuccess: () => {
        setPhone('');
        setPlanId('');
        setNetwork('');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Buy Data Bundle</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
               <select 
                 value={network}
                 onChange={(e) => {
                   setNetwork(e.target.value);
                   setPlanId(''); // reset plan when network changes
                 }}
                 className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                 required
               >
                 <option value="" disabled>Choose Network</option>
                 <option value="MTN">MTN</option>
                 <option value="AIRTEL">Airtel</option>
                 <option value="GLO">Glo</option>
                 <option value="9MOBILE">9Mobile</option>
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Select Data Plan</label>
               <select 
                 value={planId}
                 onChange={(e) => setPlanId(e.target.value)}
                 className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                 required
                 disabled={!network || dataPlansLoading}
               >
                 <option value="" disabled>
                   {dataPlansLoading ? 'Loading plans...' : 'Choose Data Plan'}
                 </option>
                 {filteredPlans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.planName} - ₦{plan.price} ({plan.validity})
                    </option>
                 ))}
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
               <input 
                 type="tel" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                 placeholder="08012345678"
                 required
                 pattern="[0-9]{11}"
               />
            </div>
            
            <button 
              type="submit" 
              disabled={purchaseDataPending || !planId}
              className={`w-full bg-primary text-white flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 ${purchaseDataPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {purchaseDataPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
               {purchaseDataPending ? 'Processing...' : 'Buy Now'}
            </button>
         </form>
      </div>
    </div>
  );
};

export default BuyData;
