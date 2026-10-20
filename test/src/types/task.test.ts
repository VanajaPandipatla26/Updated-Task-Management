import { describe, expect, it } from 'vitest';
import { Priority, Status } from '@/types/task';

describe('task type contracts', () => {
  it('exposes the supported priority and status values', () => {
    expect(Object.values(Priority)).toEqual(['low', 'medium', 'high']);
    expect(Object.values(Status)).toEqual(['pending', 'completed']);
  });
});