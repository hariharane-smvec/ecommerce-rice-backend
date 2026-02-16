const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productsController');

// GET /api/products
router.get('/', getProducts);

console.log('Protecting route with auth middleware');
const { check, validationResult } = require('express-validator');

const validateProduct = [
    check('name').notEmpty().withMessage('Product name is required').trim().escape(),
    check('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    check('category').notEmpty().withMessage('Category is required').trim().escape(),
    check('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    check('description').optional().trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// POST /api/products (Admin only)
router.post('/', require('../middleware/authMiddleware'), validateProduct, createProduct);

module.exports = router;
