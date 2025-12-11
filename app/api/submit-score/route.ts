export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json(); // { username, score }
  
  const res = await fetch('https://dev.neynar.com/api/submit-score', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return NextResponse.json(data);
}
