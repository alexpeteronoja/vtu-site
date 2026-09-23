import { Link } from "react-router-dom";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import {
  useGetWalletBalance,
  useGetTransactions,
} from "../../datahooks/walletHooks";

const Dashboard = () => {
  const { walletBalance, walletBalanceLoading } = useGetWalletBalance();
  const { transactions, transactionsLoading } = useGetTransactions();

  console.log(walletBalance);

  // Basic formatting helper
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₦0.00";
    return `₦${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalFunded =
    transactions
      ?.filter(
        (t) =>
          t.type === "funding" &&
          (t.status === "successful" || t.status === "success"),
      )
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const totalSpent =
    transactions
      ?.filter(
        (t) =>
          ["airtime_purchase", "data_purchase"].includes(t.type) &&
          (t.status === "successful" || t.status === "success"),
      )
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  // Helper for transaction labels
  const getTransactionLabel = (type) => {
    const labels = {
      funding: "Wallet Funded",
      airtime_purchase: "Airtime Purchase",
      data_purchase: "Data Purchase",
      refunded: "Refund",
    };
    return (
      labels[type] ||
      (type
        ? type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Transaction")
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary">Overview</h1>
        <Link
          to="/dashboard/fund-wallet"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 inline-flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" /> Fund Wallet
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-secondary to-blue-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-blue-200 text-sm font-medium mb-1">
            Available Balance
          </div>
          <div className="text-3xl font-bold tracking-tight">
            {walletBalanceLoading ? "..." : formatCurrency(walletBalance)}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium">
              Total Funded
            </div>
            <div className="text-xl font-bold text-secondary">
              {transactionsLoading ? "..." : formatCurrency(totalFunded)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium">Total Spent</div>
            <div className="text-xl font-bold text-secondary">
              {transactionsLoading ? "..." : formatCurrency(totalSpent)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary">
            Recent Transactions
          </h2>
          <Link
            to="/dashboard/transactions"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        {transactionsLoading ? (
          <div className="p-12 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.slice(0, 5).map((txn, idx) => (
              <div
                key={idx}
                className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === "funding" || txn.type === "refunded" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {txn.type === "funding" || txn.type === "refunded" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {getTransactionLabel(txn.type)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${txn.type === "funding" || txn.type === "refunded" ? "text-green-600" : "text-gray-900"}`}
                >
                  {txn.type === "funding" || txn.type === "refunded"
                    ? "+"
                    : "-"}
                  {formatCurrency(txn.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Clock className="w-12 h-12 text-gray-300 mb-3" />
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
