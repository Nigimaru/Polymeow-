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

  useEffect(() => {
    // Same cat for everyone on the same day
    const daySeed = new Date().getDate();
    const index = daySeed % catImages.length;
    setDailyCat(catImages[index]);

    // Check if already played today
    const played = localStorage.getItem('polymeow_played');
    if (played === today) {
      setHasPlayed(true);
    }
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
      
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-2xl">
        <Image src={dailyCat.url} alt="Today's Cat" fill className="object-cover" priority />
      </div>

      {!hasPlayed ? (
        <div className="flex gap
