import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = await fetch('https://dev.neynar.com/api/leaderboard', {
    headers: {
      'Authorization': `Bearer ${process.env.NEY_API_KEY}`
    }
  });
  const data = await res.json();
  return NextResponse.json(data);
}
