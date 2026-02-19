const { db } = require('../config/firebase');

// Mock data for initial testing if DB not ready
const MOCK_PRODUCTS = [
    { id: '1', name: 'Idly Rice', category: 'Idli Rice', weight: '25kg', price: 1100, image: '🍘' },
    { id: '2', name: 'Ponni Rice (Boiled)', category: 'Boiled', weight: '25kg', price: 1350, image: '🍚' },
    { id: '3', name: 'BPT Rice', category: 'Boiled', weight: '25kg', price: 1450, image: '🍚' },
    { id: '4', name: 'Steam Rice', category: 'Boiled', weight: '25kg', price: 1250, image: '🍲' },
    { id: '5', name: 'Broken Rice', category: 'Raw', weight: '10kg', price: 450, image: '🥣' },
    { id: '6', name: 'Karupu Kavuni Rice', category: 'Health', weight: '1kg', price: 180, image: '🖤' },
    { id: '7', name: 'Jeera Samba Rice', category: 'Biryani', weight: '5kg', price: 480, image: '🥘' },
    { id: '8', name: 'Basmathi Rice', category: 'Biryani', weight: '5kg', price: 650, image: '🍛' },
    { id: '9', name: 'Premium Wheat', category: 'Wheat', weight: '10kg', price: 550, image: '🌾' },
    { id: '10', name: 'Toor Dhall', category: 'Dhall', weight: '1kg', price: 160, image: '🟡' },
    { id: '11', name: 'Urad Dhall', category: 'Dhall', weight: '1kg', price: 140, image: '⚪' },
    { id: '12', name: 'Moong Dhall', category: 'Dhall', weight: '1kg', price: 120, image: '🟡' },
];

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        if (!db) {
            return res.json(MOCK_PRODUCTS.filter(p => !category || p.category === category));
        }

        let query = db.collection('products');
        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;

        if (!db) {
            // return res.status(503).json({ error: 'Database not connected' });
            const newProduct = { id: (MOCK_PRODUCTS.length + 1).toString(), ...data };
            MOCK_PRODUCTS.push(newProduct);
            return res.status(201).json(newProduct);
        }

        const docRef = await db.collection('products').add(data);
        res.status(201).json({ id: docRef.id, ...data });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
