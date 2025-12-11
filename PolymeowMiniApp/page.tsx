'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const catImages = [
  { url: 'https://files.catbox.moe/l4r444.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/kl7pv4.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/jpqo2x.jpg', name: 'Silver' },
  { url: 'https://files.catbox.moe/en8r9m.jpg', name: 'Silver' },
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
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const index = new Date().getDate() % catImages.length;
    setDailyCat(catImages[index]);

    if (localStorage.getItem('polymeow_played') === today) setHasPlayed(true);

    // โหลด leaderboard
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => setLeaders(data))
      .catch(() => setLeaders([]));
  }, []);

  const handleGuess = async (guess: string) => {
    if (hasPlayed) return;

    const correct = guess === dailyCat.name;
    setResult(correct ? 'Correct! +10 points & 0.01 PMEOW 🎉' : 'Wrong! Try again tomorrow 😿');
    setHasPlayed(true);
    localStorage.setItem('polymeow_played', today);

    if (correct) {
      const score = Number(localStorage.getItem('polymeow_score') || '0') + 10;
      localStorage.setItem('polymeow_score', score.toString());

      await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });

      const data = await fetch('/api/leaderboard').then(r => r.json());
      setLeaders(data);
    }
  };

  if (!dailyCat) return <p className="text-center p-10">Loading today's cat...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-pink-100 to-green-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-purple-700">Polymeow 🐱</h1>
      <p className="text-lg mb-6 text-gray-800">Is this cat "Silver" or "Gold"?</p>

      <div className="mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-pink-200">
        <Image
          src={dailyCat.url}
          alt="Today's Cat"
          width={300}
          height={300}
          className="object-cover rounded-3xl"
          priority
        />
      </div>

      {!hasPlayed ? (
        <div className="flex gap-6">
          <button
            onClick={() => handleGuess('Silver')}
            className="bg-blue-400 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-md hover:bg-blue-500 transition"
          >
            Silver 💰
          </button>
          <button
            onClick={() => handleGuess('Gold')}
            className="bg-yellow-400 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-md hover:bg-yellow-500 transition"
          >
            Gold 🪙
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold mb-3">{result}</p>
          <p className="text-lg">Total Score: {localStorage.getItem('polymeow_score') || '0'}</p>
          <p className="text-sm text-gray-600 mt-2">Come back tomorrow for a new cat!</p>
        </div>
      )}

      <div className="mt-8 w-full max-w-md bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 text-center text-purple-600">Weekly Top 20</h2>
        <ol className="list-decimal list-inside space-y-1">
          {leaders.map((l, i) => (
            <li key={i} className="text-gray-800">{l.username} – {l.score}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
