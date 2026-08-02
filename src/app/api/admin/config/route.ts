import { NextResponse } from 'next/server';
import { DEFAULT_SYSTEM_CONFIG } from '@/lib/rewards';

let activeConfig = { ...DEFAULT_SYSTEM_CONFIG };

export async function GET() {
  return NextResponse.json({ config: activeConfig });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    activeConfig = { ...activeConfig, ...body.config };
    return NextResponse.json({
      success: true,
      message: 'System configuration updated successfully.',
      config: activeConfig
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
