import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AttendanceRoute from '@/app/(app)/attendance/page';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn().mockResolvedValue([]), put: vi.fn(), del: vi.fn() } }));

describe('attendance route page', () => {
  it('renders the attendance feature page', async () => {
    render(<AttendanceRoute />);
    expect(await screen.findByRole('heading', { name: 'Attendance' })).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/api/attendance');
  });
});