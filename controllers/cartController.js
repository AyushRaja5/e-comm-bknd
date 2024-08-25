// controllers/cartController.js
const pool = require('../config/db');

// Add to Cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated and user ID is available in req.user

  try {
    // Check if the product is already in the cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // If the product is already in the cart, update the quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, userId, productId]
      );
      res.status(200).json({ message: 'Cart updated successfully' });
    } else {
      // Otherwise, insert a new row into the cart
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, productId, quantity]
      );
      res.status(201).json({ message: 'Product added to cart successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Get All Products in Cart
const getCartProducts = async (req, res) => {
  const userId = req.user.id;
  console.log(req.user)
  try {
    const result = await pool.query(
      `SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.description, p.category 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'Cart is empty' });
    }
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartProducts
};
