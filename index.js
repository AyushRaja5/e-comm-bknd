const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const pool = require('./config/db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Require the database connection to test it
require('./config/db');

const { searchProducts } = require('./controllers/productController');


app.get('/', (req, res) => {
  res.send('E-commerce Backend is Running!');
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Search product by query
app.get('/searching', searchProducts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
