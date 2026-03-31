import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Wallet, Package, LogOut, Receipt, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app', roles: ['OWNER'] },
    { icon: ShoppingCart, label: 'Kasir (POS)', path: '/app/pos', roles: ['OWNER', 'CASHIER'] },
    { icon: Receipt, label: 'Transaksi', path: '/app/transactions', roles: ['OWNER', 'CASHIER'] },
    { icon: Wallet, label: 'Keuangan', path: '/app/finance', roles: ['OWNER'] },
    { icon: Package, label: 'Produk', path: '/app/products', roles: ['OWNER'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">JuraganKas</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Manajemen UMKM</p>
        </div>
        
        <div className="px-6 pb-4 mb-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role === 'OWNER' ? 'Pemilik' : 'Kasir'}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
