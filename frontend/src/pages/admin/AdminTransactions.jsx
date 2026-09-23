import { useState, useEffect } from 'react';
import { Clock, Wallet, ArrowUpRight, ArrowDownLeft, Receipt, Phone, Wifi, User } from 'lucide-react';
import { useGetTransactions } from '../../datahooks/walletHooks';
import { useGetPayments } from '../../datahooks/paymentHooks';
import { useGetAirtimeOrders } from '../../datahooks/airtimeHooks';
import { useGetDataOrders } from '../../datahooks/dataHooks';
import { useLocation } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';

const AdminTransactions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'wallet';
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'wallet' | 'funding' | 'airtime' | 'data'
  const [currentPage, setCurrentPage] = useState(1);

  // Update tab if URL changes
  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab && ['wallet', 'funding', 'airtime', 'data'].includes(tab)) {
      if (activeTab !== tab) {
        setActiveTab(tab);
        setCurrentPage(1);
      }
    }
  }, [location.search, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const queryStr = `?limit=10&page=${currentPage}`;

  const { transactions, meta: transactionsMeta, transactionsLoading } = useGetTransactions(queryStr);
  const { payments, meta: paymentsMeta, paymentsLoading } = useGetPayments(queryStr);
  const { airtimeOrders, meta: airtimeMeta, airtimeOrdersLoading } = useGetAirtimeOrders(queryStr);
  const { dataOrders, meta: dataMeta, dataOrdersLoading } = useGetDataOrders(queryStr);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0.00';
    return `₦${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Transactions</h1>
          <p className="text-gray-500 mt-1">View platform-wide wallet activity, funding history, and orders.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-full max-w-2xl overflow-x-auto">
        <button
          onClick={() => handleTabChange('wallet')}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'wallet' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Wallet Activity
        </button>
        <button
          onClick={() => handleTabChange('funding')}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'funding' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Funding History
        </button>
        <button
          onClick={() => handleTabChange('airtime')}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'airtime' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Airtime Orders
        </button>
        <button
          onClick={() => handleTabChange('data')}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'data' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Data Orders
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
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Type & Details</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : transactions?.length > 0 ? (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{tx.user?.fullname || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{tx.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                           {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 capitalize text-sm">{tx.title || tx.type || 'Transaction'}</p>
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
                    <td colSpan="5" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Wallet className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No wallet activity found on the platform.</p>
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
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Reference</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentsLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : payments?.length > 0 ? (
                  payments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{payment.user?.fullname || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{payment.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                           <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase text-sm">{payment.paymentReference || 'N/A'}</p>
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
                    <td colSpan="5" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Clock className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No funding history found on the platform.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* AIRTIME ORDERS TAB */}
        {activeTab === 'airtime' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Network & Phone</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {airtimeOrdersLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : airtimeOrders?.length > 0 ? (
                  airtimeOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{order.user?.fullname || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                           <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase text-sm">{order.network}</p>
                          <p className="text-xs text-gray-500">{order.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'success' || order.status === 'successful' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status || 'unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Phone className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No airtime orders found on the platform.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* DATA ORDERS TAB */}
        {activeTab === 'data' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Network & Phone</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataOrdersLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                ) : dataOrders?.length > 0 ? (
                  dataOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{order.user?.fullname || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
                           <Wifi className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase text-sm">{order.network}</p>
                          <p className="text-xs text-gray-500">{order.phoneNumber} • {order.planName}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'success' || order.status === 'successful' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status || 'unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                      <Wifi className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No data orders found on the platform.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {activeTab === 'wallet' && transactionsMeta && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <Pagination totalPages={transactionsMeta.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        )}
        {activeTab === 'funding' && paymentsMeta && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <Pagination totalPages={paymentsMeta.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        )}
        {activeTab === 'airtime' && airtimeMeta && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <Pagination totalPages={airtimeMeta.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        )}
        {activeTab === 'data' && dataMeta && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <Pagination totalPages={dataMeta.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminTransactions;
