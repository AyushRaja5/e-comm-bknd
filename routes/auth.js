const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');
const authenticate = require('../middlewares/authenticate');

router.post('/signup',
  [
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 5 }).trim(),
    body('role').isIn(['buyer', 'seller'])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    registerUser(req, res);
  }
);

router.post('/login',
  [
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 5 }).trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    loginUser(req, res);
  }
);

router.get('/profile', authenticate, (req, res) => {
  getUserProfile(req, res);
});

module.exports = router;
