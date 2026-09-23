import { useState } from 'react';
import { Clock, Wallet, ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import { useGetTransactions } from '../../datahooks/walletHooks';
import { useGetPayments } from '../../datahooks/paymentHooks';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'funding'

  const { transactions, transactionsLoading } = useGetTransactions();
  const { payments, paymentsLoading } = useGetPayments();

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0.00';
    return `₦${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Transaction History</h1>
          <p className="text-gray-500 mt-1">View your wallet activity and funding history.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-full max-w-sm">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'wallet' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Wallet Activity
        </button>
        <button
          onClick={() => setActiveTab('funding')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'funding' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Funding History
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* WALLET TRANSACTIONS TAB */}
        {activeTab === 'wallet' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : transactions?.length > 0 ? (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                           {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 capitalize">{tx.title || tx.type || 'Transaction'}</p>
                          <p className="text-xs text-gray-500">{tx.description || 'Wallet transaction'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          tx.status === 'success' || tx.status === 'successful' ? 'bg-green-100 text-green-700' : 
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status || 'unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Wallet className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No wallet activity found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* FUNDING HISTORY TAB */}
        {activeTab === 'funding' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Reference</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentsLoading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : payments?.length > 0 ? (
                  payments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                           <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase">{payment.paymentReference || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{payment.paymentMethod || 'Paystack'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          payment.status === 'success' || payment.status === 'successful' ? 'bg-green-100 text-green-700' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status || 'unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Clock className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No funding history found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transactions;
