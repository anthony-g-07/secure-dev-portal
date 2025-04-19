-- Seed clean test users
INSERT IGNORE INTO users (id, email, name, role) VALUES
  (1, 'admin@test.com', 'Admin', 'admin'),
  (2, 'viewer@test.com', 'Viewer', 'viewer'),
  (3, 'target@test.com', 'Target', 'viewer');
