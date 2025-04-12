// server/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
