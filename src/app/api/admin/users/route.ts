import { NextResponse } from 'next/server';
import { getAdminUsers, addAdminUser, seedDemoData } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  seedDemoData();
  const users = getAdminUsers();

  return NextResponse.json({ users }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = addAdminUser(body);
    return NextResponse.json({ success: true, user }, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }
}
