import { Priority, Task } from '@/types/task';
import { database, persistDatabase } from './database';

const seed: Task[] = [
  { id: '1', title: 'Prepare sprint demo', description: 'Slides and live walkthrough', priority: Priority.High, dueDate: '2026-10-05', completed: false },
  { id: '2', title: 'Review pull requests', description: 'Two open PRs on the checkout flow', priority: Priority.Medium, dueDate: '2026-09-20', completed: false },
  { id: '3', title: 'Update dependencies', description: '', priority: Priority.Low, dueDate: '2026-09-15', completed: true },
];

const rows = database.prepare('SELECT id, title, description, priority, due_date, completed FROM tasks ORDER BY position');
const storedTasks: Task[] = [];
while (rows.step()) {
  const row = rows.getAsObject();
  storedTasks.push({
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    priority: row.priority as Priority,
    dueDate: String(row.due_date),
    completed: Boolean(row.completed),
  });
}
rows.free();

const seedState = database.prepare("SELECT value FROM app_meta WHERE key = 'tasks_initialized'");
const tasksInitialized = seedState.step() && seedState.getAsObject().value === '1';
seedState.free();

export const db: Task[] = storedTasks.length || tasksInitialized ? storedTasks : [...seed];

if (!tasksInitialized) saveTasks();

export function saveTasks() {
  database.exec('DELETE FROM tasks');
  const insert = database.prepare('INSERT INTO tasks (id, title, description, priority, due_date, completed, position) VALUES (?, ?, ?, ?, ?, ?, ?)');
  db.forEach((task, position) => insert.run([task.id, task.title, task.description, task.priority, task.dueDate, Number(task.completed), position]));
  insert.free();
  database.run("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('tasks_initialized', '1')");
  persistDatabase();
}
