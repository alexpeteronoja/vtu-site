import React from "react";
import {
  Users,
  Activity,
  CreditCard,
  Wifi,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  useAllUsers,
  useAllTransactions,
  useAllPayments,
  useAllDataOrders,
  useAllAirtimeOrders,
} from "../../datahooks/adminHooks";

const AdminDashboard = () => {
  // Fetching data using hooks (default params fetch the first page for the tables, but meta contains totals)
  const { data: usersData, isLoading: usersLoading } = useAllUsers({
    limit: 5,
  });
  const { data: transactionsData, isLoading: txLoading } = useAllTransactions({
    limit: 5,
  });
  const { data: paymentsData, isLoading: paymentsLoading } = useAllPayments({
    limit: 5,
  });
  const { data: dataOrdersData, isLoading: dataLoading } = useAllDataOrders({
    limit: 1,
  });
  const { data: airtimeOrdersData, isLoading: airtimeLoading } =
    useAllAirtimeOrders({ limit: 1 });

  // Extract totals from metadata
  const totalUsers = usersData?.meta?.total || 0;
  const totalTransactions = transactionsData?.meta?.total || 0;
  const totalPayments = paymentsData?.meta?.total || 0;
  const totalDataOrders = dataOrdersData?.meta?.total || 0;
  const totalAirtimeOrders = airtimeOrdersData?.meta?.total || 0;

  // Extract arrays for recent activity tables
  const recentUsers = usersData?.user || [];
  const recentTransactions = transactionsData?.transactions || [];

  const isLoading =
    usersLoading ||
    txLoading ||
    paymentsLoading ||
    dataLoading ||
    airtimeLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome to the Admin Control Panel.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Users
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalUsers.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Transactions
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalTransactions.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Total Data Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Data Orders
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalDataOrders.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* Total Airtime Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Airtime Orders
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalAirtimeOrders.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-secondary">
              Recently Registered
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr
                      key={user._id || user.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {user.fullname}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-secondary">
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <tr
                      key={tx._id || tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                        {tx.type === "credit" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className="capitalize">
                          {tx.title || tx.type || "Transaction"}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        ₦{tx.amount?.toLocaleString() || 0}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === "success" ||
                            tx.status === "successful"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status || "unknown"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
