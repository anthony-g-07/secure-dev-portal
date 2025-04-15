// server/routes/configs.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/verifyToken');
const ROLES = require("../constants/roles");

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM configs ORDER BY updated_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching configs:', err);
    res.status(500).json({ error: 'Failed to fetch configs' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ message: 'Missing content' });
    }
  
    try {
      await db.query(
        'UPDATE configs SET content = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(content), id]
      );
  
      // Log the update
      await db.query(
        'INSERT INTO audit_logs (user_id, action, resource, metadata) VALUES (?, ?, ?, ?)',
        [
          req.user.id,
          'edit_config',
          `config:${id}`,
          JSON.stringify({ updated_content: content })
        ]
      );
  
      res.json({ message: 'Config updated successfully' });
    } catch (err) {
      console.error('Error updating config:', err);
      res.status(500).json({ message: 'Failed to update config' });
    }
  });
  

module.exports = router;
