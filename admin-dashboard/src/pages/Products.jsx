import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from backend (Mocked for now)
    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Manage your rice inventory</p>
                </div>
                <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-100 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search rice varieties..."
                        className="w-full pl-10 pr-4 py-2 border border-brand-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50/10"
                    />
                </div>
                <select className="border border-brand-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-700">
                    <option>All Categories</option>
                    <option>Boiled</option>
                    <option>Raw</option>
                    <option>Basmati</option>
                </select>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="text-center py-20 text-brand-400 font-medium animate-pulse">Loading amazing products...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-brand-100 hover:border-brand-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className="h-48 bg-cream relative flex items-center justify-center p-6 group-hover:bg-brand-50 transition-colors">
                                <span className="text-8xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                    {product.image || '🌾'}
                                </span>
                                <span className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm text-brand-900 border border-brand-100">
                                    {product.weight}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="mb-2">
                                    <span className="text-[10px] font-bold text-harvest-600 uppercase tracking-widest bg-harvest-50 px-2 py-0.5 rounded-full border border-harvest-100">{product.type}</span>
                                </div>
                                <h3 className="font-serif font-bold text-xl text-brand-900 mb-1 leading-tight">{product.name}</h3>
                                <div className="flex justify-between items-end mt-4">
                                    <span className="font-bold text-2xl text-brand-700">₹{product.price}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <button className="p-2 bg-brand-50 text-brand-600 rounded-full hover:bg-brand-600 hover:text-white transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
