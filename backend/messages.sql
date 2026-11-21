-- Run once against the existing D1 database; existing votes are untouched.
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
