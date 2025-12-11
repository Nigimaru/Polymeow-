import { NextResponse } from 'next/server';

// ตัวอย่างข้อมูล leaderboard
const leaderboardData = [
  { username: 'You', score: 10 },
  { username: 'Player1', score: 150 },
  { username: 'Player2', score: 140 },
];

export async function GET() {
  // เรียงจากคะแนนมากไปน้อย
  const sorted = leaderboardData.sort((a, b) => b.score - a.score);
  return NextResponse.json(sorted);
}
