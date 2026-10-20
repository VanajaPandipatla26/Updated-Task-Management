import { describe, expect, it } from 'vitest';
import { PROJECTS, WorkMode } from '@/types/attendance';

describe('attendance type contracts', () => {
  it('lists supported work modes and projects', () => {
    expect(Object.values(WorkMode)).toEqual(['Office', 'Remote', 'Hybrid']);
    expect(PROJECTS).toEqual(['Project Alpha', 'Project Beta', 'Internal']);
  });
});