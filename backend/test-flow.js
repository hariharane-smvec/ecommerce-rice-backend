const fetch = require('node-fetch'); // or native fetch if node 18+

async function testFlow() {
    try {
        console.log('1️⃣ Creating a new order...');
        const createRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: "Raju",
                total: 1250,
                items: [{ name: "Ponni Rice", price: 1250, qty: 1 }],
                fcmToken: "device-token-sample-123"
            })
        });
        const order = await createRes.json();
        console.log('✅ Order Created:', order.id);

        console.log('2️⃣ Updating Status to "packing"...');
        const updateRes = await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'packing' })
        });
        const updatedOrder = await updateRes.json();
        console.log('✅ Status Updated:', updatedOrder.status);
        console.log('👀 Check the SERVER terminal for the "[MOCK PUSH]" log!');

    } catch (err) {
        console.error('❌ Test Failed:', err);
    }
}

testFlow();
