'use client';

import { useEffect, useState } from 'react';

interface RotatingWordProps {
  words: string[];
  className?: string;
  interval?: number;
}

export default function RotatingWord({
  words,
  className = '',
  interval = 3000,
}: RotatingWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`inline-block transition-all duration-500 ${
        isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
      } ${className}`}
    >
      {words[currentIndex]}
    </span>
  );
}
