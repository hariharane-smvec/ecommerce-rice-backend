const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all for now, restrict in production
app.use(require('helmet')()); // Security Headers
app.use(express.json({ limit: '10kb' })); // Body limit
// app.use(require('xss-clean')()); // Data Sanitization against XSS
// app.use(require('hpp')()); // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to allow frontend activity
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.send('Sri Varadhan Store API is running');
});

// Root Route
app.get('/', (req, res) => {
  res.send('Sri Varadhan Store Backend is Active! Use /api/products or /api/orders');
});

// Serve static frontend
const path = require('path');
// app.use(express.static(path.join(__dirname, '../admin-dashboard/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../admin-dashboard/dist/index.html'));
// });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
