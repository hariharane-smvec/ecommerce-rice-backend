const { db } = require('../config/firebase');

// Mock data for initial testing if DB not ready
const MOCK_PRODUCTS = [
    { id: '1', name: 'Ponni Boiled Rice', type: 'Boiled', weight: '5kg', price: 350, image: '🍚' },
    { id: '2', name: 'Ponni Boiled Rice', type: 'Boiled', weight: '10kg', price: 680, image: '🍚' },
    { id: '3', name: 'White Ponni Rice', type: 'Boiled', weight: '25kg', price: 1650, image: '🍚' },
];

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        if (!db) {
            return res.json(MOCK_PRODUCTS.filter(p => !category || p.type === category));
        }

        let query = db.collection('products');
        if (category) {
            query = query.where('type', '==', category);
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
            return res.status(503).json({ error: 'Database not connected' });
        }

        const docRef = await db.collection('products').add(data);
        res.status(201).json({ id: docRef.id, ...data });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
