import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';

describe('task database', () => {
  it('provides the seeded tasks in a shared mutable store', () => {
    expect(db).toHaveLength(3);
    expect(db.map(({ id }) => id)).toEqual(['1', '2', '3']);
    expect(db[0].title).toBe('Prepare sprint demo');
  });
});