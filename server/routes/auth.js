import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// LOGIN - Get JWT token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // For simplicity, we're checking against the default admin
    // In production, you'd look up the admin in the database
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username !== 'admin' || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: 'admin', username: 'admin' },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// VERIFY token
router.get('/verify', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
