'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface RotatingPhraseProps {
  phrases: string[];
  className?: string;
  interval?: number;
}

export default function RotatingPhrase({
  phrases,
  className = '',
  interval = 4000,
}: RotatingPhraseProps) {
  const [displayText, setDisplayText] = useState(phrases[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [charOpacities, setCharOpacities] = useState<number[]>(Array(phrases[0].length).fill(1));
  const currentIndexRef = useRef(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const displayTextRef = useRef(phrases[0]);

  const animateToPhrase = useCallback((targetPhrase: string) => {
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setIsAnimating(true);
    const currentText = displayTextRef.current;

    // Build character set from both current and target phrases
    const charSet = Array.from(new Set([...currentText, ...targetPhrase].filter((c) => c !== ' ')));

    const maxLength = Math.max(currentText.length, targetPhrase.length);
    const steps = 25; // Number of random character iterations
    let currentStep = 0;

    const animate = () => {
      if (currentStep < steps) {
        // Generate random characters with cascading settle effect
        const randomText = Array.from({ length: maxLength }, (_, i) => {
          // Each character settles at a different time (wave from left to right)
          const settleStep = i * 1.2 + 5; // Characters settle progressively

          // If this character has settled, show the target character
          if (currentStep > settleStep && i < targetPhrase.length) {
            return targetPhrase[i];
          }

          // Otherwise show random character from the character set (slot spinning)
          if (i < targetPhrase.length) {
            if (targetPhrase[i] === ' ') {
              return ' ';
            }
            return charSet[Math.floor(Math.random() * charSet.length)];
          }
          return '';
        }).join('');

        // Generate random opacities for each character
        const opacities = Array.from({ length: maxLength }, (_, i) => {
          // Settled characters are always visible
          const settleStep = i * 1.2 + 5;
          if (currentStep > settleStep && i < targetPhrase.length) {
            return 1;
          }
          // Scrambling characters randomly fade in/out with smoother values
          return Math.random() > 0.4 ? 1 : 0.5;
        });

        displayTextRef.current = randomText;
        setDisplayText(randomText);
        setCharOpacities(opacities);
        currentStep++;
        animationRef.current = setTimeout(animate, 50);
      } else {
        // Final state: show exact target phrase
        displayTextRef.current = targetPhrase;
        setDisplayText(targetPhrase);
        setCharOpacities(Array(targetPhrase.length).fill(1));
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animate();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % phrases.length;
      animateToPhrase(phrases[currentIndexRef.current]);
    }, interval);

    return () => {
      clearInterval(timer);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [phrases, interval, animateToPhrase]);

  return (
    <span className={className}>
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block transition-opacity duration-200 ease-in-out"
          style={{
            opacity: charOpacities[index] ?? 1,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
