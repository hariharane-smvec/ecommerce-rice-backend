const { db } = require('../config/firebase');
const { sendPushNotification } = require('../utils/notificationService');

// In-memory storage for orders when DB is not connected
let MOCK_ORDERS = [];

exports.createOrder = async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString(),
            id: 'ord_' + Math.floor(Math.random() * 100000)
        };

        if (db) {
            const docRef = await db.collection('orders').add(orderData);
            res.status(201).json({ id: docRef.id, ...orderData });
        } else {
            // Mock Mode
            MOCK_ORDERS.unshift(orderData); // Add to beginning
            console.log('📦 New Order Created (Mock):', orderData.id);
            res.status(201).json(orderData);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        if (db) {
            const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
            const orders = [];
            snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
            res.json(orders);
        } else {
            res.json(MOCK_ORDERS);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (db) {
            await db.collection('orders').doc(id).update({ status });

            // Fetch relevant order data to get user's FCM token
            const orderDoc = await db.collection('orders').doc(id).get();
            const orderData = orderDoc.data();

            if (orderData && orderData.fcmToken) {
                await sendPushNotification(
                    orderData.fcmToken,
                    'Order Update',
                    `Your order #${id} is now ${status}`,
                    { orderId: id, status: status }
                );
            }

            res.json({ id, status });
        } else {
            const order = MOCK_ORDERS.find(o => o.id === id);
            if (order) {
                order.status = status;

                // Simulate Notification in Mock Mode
                if (order.fcmToken) {
                    console.log(`📲 [MOCK PUSH] To: ${order.fcmToken} | Title: Order Update | Body: Your order #${id} is now ${status}`);
                }

                res.json(order);
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
