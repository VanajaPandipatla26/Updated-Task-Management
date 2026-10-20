import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { rolesDb, roleOf } from '@/lib/rolesDb';
import { Me } from '@/types/roles';

export async function currentUser(): Promise<Me> {
  const username = (await cookies()).get('auth')?.value ?? '';
  const role = roleOf(username);
  return { username, role, permissions: rolesDb.permissions[role] };
}

export const forbid = (action: string) =>
  NextResponse.json({ error: `Your role does not allow you to ${action}.` }, { status: 403 });