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

module.exports = { registerUser, loginUser };
