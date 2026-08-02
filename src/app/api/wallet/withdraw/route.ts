import { NextResponse } from 'next/server';
import { DEFAULT_SYSTEM_CONFIG, nprToCoins } from '@/lib/rewards';
import { addAdminPayout } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, userName, userEmail, method, accountDetails, amountNpr } = body;

    if (!accountDetails || !amountNpr) {
      return NextResponse.json({ error: 'Account details and valid amount are required.' }, { status: 400 });
    }

    if (amountNpr < 10) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is Rs. 10 NPR.' }, { status: 400 });
    }

    const coinsDeducted = nprToCoins(amountNpr, DEFAULT_SYSTEM_CONFIG);

    const withdrawalRequest = addAdminPayout({
      id: `trx-${Date.now()}`,
      requestId: `req-${Date.now()}`,
      userId: userId || 'user-001',
      userName: userName || 'Unknown User',
      userEmail: userEmail || 'unknown@karmatype.com',
      method,
      accountDetails,
      amountNpr,
      coinsDeducted,
      coinsUsed: coinsDeducted,
      paymentMethod: method,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully.',
      withdrawal: withdrawalRequest
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }
}
