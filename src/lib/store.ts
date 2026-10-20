import { create } from 'zustand';
import { api } from './api';
import { Task, TaskInput } from '@/types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (input: TaskInput) => Promise<void>;
  update: (id: string, input: Partial<TaskInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [], loading: false, error: null,
  load: async () => {
    set({ loading: true, error: null });
    try { set({ tasks: await api.get<Task[]>('/api/tasks'), loading: false }); }
    catch (e) { set({ error: (e as Error).message, loading: false }); }
  },
  add: async (input) => {
    const task = await api.post<Task>('/api/tasks', input);
    set({ tasks: [task, ...get().tasks] });
  },
  update: async (id, input) => {
    const task = await api.put<Task>(`/api/tasks/${id}`, input);
    set({ tasks: get().tasks.map((t) => (t.id === id ? task : t)) });
  },
  remove: async (id) => {
    await api.del(`/api/tasks/${id}`);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },
}));
