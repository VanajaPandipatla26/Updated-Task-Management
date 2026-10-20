import { Task } from '@/types/task';

export const today = () => new Date().toISOString().slice(0, 10);
export const isOverdue = (t: Task) => !t.completed && t.dueDate < today();
