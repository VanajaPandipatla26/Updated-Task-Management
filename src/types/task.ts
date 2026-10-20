export enum Priority { Low = 'low', Medium = 'medium', High = 'high' }
export enum Status { Pending = 'pending', Completed = 'completed' }

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}
export type TaskInput = Omit<Task, 'id'>;
export type Filter<T> = T | 'all';
