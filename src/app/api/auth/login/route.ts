import { NextResponse } from 'next/server';
import { addAdminUser, getAdminUsers } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const users = getAdminUsers();
    const found = users.find((user) => user.email.toLowerCase() === email);

    if (!found) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (password.length === 0) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const passwordMatches = found.password === password;
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const updated = addAdminUser({
      ...found,
      lastActiveDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: found.status || 'active',
    });

    return NextResponse.json({ success: true, user: updated }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
