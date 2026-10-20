import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskDetail, { generateMetadata } from '@/app/tasks/[id]/page';

describe('task detail page', () => {
  it('renders task details and generates task-specific metadata', () => {
    const params = { id: '1' };
    render(<TaskDetail params={params} />);
    expect(screen.getByRole('heading', { name: 'Prepare sprint demo' })).toBeTruthy();
    expect(generateMetadata({ params })).toEqual({ title: 'Prepare sprint demo' });
  });

  it('uses not-found behavior when the task does not exist', () => {
    expect(() => TaskDetail({ params: { id: 'missing' } })).toThrow('NEXT_NOT_FOUND');
    expect(generateMetadata({ params: { id: 'missing' } })).toEqual({ title: 'Task not found' });
  });
});