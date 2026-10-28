CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 500),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);