import { NextResponse } from 'next/server';

let leaderboardData = [
  { username: 'You', score: 10 },
  { username: 'Player1', score: 150 },
  { username: 'Player2', score: 140 },
];

export async function POST(request: Request) {
  const body = await request.json();
  const { username, score } = body;

  if (!username || typeof score !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // ถ้ามีผู้เล่นอยู่แล้ว อัปเดตคะแนน
  const existing = leaderboardData.find((p) => p.username === username);
  if (existing) {
    existing.score = Math.max(existing.score, score);
  } else {
    leaderboardData.push({ username, score });
  }

  // เรียงจากคะแนนมากไปน้อย
  leaderboardData.sort((a, b) => b.score - a.score);

  return NextResponse.json({ success: true, leaderboard: leaderboardData });
}
