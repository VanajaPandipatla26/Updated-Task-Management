import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';

const response = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(body),
}) as unknown as Response;

describe('API client', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('serializes request bodies and returns parsed JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ id: '1' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.post('/tasks', { title: 'Build test' })).resolves.toEqual({ id: '1' });
    expect(fetchMock).toHaveBeenCalledWith('/tasks', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ title: 'Build test' }),
    });
  });

  it('uses an API error message, falling back to the HTTP status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ error: 'Not allowed' }, false, 403)));
    await expect(api.get('/private')).rejects.toThrow('Not allowed');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({}, false, 502)));
    await expect(api.del('/missing')).rejects.toThrow('Request failed (502)');
  });
});