# SQLite Database Setup and Implementation

This document describes how this repository stores tasks and registered users in SQLite, how to set it up in another environment, and where persistence is implemented.

## Technology and Dependencies

The app uses [`sql.js`](https://www.npmjs.com/package/sql.js), which runs SQLite through WebAssembly. It does not require a separately running database server or a native compiler. `@types/sql.js` provides TypeScript declarations.

Both packages are declared in `package.json` and locked in `package-lock.json`. For an existing checkout, install the locked dependencies:

```bash
npm ci --legacy-peer-deps
```

The legacy peer-dependency option is currently needed because this repository has an existing ESLint/Next peer-version mismatch. To add the database packages to another project:

```bash
npm install sql.js --legacy-peer-deps
npm install --save-dev @types/sql.js --legacy-peer-deps
```

The app's [`next.config.ts`](../next.config.ts) lists `sql.js` under `serverExternalPackages`. Keep this setting: Turbopack otherwise attempts to bundle the WASM loader and package archive assets, which can cause API routes to fail during development.

## Configuration and First Run

Run the normal Next.js server; there is no separate DB process:

```bash
npm run dev
```

The database file is created automatically on first server use at:

```text
data/task-dashboard.sqlite
```

Override the location by setting `DATABASE_PATH` to a writable file path before starting Next.js. The special value `:memory:` creates a non-persistent database and is used by the Vitest setup only.

On first initialization, the app creates the tables and inserts the three sample tasks. Registered users are not seeded; create them through `/register`.

## Schema

`src/lib/database.ts` creates the schema if it is missing:

| Table | Purpose | Important columns |
| --- | --- | --- |
| `tasks` | Persistent task records and display order | `id`, `title`, `description`, `priority`, `due_date`, `completed`, `position` |
| `users` | Registered accounts and password verification data | `username`, `salt`, `hash` |
| `app_meta` | Tracks one-time task seeding | `key`, `value` |

Passwords are not stored as plaintext or encrypted text. Registration creates a random salt and a scrypt hash using Node's crypto API. Login derives a candidate hash and compares it with the stored hash. The database cannot reveal a user's original password.

## How Persistence Works

1. `src/lib/database.ts` locates or creates the SQLite file, initializes the WASM SQLite engine, creates the schema, and exports `persistDatabase()` to write the current database image to disk.
2. `src/lib/db.ts` loads task rows into the task collection. It seeds sample tasks once, recording completion in `app_meta` so an intentionally empty task list stays empty after a restart.
3. `POST /api/tasks` inserts a task into the collection; `PUT` and `DELETE /api/tasks/[id]` update or remove one. Each successful mutation calls `saveTasks()` in `src/lib/db.ts`, which rewrites the task rows and then persists the SQLite image.
4. `POST /api/register` validates a new account and calls `createUser()` in `src/lib/users.ts`. That function stores the username, salt, and scrypt hash, then persists the database image.
5. On the next process start, the same file is loaded and both task and user data are restored.

Database snapshots are written to a unique temporary file and renamed into place to avoid incomplete writes and collisions between parallel Next.js workers. The database directory/file are created with restrictive permissions where the operating system supports them.

## Sessions and Deployment

Login sessions are signed, HttpOnly, SameSite cookies with an eight-hour expiry. Set `SESSION_SECRET` to a random value of at least 32 characters in production. This is especially important when multiple app instances must verify the same sessions. If it is unset, the app creates a private `.session-secret` sidecar next to the database; keep that file with the database when moving a single-instance installation.

Back up `task-dashboard.sqlite` while the app is stopped or use a consistent filesystem snapshot. Protect the backup because it contains task data and password hashes. Do not commit the database or sidecar secret; the default `data/` directory is ignored by Git.

For deployments, point `DATABASE_PATH` at a writable persistent volume. A local SQLite file is not shared between multiple serverless instances; use a managed/shared database if the app needs horizontal scaling or ephemeral hosting.

## Verification and Inspection

Run the test suite and production build:

```bash
npm test
npm run build
```

The persistence tests reopen a temporary database and verify that tasks and users survive. For manual inspection, open `data/task-dashboard.sqlite` with a SQLite viewer, not a text editor. Example queries:

```sql
SELECT id, title, description, priority, due_date, completed FROM tasks ORDER BY position;
SELECT username FROM users ORDER BY username;
```

Avoid selecting or sharing `salt` and `hash` unless needed for a controlled security investigation.