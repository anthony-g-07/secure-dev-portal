-- 👇 Add sample configs
INSERT INTO configs (title, content, created_by)
VALUES 
  ('Payment Service', '{"env":"production","enable_payments":true,"currency":"USD"}', 2),
  ('Notification System', '{"env":"staging","retry":3,"webhook_url":"https://hooks.example.com"}', 2),
  ('Beta Features', '{"feature_flags":{"new_ui":true,"ml_recommendations":false}}', 2),
  ('Dev Config', '{"debug":true,"log_level":"verbose"}', 2),
  ('Analytics', '{"tracking_id":"UA-123456","sampling_rate":50}', 2);

-- 👇 Add fake logs
INSERT INTO audit_logs (user_id, action, resource, metadata)
VALUES 
  (1, 'login', NULL, NULL),
  (2, 'login', NULL, NULL),
  (3, 'login', NULL, NULL),
  (1, 'edit_config', 'config:1', '{"field":"currency","old":"USD","new":"EUR"}'),
  (2, 'edit_config', 'config:2', '{"field":"retry","old":3,"new":5}'),
  (1, 'change_user_role', 'user:3', '{"old":"viewer","new":"developer"}'),
  (2, 'edit_config', 'config:3', '{"field":"ml_recommendations","old":false,"new":true}'),
  (1, 'login', NULL, NULL),
  (1, 'edit_config', 'config:5', '{"field":"sampling_rate","old":50,"new":25}'),
  (1, 'change_user_role', 'user:2', '{"old":"developer","new":"admin"}');
