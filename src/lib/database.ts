import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import initSqlJs from 'sql.js';

const databasePath = process.env.DATABASE_PATH ?? join(process.cwd(), 'data', 'task-dashboard.sqlite');
const SQL = await initSqlJs({ locateFile: (file) => join(process.cwd(), 'node_modules', 'sql.js', 'dist', file) });

export const database = databasePath === ':memory:'
  ? new SQL.Database()
  : existsSync(databasePath)
    ? new SQL.Database(new Uint8Array(readFileSync(databasePath)))
    : new SQL.Database();

database.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    due_date TEXT NOT NULL,
    completed INTEGER NOT NULL,
    position INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY COLLATE NOCASE,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS app_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export function persistDatabase() {
  if (databasePath === ':memory:') return;
  mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${databasePath}.${process.pid}.${randomUUID()}.tmp`;
  writeFileSync(temporaryPath, Buffer.from(database.export()), { mode: 0o600 });
  renameSync(temporaryPath, databasePath);
}