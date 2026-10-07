import { NextRequest, NextResponse } from 'next/server';
import { findDemoUser } from './../../../lib/auth';
export async function GET(request: NextRequest) {
  const username = request.cookies.get('assembly_user')?.value;
  const user = username ? findDemoUser(username) : undefined;
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  return NextResponse.json({ user });
}
