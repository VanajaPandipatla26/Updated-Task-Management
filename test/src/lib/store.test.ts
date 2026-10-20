import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { useTaskStore } from '@/lib/store';
import { Priority, Task } from '@/types/task';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn() } }));

const task: Task = { id: '1', title: 'Original', description: '', priority: Priority.Low, dueDate: '2026-10-08', completed: false };

describe('task store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTaskStore.setState({ tasks: [], loading: false, error: null });
  });

  it('loads tasks and stores a request error without leaving loading enabled', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([task]);
    await useTaskStore.getState().load();
    expect(useTaskStore.getState()).toMatchObject({ tasks: [task], loading: false, error: null });

    vi.mocked(api.get).mockRejectedValueOnce(new Error('offline'));
    await useTaskStore.getState().load();
    expect(useTaskStore.getState()).toMatchObject({ loading: false, error: 'offline' });
  });

  it('adds, updates, and removes tasks through the API client', async () => {
    useTaskStore.setState({ tasks: [task] });
    const added = { ...task, id: '2', title: 'Added' };
    vi.mocked(api.post).mockResolvedValueOnce(added);
    await useTaskStore.getState().add({ ...added, id: undefined } as never);
    expect(useTaskStore.getState().tasks).toEqual([added, task]);

    const changed = { ...task, title: 'Changed' };
    vi.mocked(api.put).mockResolvedValueOnce(changed);
    await useTaskStore.getState().update(task.id, { title: 'Changed' });
    expect(useTaskStore.getState().tasks[1]).toEqual(changed);

    vi.mocked(api.del).mockResolvedValueOnce(undefined);
    await useTaskStore.getState().remove(task.id);
    expect(useTaskStore.getState().tasks).toEqual([added]);
  });
});