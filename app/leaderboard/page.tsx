'use client';

import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [weekly, setWeekly] = useState<any[]>([]);
  const [allTime, setAllTime] = useState<any[]>([]);

  useEffect(() => {
    // Mock leaderboard data (จริง ๆ จะใช้ Firebase ทีหลัง)
    const mockData = [
      { username: 'Player1', score: 150 },
      { username: 'Player2', score: 140 },
      { username: 'Player3', score: 130 },
      { username: 'You', score: Number(localStorage.getItem('polymeow_score') || '0') },
      { username: 'Player5', score: 100 },
      // เพิ่ม mock อีกเพื่อให้ครบ 20
      ...Array(15).fill(null).map((_, i) => ({ username: `Player${i+6}`, score: Math.floor(Math.random() * 100) })),
    ].sort((a, b) => b.score - a.score).slice(0, 20);

    setWeekly(mockData);
    setAllTime(mockData.map((item, idx) => ({ ...item, score: item.score + idx * 5 }))); // all-time ต่างกันนิดหน่อย
  }, []);

  const renderTable = (data: any[], title: string) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">{title}</h2>
      <table className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <thead className="bg-purple-200">
          <tr>
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player, idx) => (
            <tr key={idx} className={player.username === 'You' ? 'bg-yellow-100 font-bold' : 'even:bg-gray-50'}>
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{player.username}</td>
              <td className="p-3 text-right">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-10 text-purple-800">Polymeow Leaderboard 🏆</h1>
      
      {renderTable(weekly, 'Weekly Top 20')}
      {renderTable(allTime, 'All-Time Top 20')}

      <a href="/" className="mt-8 text-blue-600 underline text-lg">
        Back to Play
      </a>
    </div>
  );
}
