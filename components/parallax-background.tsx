"use client"

import { useEffect, useRef } from "react"

export default function ParallaxBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{ height: "150%", width: "100%" }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        <div className="absolute top-[20%] left-[15%] w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[50%] w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
