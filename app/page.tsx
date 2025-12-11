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

  useEffect(() => {
    const index = new Date().getDate() % catImages.length;
    setDailyCat(catImages[index]);

    const played = localStorage.getItem('polymeow_played');
    if (played === today) setHasPlayed(true);
  }, []);

  const handleGuess = (guess: string) => {
    if (hasPlayed) return;

    const correct = guess === dailyCat.name;
    setResult(correct ? 'Correct! +10 points & 0.01 PMEOW 🎉' : 'Wrong! Try again tomorrow 😿');
    setHasPlayed(true);
    localStorage.setItem('polymeow_played', today);

    if (correct) {
      const score = Number(localStorage.getItem('polymeow_score') || '0') + 10;
      localStorage.setItem('polymeow_score', score.toString());
    }
  };

  if (!dailyCat) return <p className="text-center p-10">Loading today's cat...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">Polymeow 🐱</h1>
      <p className="text-lg mb-6 text-gray-700">Is this cat "Silver" or "Gold"?</p>

      <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={dailyCat.url}
          alt="Today's Cat"
          width={320}   // กำหนดความกว้าง
          height={320}  // กำหนดความสูง
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
          <p className="text-lg">Total Score: {localStorage.getItem('polymeow_score') || '0'}</p>
          <p className="text-sm text-gray-600 mt-4">Come back tomorrow for a new cat!</p>
        </div>
      )}

      <a href="/leaderboard" className="mt-10 text-blue-600 underline text-lg">
        View Leaderboard
      </a>
    </div>
  );
}
