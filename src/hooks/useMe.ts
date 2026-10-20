import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Me } from '@/types/roles';

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get<Me>('/api/me').then(setMe).catch((e: Error) => setError(e.message)); }, []);
  return { me, error };
}