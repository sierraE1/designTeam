CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reward_name VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT now()
);

INSERT INTO users (id, username, email, password_hash)
VALUES (1, 'demo_user', 'demo@example.com', 'dev-password-hash')
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM users), 1));
SELECT setval('tasks_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM tasks), 1), 1));
SELECT setval('moods_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM moods), 1), 1));
SELECT setval('rewards_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM rewards), 1), 1));
