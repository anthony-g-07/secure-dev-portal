// server/routes/logs.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/verifyToken');
const ROLES = require("../constants/roles");

router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const [logs] = await db.query(`
      SELECT 
        l.id, l.action, l.resource, l.metadata, l.timestamp,
        u.name AS user_name, u.email AS user_email
      FROM audit_logs l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.timestamp DESC
    `);

    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

module.exports = router;
