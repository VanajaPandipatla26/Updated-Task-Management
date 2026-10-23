import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { rolesDb, roleOf } from '@/lib/rolesDb';
import { Me, Role } from '@/types/roles';
import { readSession } from '@/lib/session';

export async function currentUser(): Promise<Me> {
  const username = readSession((await cookies()).get('auth')?.value) ?? '';
  const role = username ? roleOf(username) : Role.HumanResource;
  return { username, role, permissions: rolesDb.permissions[role] };
}

export const forbid = (action: string) =>
  NextResponse.json({ error: `Your role does not allow you to ${action}.` }, { status: 403 });