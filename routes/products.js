// routes/products.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();
// Middleware to authenticate and authorize
const authenticate = require('../middlewares/authenticate');
const { addProduct, getProduct, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
    
// Add Product
router.post('/', authenticate, addProduct);

// Get Products
router.get('/', getProduct);
router.get('/:id', getProductById);

// Update a product by ID
router.put('/products/:id', authenticate, updateProduct);

// Delete a product by ID
router.delete('/products/:id', authenticate, deleteProduct);

module.exports = router;
