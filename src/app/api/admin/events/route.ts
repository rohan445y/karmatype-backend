import { NextResponse } from 'next/server';
import { subscribeAdminSync, getAdminUsers, getAdminPayouts, getAdminNotifications, getAdminLogs } from '@/lib/admin-sync';

export const dynamic = 'force-dynamic';

let clients = new Set<ReadableStreamDefaultController<any>>();

const encoder = new TextEncoder();

export async function GET() {
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);

      const send = () => {
        if (isClosed) return;
        try {
          const payload = JSON.stringify({
            users: getAdminUsers(),
            payouts: getAdminPayouts(),
            notifications: getAdminNotifications(),
            logs: getAdminLogs(),
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          isClosed = true;
          clients.delete(controller);
        }
      };

      send();
      const unsubscribe = subscribeAdminSync(send);

      const interval = setInterval(() => {
        if (!isClosed) {
          send();
        } else {
          clearInterval(interval);
        }
      }, 10000);

      const cleanup = () => {
        isClosed = true;
        clearInterval(interval);
        unsubscribe();
        clients.delete(controller);
      };

      controller.close = cleanup;
    },
    cancel() {
      isClosed = true;
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
