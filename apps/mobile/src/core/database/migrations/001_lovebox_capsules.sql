CREATE TABLE IF NOT EXISTS capsules (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  unlock_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_capsules_unlock_at ON capsules (unlock_at);
