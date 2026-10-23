# Task Management Dashboard

Next.js 16 (App Router) · React 18 · TypeScript · Zustand · CSS Modules

## Setup
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
**Accounts:** register an account before signing in. Passwords must be 8-128 characters; usernames must be 3-32 letters, numbers, underscores, or hyphens.

## Persistence and sessions
Tasks and registered users are stored in a SQLite database at `data/task-dashboard.sqlite` by default. Set `DATABASE_PATH` to use another location. The database directory and file are created with owner-only permissions where supported. Set a random `SESSION_SECRET` of at least 32 characters in production, especially when running multiple instances; otherwise a private persistent secret file is created alongside the database. Sessions are signed, HttpOnly, SameSite cookies and expire after eight hours.

See [Database Setup and Implementation](docs/database-setup.md) for dependency setup, schema, persistence flow, deployment notes, and inspection queries.

## Features
Signed-cookie authentication (proxy route protection, logout) · dashboard stats (total / completed / pending / overdue) · create, edit, delete, complete tasks · priority and due date · debounced search, status and priority filters, due-date sort · loading, error and empty states · form validation · responsive layout · automatic dark mode.

## Next.js features demonstrated
App Router · dynamic route (`/tasks/[id]`) with SSR · API routes (`/api/tasks`, `/api/login`) · metadata (`generateMetadata`) · proxy · `not-found.tsx` (404) · `error.tsx` (error boundary) · `next/font`.

## Why Zustand
Small API, no provider boilerplate, typed actions, and selective subscriptions. Async actions live in the store, keeping components presentational. Context would re-render every consumer; Redux Toolkit is more ceremony than a single-slice app needs.

## Structure
```
src/proxy.ts                auth guard
src/app/                    routes, layout, 404, error boundary
src/app/api/                REST API
src/components/             StatsCards, TaskForm, TaskItem
src/hooks/useDebounce.ts    custom hook
src/lib/                    api client, store, db, date helpers
src/types/task.ts           enums, interfaces, generic types
src/styles/ui.module.css    CSS Modules
```
`src/lib/database.ts` owns SQLite initialization and persistence; task and user records survive server restarts.
