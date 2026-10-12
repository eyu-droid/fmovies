import { sendMovieNightReminders, updateMovieNightStatus } from '@/lib/cron';
import { NextRequest, NextResponse } from 'next/server';

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sendMovieNightReminders();
    await updateMovieNightStatus();

    return NextResponse.json(
      { message: 'Cron job executed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error executing cron job:', error);
    return NextResponse.json(
      { error: 'Failed to execute cron job' },
      { status: 500 }
    );
  }
}
