import { NextResponse } from 'next/server';
import { addAdminUser, getAdminUsers } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim() || email.split('@')[0] || 'New User';
    const referralCode = String(body.referralCode || `${name.toUpperCase().replace(/\s+/g, '_')}-${Date.now().toString().slice(-4)}`);

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const existing = getAdminUsers().find((user) => user.email.toLowerCase() === email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = addAdminUser({
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      isPremium: false,
      avatar: '',
      coins: 0,
      xp: 0,
      streak: 0,
      level: 1,
      totalTestsCompleted: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      premiumExpiresAt: undefined,
      lastActiveDate: new Date().toISOString(),
      referralCode,
      referredBy: body.referredBy,
      country: body.country || 'Nepal',
      joinedAt: new Date().toISOString(),
      username: email.split('@')[0],
      membershipPlan: 'Free',
      walletBalance: 0,
      status: 'active',
      emailVerified: false,
      lastLogin: new Date().toISOString(),
      password,
    });

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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
