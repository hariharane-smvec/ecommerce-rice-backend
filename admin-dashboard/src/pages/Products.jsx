import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Boiled',
        weight: '',
        price: '',
        stock: '',
        description: '',
        image: '🌾'
    });

    const fetchProducts = () => {
        setLoading(true);
        let url = '/api/products';
        if (selectedCategory !== 'All Categories') {
            url += `?category=${encodeURIComponent(selectedCategory)}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products", err);
                setLoading(false);
            });
    };

    // Fetch products when selectedCategory changes
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token here if needed
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock) || 0
                })
            });

            if (response.ok) {
                setIsModalOpen(false);
                setFormData({
                    name: '',
                    category: 'Boiled',
                    weight: '',
                    price: '',
                    stock: '',
                    description: '',
                    image: '🌾'
                });
                fetchProducts();
            } else {
                const errorData = await response.json();
                alert('Error processing product: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Manage your rice inventory</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
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
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-brand-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-700"
                >
                    <option>All Categories</option>
                    <option>Boiled</option>
                    <option>Raw</option>
                    <option>Basmati</option>
                    <option>Idli Rice</option>
                    <option>Biryani</option>
                    <option>Health</option>
                    <option>Wheat</option>
                    <option>Dhall</option>
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
                                    <span className="text-[10px] font-bold text-harvest-600 uppercase tracking-widest bg-harvest-50 px-2 py-0.5 rounded-full border border-harvest-100">{product.category}</span>
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

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    placeholder="e.g. Premium Ponni Rice"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    >
                                        <option value="Boiled">Boiled</option>
                                        <option value="Raw">Raw</option>
                                        <option value="Basmati">Basmati</option>
                                        <option value="Idli Rice">Idli Rice</option>
                                        <option value="Biryani">Biryani</option>
                                        <option value="Health">Health</option>
                                        <option value="Wheat">Wheat</option>
                                        <option value="Dhall">Dhall</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        required
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="e.g. 25kg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    placeholder="Product description..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow-sm transition-colors font-medium"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
