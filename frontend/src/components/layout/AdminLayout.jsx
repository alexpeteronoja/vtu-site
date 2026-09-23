import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Database, LogOut, Menu, User, Wallet } from 'lucide-react';
import withAuth from '../../utils/withAuth';
import { useLogout } from '../../datahooks/authHooks';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user } = withAuth();
  const { logoutMutate, logoutPending } = useLogout();

  const handleLogout = () => {
    logoutMutate();
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Users className="w-5 h-5" />, label: 'Manage Users', path: '/admin/users' },
    { icon: <Database className="w-5 h-5" />, label: 'Data Plans', path: '/admin/data-plans' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Transactions', path: '/admin/transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-white/10">
            <Link to="/" className="text-2xl font-bold text-primary">
              VTU<span className="text-white">Admin</span>
            </Link>
          </div>

          <div className="p-6 border-b border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
             </div>
             <div>
                <div className="font-bold text-sm truncate">{user?.name || 'Administrator'}</div>
                <div className="text-xs text-gray-400 truncate">Admin Portal</div>
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                    ? 'bg-primary text-white font-medium' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              disabled={logoutPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {logoutPending ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-900">Admin Control Panel</h2>
          </div>
          
          <div className="relative">
             <button 
               onClick={() => setDropdownOpen(!isDropdownOpen)}
               className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
             >
                <User className="w-5 h-5" />
             </button>

             {isDropdownOpen && (
               <>
                 <div 
                   className="fixed inset-0 z-40" 
                   onClick={() => setDropdownOpen(false)}
                 />
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-1">
                   <div className="px-4 py-3 border-b border-gray-50 mb-1">
                     <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
                     <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@vtuhub.com'}</p>
                   </div>
                   <button
                     onClick={() => {
                       setDropdownOpen(false);
                       handleLogout();
                     }}
                     disabled={logoutPending}
                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50 font-medium"
                   >
                     <LogOut className="w-4 h-4" />
                     {logoutPending ? 'Logging out...' : 'Log Out'}
                   </button>
                 </div>
               </>
             )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
