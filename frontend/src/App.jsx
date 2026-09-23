import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// User Portal
import UserLayout from './components/layout/UserLayout';
import Dashboard from './pages/user/Dashboard';
import FundWallet from './pages/user/FundWallet';
import BuyData from './pages/user/BuyData';
import BuyAirtime from './pages/user/BuyAirtime';
import Transactions from './pages/user/Transactions';

// Admin Portal
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDataPlans from './pages/admin/ManageDataPlans';
import AdminTransactions from './pages/admin/AdminTransactions';

import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/fund-wallet" element={<FundWallet />} />
            <Route path="/dashboard/buy-data" element={<BuyData />} />
            <Route path="/dashboard/buy-airtime" element={<BuyAirtime />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            <Route path="/dashboard/profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Profile</h1></div>} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/data-plans" element={<ManageDataPlans />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
