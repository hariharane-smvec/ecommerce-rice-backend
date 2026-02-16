const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/ordersController');

const { check, validationResult } = require('express-validator');

// Validation Middleware
const validateOrder = [
    check('customerName').notEmpty().withMessage('Customer name is required').trim().escape(),
    check('total').isFloat({ min: 0 }).withMessage('Total must be a positive number'),
    check('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    check('items.*.name').notEmpty().withMessage('Item name is required'),
    check('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    check('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// POST /api/orders - Create a new order
router.post('/', validateOrder, createOrder);

// GET /api/orders - Get all orders (Admin) or filter by user
router.get('/', getOrders);

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', updateOrderStatus);

module.exports = router;
