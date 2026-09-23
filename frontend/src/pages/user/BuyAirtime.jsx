import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { usePurchaseAirtime } from '../../datahooks/airtimeHooks';

const BuyAirtime = () => {
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');

  const { purchaseAirtimeMutate, purchaseAirtimePending } = usePurchaseAirtime();

  const handleSubmit = (e) => {
    e.preventDefault();
    purchaseAirtimeMutate({ 
      network, 
      amount: Number(amount), 
      phone 
    }, {
      onSuccess: () => {
        setPhone('');
        setAmount('');
        setNetwork('');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Buy Airtime</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
               <select 
                 value={network}
                 onChange={(e) => setNetwork(e.target.value)}
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
               <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                 placeholder="100"
                 required
                 min="50"
               />
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
              disabled={purchaseAirtimePending}
              className={`w-full bg-primary text-white flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 ${purchaseAirtimePending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {purchaseAirtimePending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
               {purchaseAirtimePending ? 'Processing...' : 'Buy Airtime'}
            </button>
         </form>
      </div>
    </div>
  );
};

export default BuyAirtime;
