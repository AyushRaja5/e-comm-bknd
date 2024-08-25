// models/product.js
const pool = require('../config/db'); // Adjust the path if necessary

const createProductTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50),
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      discount NUMERIC(5, 2),
      seller_id INTEGER REFERENCES users(id)
    );
  `);
};

createProductTable().catch(err => console.error('Error creating product table:', err));
