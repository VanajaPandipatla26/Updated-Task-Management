import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { useMe } from '@/hooks/useMe';
import { Role } from '@/types/roles';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));

describe('useMe', () => {
  afterEach(() => vi.resetAllMocks());

  it('loads the current user and exposes request failures', async () => {
    const current = { username: 'alex', role: Role.Developer, permissions: { access: true, add: false, edit: true, delete: false } };
    vi.mocked(api.get).mockResolvedValueOnce(current);
    const { result, rerender } = renderHook(() => useMe());

    await waitFor(() => expect(result.current.me).toEqual(current));

    vi.mocked(api.get).mockRejectedValueOnce(new Error('session expired'));
    rerender();
    await act(async () => Promise.resolve());
    // The hook fetches once per mount, so a failed request is checked in an independent mount.
    const failed = renderHook(() => useMe());
    await waitFor(() => expect(failed.result.current.error).toBe('session expired'));
  });
});