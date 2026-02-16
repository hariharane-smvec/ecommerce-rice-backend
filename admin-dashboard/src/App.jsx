import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Login from './pages/Login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Import auth instance

const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Check for Mock Login
                const isMockAuth = localStorage.getItem('isAuthenticated') === 'true';
                if (isMockAuth) {
                    setUser({ email: localStorage.getItem('userEmail') || 'admin@test.com' });
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={
                    <ProtectedRoute>
                        <div className="flex bg-cream min-h-screen">
                            <Sidebar />
                            <div className="flex-1 ml-72 p-8 lg:p-12">
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/products" element={<Products />} />
                                    {/* Placeholders for other routes */}
                                    <Route path="/orders" element={<div className="p-8 font-bold text-gray-400">Orders Management (Coming Soon)</div>} />
                                    <Route path="/customers" element={<div className="p-8 font-bold text-gray-400">Customer List (Coming Soon)</div>} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
