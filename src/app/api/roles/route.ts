import { NextResponse } from 'next/server';
import { rolesDb } from '@/lib/rolesDb';
import { findUser } from '@/lib/users';
import { Permissions, Role } from '@/types/roles';

const snapshot = () => ({ assignments: Object.values(rolesDb.assignments), permissions: rolesDb.permissions });

export async function GET() {
  return NextResponse.json(snapshot());
}

export async function PUT(req: Request) {
  const body = (await req.json()) as {
    username?: string; role?: Role; permissions?: Partial<Permissions>; mode?: 'create' | 'update';
  };
  if (!body.role || !Object.values(Role).includes(body.role))
    return NextResponse.json({ error: 'Choose a valid role' }, { status: 400 });

  const name = body.username?.trim();
  const user = name ? findUser(name) : undefined;
  if (name && !user) return NextResponse.json({ error: `No registered user named “${name}”` }, { status: 404 });

  const key = user?.username.toLowerCase();
  const existing = key ? rolesDb.assignments[key] : undefined;
  if (user && body.mode !== 'update' && existing)
    return NextResponse.json({ error: `“${user.username}” is already added. Use Edit to change their role.` }, { status: 409 });
  if (user && body.mode === 'update' && !existing)
    return NextResponse.json({ error: `“${user.username}” has not been added yet.` }, { status: 404 });

  const p = body.permissions ?? {};
  const access = Boolean(p.access);
  rolesDb.permissions[body.role] = {
    access, add: access && Boolean(p.add), edit: access && Boolean(p.edit), delete: access && Boolean(p.delete),
  };
  if (user && key) rolesDb.assignments[key] = { username: user.username, role: body.role };
  return NextResponse.json(snapshot());
}