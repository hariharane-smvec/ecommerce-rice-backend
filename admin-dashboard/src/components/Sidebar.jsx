import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Truck, Users, Settings } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Products', path: '/products', icon: ShoppingBag },
        { name: 'Orders', path: '/orders', icon: Truck },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-72 bg-gradient-to-b from-brand-950 to-brand-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
            <div className="p-8 border-b border-brand-800/50">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-harvest-500 rounded-lg flex items-center justify-center transform rotate-3">
                        <span className="text-xl">🌾</span>
                    </div>
                    <h1 className="text-2xl font-bold font-serif tracking-wide text-white">Sri Varadhan</h1>
                </div>
                <p className="text-brand-200 text-xs tracking-widest uppercase ml-11 font-medium">Premium Rice Store</p>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-brand-800 text-white shadow-lg translate-x-1'
                                : 'text-brand-200 hover:bg-brand-800/50 hover:text-white hover:translate-x-1'
                            }`
                        }
                    >
                        <item.icon size={20} className={`transition-colors ${({ isActive }) => isActive ? 'text-harvest-400' : 'text-brand-400 group-hover:text-harvest-300'}`} />
                        <span className="font-medium tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-brand-800/50 bg-brand-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-harvest-400 to-harvest-600 flex items-center justify-center text-white border-2 border-brand-800 shadow-md">
                            <span className="font-serif font-bold">A</span>
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">Admin User</p>
                            <p className="text-brand-400 text-xs">admin@store.com</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            // Clear mock auth
                            localStorage.removeItem('isAuthenticated');
                            localStorage.removeItem('userEmail');
                            window.location.href = '/login';
                        }}
                        className="p-2 text-brand-400 hover:text-red-400 transition-colors"
                        title="Sign Out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
