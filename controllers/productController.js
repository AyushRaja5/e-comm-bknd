const pool = require('../config/db');

const addProduct = async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Unauthorized' });

  const { name, category, description, price, discount } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Missing fields' });
  const sellerId = req.user.id;

  try {
    const insertResult = await pool.query(
      'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, category, description, price, discount, sellerId]
    );

    const productId = insertResult.rows[0].id;

    // Fetch the newly created product details
    const result = await pool.query(
      'SELECT id, name, category, description, price, discount, seller_id FROM products WHERE id = $1',
      [productId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Implement other CRUD operations similarly
const getProduct = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: `Database error: ${err.message}` });
    }
}

// Get a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Search Product by query
const searchProducts = async (req, res) => {
  console.log(req.query,'query')
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, category 
       FROM products 
       WHERE name ILIKE $1 OR category ILIKE $1`,
      [`%${query}%`]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No products found' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, discount } = req.body;
  const sellerId = req.user.id; // Assuming you have set req.user.id from authentication middleware

   if(req.user.role!='seller')
    return res.status(400).json({ error: 'Not authorized to update product' });
  
   if (!name && !category && !description && !price && !discount) {
      return res.status(400).json({ error: 'No fields to update' });
   }

  try {
    // Check if the product belongs to the seller
    const checkProduct = await pool.query(
      'SELECT seller_id FROM products WHERE id = $1',
      [id]
    );

    if (checkProduct.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    if (checkProduct.rows[0].seller_id !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

    // Update the product
    const result = await pool.query(
      'UPDATE products SET name = COALESCE($1, name), category = COALESCE($2, category), description = COALESCE($3, description), price = COALESCE($4, price), discount = COALESCE($5, discount) WHERE id = $6 RETURNING id, name, category, description, price, discount, seller_id',
      [name, category, description, price, discount, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id; // req.user.id from authentication middleware
  
  if(req.user.role!='seller')
    return res.status(400).json({ error: 'Not authorized to delete product' });
  
  try {
    // Check if the product belongs to the seller
    const checkProduct = await pool.query(
      'SELECT seller_id FROM products WHERE id = $1',
      [id]
    );

    if (checkProduct.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    if (checkProduct.rows[0].seller_id !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

    // Delete the product
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

module.exports = { addProduct, getProduct, getProductById, searchProducts, updateProduct, deleteProduct };
