import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/authz';

export async function GET() {
  return NextResponse.json(await currentUser());
}

