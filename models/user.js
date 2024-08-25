// models/user.js
const { Pool } = require('pg');
const pool = require('../config/db'); // Adjust the path if necessary

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(10) CHECK (role IN ('buyer', 'seller')) NOT NULL
    );
  `);
};

createUserTable().catch(err => console.error('Error creating user table:', err));