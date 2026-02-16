const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    console.warn("WARNING: Razorpay keys are missing in environment variables. Payment routes will fail.");
}

let razorpay = null;

if (keyId && keySecret) {
    try {
        razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
    } catch (err) {
        console.error("Failed to initialize Razorpay:", err.message);
    }
} else {
    console.warn("WARNING: Razorpay keys are missing. Payment routes will return errors.");
}

// Create Order
router.post('/orders', async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({ error: 'Payment service unavailable (Configuration missing)' });
        }

        const { amount, currency = 'INR' } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Something went wrong with payment init' });
    }
});

// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ error: "Invalid Signature" });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
