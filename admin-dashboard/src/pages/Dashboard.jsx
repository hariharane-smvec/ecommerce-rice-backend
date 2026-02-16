import React from 'react';
import { TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <span className="text-brand-600 font-semibold text-xs bg-brand-50 px-2 py-1 rounded-full">{trend}</span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-serif font-bold text-brand-900 mt-1">{value}</p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-900 font-serif">Hello, Admin 👋</h1>
                <p className="text-gray-500 mt-1">Here is your store's daily overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹12,450"
                    icon={TrendingUp}
                    color="bg-brand-600"
                    trend="+12% vs last week"
                />
                <StatCard
                    title="Total Orders"
                    value="24"
                    icon={Package}
                    color="bg-harvest-500"
                    trend="+5 new today"
                />
                <StatCard
                    title="Pending Processes"
                    value="8"
                    icon={Clock}
                    color="bg-orange-500"
                    trend="Requires attention"
                />
                <StatCard
                    title="Delivered"
                    value="156"
                    icon={CheckCircle}
                    color="bg-brand-500"
                    trend="98% success rate"
                />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100/50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-900 font-serif">Recent Orders</h2>
                    <button className="text-brand-600 text-sm font-medium hover:text-brand-800">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="pb-4 pl-4">Order ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Items</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="text-sm hover:bg-brand-50/30 transition-colors">
                                    <td className="py-4 pl-4 font-semibold text-brand-900">#ORD-00{i}</td>
                                    <td className="py-4 text-gray-600">John Doe</td>
                                    <td className="py-4 text-gray-600">Ponni Boiled x 2</td>
                                    <td className="py-4 font-medium text-gray-900">₹700</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${i === 1 ? 'bg-harvest-100 text-harvest-700' : 'bg-brand-100 text-brand-700'
                                            }`}>
                                            {i === 1 ? 'Packing' : 'Confirmed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
