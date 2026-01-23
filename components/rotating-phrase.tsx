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
  interval = 5000,
}: RotatingPhraseProps) {
  const [displayText, setDisplayText] = useState(phrases[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [charOpacities, setCharOpacities] = useState<number[]>(Array(phrases[0].length).fill(1));
  const [charYOffsets, setCharYOffsets] = useState<number[]>(Array(phrases[0].length).fill(0));
  const [charXOffsets, setCharXOffsets] = useState<number[]>(Array(phrases[0].length).fill(0));
  const [charRotations, setCharRotations] = useState<number[]>(Array(phrases[0].length).fill(0));
  const [charScales, setCharScales] = useState<number[]>(Array(phrases[0].length).fill(1));
  const [charBlurs, setCharBlurs] = useState<number[]>(Array(phrases[0].length).fill(0));
  const [enableTransitions, setEnableTransitions] = useState(true);
  const currentIndexRef = useRef(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const displayTextRef = useRef(phrases[0]);

  const animateToPhrase = useCallback((targetPhrase: string) => {
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setIsAnimating(true);

    // Disable transitions to instantly set initial state
    setEnableTransitions(false);

    // Update text and initial animation state together
    displayTextRef.current = targetPhrase;
    setDisplayText(targetPhrase);
    setCharOpacities(Array(targetPhrase.length).fill(0));
    setCharYOffsets(Array(targetPhrase.length).fill(-6));
    setCharXOffsets(Array(targetPhrase.length).fill(0));
    setCharRotations(Array(targetPhrase.length).fill(0));
    setCharScales(Array(targetPhrase.length).fill(0.95));
    setCharBlurs(Array(targetPhrase.length).fill(0));

    const steps = 30; // Smooth wave animation steps
    let currentStep = 0;

    const animate = () => {
      if (currentStep < steps) {
        // Wave progresses from left to right with staggered timing
        const opacities = Array.from({ length: targetPhrase.length }, (_, i) => {
          // Each character starts fading in at a different time
          const charDelay = i * 0.8; // Stagger amount
          const progress = Math.max(0, Math.min(1, (currentStep - charDelay) / 15));
          // Smooth ease-in-out
          return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        });

        // Subtle vertical wave motion
        const yOffsets = Array.from({ length: targetPhrase.length }, (_, i) => {
          const charDelay = i * 0.8;
          const progress = Math.max(0, Math.min(1, (currentStep - charDelay) / 15));
          // Gentle upward movement that settles
          const eased = 1 - Math.pow(1 - progress, 3);
          return (1 - eased) * -6;
        });

        // Very subtle scale effect
        const scales = Array.from({ length: targetPhrase.length }, (_, i) => {
          const charDelay = i * 0.8;
          const progress = Math.max(0, Math.min(1, (currentStep - charDelay) / 15));
          // Gentle scale from 0.95 to 1
          const eased =
            progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          return 0.95 + eased * 0.05;
        });

        setCharOpacities(opacities);
        setCharYOffsets(yOffsets);
        setCharScales(scales);
        currentStep++;
        animationRef.current = setTimeout(animate, 40);
      } else {
        // Final state: everything settled
        setCharOpacities(Array(targetPhrase.length).fill(1));
        setCharYOffsets(Array(targetPhrase.length).fill(0));
        setCharScales(Array(targetPhrase.length).fill(1));
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    // Re-enable transitions and start animation on next frame
    requestAnimationFrame(() => {
      setEnableTransitions(true);
      requestAnimationFrame(() => {
        animate();
      });
    });
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
    <span
      className={`${className} inline-flex flex-wrap justify-center overflow-visible leading-tight max-w-full`}
    >
      {displayText.split(' ').map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-flex whitespace-nowrap"
          style={{ marginLeft: wordIndex > 0 ? '0.25em' : '0' }}
        >
          {word.split('').map((char, charIndex) => {
            const index = displayText.split('').findIndex((c, i) => {
              const wordsBeforeCurrent = displayText.split(' ').slice(0, wordIndex);
              const charsBeforeWord = wordsBeforeCurrent.reduce((acc, w) => acc + w.length + 1, 0);
              return i === charsBeforeWord + charIndex;
            });
            const yOffset = charYOffsets[index] ?? 0;
            const xOffset = charXOffsets[index] ?? 0;
            const rotation = charRotations[index] ?? 0;
            const scale = charScales[index] ?? 1;
            const blur = charBlurs[index] ?? 0;
            return (
              <span
                key={charIndex}
                className="inline-block will-change-transform"
                style={{
                  opacity: charOpacities[index] ?? 1,
                  transform: `translateY(${yOffset}px) scale(${scale})`,
                  transition: enableTransitions
                    ? 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out'
                    : 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
