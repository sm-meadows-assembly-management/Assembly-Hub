import { NextResponse } from 'next/server';
import { authenticateDemoUser, rolePath } from './../../../lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = authenticateDemoUser(username ?? '', password ?? '');
  if (!user) return NextResponse.json({ error: 'Username or password is incorrect.' }, { status: 401 });

  const response = NextResponse.json({ ok: true, user: { username: user.username, name: user.name, role: user.role }, path: rolePath(user.role) });
  response.cookies.set('assembly_user', user.username, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}
