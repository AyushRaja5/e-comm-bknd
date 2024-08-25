const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.stack);
    } else {
      console.log('Database connected successfully!');
      client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool
        if (err) {
          console.error('Error executing query', err.stack);
        } else {
          console.log('Current Time:', result.rows[0].now);
        }
      });
    }
  });

module.exports = pool;
