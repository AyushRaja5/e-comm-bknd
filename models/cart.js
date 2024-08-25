// models/cart.js
const pool = require('../config/db'); // Adjust the path if necessary

const createCartTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      UNIQUE(user_id, product_id)
    );
  `);
};

createCartTable().catch(err => console.error('Error creating cart table:', err));
