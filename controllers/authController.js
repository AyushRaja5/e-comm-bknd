const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, role]
    );
    res.status(201).json({ userId: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const result = await pool.query('SELECT id, password, username, role FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    // console.log(result)
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token,  
      user: {
        id: user.id,
        role: user.role,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the token payload

  try {
    // Fetch user details from database
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    res.json({ username: user.username, role: user.role, id: user.id }); // Return user details
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
