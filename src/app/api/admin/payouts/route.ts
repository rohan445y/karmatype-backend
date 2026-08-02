import { NextResponse } from 'next/server';
import { getAdminPayouts, addAdminPayout, updateAdminPayout, seedDemoData } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  seedDemoData();
  const payouts = getAdminPayouts();

  return NextResponse.json({ payouts }, {
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
    const payout = addAdminPayout(body);
    return NextResponse.json({ success: true, payout }, {
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const updated = updateAdminPayout(body.id, body.status, body.adminNote, body.transactionRef);
    if (!updated) {
      return NextResponse.json({ error: 'Payout not found' }, {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    return NextResponse.json({ success: true, payout: updated }, {
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
