import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Poll for new orders every 5 seconds (Simple real-time simulation)
    useEffect(() => {
        const fetchOrders = () => {
            fetch(`${API_URL}/api/orders`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => console.error("Failed to fetch orders", err));
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = (id, newStatus) => {
        fetch(`${API_URL}/api/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(updatedOrder => {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            });
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'packing': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

            {loading && orders.length === 0 ? (
                <div>Loading orders...</div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-gray-900 text-lg">Order #{order.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl text-green-700">₹{order.total}</p>
                                    <p className="text-sm text-gray-500">{order.customerName}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm mb-1">
                                        <span>{item.image} {item.name} ({item.weight}) x {item.qty}</span>
                                        <span className="font-medium">₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'packing')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Accept & Pack
                                    </button>
                                )}
                                {order.status === 'packing' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'delivered')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
