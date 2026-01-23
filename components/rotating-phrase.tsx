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
  const [charScales, setCharScales] = useState<number[]>(Array(phrases[0].length).fill(1));
  const [charBlurs, setCharBlurs] = useState<number[]>(Array(phrases[0].length).fill(0));
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

        // Generate opacities with sinusoidal easing
        const opacities = Array.from({ length: maxLength }, (_, i) => {
          // Settled characters are always visible
          const settleStep = i * 1.2 + 5;
          if (currentStep > settleStep && i < targetPhrase.length) {
            return 1;
          }
          // Smooth opacity pulsing
          const charProgress = Math.min(currentStep / settleStep, 1);
          const intensity = Math.sin(charProgress * Math.PI);
          const wave = Math.sin((currentStep + i * 3) * 0.6);
          // Oscillate between 0.6 and 1.0
          return 0.8 + wave * 0.2 * intensity;
        });

        // Generate vertical offsets (Matrix-style glitch with sinusoidal easing)
        const yOffsets = Array.from({ length: maxLength }, (_, i) => {
          const settleStep = i * 1.2 + 5;
          if (currentStep > settleStep && i < targetPhrase.length) {
            return 0;
          }
          // Calculate progress for this character (0 to 1)
          const charProgress = Math.min(currentStep / settleStep, 1);
          // Sinusoidal intensity that peaks in the middle and eases out
          const intensity = Math.sin(charProgress * Math.PI);
          // Random direction with smooth easing
          const direction = Math.sin((currentStep + i) * 0.5) * 2 + (Math.random() - 0.5);
          return direction * intensity * 8;
        });

        // Generate scale variations with smooth easing
        const scales = Array.from({ length: maxLength }, (_, i) => {
          const settleStep = i * 1.2 + 5;
          if (currentStep > settleStep && i < targetPhrase.length) {
            return 1;
          }
          // Smooth sinusoidal scale pulsing
          const charProgress = Math.min(currentStep / settleStep, 1);
          const intensity = Math.sin(charProgress * Math.PI);
          const wave = Math.sin((currentStep + i * 2) * 0.4);
          return 1 + wave * 0.15 * intensity;
        });

        // Generate blur amounts with smooth easing
        const blurs = Array.from({ length: maxLength }, (_, i) => {
          const settleStep = i * 1.2 + 5;
          if (currentStep > settleStep && i < targetPhrase.length) {
            return 0;
          }
          // Blur intensity follows smooth curve
          const charProgress = Math.min(currentStep / settleStep, 1);
          const intensity = Math.sin(charProgress * Math.PI);
          return intensity * 2;
        });

        displayTextRef.current = randomText;
        setDisplayText(randomText);
        setCharOpacities(opacities);
        setCharYOffsets(yOffsets);
        setCharScales(scales);
        setCharBlurs(blurs);
        currentStep++;
        animationRef.current = setTimeout(animate, 50);
      } else {
        // Final state: show exact target phrase
        displayTextRef.current = targetPhrase;
        setDisplayText(targetPhrase);
        setCharOpacities(Array(targetPhrase.length).fill(1));
        setCharYOffsets(Array(targetPhrase.length).fill(0));
        setCharScales(Array(targetPhrase.length).fill(1));
        setCharBlurs(Array(targetPhrase.length).fill(0));
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
      {displayText.split('').map((char, index) => {
        const yOffset = charYOffsets[index] ?? 0;
        const scale = charScales[index] ?? 1;
        const blur = charBlurs[index] ?? 0;
        return (
          <span
            key={index}
            className="inline-block"
            style={{
              opacity: charOpacities[index] ?? 1,
              transform: `translateY(${yOffset}px) scale(${scale})`,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              transition:
                'opacity 0.08s ease-in-out, transform 0.08s ease-in-out, filter 0.08s ease-in-out',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
}
