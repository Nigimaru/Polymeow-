'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const catImages = [
  // Silver - 4 images
  { url: 'https://files.catbox.moe/l4r444.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/kl7pv4.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/jpqo2x.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/en8r9m.jpg', name: 'Silver' },
  // Gold - 6 images
  { url: 'https://files.catbox.moe/87f8ur.jpg', name: 'Gold' },
  { url: 'https://files.catbox.moe/m0hd8j.jpg', name: 'Gold' },
  { url: 'https://files.catbox.moe/0kzv7j.jpg', name: 'Gold' },
  { url: 'https://files.catbox.moe/nq79qv.jpg', name: 'Gold' },
  { url: 'https://files.catbox.moe/9603vs.jpg', name: 'Gold' },
  { url: 'https://files.catbox.moe/6jxx0g.jpg', name: 'Gold' },
];

export default function PlayPage() {
  const today = new Date().toDateString();
  const [dailyCat, setDailyCat] = useState<any>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [result, setResult] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // เลือกแมววันนี้
  useEffect(() => {
    const daySeed = new Date().getDate();
    const index = daySeed % catImages.length;
    setDailyCat(catImages[index]);

    const played = localStorage.getItem('polymeow_played');
    if (played === today) setHasPlayed(true);
  }, []);

  // ดึง Leaderboard จาก Neynar
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(
          'https://dev.neynar.com/api/v1/apps/90b276a3-7b6d-4f2c-9248-bb95a4dac64c/leaderboard'
        );
        const data = await res.json();
        setLeaderboard(data.scores || []);
      } catch (e) {
        console.error('Failed to fetch leaderboard', e);
      }
    }
    fetchLeaderboard();
  }, []);

  const handleGuess = (guess: string) => {
    if (hasPlayed) return;

    const correct = guess === dailyCat.name;
    setResult(
      correct
        ? 'Correct! +10 points & 0.01 PMEOW 🎉'
        : 'Wrong! Try again tomorrow 😿'
    );
    setHasPlayed(true);
    localStorage.setItem('polymeow_played', today);

    if (correct) {
      const score =
        Number(localStorage.getItem('polymeow_score') || '0') + 10;
      localStorage.setItem('polymeow_score', score.toString());
    }
  };

  if (!dailyCat) {
    return <p className="text-center p-10">Loading today's cat...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">Polymeow 🐱</h1>
      <p className="text-lg mb-6 text-gray-700">
        Is this cat "Silver" or "Gold"?
      </p>

      <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={dailyCat.url}
          alt="Today's Cat"
          width={320}
          height={320}
          className="object-cover rounded-2xl"
          priority
        />
      </div>

      {!hasPlayed ? (
        <div className="flex gap-8">
          <button
            onClick={() => handleGuess('Silver')}
            className="bg-green-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-lg hover:bg-green-600 transition"
          >
            Silver 💰
          </button>
          <button
            onClick={() => handleGuess('Gold')}
            className="bg-yellow-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-lg hover:bg-yellow-600 transition"
          >
            Gold 🪙
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">{result}</p>
          <p className="text-lg">
            Total Score: {localStorage.getItem('polymeow_score') || '0'}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Come back tomorrow for a new cat!
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-10 w-full max-w-md bg-white rounded-xl shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No players yet</p>
        ) : (
          <ol className="list-decimal list-inside space-y-2">
            {leaderboard.map((player, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{player.name}</span>
                <span>{player.score}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
