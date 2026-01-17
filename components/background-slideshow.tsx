'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BackgroundSlideshowProps {
  images?: string[];
  interval?: number;
  className?: string;
}

export default function BackgroundSlideshow({
  images,
  interval = 8000,
  className = '',
}: BackgroundSlideshowProps) {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available background images
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/background-images');
        const data = (await response.json()) as { mobile: string[]; desktop: string[] };
        const imageList = isMobile ? data.mobile : data.desktop;
        setBackgroundImages(imageList);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch background images:', error);
        // Fallback to provided images or default
        const fallbackImages = images ?? [
          isMobile ? '/bg1-m.png' : '/bg1.png',
          isMobile ? '/bg2-m.png' : '/bg2.png',
        ];
        setBackgroundImages(fallbackImages);
        setIsLoading(false);
      }
    }

    void fetchImages();
  }, [isMobile, images]);

  // Auto-rotate images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [backgroundImages.length, interval]);

  if (isLoading || backgroundImages.length === 0) {
    return null;
  }

  return (
    <div className={`absolute top-0 left-0 w-full h-full -z-20 ${className}`}>
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className="absolute top-0 left-0 w-full h-full transition-opacity duration-2000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 0.2 : 0,
            transitionDuration: '2000ms',
          }}
        >
          <img
            src={image}
            alt={`Background ${index + 1}`}
            className={`w-full h-full object-cover ${isMobile ? 'object-left' : 'object-center'}`}
          />
          <div
            className="absolute top-0 left-0 w-full h-full backdrop-blur-sm"
            style={{
              maskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
