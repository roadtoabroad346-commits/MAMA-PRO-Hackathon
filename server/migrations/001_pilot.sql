PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS accounts (
 id TEXT PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('parent','specialist','moderator','admin')), active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS sessions (
 token TEXT PRIMARY KEY, actor TEXT NOT NULL REFERENCES accounts(id), csrf TEXT NOT NULL, expires TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS scopes (
 specialist TEXT NOT NULL REFERENCES accounts(id), parent TEXT NOT NULL REFERENCES accounts(id), active INTEGER NOT NULL,
 PRIMARY KEY(specialist,parent)
);
CREATE TABLE IF NOT EXISTS resources (
 id TEXT PRIMARY KEY, kind TEXT NOT NULL, owner TEXT NOT NULL REFERENCES accounts(id), author TEXT NOT NULL REFERENCES accounts(id),
 recipient TEXT REFERENCES accounts(id), ref TEXT REFERENCES resources(id), status TEXT NOT NULL, version INTEGER NOT NULL CHECK(version>0),
 data TEXT NOT NULL CHECK(json_valid(data)), created TEXT NOT NULL, updated TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS resource_owner ON resources(kind,owner,status);
CREATE INDEX IF NOT EXISTS resource_recipient ON resources(kind,recipient,status);
CREATE INDEX IF NOT EXISTS resource_reference ON resources(ref,kind);
CREATE TABLE IF NOT EXISTS operations (
 actor TEXT NOT NULL REFERENCES accounts(id), op TEXT NOT NULL, key TEXT NOT NULL, payload TEXT NOT NULL, result TEXT NOT NULL,
 PRIMARY KEY(actor,op,key)
);
CREATE TABLE IF NOT EXISTS jobs (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES accounts(id), ref TEXT NOT NULL REFERENCES resources(id), revision INTEGER NOT NULL,
 channel TEXT NOT NULL CHECK(channel IN ('sandbox_contact','in_app')), fire_at TEXT NOT NULL, status TEXT NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0, UNIQUE(ref,revision,channel)
);
CREATE INDEX IF NOT EXISTS job_due ON jobs(status,fire_at);
CREATE TABLE IF NOT EXISTS inbox (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES accounts(id), source TEXT NOT NULL UNIQUE, kind TEXT NOT NULL,
 ref TEXT NOT NULL, created TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit (
 id INTEGER PRIMARY KEY, actor TEXT NOT NULL, op TEXT NOT NULL, resource TEXT, version INTEGER, at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied TEXT NOT NULL);
INSERT OR IGNORE INTO schema_migrations VALUES(1,datetime('now'));
