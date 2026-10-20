import { Priority, Task } from '@/types/task';

const seed: Task[] = [
  { id: '1', title: 'Prepare sprint demo', description: 'Slides and live walkthrough', priority: Priority.High, dueDate: '2026-10-05', completed: false },
  { id: '2', title: 'Review pull requests', description: 'Two open PRs on the checkout flow', priority: Priority.Medium, dueDate: '2026-09-20', completed: false },
  { id: '3', title: 'Update dependencies', description: '', priority: Priority.Low, dueDate: '2026-09-15', completed: true },
];

// In-memory store shared across API routes (resets when the server restarts).
const g = globalThis as unknown as { __tasks?: Task[] };
export const db: Task[] = (g.__tasks ??= [...seed]);
