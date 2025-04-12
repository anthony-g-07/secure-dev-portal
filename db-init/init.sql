-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('viewer', 'developer', 'admin')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CONFIGS TABLE
CREATE TABLE IF NOT EXISTS configs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 🧪 SEED DATA: USERS
INSERT INTO users (email, name, role) VALUES
  ('admin@demo.com', 'Admin User', 'admin'),
  ('dev@demo.com', 'Dev User', 'developer'),
  ('viewer@demo.com', 'Viewer User', 'viewer')
ON CONFLICT (email) DO NOTHING;

-- 🧪 SEED DATA: CONFIGS
INSERT INTO configs (title, content, created_by) VALUES
  ('Production Config', '{"env": "production", "replicas": 3, "enable_ssl": true}', 2),
  ('Staging Config', '{"env": "staging", "replicas": 1, "enable_ssl": false}', 2)
ON CONFLICT DO NOTHING;
