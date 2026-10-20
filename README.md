# Task Management Dashboard

Next.js 14 (App Router) · React 18 · TypeScript · Zustand · CSS Modules

## Setup
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
**Login:** any username, password `password123`.

## Features
Mock auth (cookie + middleware route protection, logout) · dashboard stats (total / completed / pending / overdue) · create, edit, delete, complete tasks · priority and due date · debounced search, status and priority filters, due-date sort · loading, error and empty states · form validation · responsive layout · automatic dark mode.

## Next.js features demonstrated
App Router · dynamic route (`/tasks/[id]`) with SSR · API routes (`/api/tasks`, `/api/login`) · metadata (`generateMetadata`) · middleware · `not-found.tsx` (404) · `error.tsx` (error boundary) · `next/font`.

## Why Zustand
Small API, no provider boilerplate, typed actions, and selective subscriptions. Async actions live in the store, keeping components presentational. Context would re-render every consumer; Redux Toolkit is more ceremony than a single-slice app needs.

## Structure
```
middleware.ts               auth guard
src/app/                    routes, layout, 404, error boundary
src/app/api/                mock REST API (in-memory)
src/components/             StatsCards, TaskForm, TaskItem
src/hooks/useDebounce.ts    custom hook
src/lib/                    api client, store, db, date helpers
src/types/task.ts           enums, interfaces, generic types
src/styles/ui.module.css    CSS Modules
```
Data is in memory and resets when the server restarts.
