-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('viewer', 'developer', 'admin') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255),
  metadata JSON,  -- JSON is supported in MySQL 5.7+
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CONFIGS TABLE
CREATE TABLE IF NOT EXISTS configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSON NOT NULL,
  created_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 🧪 SEED DATA: USERS
INSERT IGNORE INTO users (email, name, role) VALUES
  ('admin@demo.com', 'Admin User', 'admin'),
  ('dev@demo.com', 'Dev User', 'developer'),
  ('viewer@demo.com', 'Viewer User', 'viewer');

-- 🧪 SEED DATA: CONFIGS
INSERT IGNORE INTO configs (title, content, created_by) VALUES
  ('Production Config', '{"env": "production", "replicas": 3, "enable_ssl": true}', 2),
  ('Staging Config', '{"env": "staging", "replicas": 1, "enable_ssl": false}', 2);
