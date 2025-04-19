// server/routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const verifyToken = require("../middleware/verifyToken");
const ROLES = require("../constants/roles");

// GET /api/users
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

router.put("/:id/role", verifyToken, async (req, res) => {
  console.log("🔐 req.user =", req.user);
  const { id } = req.params;
  const { newRole } = req.body;

  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!ROLES.ALL.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // ⛔ Prevent self-demotion
    if (parseInt(id) === req.user.id && newRole !== ROLES.ADMIN) {
      // Count other admins
      const [admins] = await db.query(
        'SELECT COUNT(*) AS count FROM users WHERE role = ? AND id != ?',
        [ROLES.ADMIN, req.user.id]
      );

      if (admins[0].count === 0) {
        return res.status(400).json({
          message: "You cannot demote yourself as the last admin",
        });
      }
    }
    await db.query("UPDATE users SET role = ? WHERE id = ?", [newRole, id]);

    await db.query(
      "INSERT INTO audit_logs (user_id, action, resource, metadata) VALUES (?, ?, ?, ?)",
      [
        req.user.id,
        "change_user_role",
        `user:${id}`,
        JSON.stringify({ new_role: newRole }),
      ]
    );

    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
});

module.exports = router;
