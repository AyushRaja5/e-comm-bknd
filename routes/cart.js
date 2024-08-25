// routes/cart.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Middleware to authenticate
const authenticate = require('../middlewares/authenticate');
const { addToCart, removeFromCart, getCartProducts } = require('../controllers/cartController');

// Add to Cart
router.post('/add', authenticate, addToCart);

// Remove from Cart
router.delete('/remove', authenticate, removeFromCart);


// Get All Products in Cart
router.get('/', authenticate, getCartProducts);

module.exports = router;
